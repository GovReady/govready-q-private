import csv
import json
import re
from collections import OrderedDict

def oscalize_control_id(cl_id):
    """ output an oscal standard control id from various common formats for control ids """

    # Handle improperly formatted control id
    # Recognize only properly formmated control id:
    #   at-1, at-01, ac-2.3, ac-02.3, ac-2 (3), ac-02 (3), ac-2(3), ac-02 (3)
    pattern = re.compile("^[A-Za-z][A-Za-z]-[0-9() .]*$")
    if not pattern.match(cl_id):
        return render(request, "controls/detail.html", { "control": {} })

    # Handle properly formatted existing id
    # Transform various patterns of control ids into OSCAL format
    # Fix leading zero in at-01, ac-02.3, ac-02 (3)
    cl_id = cl_id = re.sub(r'^([A-Za-z][A-Za-z]-)0(.*)$', r'\1\2', cl_id)
    # Change paranthesis into a dot
    cl_id = re.sub(r'^([A-Za-z][A-Za-z]-)([0-9]*)([ ]*)\(([0-9]*)\)$', r'\1\2.\4', cl_id)
    # Remove trailing space
    cl_id = cl_id.strip(" ")
    # makes ure lowercase
    cl_id = cl_id.lower()

    return cl_id

def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []
      
    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf) 

        #convert each csv row into python dict
        for row in csvReader:

            # special code control matrice parsing
            if 'RMF_CONTROL' in row:
                row['RMF_CONTROL_OSCAL'] = oscalize_control_id(row['RMF_CONTROL'])
            if 'RMF CONTROL NUMBER' in row:
                row['RMF_CONTROL_OSCAL'] = oscalize_control_id(row['RMF CONTROL NUMBER'])

            # rename keys
            row2 = OrderedDict((k.replace(" ","_").lower(), v) for k, v in row.items())
            print(row2)

            #add this python dict to json array
            jsonArray.append(row2)
  
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
          
# csvFilePath = r'/Users/greg/Documents/code/govready-q-private/controls/data/controls_matrices/controls_matrix - controls_foundation.csv'
# jsonFilePath = r'/Users/greg/Documents/code/govready-q-private/controls/data/controls_matrices/controls_matrix - controls_foundation.json'
csvFilePath = r'/Users/greg/Documents/code/govready-q-private/controls/data/controls_matrices/controls_matrix_rev5 - controls_foundation.csv'
jsonFilePath = r'/Users/greg/Documents/code/govready-q-private/controls/data/controls_matrices/controls_matrix_rev5 - controls_foundation.json'

csv_to_json(csvFilePath, jsonFilePath)
