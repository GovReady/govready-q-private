#!/usr/bin/env python
# coding: utf-8

# About
# NLP find candidate components in legacy implementation statements

# usage
#   python3 manage.py nlpfindcandidatecomponents --importname nlpcomponents --create-components --project_ids 1
#   python3 manage.py nlpfindcandidatecomponents --importname nlpcomponents --create-components --project_ids 1 --entity_file nlp/data/test_entity_file.txt --nonentity_file nlp/data/test_nonentity_file.py
#   docker exec -it govready-q-dev python3 manage.py nlpfindcandidatecomponents --importname nlpcomponents --create-components --project_ids 1 --entity_file nlp/data/test_entity_file --nonentity_file nlp/data/test_nonentity_file.py


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
        parser.add_argument('--entity_file', metavar='entity_file', required=False, type=str, default=None, help="File containing line separed entities")
        parser.add_argument('--nonentity_file', metavar='nonentity_file', required=False, type=str, default=None, help="File containing line separed nonentities")

    def get_entities_from_file(self, filename):
        """Return array of entities from file"""

        try:
            with open(filename) as file:
                lines = file.readlines()
                entities = [line.rstrip() for line in lines]
        except:
            print(f"Problem opening {filename}")
            entities = None

        print('entities read from file',entities)

        return entities

    def get_Entity(self, nlp_text):
        """Return list of candidate spaCy entities in text block"""

        # First we make sure that the input is of correct type
        # by using the assert command to check the input type
        assert type(nlp_text) == spacy.tokens.doc.Doc

        # Let's set up a placeholder list for our Entities
        Entities = []

        # We begin then begin looping over the Doc object
        for entity in nlp_text.ents:
            if entity.text in NONENTITIES:
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
            if entity.text in NONENTITIES:
                continue

            entity_sentence_dict = {
                "control_id": control_id,
                "control_key": control_key,
                "entity": entity.text,
                "label": entity.label_,
                "prev_sentence": (get_previous_sentence(nlp_text, entity.start)).text,
                "sentence": (entity.sent).text,
                "next_sentence": (get_next_sentence(nlp_text, entity.start)).text
            }
            # NOTE - convert None to empty string: prev_sentence is not None and prev_sentence or ''

            # Create a key and value
            # EntitiesSentencesDict[entity.text]= (entity.sent).text  # (add.text to untokenize sentences)
            EntitiesSentencesDict[entity.text]= entity_sentence_dict

        # When the loop is complete, return the list of Entities
        return EntitiesSentencesDict

    # Uli's code
    def get_previous_sentence(doc, token_index):
        if doc[token_index].sent.start - 1 < 0:
            return None
        return doc[doc[token_index].sent.start - 1].sent

    # Uli's code
    # function to get sentence after entity sentence.
    def get_next_sentence(doc, token_index):
        if doc[token_index].sent.end + 1 >= len(doc):
            return None
        return doc[doc[token_index].sent.end + 1].sent

    def string_clean_up(self, text):
        """Return a string with unicode removed"""

        # str_hard_space='17\xa0kg on 23rd\xa0June 2021'
        # # print (str_hard_space)
        # xa=u'\xa0'

        clean_string = unicodedata.normalize("NFKD", text)
        return clean_string

    def handle(self, *args, **options):
        """Execute script"""

        # Create import record so we easily bulk delete created components
        IMPORT_NAME = options['importname']
        PROJECT_IDS = options['project_ids']
        CREATE_COMPONENTS = options['create_components']
        ENTITY_FILE = options['entity_file']
        NONENTITY_FILE = options['nonentity_file']

        import_rec = ImportRecord.objects.create(name=IMPORT_NAME)
        impl_type = CIL

        # Statement.objects.filter(statement_type=impl_type, consumer_element=p.system.root_element)

        # Get the CMMC Catalog instance
        # catalog_key = "CMMC_ver1"
        # cmmc = Catalog.GetInstance(catalog_key=catalog_key)
        # c_dict= cmmc.get_flattened_controls_all_as_dict()

        # Start main section
        print("\nStart main section\n============\n")
        projects = Project.objects.filter(id__in=PROJECT_IDS)

        # Prepare NLP
        # Import NLP Libraries
        import spacy    # library spacy used for NLP processing
        nlp = spacy.load('en_core_web_sm')  # choose Spacy English Library small
        # nlp = spacy.load('en_core_web_lg') # large model

        if ENTITY_FILE:
            pre_identified_entities_list = self.get_entities_from_file(ENTITY_FILE)

            # Make a loop that adds pre-identified entities list to the Entity Ruler
            ruler = nlp.add_pipe("entity_ruler")
            patterns=[]
            for item in pre_identified_entities_list:
                pattern = {"label":"Identified_Ent","pattern":item}
                # pattern = {"label":"COMPONENT","pattern":item}
                patterns.append(pattern)
            ruler.add_patterns(patterns)

        # Quick test of added entities
        doc = nlp("A text about Apple and PyramidIT and Greg")
        ents = [(ent.text, ent.label_) for ent in doc.ents]
        print(2,"=====", ents)
        # sys.exit()

        # NONENTITIES = ['ISO', 'UTC', 'None', 'Project', 'annual']
        if NONENTITY_FILE:
            NONENTITIES = self.get_entities_from_file(NONENTITY_FILE)

        for project in projects:
            print(3,"==== project", project)
            proj_impl_smts = Statement.objects.filter(statement_type=impl_type, consumer_element=project.system.root_element)
            print(4,"==== proj_impl_smts", proj_impl_smts)

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
