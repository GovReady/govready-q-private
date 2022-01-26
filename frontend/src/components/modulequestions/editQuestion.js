import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { hide, show } from '../modulequestions/slice';

import { ReactModal } from "../shared/modal"
import { 
    Button,
    ButtonToolbar,
    DropdownButton,
    Col, 
    ControlLabel,
    Grid, 
    Form, 
    FormControl, 
    FormGroup, 
    HelpBlock,
    MenuItem,
    Row,
    SplitButton,
    Modal
} from "react-bootstrap"
import { set } from 'lodash';

const PRETTY_YAML = require('json-to-pretty-yaml');
const YAML = require('js-yaml');

export const EditQuestion = ({ moduleId, questionId, uuid }) => {
    const dispatch = useDispatch();

    const [ post, setPost ] = useState(null);
    const [ currentQuestion, setCurrentQuestion ] = useState(null);
    const [ properties, setProperties ] = useState([]);
    const [ tempAction, setTempAction ] = useState('');
    const [ tempChoice, setTempChoice ] = useState('');
    const [ tempFields, setTempFields ] = useState('');
    const [ modules, setModules ] = useState([]);

    /* Fetch data from endpoint */
    useEffect(() => {
        axios(`/api/v2/modules/`).then(response => {
            setModules(response.data);
        })
        axios(`/api/v2/modules/${moduleId}/questions/${questionId}/`).then(response=>{
            setPost(response.data);
        });
        // getModules();
    }, [moduleId, questionId]);

    useEffect(() =>{
        dispatch(show())
    }, [uuid])

    /* Assign our state to the instance of the object */
    useEffect(() => {
        if(post !== null){
            setCurrentQuestion(post.spec);
            setProperties(Object.keys(post.spec));

            if(post.spec.actions !== undefined){
                setTempAction(PRETTY_YAML.stringify(post.spec.actions))
            }
            if(post.spec.choices !== undefined){
                setTempChoice(reFormatingArrayOfObjectsToStringWithLines(post.spec.choices))
            }
            if(post.spec.fields !== undefined){
                setTempFields(reFormatingArrayOfObjectsToStringWithLines(post.spec.fields))
            }
        }
    }, [post, moduleId, questionId])

    /* Update post and properties anytime the current question changes */
    useEffect(() => {
        if(post !== null && currentQuestion !== null){
            const updatedPost = post;
            updatedPost.spec = currentQuestion;
            setPost(updatedPost);
            setProperties(Object.keys(currentQuestion))
        }
    }, [currentQuestion]);

    const handleSave = async (updatedData) => {
        const response = await axios.put(`/api/v2/modules/${moduleId}/questions/${questionId}/`, updatedData);
        if(response.status === 200){    
            window.location.reload();
        } else{
            console.error("Something went wrong")
        }
    };

    const handleDelete = async () => {
        const response = await axios.delete(`/api/v2/modules/${moduleId}/questions/${questionId}/`)
        if(response.status === 204){    
            window.location.reload();
        } else{
            console.error("Something went wrong")
        }
    };

    const helperDict = {
        "prompt": "First line will be shown in a larger font.",
        "placeholder": "Template text displayed as the field’s placeholder text when the field is empty. Do not set both a placeholder and a default.",
        "default": "Template text provided as a default value. Do not set both a placeholder and a default.",
        "choices": "Put each choice on a separate line and provide as KEY|LABEL|HELP.",
        "impute": "Impute conditions are run in order. The first condition to match determines the answer for this question. Each condition is a Jinja2 expression. If the condition evaluates to true, the condition matches.",
        "actions": "Optional question specification YAML data not defined above.",
        "help": "Template text shown as small-font help text below the question’s input field.",
        "min": "The minimum number of choices the user must select. Leave blank if there is no minimum.",
        "max": "The maximum number of choices the user may select. Leave blank if there is no maximum.",
        "file-type": "Restrict file uploads to files of the given type.",
        "module": "The module that can be used to answer this question.",
        "module-set": "The module that can be used to answer this question.",
        "protocol": "Enter a protocol ID to allow the user to choose any compliance app that satisfies this protocol. List multiple IDs specified by spaces to require that the app satisfies all listed protocols."
    };

    const addNewPropertiesToCurrentQuestion = (obj, type) => {
        const newValue = {...obj};
        let propertiesToIgnore = ['id', 'prompt', 'title', 'type'];

        switch(type) {
            case 'text':
                /* 
                    1. Add properties 
                        Placeholder, 
                        Default
                        Help 
                    2. Delete any properties that arent [id, prompt, type, impute, and optional ]
                */
                propertiesToIgnore = propertiesToIgnore.concat(['placeholder', 'default', 'help'])
                
                newValue["placeholder"] = "";
                newValue["default"] = "";
                newValue["help"] = "";
                
                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }

                })
                setTempChoice('');
                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'password':
                propertiesToIgnore = propertiesToIgnore.concat(['help'])
                newValue["help"] = "";

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }

                })
                setTempChoice('');
                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'email-address':
                propertiesToIgnore = propertiesToIgnore.concat(['placeholder', 'default', 'help'])
                
                newValue["placeholder"] = "";
                newValue["default"] = "";
                newValue["help"] = "";
                
                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }

                });

                setTempChoice('');
                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'url':
                propertiesToIgnore = propertiesToIgnore.concat(['placeholder', 'default', 'help'])
                
                newValue["placeholder"] = "";
                newValue["default"] = "";
                newValue["help"] = "";
                
                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }

                });

                setTempChoice('');
                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'longtext':
                propertiesToIgnore = propertiesToIgnore.concat(['default', 'help'])

                newValue["default"] = "";
                newValue["help"] = "";
                
                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                });

                setTempChoice('');
                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'date':
                propertiesToIgnore = propertiesToIgnore.concat(['help'])
                newValue["help"] = "";

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })
                setTempChoice('');
                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'choice':
                propertiesToIgnore = propertiesToIgnore.concat(['choices'])

                newValue["choices"] = [];

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })

                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'choice-from-data':
                propertiesToIgnore = propertiesToIgnore.concat(['choices'])

                newValue["choices"] = [];

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })

                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'multiple-choice':
                propertiesToIgnore = propertiesToIgnore.concat(['choices', 'min', 'max'])
                
                newValue["choices"] = [];
                newValue["min"] = null;
                newValue["max"] = null;

                
                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })

                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'multiple-choice-from-data':
                propertiesToIgnore = propertiesToIgnore.concat(['choices', 'min', 'max'])
                
                newValue["choices"] = [];
                newValue["min"] = null;
                newValue["max"] = null;

                
                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })

                setTempFields('');
                setTempAction('')
                
                setCurrentQuestion(newValue);
                break;
            case 'datagrid':
                propertiesToIgnore = propertiesToIgnore.concat(['fields', 'min', 'max'])

                newValue["fields"] = [];
                newValue["min"] = null;
                newValue["max"] = null;

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })

                setTempChoice('');
                setTempAction('');
                
                setCurrentQuestion(newValue);
                break;
            case 'integer':
                propertiesToIgnore = propertiesToIgnore.concat(['placeholder', 'min', 'max', 'help'])

                newValue["placeholder"] = "";
                newValue["min"] = null;
                newValue["max"] = null;
                newValue["help"] = "";

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })
                setTempChoice('');
                setTempFields('');
                setTempAction('');
                
                setCurrentQuestion(newValue);
                break;
            case 'real':
                propertiesToIgnore = propertiesToIgnore.concat(['placeholder', 'min', 'max', 'help'])

                newValue["placeholder"] = "";
                newValue["min"] = null;
                newValue["max"] = null;
                newValue["help"] = "";

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })
                setTempChoice('');
                setTempFields('');
                setTempAction('');
                
                setCurrentQuestion(newValue);
                break;
            case 'interstitial':
                propertiesToIgnore = propertiesToIgnore.concat(['impute'])

                newValue["impute"] = [];

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })
                setTempChoice('');
                setTempFields('');
                setTempAction('');
                
                setCurrentQuestion(newValue);
            case 'file':
                propertiesToIgnore = propertiesToIgnore.concat(['file-type', 'help'])

                newValue["file-type"] = "";
                newValue["help"] = "";

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })
                setTempChoice('');
                setTempFields('');
                setTempAction('');
                
                setCurrentQuestion(newValue);
                break;
            case 'module':
                propertiesToIgnore = propertiesToIgnore.concat(['module-id', 'protocol'])

                newValue["module-id"] = "";
                newValue["protocol"] = [];

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })
                setTempChoice('');
                setTempFields('');
                setTempAction('');
                
                setCurrentQuestion(newValue);
                break;
            case 'module-set':
                propertiesToIgnore = propertiesToIgnore.concat(['module-id', 'protocol'])

                newValue["module-id"] = "";
                newValue["protocol"] = [];

                Object.keys(newValue).map((property) => {
                    if(!propertiesToIgnore.includes(property)){
                        delete newValue[property];
                    }
                })
                setTempChoice('');
                setTempFields('');
                setTempAction('');
                
                setCurrentQuestion(newValue);
                break;
            default:
                delete newValue["help"]
        }
        return newValue;
        
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const handleChange = (value, updatedValue) => {
        const newValue = {...currentQuestion};
        newValue[value] = updatedValue;
        setCurrentQuestion(newValue);
    };

    const typesArray = [
        {
            header: 'Text Questions',
            sub: ['Text (Single line)', 'Password', 'Email Address', 'Web Address(URL)', 'Paragraph (Rich Text/Markdown)']
        },
        {
            header: 'Choice Questions',
            sub: ['Date', 'Yes/No', 'Single Choice', 'Email Single Choice from Data', 'Multiple Choice', 'Multiple Choice from Data', 'Datagrid']
        },
        {
            header: 'Number Questions',
            sub: ['Integer', 'Any Number']
        },
        {
            header: 'Media Questions',
            sub: ['Interstitials', 'File Upload']
        },
        {
            header: 'Sub-Task Questions',
            sub: ['Task (Single Task)', 'Multiple Task']
        },
    ];

    const typeDict = {
        'Text (Single line)': 'text',
        'Password': 'password',
        'Email Address': 'email-address',
        'Web Address(URL)': 'url',
        'Paragraph (Rich Text/Markdown)': 'longtext',
        'Date': 'date',
        'Yes/No': 'yesno',
        'Single Choice': 'choice',
        'Email Single Choice from Data': 'choice-from-data',
        'Multiple Choice': 'multiple-choice',
        'Multiple Choice from Data': 'multiple-choice-from-data',
        'Datagrid': 'datagrid',
        'Integer': 'integer',
        'Any Number': 'real',
        'Interstitial': 'interstitial',
        'File Upload': 'file',
        'Task (Single Task)': 'module',
        'Multiple Task': 'module-set'
    };

    const imputeType = [
        ['YAML Value', null],
        ['Jinja2 Expression', 'expression'],
        ['Jinja2 Template', 'template']
    ]
    const differentProperties = ['id', 'title', 'type', 'actions', 'choices', 'fields', 'min', 'max', 'impute', 'file-type', 'module-id', 'protocol'];

    const fileType = [
        ['Any File Type', null], 
        ['Image', 'image']
    ];

    const fileObjects = {
        'Any File Type': '',
        'Image': 'image'
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    const reFormatingArrayOfObjectsToStringWithLines = (arrayOfObjects) => {
        return arrayOfObjects.map((obj) => {
            let newText = "";
            
            /* key */ 
            if(obj['key'] !== '' && obj['text'] === '') {
                newText += obj['key'];
            }
            /* key| */
            if(obj['key'] !== '' && obj['text'] !== '') {
                newText += obj['key'] + '|';
            }
            if(obj['help'] !== undefined){
                /* key|text|help| */
                if(obj['text'] !== '' && obj['help'] !== ''){
                    newText += obj['text'] + '|' + obj['help'] + '|';
                }
                /* key|text| */
                if(obj['text'] !== '' && obj['help'] === ''){
                    newText += obj['text'] + '|'
                }
                /* key||help */
                if(obj['text'] === '' && obj['help'] !== ''){
                    newText += '|' + obj['help'] + '|'
                }
            } else {
                newText += obj['text'] + '|'
            }    
            return newText;
        }).join('\n');
    };

    const stringedChoiceToObject = (stringedObj) => {
        let newArray = stringedObj.split('|');
        if(newArray[1] === undefined){
            newArray[1] = '';
        }
        if(newArray[2] === undefined) {
            newArray[2] = '';
        }
        const newObj = {
            key: newArray[0],
            text: newArray[1],
            help: newArray[2]
        }
        return newObj;
    };

    const addNewImpute = () => {
        /* add mew impute object to the array */
        const newImputedObject = {
            condition: "", 
            value: null
        };
        
        const updatedQuestion = {...currentQuestion};

        if(updatedQuestion.impute === undefined){
            updatedQuestion.impute = [];
        }

        updatedQuestion.impute.push(newImputedObject);
        setCurrentQuestion(updatedQuestion);
    };

    const handleImputeChange = (condition, index, property, updatedValue) => {
        const updatedQuestion = {...currentQuestion};

        if (property === 'value-mode'){
            if(currentQuestion.impute[index]['value-mode'] !== updatedValue || currentQuestion.impute[index]['value-mode'] === undefined) {
                updatedQuestion.impute[index]['value-mode'] = updatedValue;
            }
        } else {
            updatedQuestion.impute[index][property] = updatedValue;
        }

        setCurrentQuestion(updatedQuestion);
    }

    const handleTypeChange = (updatedValue) => {
        const newValue = {...currentQuestion};
        newValue.type = typeDict[updatedValue];
        addNewPropertiesToCurrentQuestion(newValue, typeDict[updatedValue]);
    }

    const handleSubmit = () => {
        /* 
            1. Grab tempChoiceText and tempActionText
            2. Change these strings to their respective objects
            3. Update CurrentQuestion with these new values
            4. HandleSave
        */
        const updatedQuestion = {...currentQuestion};

        /* Translate tempAction string back to an YAML object */
        const listOfErrors = [];
        if(tempAction.length > 0){
            try {
                const yamlObj = YAML.load(tempAction);
                updatedQuestion.actions = yamlObj;
            } catch(error) {
                listOfErrors.push(error);
            }
        }

        /* Translate tempChoice string back to an array of objects */
        if(tempChoice.length > 0 ){
            try{
                const splittingText = tempChoice.split('\n');
                const newArrayOfChoices = [];
                splittingText.map((choice) => {
                    newArrayOfChoices.push(stringedChoiceToObject(choice));
                });
                updatedQuestion.choices = newArrayOfChoices;
            } catch(error) {
                listOfErrors.push(error);
            }
        }

        /* Translate tempFields string back to an array of objects*/
        if(tempFields.length > 0){
            try {
                const splittingText = tempFields.split('\n');
                const newArrayOfFields = [];
                splittingText.map((choice) => {
                    newArrayOfFields.push(stringedChoiceToObject(choice));
                });
                updatedQuestion.fields = newArrayOfFields;
            } catch(error){
                listOfErrors.push(error);
            }
        }

        const updatedPost = post;
        updatedPost.spec = updatedQuestion;
        
        if(listOfErrors.length === 0){
            handleSave(updatedPost);
        }
        else{
            alert(`Error: ${listOfErrors}`);
        }
        
    }

    const getModuleTitleFromId = (modId) => {
        if(modules.length !== 0){
            return modules.data.filter(mod => mod.id == modId)[0].module_name;
        } else {
            return 'Select a module from below'
        }
    }
    
    return (
        <>
            {post !== null && properties !== null && modules !== null && 
                <ReactModal 
                    moduleId={moduleId}
                    questionId={questionId}
                    title={`Edit Module ${moduleId}`}
                    header={
                        <Form horizontal>
                            {currentQuestion !== null && 
                                <>
                                    <h1>Edit Question</h1>
                                    <FormGroup controlId={`form-header`}>
                                        <Col componentClass={ControlLabel} sm={2}>
                                            {capitalizeFirstLetter('id')}
                                        </Col>
                                        <Col sm={10}>
                                            <FormControl 
                                                type="text" 
                                                placeholder={'Enter text'} 
                                                value={currentQuestion.id !== null ? currentQuestion.id : ''} 
                                                onChange={(event) => handleChange('id', event.target.value)}
                                            />
                                        </Col>
                                        <Col sm={2}>
                                        </Col>
                                        <Col sm={10}>
                                            <HelpBlock >
                                                Identifier for question used in templates and the API.
                                            </HelpBlock>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col componentClass={ControlLabel} sm={2}>
                                            {capitalizeFirstLetter('Title')}
                                        </Col>
                                        <Col sm={10}>
                                            <FormControl 
                                                type="text" 
                                                placeholder={'Enter text'} 
                                                value={currentQuestion.title !== null ? currentQuestion.title : ''} 
                                                onChange={(event) => handleChange('title', event.target.value)}
                                            />
                                        </Col>
                                        <Col sm={2}>
                                        </Col>
                                        <Col sm={10}>
                                            <HelpBlock >
                                                Title for question shown in progress list and elsewhere.
                                            </HelpBlock>
                                        </Col>
                                    </FormGroup>
                                </>
                            }
                        </Form>
                    }
                    body={
                        <Form horizontal onSubmit={handleSubmit}>
                            {properties !== null && currentQuestion !== null && 
                                Object.entries(properties).map(([key, value]) => {
                                    if(!differentProperties.includes(value)) {
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter(value)}
                                                </Col>
                                                <Col sm={10}>
                                                    <FormControl 
                                                        componentClass="textarea"
                                                        placeholder={'Enter text'} 
                                                        value={currentQuestion[value] !== null ? currentQuestion[value] : ""} 
                                                        onChange={(event) => {
                                                            handleChange(value, event.target.value)
                                                        }}
                                                    />
                                                </Col>
                                                {(value !== null) && (value in helperDict) ? 
                                                <>
                                                    <Col sm={2}>
                                                    </Col>
                                                    <Col sm={10}>
                                                        <HelpBlock>
                                                            {helperDict[value]}
                                                        </HelpBlock>
                                                    </Col>
                                                </>
                                                : ""}
                                            </FormGroup>
                                        )
                                    }
                                    else if(value === 'min' || value === 'max') {
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter(value)}
                                                </Col>
                                                <Col sm={10}>
                                                    <FormControl 
                                                        type="number"
                                                        placeholder={'Enter text'} 
                                                        value={currentQuestion[value] !== null ? currentQuestion[value] : ""} 
                                                        onChange={(event) => {
                                                            handleChange(value, event.target.value)
                                                        }}
                                                    />
                                                </Col>
                                                {(value !== null) && (value in helperDict) ? 
                                                <>
                                                    <Col sm={2}>
                                                    </Col>
                                                    <Col sm={10}>
                                                        <HelpBlock >
                                                            {helperDict[value]}
                                                        </HelpBlock>
                                                    </Col>
                                                </>
                                                : ""}
                                            </FormGroup>
                                        )
                                    }
                                    else if(value === 'actions'){
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter(value)}
                                                </Col>
                                                <Col sm={10}>
                                                    <FormControl 
                                                        componentClass="textarea"
                                                        placeholder={'Enter text'} 
                                                        value={currentQuestion[value] !== null ? tempAction : ""} 
                                                        onChange={(event) => setTempAction(event.target.value)}
                                                    />
                                                </Col>
                                                <Col sm={2}>
                                                </Col>
                                                <Col sm={10}>
                                                    <HelpBlock >
                                                        {helperDict[value]}
                                                    </HelpBlock>
                                                </Col>
                                            </FormGroup>
                                            
                                        )
                                    }
                                    else if(value === 'choices'){
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter('choices')}
                                                </Col>
                                                <Col sm={10}>
                                                    <FormControl 
                                                        componentClass="textarea"
                                                        placeholder={'Enter text'} 
                                                        value={currentQuestion[value] !== null ? tempChoice : ""} 
                                                        onChange={(event) => setTempChoice(event.target.value)}
                                                    />
                                                </Col>
                                                <Col sm={2}>
                                                </Col>
                                                <Col sm={10}>
                                                    <HelpBlock >
                                                        {helperDict[value]}
                                                    </HelpBlock>
                                                </Col>
                                            </FormGroup>
                                            
                                        )
                                    }
                                    else if(value === 'fields'){
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter('fields')}
                                                </Col>
                                                <Col sm={10}>
                                                    <FormControl 
                                                        componentClass="textarea"
                                                        placeholder={'Enter text'} 
                                                        value={currentQuestion[value] !== null ? tempFields : ""} 
                                                        onChange={(event) => setTempFields(event.target.value)}
                                                    />
                                                </Col>
                                                <Col sm={2}>
                                                </Col>
                                                <Col sm={10}>
                                                    <HelpBlock >
                                                        {helperDict[value]}
                                                    </HelpBlock>
                                                </Col>
                                            </FormGroup>
                                            
                                        )
                                    }
                                    else if(value === 'type'){
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter('type')}
                                                </Col>
                                                <Col sm={10}>
                                                    <DropdownButton
                                                        bsStyle={"default"}
                                                        title={getKeyByValue(typeDict, currentQuestion.type)}
                                                        id={`dropdown-basic-${1}`}
                                                        >
                                                            {
                                                                typesArray.map((mainType, index) => {
                                                                    return (
                                                                        <>
                                                                            <MenuItem key={index} eventKey={mainType.header}><b>{mainType.header}</b></MenuItem>
                                                                            {mainType.sub.map((sub, subIndex) => (
                                                                                <MenuItem
                                                                                    key={subIndex} 
                                                                                    eventKey={sub} 
                                                                                    onSelect={(event) => handleTypeChange(event)} //addNewPropertiesToCurrentQuestion(newValue, updatedValue)
                                                                                    active={sub === currentQuestion['type']}
                                                                                >
                                                                                    {sub}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                    </DropdownButton>
                                                </Col>
                                            </FormGroup>
                                            
                                        )
                                    }
                                    else if(value === 'file-type'){
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter('File Type')}
                                                </Col>
                                                <Col sm={10}>
                                                    <DropdownButton
                                                        bsStyle={"default"}
                                                        title={[undefined, null, ""].includes(currentQuestion['file-type']) ? fileType[0][0] : getKeyByValue(fileObjects, currentQuestion['file-type'])}
                                                        id={`dropdown-basic-${1}`}
                                                        >
                                                            {
                                                                fileType.map((type, index) => {
                                                                    return (
                                                                        <MenuItem 
                                                                            key={index} 
                                                                            eventKey={type[1] !== null ? type[1] : ''}
                                                                            onSelect={(event) => handleChange(value, event)}
                                                                            active={currentQuestion['file-type'] === type[1]}
                                                                        >
                                                                            {type[0]}
                                                                        </MenuItem>
                                                                    )
                                                                })
                                                            }
                                                    </DropdownButton>
                                                </Col>
                                                <Col sm={2}>
                                                </Col>
                                                <Col sm={10}>
                                                    <HelpBlock >
                                                        {helperDict[value]}
                                                    </HelpBlock>
                                                </Col>
                                            </FormGroup>
                                        )
                                    }
                                    else if (value === 'module-id'){
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter('Module')}
                                                </Col>
                                                <Col sm={10}>
                                                    <DropdownButton
                                                        bsStyle={"default"}
                                                        title={[undefined, null, ""].includes(currentQuestion['module-id']) ? 'Select My Own Module Protocol' : getModuleTitleFromId(currentQuestion['module-id'])}
                                                        id={`dropdown-basic-${1}`}
                                                        >
                                                            <MenuItem 
                                                                eventKey={''}
                                                                onSelect={(event) => handleChange(value, event)}
                                                                active={currentQuestion['module-id'] === ''}
                                                            >
                                                                Select My Own Module Protocol
                                                            </MenuItem>
                                                            {modules.data !== undefined && modules.data.map((type, index) => {
                                                                    return (
                                                                        <MenuItem 
                                                                            key={index} 
                                                                            eventKey={type.id}
                                                                            onSelect={(event) => handleChange(value, event)}
                                                                            active={currentQuestion['module-id'] === type.id}
                                                                        >
                                                                            {type.module_name}
                                                                        </MenuItem>
                                                                    )
                                                                })
                                                            }
                                                    </DropdownButton>
                                                </Col>
                                                <Col sm={2}>
                                                </Col>
                                                <Col sm={10}>
                                                    <HelpBlock >
                                                        {helperDict[value]}
                                                    </HelpBlock>
                                                </Col>
                                            </FormGroup>
                                        )
                                    }
                                    else if (value === 'protocol' && [undefined, null, ""].includes(currentQuestion['module-id'])){
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    Protocol
                                                </Col>
                                                <Col sm={10}>
                                                    <FormControl 
                                                        componentClass="textarea"
                                                        placeholder={'Enter text'} 
                                                        value={currentQuestion[value] !== null ? currentQuestion[value] : ""} 
                                                        onChange={(event) => {
                                                            handleChange(value, event.target.value)
                                                        }}
                                                    />
                                                </Col>
                                                <Col sm={2}>
                                                </Col>
                                                <Col sm={10}>
                                                    <HelpBlock >
                                                        {helperDict[value]}
                                                    </HelpBlock>
                                                </Col>
                                            </FormGroup>
                                        )
                                    }
                                    else if (value === 'impute'){
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter(value)}
                                                </Col>
                                                <Col sm={10}>
                                                    {currentQuestion[value].map((condition, conditionIndex) => {
                                                        return (
                                                            <FormGroup key={conditionIndex} controlId={`impute-${conditionIndex}`}>
                                                                <Col componentClass={ControlLabel} sm={2}>Condition {conditionIndex}:</Col>
                                                                <Col sm={10}>
                                                                    <FormControl 
                                                                        componentClass="textarea"
                                                                        placeholder={'Enter text'} 
                                                                        value={condition.condition} 
                                                                        onChange={(event) => handleImputeChange(condition, conditionIndex, 'condition',  event.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col componentClass={ControlLabel} sm={2}>
                                                                    Value {conditionIndex}:
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <FormControl 
                                                                        type="text"
                                                                        placeholder={'Enter text'} 
                                                                        value={condition.value !== null ? condition.value : ""} 
                                                                        onChange={(event) => handleImputeChange(condition, conditionIndex, 'value', event.target.value)}
                                                                    />
                                                                </Col>
                                                                <Col sm={4}>
                                                                    <DropdownButton
                                                                        bsStyle={"default"}
                                                                        title={[undefined, null, ""].includes(condition['value-mode']) ? imputeType[0][0] : condition['value-mode']}
                                                                        id={`dropdown-basic-${1}`}
                                                                        >
                                                                            {
                                                                                imputeType.map((type, index) => {
                                                                                    return (
                                                                                        <MenuItem 
                                                                                            key={index} 
                                                                                            eventKey={type[1] !== null ? type[1] : ""}
                                                                                            onSelect={(event) => handleImputeChange(condition, conditionIndex, 'value-mode', event)}
                                                                                            active={condition['value-mode'] === type[1]}
                                                                                        >
                                                                                            {type[0]}
                                                                                        </MenuItem>
                                                                                    )
                                                                                })
                                                                            }
                                                                    </DropdownButton>
                                                                </Col>
                                                            </FormGroup>
                                                        )
                                                    })}
                                                    
                                                    <Button type="button" variant="secondary" onClick={addNewImpute}>Add Impute condition</Button>
                                                    <Col sm={2}>
                                                    </Col>
                                                    <Col sm={10}>
                                                        <HelpBlock >
                                                            {helperDict[value]}
                                                        </HelpBlock>
                                                    </Col>
                                                </Col>
                                            </FormGroup>
                                        )
                                    }
                                })
                            }
                            {(currentQuestion !== null && currentQuestion.impute === undefined) && <FormGroup key={'floating-impute'} controlId={`form-impute_button`}>
                                <Col componentClass={ControlLabel} sm={2}>Impute</Col>
                                <Col sm={10}>
                                    <Button type="button" variant="secondary" onClick={addNewImpute}>Add Impute condition</Button>
                                </Col>
                            </FormGroup>}
                            <Modal.Footer style={{width: 'calc(100% + 20px)'}}>
                            <Button type="button" className="btn btn-danger" onClick={handleDelete} style={{float: 'left'}}>Delete Question</Button>
                            <Button variant="secondary" onClick={() => dispatch(hide())} style={{marginRight: '2rem'}}>Close</Button>
                                    <Button type="submit" className="btn btn-success">Save Changes</Button>
                            </Modal.Footer>
                        </Form>
                    }
                />
            }
        </>
    )
}