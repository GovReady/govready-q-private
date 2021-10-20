#!/usr/bin/env python
# coding: utf-8

# usage
#   python3 manage.py nlpfindcandidatecomponents --importname nlpcomponents --create-components --project_ids 1
#   docker exec -it govready-q-dev python3 manage.py nlpfindcandidatecomponents --importname nlpcomponents --create-components --project_ids 1


import sys
import os
import os.path
import json
import unicodedata

from collections import defaultdict
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction, models
from django.db.utils import OperationalError
from django.conf import settings
from pathlib import Path
from pathlib import PurePath
from django.utils.text import slugify

from controls.models import Element, Statement, StatementRemote, ImportRecord
from controls.enums.statements import StatementTypeEnum
from controls.enums.remotes import RemoteTypeEnum
from controls.oscal import *
from controls.utilities import oscalize_control_id
from controls.views import OSCALComponentSerializer, ComponentImporter
from siteapp.models import User, Project, Organization, Tag


import fs, fs.errors
# import xlsxio

import logging
logging.basicConfig()
import structlog
from structlog import get_logger
from structlog.stdlib import LoggerFactory
structlog.configure(logger_factory=LoggerFactory())
structlog.configure(processors=[structlog.processors.JSONRenderer()])
logger = get_logger()

# Import NLP Libraries
import spacy    # library spacy used for NLP processing
nlp = spacy.load('en_core_web_sm')  # choose Spacy English Library small
# nlp = spacy.load('en_core_web_lg') # large model
# import pandas as pd  # panda library to create dataframes

# Add entities - https://spacy.io/api/entityruler#add_patterns
patterns = [
    {"label": "ORG", "pattern": "Apple"},
    {"label": "GPE", "pattern": [{"lower": "san"}, {"lower": "francisco"}]},
    {"label": "COMPONENT", "pattern": "Compliance Docs"},
    {"label": "COMPONENT", "pattern": "Project System Security Policy"},
    {"label": "COMPONENT", "pattern": "PyramidIT"},
    {"label": "COMPONENT", "pattern": "Cybrary"},
]

ruler = nlp.add_pipe("entity_ruler")
ruler.add_patterns(patterns)

doc = nlp("A text about Apple and PyramidIT and Greg")
ents = [(ent.text, ent.label_) for ent in doc.ents]
print(10,"=====", ents)
# sys.exit()

NON_COMPONENTS = ['ISO', 'UTC', 'None', 'Project', 'annual']

# Settings
CI = StatementTypeEnum.CONTROL_IMPLEMENTATION.name
CIP = StatementTypeEnum.CONTROL_IMPLEMENTATION_PROTOTYPE.name
CIL = StatementTypeEnum.CONTROL_IMPLEMENTATION_LEGACY.name

class Command(BaseCommand):
    help = 'NLP find candidate components in legacy implementation statements'

    def add_arguments(self, parser):
        parser.add_argument('--importname', metavar='import_name', nargs='?', type=str, default="NLP Candidate components in legacy impl smts", help="Name to identify the batch creation of statements")
        parser.add_argument('--project_ids', metavar='project_ids', nargs='+', required=True, type=int, help="Space delimited list of Project IDs")
        parser.add_argument('--create-components', dest='create_components', required=False, action='store_true', help="Space delimited list of Project IDs")

    def get_Entity(self, nlp_text):
        """Return list of candidate spaCy entities in text block"""

        # First we make sure that the input is of correct type
        # by using the assert command to check the input type
        assert type(nlp_text) == spacy.tokens.doc.Doc

        # Let's set up a placeholder list for our Entities
        Entities = []

        # We begin then begin looping over the Doc object
        for entity in nlp_text.ents:
            if entity.text in NON_COMPONENTS:
                continue
            # Append entity to the list of entities
            Entities.append(entity.text)

        # When the loop is complete, return the list of Entities
        return Entities

    def get_EntitySentence(self, nlp_text, control_id, control_key, ssp_id):
        """Return sentence containing candidate entity"""

        # Make sure input is of correct type
        assert type(nlp_text) == spacy.tokens.doc.Doc

        # Placeholder dictionary for Entities
        EntitiesSentencesDict = dict()

        # Loop over the Doc object
        for entity in nlp_text.ents:
            if entity.text in NON_COMPONENTS:
                continue
            entity_sentence_dict = {
                "control_id": control_id,
                "control_key": control_key,
                "entity": entity.text,
                "label": entity.label_,
                "sentence": (entity.sent).text
            }

            # Create a key and value
            # EntitiesSentencesDict[entity.text]= (entity.sent).text  # (add.text to untokenize sentences)
            EntitiesSentencesDict[entity.text]= entity_sentence_dict

        # When the loop is complete, return the list of Entities
        return EntitiesSentencesDict

    def string_clean_up(self, text):
        """Return a string with unicode removed"""

        str_hard_space='17\xa0kg on 23rd\xa0June 2021'
        # print (str_hard_space)
        xa=u'\xa0'

        clean_string = unicodedata.normalize("NFKD", text)
        return clean_string


    def handle(self, *args, **options):
        """Execute script"""

        # Create import record so we easily bulk delete
        IMPORT_NAME = options['importname']
        PROJECT_IDS = options['project_ids']
        CREATE_COMPONENTS = options['create_components']

        import_rec = ImportRecord.objects.create(name=IMPORT_NAME)
        impl_type = CIL

        # Statement.objects.filter(statement_type=impl_type, consumer_element=p.system.root_element)

        # Get the CMMC Catalog instance
        # catalog_key = "CMMC_ver1"
        # cmmc = Catalog.GetInstance(catalog_key=catalog_key)
        # c_dict= cmmc.get_flattened_controls_all_as_dict()

        # Start main section
        print("\nScript start\n============\n")
        projects = Project.objects.filter(id__in=PROJECT_IDS)

        for project in projects:
            print(1,"====", project)
            proj_impl_smts = Statement.objects.filter(statement_type=impl_type, consumer_element=project.system.root_element)
            print(2,"====", proj_impl_smts)

            # Loop through project legacy statements
            for smt in proj_impl_smts:
                print(f"\nLegacy Statement {smt.sid}:", smt.id, smt.body[0:350], "...")

                # Get data from statements
                text = self.string_clean_up(smt.body)
                control_id = smt.sid
                catalog_key = smt.sid_class
                # TODO: improve ssp_id
                ssp_id = project.id

                # NLP
                nlp_text = nlp(text)
                # print(4, "===", type(nlp_text)) #<class 'spacy.tokens.doc.Doc'>

                # Extracting Entities from NLP
                candidate_entities = self.get_Entity(nlp_text)
                print(f"{len(candidate_entities)} candidate entities:", candidate_entities,"\n")

                # Extracting entity surrounding text
                sentences = self.get_EntitySentence(nlp_text, control_id, catalog_key, ssp_id)
                # print(6, "sentences: ", sentences)
                # print(json.dumps(sentences, sort_keys=True, indent=4))

                for item in sentences.keys():
                    print(f"'{item}':", sentences[item]['sentence'])

                    # Get or create component from database
                    if CREATE_COMPONENTS:
                        # Handle when a system exists with name of component
                        if Element.objects.filter(name=item, element_type="system").exists():
                            sentences[item]['entity'] = item + " Component"

                        new_component, new_component_created = Element.objects.get_or_create(name=sentences[item]['entity'], element_type="system_element")
                        if new_component_created:
                            new_component.full_name = sentences[item]['entity']
                            new_component.import_record = import_rec
                            new_component.save()
                            # Tag compnent
                            desired_tags = set(['NLP generated', 'draft'])
                            existing_tags = Tag.objects.filter(label__in=desired_tags).values('id', 'label')
                            tags_to_create = desired_tags.difference(set([tag['label'] for tag in existing_tags]))
                            new_tags = Tag.objects.bulk_create([Tag(label=tag) for tag in tags_to_create])
                            all_tag_ids = [tag.id for tag in new_tags] + [tag['id'] for tag in existing_tags]
                            new_component.add_tags(all_tag_ids)
                            new_component.save()
                            logger.info(event=f"new_element_from_auto_nlp component",
                                object={"object": "element", "id": new_component.id},
                                user={"id": None, "username": None})

                    # TODO: oscalize id?
                    smt_prototype, smt_created= Statement.objects.get_or_create(
                        sid=sentences[item]['control_id'],
                        sid_class=sentences[item]['control_key'],
                        producer_element=new_component,
                        statement_type=CIP)
                    if smt_created:
                        smt_prototype.body = sentences[item]['sentence']
                        smt_prototype.import_record = import_rec
                        # update statement changelog
                        smt_prototype.change_log = { "change_log": {"changes": []} }
                        change = {
                            "datetimestamp": smt_prototype.updated.isoformat(),
                            "event": None,
                            "source": None,
                            "user_id": "admin",
                            "fields": {
                                "sid": smt_prototype.sid,
                                "sid_class": smt_prototype.sid_class,
                                "body": smt_prototype.body
                            }
                        }
                        if smt_created:
                            change['event'] = 'created'
                        else:
                            change['event'] = 'updated'
                            change['fields']['body'] = smt_prototype.body
                        smt_prototype.change_log_add_entry(change)

                        smt_prototype.save()
                        # tag existing components that get new statements as 'NLP-added statements'
                        if not new_component_created:
                            desired_tags = set(['NLP-added statements'])
                            existing_tags = Tag.objects.filter(label__in=desired_tags).values('id', 'label')
                            tags_to_create = desired_tags.difference(set([tag['label'] for tag in existing_tags]))
                            new_tags = Tag.objects.bulk_create([Tag(label=tag) for tag in tags_to_create])
                            all_tag_ids = [tag.id for tag in new_tags] + [tag['id'] for tag in existing_tags]
                            new_component.add_tags(all_tag_ids)
                            new_component.save()

                        print(f"Prototype smt created {smt_prototype.id}")
                        logger.info(event=f"new_statement_from_auto_nlp control_implentation_prototype",
                                object={"object": "statement", "id": smt_prototype.id},
                                user={"id": None, "username": None})

                        new_smt_project = smt_prototype.create_system_control_smt_from_component_prototype_smt(project.system.root_element.id)
                        print(f"Project smt created {new_smt_project.id}")
                        logger.info(event=f"new_statement_from_auto_nlp control_implentation",
                                object={"object": "statement", "id": new_smt_project.id},
                                user={"id": None, "username": None})


        print("\n==========\nScript end")
