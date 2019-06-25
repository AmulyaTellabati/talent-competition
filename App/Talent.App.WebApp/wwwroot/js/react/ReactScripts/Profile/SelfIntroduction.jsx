/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'
import { Input, Header,TextArea } from "semantic-ui-react";
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputs: {
                summary: '',
                description:''
            }      
        }
        this.handleChange = this.handleChange.bind(this)
        this.saveIntroduction=this.saveIntroduction.bind(this)    
    };

    saveIntroduction() {
       
        this.props.updateProfileData({
            summary: this.state.inputs.summary,
            description:this.state.inputs.description
        })

    }

    handleChange(event) {
        const data = Object.assign({}, this.state.inputs)
        data[event.target.name] = event.target.value
        this.setState({
            inputs: data
        
        })

    }

    render() {
        let summary = this.props.summary ? this.props.summary : this.state.inputs.summary
        let description= this.props.description? this.props.description: this.state.inputs.description

        return (<div className="row">
            <div className="ui sixteen wide column">
                <ChildSingleInput
                    inputType="text"                   
                    name="summary"
                    value={summary}
                    controlFunc={this.handleChange}
                    maxLength={150}
                    placeholder="please provide a short summary about yourself"
                    errorMessage="Please enter a valid text"
                />

                
                <Header size="small" style={{ margin: '10px 0' }}>
                    Summary must be no more than 150 characters
        </Header>
                <TextArea
                    value={description}
                    name="description"
                    onChange={this.handleChange}
                    placeholder="Please tell us about any hobbies, additional expertise, or anything else you'd like to add."
                />
                <Header size="small" style={{ margin: '10px 0' }}>
                    Description must be between 150-600 characters
        </Header>
                <div style={{ textAlign: 'right' }}>
                    <button type="button" className="ui right floated teal button" onClick={this.saveIntroduction}>Save</button>

                   
                </div>
            </div>
        </div>)
    }
}
//<Button color="black" onClick={() => this.saveIntroduction()}>
//    Save
//          </Button>