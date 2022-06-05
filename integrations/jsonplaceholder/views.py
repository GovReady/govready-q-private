import json
import time
import importlib
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseNotFound
from integrations.models import Integration, Endpoint
from .communicate import JsonplaceholderCommunication

INTEGRATION_NAME = 'jsonplaceholder'
try:
    INTEGRATION = get_object_or_404(Integration, name=INTEGRATION_NAME)
except:
    HttpResponseNotFound(f'<h1>404 - Integration configuration missing. Create Integration database record.</h1>')


def set_integration():
    """Select correct integration"""
    return JsonplaceholderCommunication()


def integration_identify(request):
    """Integration returns an identification"""


    communication = set_integration()
    url_patterns = getattr(importlib.import_module(f'integrations.{INTEGRATION_NAME}.urls'), "urlpatterns")
    data = []
    for up in url_patterns:
        up_dict = {"name": up.name}
        data.append(up_dict)

    return HttpResponse(
        f"<html><body><p>Identify integration communication '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>Returned data:</p>"
        f"<pre>{json.dumps(data,indent=4)}</pre>"
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
        f"<p>endpoint: {endpoint}</p>"
        f"<p>Returned data:</p>"
        f"<pre>{json.dumps(data, indent=4)}</pre>"
        f"</body></html>")


def integration_endpoint_post(request, endpoint=None):
    """Communicate with an integrated service using POST"""

    communication = set_integration()
    data = communication.post_response(endpoint)

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
        f"<p>endpoint: {endpoint}.</p>"
        f"<p>Returned data:</p>"
        f"<pre>{json.dumps(data, indent=4)}</pre>"
        f"</body></html>")
