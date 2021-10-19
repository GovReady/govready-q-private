#!/usr/bin/env python
# coding: utf-8

# usage
#   python3 manage.py findcandidatecomponents


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
from siteapp.models import User, Project, Organization

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


class Command(BaseCommand):
    help = 'NLP find candidate components in legacy implementation statements'

    def add_arguments(self, parser):
        # parser.add_argument('--format', metavar='format', nargs='?', default="oscal", help="File format")
        # parser.add_argument('--path', metavar='dir_or_pdf', nargs='?', default="local/export/components", help="The directory path containing component files to import.")

        parser.add_argument('--importname', metavar='import_name', nargs='?', type=str, default="NLP Candidate components in legacy impl smts", help="Name to identify the batch creation of statements")

        parser.add_argument('--project_ids', metavar='project_ids', nargs='+', required=True, type=int, help="Space delimited list of Project IDs")

        # parser.add_argument('--stopinvalid', default=True, action='store_true')
        # parser.add_argument('--no-stopinvalid', dest='stopinvalid', action='store_false')

    def get_Entity(self, nlp_text):
        """Return list of candidate spaCy entities in text block"""

        # First we make sure that the input is of correct type
        # by using the assert command to check the input type
        assert type(nlp_text) == spacy.tokens.doc.Doc

        # Let's set up a placeholder list for our Entities
        Entities = []

        # We begin then begin looping over the Doc object
        for entity in nlp_text.ents:
                # Append entity to the list of entities
                Entities.append(entity.text)

        # When the loop is complete, return the list of Entities
        return Entities

    def get_EntitySentence(self, nlp_text):
        """Return sentence containing candidate entity"""

        # First we make sure that the input is of correct type
        # by using the assert command to check the input type
        assert type(nlp_text) == spacy.tokens.doc.Doc

        # Let's set up a placeholder dictionary for our Entities
        EntitiesSentencesDict = dict()

        # We begin then begin looping over the Doc object
        for entity in nlp_text.ents:
            # Create a key and value
            EntitiesSentencesDict[entity.text]= (entity.sent).text  # (add.text to untokenize sentences)

        # When the loop is complete, return the list of Entities
        return EntitiesSentencesDict

    def string_clean_up(self, text):
        """Return a string with unicode removed"""

        str_hard_space='17\xa0kg on 23rd\xa0June 2021'
        print (str_hard_space)
        xa=u'\xa0'

        clean_string = unicodedata.normalize("NFKD", text)
        return clean_string


    def handle(self, *args, **options):

        # Set up
        # Create import record so we easily bulk delete
        import_name = options['importname']
        project_ids = options['project_ids']

        # # Set up
        # # Create import record so we easily bulk delete
        # import_name = options['importname']
        # project_ids = options['project_ids']

        import_rec = ImportRecord.objects.create(name=import_name)
        impl_type = StatementTypeEnum.CONTROL_IMPLEMENTATION_LEGACY.name

        # Statement.objects.filter(statement_type=impl_type, consumer_element=p.system.root_element)

        # Get the CMMC Catalog instance
        # catalog_key = "CMMC_ver1"
        # cmmc = Catalog.GetInstance(catalog_key=catalog_key)
        # c_dict= cmmc.get_flattened_controls_all_as_dict()

        # Start main section
        print("\nScript start\n============\n")
        projects = Project.objects.filter(id__in=project_ids)

        for project in projects:
            print(1,"====", project)
            proj_impl_smts = Statement.objects.filter(statement_type=impl_type, consumer_element=project.system.root_element)
            print(2,"====", proj_impl_smts)

        # Process components and their statements
        # emt_smts = Statement.objects.filter(consumer_element__in=project_ids, statement_type=impl_type).order_by('producer_element')

        for smt in proj_impl_smts:
            print(f"\n3", "===", smt.id, smt.body[0:150])
            # NLP
            # df['Implementation Statement'].apply(nlp)
            text = self.string_clean_up(smt.body)
            nlp_text = nlp(text)
            print(4, "===", type(nlp_text)) #<class 'spacy.tokens.doc.Doc'>

            # Extracting Entities from NLP
            candidate_entities = self.get_Entity(nlp_text)
            print(5, "candidate entities: ", candidate_entities)

            # Extracting entity surrounding text
            sentences = self.get_EntitySentence(nlp_text)
            print(6, "sentences: ", sentences)
            print(json.dumps(sentences, sort_keys=True, indent=4))


        print("\n==========\nScript end")
        sys.exit()

        # list unique candidate entities in document

        # df['Candidate_Entities'].apply(pd.Series).stack().unique()


        #define our own Python function to fetch Spacy Entity and Related Sentence for each Implementation Statement

        # create new dataframe of Candidate Entities and Related Sentences
        df3 = df['Candidate_Entities_with_Sentences'].apply(pd.Series)
        df3


        # In[21]:


        df3.dtypes

        print(df3.dtypes)

        # In[ ]:

        print("End of script")
