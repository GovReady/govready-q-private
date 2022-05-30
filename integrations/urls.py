from django.conf.urls import include, url
import os

urlpatterns = [
    url(r"^jsonplaceholder/", include("integrations.jsonplaceholder.urls")),
]

known_dirs = ['templatetags','migrations','management', 'utils', '__pycache__', 'github', 'templates']
integration_apps = [dir for dir in next(os.walk('integrations'))[1] if dir not in known_dirs]
for app in integration_apps:
    if os.path.exists(os.path.join('integrations', app, 'urls.py')):
        urlpatterns.append(url(r'^%s/' % app, include('integrations.%s.urls' % app)))

print(f"ALL urlpatterns: {urlpatterns}")

