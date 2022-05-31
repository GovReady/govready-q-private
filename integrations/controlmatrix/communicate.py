import requests
import json
from base64 import b64encode
from urllib.parse import urlparse
from integrations.utils.integration import Communication
from integrations.models import Integration, Endpoint
import pandas
import pathlib


class ControlmatrixCommunication(Communication):
    
    DESCRIPTION = {
        "name": "Controlmatrix",
        "description": "Controlmatrix Service",
        "version": "0.1",
        "integration_db_record": False,
        "mock": {
            "base_url": "http:/localhost:9009",
            "personal_access_token": None
        }
    }

    def __init__(self, **kwargs):
        assert self.DESCRIPTION, "Developer must assign a description dict"
        self.__is_authenticated = False
        self.error_msg = {}
        self.auth_dict = {}
        self.data = None
        self.base_url = "https://controlmatrix.com/api"

    def identify(self):
        """Identify which Communication subclass"""
        identity_str = f"This is {self.DESCRIPTION['name']} version {self.DESCRIPTION['version']}"
        print(identity_str)
        return identity_str

    def setup(self, **kwargs):
        pass

    def get_response(self, endpoint, headers=None, verify=False):
        response = requests.get(f"{self.base_url}{endpoint}")
        self.status_code = response.status_code
        if self.status_code == 200:
            self.data = response.json()
        elif self.status_code == 404:
            print("404 - page not found")
        else:
            pass
        return self.data
        
    def authenticate(self, user=None, passwd=None):
        """Authenticate with service"""
        pass

    @property
    def is_authenticated(self):
        return self.__is_authenticated

    @is_authenticated.setter
    def is_authenticated(self, value):
        self.__is_authenticated = value

    def extract_data(self, authentication, identifiers):
        """Extract data"""
        try:
            data = []

            # import pandas
            # import pathlib
            rows_list = []
            # TODO: Fix file path
            fn = "integrations/controlmatrix/assets/data/controls_matrix.xlsx"
            if pathlib.Path(fn).is_file():
                try:
                    df_dict = pandas.read_excel(fn, 'controls_foundation', header=0)
                    for index, row in df_dict.iterrows():
                        row_dict = {
                            "CONTROL_STATUS": row.get('CONTROL_STATUS', ""),
                            "MONITORED_STATUS": row.get('MONITORED_STATUS', ""),
                            "TIER": row.get('TIER', ""),
                            "REVIEW_FREQUENCY": row.get('REVIEW_FREQUENCY', ""),
                            "CONTROL_TYPE": row.get('CONTROL_TYPE', ""),
                            "AUTOMATED": row.get('AUTOMATED', ""),
                            "COMMON_CONTROL": row.get('COMMON_CONTROL', ""),
                            "PRIORITY": row.get('PRIORITY', ""),
                            "BASELINE_IMPACT": row.get('BASELINE_IMPACT', ""),
                            "RMF_CONTROL_FAMILY": row.get('RMF_CONTROL_FAMILY', ""),
                            "RMF_CONTROL": row.get('RMF_CONTROL', ""),
                            "RMF_CONTROL_NAME": row.get('RMF_CONTROL_NAME', ""),
                            "CSF_FUNCTION": row.get('CSF_FUNCTION', ""),
                            "CSF_CATEGORY": row.get('CSF_CATEGORY', ""),
                            "CSF_SUBCATEGORY": row.get('CSF_SUBCATEGORY', ""),
                            "CYBERSECURITY_PROGRAM_DOMAIN": row.get('CYBERSECURITY_PROGRAM_DOMAIN', ""),
                            "ORTB": row.get('ORTB', ""),
                            "FSA": row.get('FSA', ""),
                            "HVA": row.get('HVA', ""),
                            "FPKI": row.get('FPKI', ""),
                            "PRIVACY": row.get('PRIVACY', ""),
                            "CLOUD_SHARED": row.get('CLOUD_SHARED', ""),
                            "FAST_TRACK": row.get('FAST_TRACK', "")
                        }
                        rows_list.append(row_dict)
                except FileNotFoundError as e:
                    print(f"Error reading file {fn}: {e}")
                    # logger.error(f"Error reading file {fn}: {e}")
                except Exception as e:
                    # logger.error(f"Other error reading file {fn}: {e}")
                    print(f"Other error reading file {fn}: {e}")
            else:
                print(f"Faiiled to find or open file '{fn}'.")
            
            print(f"identifiers: ", identifiers)
            # for ctl in rows_list:
            #     print(ctl['RMF_CONTROL'].lower())
            #     if ctl['RMF_CONTROL'].lower() in identifiers:
            #         data.append(ctl)
            control_matrix = next((ctl for ctl in rows_list if ctl['RMF_CONTROL'].lower() in identifiers), None)
            data.append(control_matrix)
        except:
            data = []
        return data

    def transform_data(self, data, system_id=None, title=None, description=None, deployment_uuid=None):
        pass

    def load_data(self, data):
        pass
