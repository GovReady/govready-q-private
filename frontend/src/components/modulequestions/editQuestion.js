import React, { useState, useEffect } from 'react';
import axios from 'axios';

import slugify from 'react-slugify';

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
    SplitButton
} from "react-bootstrap"


export const EditQuestion = ({ moduleId, questionId }) => {
    
    // const [questionId, setQuestionID] = useState("")
    

    // const endpoint = (querystrings) => {        
    //     return axios.get(`/api/v2/modules/165/`, { params: querystrings });
    // };
    const [ post, setPost ] = useState(null);
    const [ currentQuestion, setCurrentQuestion ] = useState(null);
    const [ fields, setFields ] = useState([]);
    const BUTTONS = ['Default', 'Primary', 'Success', 'Info', 'Warning', 'Danger'];
    const helperDict = {
        "prompt": "First line will be shown in a larger font.",
        "placeholder": "Template text displayed as the field’s placeholder text when the field is empty. Do not set both a placeholder and a default.",
        "default": "Template text provided as a default value. Do not set both a placeholder and a default.",
        "choices": "Put each choice on a separate line and provide as KEY|LABEL|HELP.",
        "impute": "Impute conditions are run in order. The first condition to match determines the answer for this question. Each condition is a Jinja2 expression. If the condition evaluates to true, the condition matches.",
        "optional": "Optional question specification YAML data not defined above.",
        "help": "Template text shown as small-font help text below the question’s input field.",
        "min": "The minimum number of choices the user must select. Leave blank if there is no minimum.",
        "max": "The maximum number of choices the user may select. Leave blank if there is no maximum.",
    };

  
    useEffect(() => {
        axios(`/api/v2/modules/${moduleId}/questions/${questionId}/`).then(response=>{
            setPost(response.data);
        })
    }, [])

    useEffect(() => {
        if(post !== null){
            setCurrentQuestion(post.spec);
            setFields(Object.keys(post.spec))
        }
    }, [post])

    useEffect(() => {
        if(post !== null && currentQuestion !== null){
            const updatedPost = post;
            updatedPost.spec = currentQuestion;
            setPost(updatedPost)
        }
    }, [currentQuestion])

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const handleChange = (value, updatedValue) => {
        const newValue = {...currentQuestion};
        newValue[value] = updatedValue
        setCurrentQuestion(newValue);
        console.log('UPDATED CURRENTQUESTION: ', currentQuestion)
    }

    console.log('post: ', post)
    console.log('fields: ', fields)
    const typesArray = [
        {
            header: 'Text Questions',
            sub: ['Text (Single line)', 'Password', 'Email Address', 'Web Address(URL)', 'Paragraph (Rich Text/Markdown)']
        },
        {
            header: 'Choice Questions',
            sub: ['Yes/No', 'Single Choice', 'Email Single Choice from Data', 'Multiple Choice', 'Multiple Choice from Data', 'Datagrid']
        },
        {
            header: 'Number Questions',
            sub: ['Integer', 'Any Number', 'Datagrid']
        },
        {
            header: 'Media Questions',
            sub: ['Interstitials', 'File Upload']
        },
        {
            header: 'Sub-Task Questions',
            sub: ['Task (Single Task)', 'Multiple Task']
        },
    ]

    return (
        <>
            {post !== null && fields !== null && 
                <ReactModal 
                    moduleId={moduleId}
                    questionId={questionId}
                    data={post}
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
                        <Form horizontal>
                            {fields !== null && currentQuestion !== null && 
                                Object.entries(fields).map(([key, value]) => {
                                    console.log('value: ', value)
                                    if(value !== 'id' && value !== 'title' && value !== 'type' && value !== 'actions') {
                                        
                                        return (
                                            <FormGroup key={key} controlId={`form-${value}`}>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter(value)}
                                                </Col>
                                                <Col sm={10}>
                                                    <FormControl 
                                                        type="text" 
                                                        placeholder={'Enter text'} 
                                                        value={currentQuestion[value] !== null ? currentQuestion[value] : ""} 
                                                        onChange={(event) => {
                                                            console.log('@@@@@@@', currentQuestion[value])
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
                                        console.log('ACTIONS!!!!: ', value, currentQuestion.actions)
                                        const actionText = "actions object but in yaml";
                                        return (
                                            <FormGroup>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter('actions')}
                                                </Col>
                                                <Col sm={10}>
                                                    <FormControl 
                                                        type="text" 
                                                        placeholder={'Enter text'} 
                                                        value={currentQuestion[value] !== null ? currentQuestion[value] : ""} 
                                                        onChange={(event) => {
                                                            console.log('@@@@@@@', currentQuestion[value])
                                                            handleChange(value, event.target.value)
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            
                                        )
                                    }
                                    else if(value === 'type'){
                                        return (
                                            <FormGroup>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter('type')}
                                                </Col>
                                                <Col sm={10}>
                                                    <DropdownButton
                                                        bsStyle={"default"}
                                                        title={currentQuestion.type}
                                                        id={`dropdown-basic-${1}`}
                                                        >
                                                            {
                                                                typesArray.map((mainType) => {
                                                                    return (
                                                                        <>
                                                                            <MenuItem eventKey={mainType.header}><b>{mainType.header}</b></MenuItem>
                                                                            {mainType.sub.map((sub) => (
                                                                                <MenuItem 
                                                                                    key={sub} 
                                                                                    eventKey={sub} 
                                                                                    onSelect={(event) => handleChange('type', event)}
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
                                    else if (value === 'impute'){
                                        return (
                                            <FormGroup>
                                                <Col componentClass={ControlLabel} sm={2}>
                                                    {capitalizeFirstLetter('type')}
                                                </Col>
                                                <Col sm={10}>
                                                    <button class="" title="Add Impute Condition" onclick="authoring_tool_add_impute_condition_fields()">Add impute condition</button>
                                                </Col>
                                            </FormGroup>
                                        )
                                    }
                                })
                            }
                            
                        </Form>
                    }
                />
            }
        </>
    )
}