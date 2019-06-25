import React from 'react'
import { Form, Radio,Header,Button } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            jobSeekingStatus: {
                status: '',
                availableDate: null

            }

        }

        this.handleChange = this.handleChange.bind(this)
        this.saveJobSeekingStatus=this.saveJobSeekingStatus.bind(this)
    }

    saveJobSeekingStatus() {
        
        this.props.saveProfileData({
            jobSeekingStatus: this.state.jobSeekingStatus
        })
    }

    handleChange(e,data) {
        
        data.name = data.value;
        this.setState({
            jobSeekingStatus: {
                status: data.value
            },
            value:data.value
        })

    }

    render() {
        return (
            
            <div className="ui sixteen wide column"><Header size="tiny">Current Status</Header>
                    <Form.Field>
                        Selected value: <b>{this.state.value}</b>
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Actively looking for a job'
                            name='radioGroup'
                        value='Actively looking for a job'
                        checked={this.state.value === 'Actively looking for a job'}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Not looking for a job at the moment'
                            name='radioGroup'
                        value='Not looking for a job at the moment'
                        checked={this.state.value === 'Not looking for a job at the moment'}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Currently employed but open to offers'
                            name='radioGroup'
                        value='Currently employed but open to offers'
                        checked={this.state.value === 'Currently employed but open to offers'}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                        label='Will be available on later date'
                        name='radioGroup'
                        value='Will be available on later date'
                        checked={this.state.value === 'Will be available on later date'}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <button type="button" className="ui right floated teal button" onClick={this.saveJobSeekingStatus}>Save</button>
            </div>
           
                   
                
        )
    }
}



//<Button color="black" >Save</Button>