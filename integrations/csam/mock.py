#!/usr/bin/env python3

########################################################
#
# A simple Python webserver to generate mock CSAM API
# results
#
# Usage:
#   
#   # Start mock service
#   python3 integrations/csam/mock.py
#
# Accessing:
#   curl localhost:9002/endpoint
#   curl -X 'GET' 'http://127.0.0.1:9002/system/111'
#   curl localhost:9002/system/111  # requires authentication
#
# Accessing with simple authentication:
#   curl -X 'GET' 'http://localhost:9002/system/111' \
#     -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true' \
#     -H 'Authorization: Bearer FAD619'
#
#######################################################

# Parse command-line arguments
import click

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json

PORT = 9002

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    # Mock data
    SYSTEMS = {"111": {"system_id": 111,
                       "name": "SystemA",
                       "description":  "This is a simple test system"
                       },
                "222": {"system_id": 222,
                        "name": "SystemB",
                        "description":  "This is another simple test system"
                        }
                }

    def mk_csam_system_info_response(self, system_id):
        return self.SYSTEMS[system_id]

    def do_GET(self, method=None):
        """Parse and route GET request"""
        # Parse path
        request = urlparse(self.path)
        params = parse_qs(request.query)
        print(f"request.path: {request.path}, params: {params}")
        # params are received as arrays, so get first element in array
        # system_id = params.get('system_id', [0])[0]

        # Route GET request
        if request.path == "/test/hello":
            """Reply with 'hello'"""
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = {"message":"hello"}
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

        elif request.path == "/test/authenticate-test":
            """Test authentication"""
            # Test authentication by reading headers and looking for 'Authentication'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            # Read headers
            if 'Authorization' in self.headers:
                print("Authorization header:", self.headers['Authorization'])
                data = {"reply": "Success",
                        "Authorization": self.headers['Authorization'],
                        "pat": self.headers['Authorization'].split("Bearer ")[-1]
                        }
            else:
                data = {"reply": "Fail",
                        "Authorization": None,
                        "pat": None
                        }
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

        elif request.path == "/v1/system/111" or request.path == "/v1/system/222":
            """Reply with system information"""
            # # authorized example
            # curl -X 'GET' 'http://localhost:9002/v1/system/111' \
            # -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true' \
            # -H 'Authorization: Bearer FAD619'
            #
            # # unauthorized example:
            # curl -X 'GET' 'http://localhost:9002/v1/system/111' \
            # -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true' 
            pat = None
            if 'Authorization' in self.headers:
                pat = self.headers['Authorization'].split("Bearer ")[-1]
            if pat is None or pat != "FAD619":
                # Authentication fails
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                data = {"message": "Unauthorized request",
                        "endpoint": request.path
                        }
            else:
                # Authentication succeeds
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                if '111' in request.path:
                    data = self.mk_csam_system_info_response('111')
                elif '222' in request.path:
                    data = self.mk_csam_system_info_response('222')
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

        else:
            """Reply with Path not found"""
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = {"message":"Path not found"}
            # Send the JSON response
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

    def do_POST(self):
        """Parse and route POST request"""
        request = urlparse(self.path)
        params = parse_qs(request.query)
        print("request.path:", request.path)
        print("** params", params)

        # Route POST request
        if request.path == "/test/hello":
            """Reply with 'hello'"""
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = {"message": "hello, POST"}
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

        if request.path == "/v1/system/111" or request.path == "/v1/system/222":
            """Update system information"""
            # # authorized example
            # curl -X 'POST' 'http://localhost:9002/system/111' \
            # -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true' \
            # -H 'Authorization: Bearer FAD619'
            #
            # # unauthorized example:
            # curl -X 'POST' 'http://localhost:9002/system/111' \
            # -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'
            pat = None
            if 'Authorization' in self.headers:
                pat = self.headers['Authorization'].split("Bearer ")[-1]
            if pat is None or pat != "FAD619":
                # Authorization failed
                self.send_response(401)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                data = {"message": "Unauthorized request",
                        "endpoint": request.path
                        }
            else:
                # Authorization succeeded - read POST data and update system info
                content_length = int(self.headers['Content-Length'])
                self.post_data = self.rfile.read(content_length)
                self.post_data_json = json.loads(self.post_data)
                if '111' in request.path:
                    system_id = '111'
                elif '222' in request.path:
                    system_id = '222'
                self.SYSTEMS[system_id]['name'] = self.post_data_json.get('name', self.SYSTEM['name'])
                self.SYSTEM[system_id]['description'] = self.post_data_json.get('description', self.SYSTEM['description'])
                # Send response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                data = self.mk_csam_system_info_response(system_id)
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

        else:
            # Path not found
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = {"message":"Path not found"}
            # Send the JSON response
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

def main():
    httpd = HTTPServer(('localhost', PORT), SimpleHTTPRequestHandler)
    httpd.serve_forever()

if __name__ == "__main__":
    main()