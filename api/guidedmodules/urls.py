from django.conf.urls import url
from django.urls import include
from rest_framework import routers
from rest_framework_nested.routers import NestedSimpleRouter
from api.guidedmodules.views.module import ModuleViewSet
from api.guidedmodules.views.module_questions import ModuleQuestionViewSet
from api.guidedmodules.views.AppVersions import AppVersionViewSet


router = routers.DefaultRouter()
router.register('AppVersion', AppVersionViewSet)
router.register('modules', ModuleViewSet)

module_router = NestedSimpleRouter(router, 'modules', lookup='modules')
module_router.register('questions', ModuleQuestionViewSet, basename='module-questions')

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^', include(module_router.urls)),
]
