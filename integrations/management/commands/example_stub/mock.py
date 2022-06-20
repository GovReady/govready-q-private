#!/usr/bin/env python3

##############################################################
#
# A simple Python webserver to generate mock Integration API results
#
# Requirements:
#
#   pip install click
#
# Usage:
#   
#   # Start mock service
#   python3 integrations/example/mock.py
#
# Accessing:
#
#   curl localhost:9009/endpoint
#   curl -X 'GET' 'http://127.0.0.1:9009/v1/system/111'
#   curl localhost:9002/v1/system/111  # requires authentication
#
##############################################################

# Parse command-line arguments
import click

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
from abc import ABC
#from urllib.parse import urlparse
from django.utils import timezone
from time import time


PORT = 9002
MOCK_SRVC = "CSAM"

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):

    # Mock data
    SYSTEMS = { "111": {"id": 111,
                       "someKey": "Some Value"
                       },
                "222": {"id": 222,
                       "someKey": "Some Value"
                       }
                }

    def mk_system_info_response(self, system_id):
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
        if request.path == "/v1/test/hello":
            """Reply with 'hello'"""
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = {"message":"hello"}
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

        elif request.path == "/v1/test/authenticate-test":
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

        elif request.path == "/v1/systems/111" or request.path == "/v1/systems/222":
            """Reply with system information"""

            system_id = re.search(r"/v1/systems/([0-9]{1,8})", request.path).group(1).strip()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            if '111' in request.path:
                data = self.mk_system_info_response('111')
            elif '222' in request.path:
                data = self.mk_system_info_response('222')
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
        if request.path == "/v1/test/hello":
            """Reply with 'hello'"""
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = {"message": "hello, POST"}
            self.wfile.write(json.dumps(data, indent=4).encode('UTF-8'))

        if request.path == "/v1/systems/111" or request.path == "/v1/systems/222":
            """Update system information"""
            # # unauthorized example:
            # curl -X 'POST' 'http://localhost:9002/system/111' \
            # -H 'accept: application/json;odata.metadata=minimal;odata.streaming=true'
        
            content_length = int(self.headers['Content-Length'])
            self.post_data = self.rfile.read(content_length)
            self.post_data_json = json.loads(self.post_data)
            if '111' in request.path:
                system_id = '111'
            elif '222' in request.path:
                system_id = '222'
            self.SYSTEMS[system_id]['name'] = self.post_data_json.get('name', self.SYSTEM['name'])
            self.SYSTEM[system_id]['purpose'] = self.post_data_json.get('purpose', "MISSING CONTENT")
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            data = self.mk_system_info_response(system_id)
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
