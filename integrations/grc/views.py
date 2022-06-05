import json
import time
import importlib
import markdown
from datetime import datetime
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseNotFound
from integrations.models import Integration, Endpoint
from .communicate import GRCCommunication
from controls.models import System

INTEGRATION_NAME = 'grc'
try:
    INTEGRATION = get_object_or_404(Integration, name=INTEGRATION_NAME)
except:
    HttpResponseNotFound(f'<h1>404 - Integration configuration missing. Create Integration database record.</h1>')

def set_integration():
    return GRCCommunication()

def integration_identify(request):
    """Integration returns an identification"""

    from django.urls import reverse
    communication = set_integration()
    url_patterns = getattr(importlib.import_module(f'integrations.{INTEGRATION_NAME}.urls'), "urlpatterns")
    data = []
    for up in url_patterns:
        try:
            resolved_url = reverse(up.name)
        except:
            # hack to approximate reverse url path
            url_match_part = str(up.pattern.regex).replace('re.compile','').replace("('^","").replace("$'","")
            resolved_url = f"/integrations/{INTEGRATION_NAME}/{url_match_part}"
        up_dict = {
            "integration_name": INTEGRATION_NAME,
            "name": up.name,
            "url": resolved_url,
            # "importlib": f"importlib.import_module('integrations.{INTEGRATION_NAME}.views.{up.name}')"
        }
        data.append(up_dict)

    # Retrieve README
    with open('integrations/csam/README.md', 'r') as f:
        readme_markdown = f.readlines()
        readme_html = markdown.markdown("\n".join(readme_markdown))

    return HttpResponse(
        f"<html><body><p>Identify integration communication '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>Returned data:</p>"
        f"<h2>Links</h2>"
        f"<pre>{json.dumps(data,indent=4)}</pre>"
        f"<h2>README</h2>"
        f"<div style='width:900px; padding:12px; border: 0.5px solid #888; background-color: #fcfcfc; font-family:courier;'>{readme_html}</div>"
        f"</body></html>")

def integration_endpoint(request, endpoint=None):
    """Communicate with an integrated service"""

    communication = set_integration()
    data = communication.get_response(endpoint)
    # Cache remote data locally in database
    ep, created = Endpoint.objects.get_or_create(
        integration=INTEGRATION,
        endpoint_path=endpoint
    )
    ep.data = data
    ep.save()

    return HttpResponse(
        f"<html><body><p>Attempting to communicate with '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>endpoint: {endpoint}</p>"
        f"<p>Returned data:</p>"
        f"<pre>{json.dumps(data,indent=4)}</pre>"
        f"</body></html>")

def integration_endpoint_post(request, endpoint=None):
    """Communicate with an integrated service using POST"""

    post_data = {
        "name": "My IT System2",
        "description":  "This is a more complex test system"
    }
    communication = set_integration()
    data = communication.post_response(endpoint, data=json.dumps(post_data))
    # Cache remote data locally in database
    ep, created = Endpoint.objects.get_or_create(
        integration=INTEGRATION,
        endpoint_path=endpoint
    )
    ep.data = data
    ep.save()

    return HttpResponse(
        f"<html><body><p>Attempting to communicate using POST with '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>endpoint: {endpoint}.</p>"
        f"<p>Returned data:</p>"
        f"<pre>{json.dumps(data,indent=4)}</pre>"
        f"</body></html>")

def get_system_info(request, system_id=2):
    """Retrieve the system information from CSAM"""

    # system = System.objects.get(pk=system_id)
    system = get_object_or_404(System, pk=system_id)
    # TODO: Check user permission to view
    csam_system_id = system.info.get('csam_system_id', None)
    if csam_system_id is None:
        return HttpResponse(
        f"<html><body><p>Attempting to communicate with '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>System '{system_id}' does not have an associated 'csam_system_id'.</p>"
        f"</body></html>")

    endpoint = f'/v1/systems/{csam_system_id}'
    communication = set_integration()
    data = communication.get_response(endpoint)
    # Cache remote data locally in database
    ep, created = Endpoint.objects.get_or_create(
        integration=INTEGRATION,
        endpoint_path=endpoint
    )
    ep.data = data
    ep.save()

    return HttpResponse(
        f"<html><body><p>Attempting to communicate with '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>endpoint: {endpoint}</p>"
        f"<p>Returned data:</p>"
        f"<pre>{json.dumps(data,indent=4)}</pre>"
        f"</body></html>")

def system_info(request, system_id=2):
    """Retrieve the system information from CSAM"""

    system = get_object_or_404(System, pk=system_id)
    try:
        # system = System.objects.get(pk=system_id)
        system = get_object_or_404(System, pk=system_id)
    except:
        return HttpResponse(
        f"<html><body>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>System '{system_id}' does not exist.</p>"
        f"</body></html>")

    # TODO: Check user permission to view
    communication = set_integration()
    csam_system_id = system.info.get('csam_system_id', None)
    if csam_system_id is None:
        return HttpResponse(
        f"<html><body><p>Attempting to communicate with '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>System '{system_id}' does not have an associated 'csam_system_id'.</p>"
        f"</body></html>")

    endpoint = f'/v1/systems/{csam_system_id}'
    # is there local information?
    ep, created = Endpoint.objects.get_or_create(
        integration=INTEGRATION,
        endpoint_path=endpoint
    )
    # TODO: Refresh data if empty
    if created:
        # Cache not available
        data = communication.get_response(endpoint)
        # Cache remote data locally in database
        ep.data = data
        ep.save()
    else:
        # Cache available
        cached = True
        pass

    context = {
        "system": system,
        "cached": True,
        "communication": communication,
        "ep": ep
    }
    from siteapp import settings
    # settings.TEMPLATES[0]['DIRS'].append('/Users/gregelinadmin/Documents/workspace/govready-q-private/integrations/csam/templates/')
    # print(2,"========= TEMPLATES", settings.TEMPLATES[0]['DIRS'])
    return render(request, "csam/system.html", context)

def get_multiple_system_info(request, system_id_list="1,2"):
    """Get and cach system info for multiple systems"""
    systems_updated = []
    systems = System.objects.filter(pk__in=system_id_list.split(","))
    for s in systems:
        csam_system_id = s.info.get("csam_system_id", None)
        if csam_system_id is None:
            print(f"System id {s.id} has no csam_system_id")
        else:
            endpoint = f'/v1/systems/{csam_system_id}'
            communication = set_integration()
            data = communication.get_response(endpoint)
            # Cache remote data locally in database
            ep, created = Endpoint.objects.get_or_create(
                integration=INTEGRATION,
                endpoint_path=endpoint
            )
            ep.data = data
            ep.save()
            msg = f"System id {s.id} info updated from csam system {csam_system_id}"
            print(msg)
            systems_updated.append(msg)
            time.sleep(0.25)

    return HttpResponse(
        f"<html><body><p>Attempting to communicate with '{INTEGRATION_NAME}' "
        f"get_multiple_system_info for system ids {system_id_list}</p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>Result:</p>"
        f"<pre>{systems_updated}</pre>"
        f"</body></html>")

def update_system_description_test(request, system_id=2):
    """Test updating system description in CSAM"""

    params={"src_obj_type": "system", "src_obj_id": system_id}
    data = update_system_description(params)
    return HttpResponse(
        f"<html><body><p>Attempting to update CSAM description of System id {system_id}...' "
        f"<p>now: {datetime.now()}</p>"
        f"<p>Returned data:</p>"
        f"<pre>{json.dumps(data,indent=4)}</pre>"
        f"</body></html>")

def update_system_description(request, params={"src_obj_type": "system", "src_obj_id": 2}):
    """Update System description in CSAM"""

    system_id = params['src_obj_id']
    system = System.objects.get(pk=system_id)
    # TODO: Check user permission to update
    csam_system_id = system.info.get('csam_system_id', None)
    # print("10, ========== csam_system_id", csam_system_id)
    if csam_system_id is not None:
        new_description = "This is the new system description."
        endpoint = f"/v1/systems/{csam_system_id}"
        post_data = {
            "description": new_description
        }
        communication = set_integration()
        data = communication.post_response(endpoint, data=json.dumps(post_data))
        result = data
    return result


