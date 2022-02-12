from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from guidedmodules.models import TaskAnswer, ModuleQuestion, TaskAnswerHistory
from controls.models import ElementControl, Statement
from django.utils import timezone


# These signals will Update project updated timestamp
@receiver(post_save, sender=Statement)
def on_project_component_change(sender, instance, created, **kwargs):
    if instance.consumer_element is not None:
        instance.consumer_element.system.first().projects.update(updated=timezone.now())

@receiver(post_delete, sender=Statement)
def on_project_component_remove(sender, instance, **kwargs):
    if instance.consumer_element is not None:
        instance.consumer_element.system.first().projects.update(updated=timezone.now())

@receiver(post_save, sender=ElementControl)
def on_project_control_change(sender, instance, created, **kwargs):
    instance.element.system.first().projects.update(updated=timezone.now())

@receiver(post_delete, sender=ElementControl)
def on_project_control_remove(sender, instance, **kwargs):
    instance.element.system.first().projects.update(updated=timezone.now())

@receiver(post_save, sender=TaskAnswer)
def on_questionnaire_answer_change(sender, instance, created, **kwargs):
    project = instance.task.project
    project.updated = timezone.now()
    project.save()

@receiver(post_delete, sender=TaskAnswer)
def on_questionnaire_answer_remove(sender, instance, **kwargs):
    project = instance.task.project
    project.updated = timezone.now()
    project.save()


@receiver(post_save, sender=ModuleQuestion)
def on_module_question_change(sender, instance, created, **kwargs):
    task = instance.module.task_set.first()
    if task:
        project = task.project
        project.updated = timezone.now()
        project.save()

@receiver(post_delete, sender=ModuleQuestion)
def on_module_question_remove(sender, instance, **kwargs):
    task = instance.module.task_set.first()
    if task:
        project = task.project
        project.updated = timezone.now()
        project.save()


@receiver(post_save, sender=TaskAnswerHistory)
def on_task_answer_history_change(sender, instance, created, **kwargs):
    project = instance.taskanswer.task.project
    project.updated = timezone.now()
    project.save()

@receiver(post_delete, sender=TaskAnswerHistory)
def on_task_answer_history_remove(sender, instance, **kwargs):
    project = instance.taskanswer.task.project
    project.updated = timezone.now()
    project.save()
