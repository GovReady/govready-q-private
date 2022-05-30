import json
import time
from datetime import datetime
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
from django.db.models import Q
from integrations.models import Integration, Endpoint
from controls.models import System
from siteapp.models import Organization, Portfolio
from siteapp.views import get_compliance_apps_catalog_for_user, start_app
from guidedmodules.app_loading import ModuleDefinitionError
from .communicate import ExampleCommunication

# Change 'example' to name of integration, e.g., 'csam' and 'csam_system_id'
INTEGRATION_NAME = 'example'
INTEGRATION_SYSTEM_ID = 'example_system_id'

try:
    INTEGRATION = get_object_or_404(Integration, name=INTEGRATION_NAME)
except:
    HttpResponseNotFound(f'<h1>404 - Integration configuration missing. Create Integration database record.</h1>')

def set_integration():
    return ExampleCommunication()

def integration_identify(request):
    """Integration returns an identification"""

    communication = set_integration()
    return HttpResponse(f"Attempting to communicate with csam integration: {communication.identify()}")

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
    integration_system_id = system.info.get(INTEGRATION_SYSTEM_ID, None)
    if integration_system_id is None:
        return HttpResponse(
        f"<html><body><p>Attempting to communicate with '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>System '{system_id}' does not have an associated '{integration_system_id}'.</p>"
        f"</body></html>")

    endpoint = f'/v1/systems/{integration_system_id}'
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
    # try:
    #     # system = System.objects.get(pk=system_id)
    #     system = get_object_or_404(System, pk=system_id)
    # except:
    #     return HttpResponse(
    #     f"<html><body>"
    #     f"<p>now: {datetime.now()}</p>"
    #     f"<p>System '{system_id}' does not exist.</p>"
    #     f"</body></html>")

    # TODO: Check user permission to view
    communication = set_integration()
    integration_system_id = system.info.get(INTEGRATION_SYSTEM_ID, None)
    if integration_system_id is None:
        return HttpResponse(
        f"<html><body><p>Attempting to communicate with '{INTEGRATION_NAME}' "
        f"integration: {communication.identify()}</p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>System '{system_id}' does not have an associated '{integration_system_id}'.</p>"
        f"</body></html>")

    endpoint = f'/v1/systems/{integration_system_id}'
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
        integration_system_id = s.info.get(INTEGRATION_SYSTEM_ID, None)
        if integration_system_id is None:
            print(f"System id {s.id} has no example_system_id")
        else:
            endpoint = f'/v1/systems/{integration_system_id}'
            communication = set_integration()
            data = communication.get_response(endpoint)
            # Cache remote data locally in database
            ep, created = Endpoint.objects.get_or_create(
                integration=INTEGRATION,
                endpoint_path=endpoint
            )
            ep.data = data
            ep.save()
            msg = f"System id {s.id} info updated from csam system {integration_system_id}"
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
    integration_system_id = system.info.get(INTEGRATION_SYSTEM_ID, None)
    # print("10, ========== integration_system_id", integration_system_id)
    if example_system_id is not None:
        new_description = "This is the new system description."
        endpoint = f"/v1/systems/{integration_system_id}"
        post_data = {
            "description": new_description
        }
        communication = set_integration()
        data = communication.post_response(endpoint, data=json.dumps(post_data))
        result = data
    return result

def create_system_from_remote(request, remote_system_id):
    """Create a system in GovReady-Q based on info from integrated service"""

    print("Create a system in GovReady-Q based on info from integrated service")

    communication = set_integration()
    integration_system_id = int(remote_system_id)
    endpoint = f'/v1/systems/{integration_system_id}'
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

    # Check if system aleady exists with example_system_id
    if not System.objects.filter(Q(info__contains={INTEGRATION_SYSTEM_ID: integration_system_id})).exists():
        # Create new system
        # What is default template?
        source_slug = "govready-q-files-startpack"
        app_name = "speedyssp"
        # can user start the app?
        # Is this a module the user has access to? The app store
        # does some authz based on the organization.
        catalog = get_compliance_apps_catalog_for_user(request.user)
        for app_catalog_info in catalog:
            if app_catalog_info["key"] == source_slug + "/" + app_name:
                # We found it.
                break
        else:
            raise Http404()
        # Start the most recent version of the app.
        appver = app_catalog_info["versions"][0]
        organization = Organization.objects.first()  # temporary
        folder = None
        task = None
        q = None
        # Get portfolio project should be included in.
        if request.GET.get("portfolio"):
            portfolio = Portfolio.objects.get(id=request.GET.get("portfolio"))
        else:
            if not request.user.default_portfolio:
                request.user.create_default_portfolio_if_missing()
            portfolio = request.user.default_portfolio
        try:
            project = start_app(appver, organization, request.user, folder, task, q, portfolio)
        except ModuleDefinitionError as e:
            error = str(e)
        # Associate System with INTEGRATION_NAME system
        new_system = project.system 
        new_system.info = {INTEGRATION_SYSTEM_ID: integration_system_id}
        new_system.save()
        # Update System name to INTEGRATION_NAME system name
        nsre = new_system.root_element
        nsre.name = ep.data['name']
        nsre.save()
        # Update System Project title to INTEGRATION_NAME system name
        prt = project.root_task
        prt.title_override = ep.data['name']
        prt.save()
        # Redirect to the new project.
        # return HttpResponseRedirect(project.get_absolute_url())
        msg = f"Created new System in GovReady based on {INTEGRATION_NAME} system id {integration_system_id}."
    else:
        systems = System.objects.filter(Q(info__contains={INTEGRATION_SYSTEM_ID: integration_system_id}))
        if len(systems) == 1:
            system = systems[0]
            # Assume one project per system
            project = system.projects.all()[0]
            msg = f"System aleady exists in GovReady based on {INTEGRATION_NAME} system id {integration_system_id}."
        else:
            project = None
            msg = f"Multiple systems aleady exists in GovReady based on {INTEGRATION_NAME} system id {integration_system_id}."
            msg = msg + f"They are: " + ",".join(str(systems))
            return HttpResponse(
                f"<html><body><p>{msg}</p>"
                f"<p>now: {datetime.now()}</p>"
                f"<p>Returned data:</p>"
                f"<pre>{json.dumps(ep.data,indent=4)}</pre>"
                f"</body></html>")
    return HttpResponse(
        f"<html><body><p>{msg}</p>"
        f"<p>visit system {project.title} at {project.get_absolute_url()} </p>"
        f"<p>now: {datetime.now()}</p>"
        f"<p>Returned data:</p>"
        f"<pre>{json.dumps(ep.data,indent=4)}</pre>"
        f"</body></html>")
