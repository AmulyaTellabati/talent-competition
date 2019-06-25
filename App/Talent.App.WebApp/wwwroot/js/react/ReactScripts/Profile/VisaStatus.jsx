import React from 'react'
import { SingleInput } from '../Form/SingleInput.jsx';
import { Dropdown, Header } from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react";

const VisaOptions = () => {
    const visaOptions = ['Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa']
    return visaOptions.reduce((result, next) => {
        result.push({
            key: next,
            text: next,
            value: next
        })
        return result
    }, [])
}

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visaStatus: '',
            visaExpiryDate:''
        }
        this.handleDropDownValueChange = this.handleDropDownValueChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveVisa=this.saveVisa.bind(this)
    }

    saveVisa() {
        this.props.saveProfileData({
            visaStatus: this.state.visaStatus,
            visaExpiryDate:this.state.visaExpiryDate
           
        })
    }
    handleChange(e,data) {
       data.name=data.value
        this.setState({visaExpiryDate: data.value})

    }

    handleDropDownValueChange(e, data) {

        data.name = data.value
        this.setState({
            visaStatus: data.value
        })

       


    }

    render() {
        let visa = this.props.visaStatus ? this.props.visaStatus : this.state.visaStatus
        let visaex=this.props.visaExpiryDate?this.props.visaExpiryDate:this.state.visaExpiryDate
        return (<div className="row">
            <div className="ui sixteen wide column" style={{ display: 'flex' }}>
                <div style={{ marginRight: 20 }}>
                    <Header size="tiny">Visa type</Header>
                <Dropdown
                    options={VisaOptions()}
                    placeholder="Your Visa type"
                    selection 
                    search
                    value={visa}
                    name="visaStatus"
                    onChange={this.handleDropDownValueChange}
                    />
                    </div>
                {(visa === 'Work Visa' ||
                    visa === 'Student Visa') && (
                        <div style={{ marginRight: 20 }}>
                            <Header size="tiny">Visa expire date</Header>
                            <DateInput
                                name="visaExpiryDate"
                                placeholder="Expire Date"
                                value={visaex}
                                iconPosition="left"
                                onChange={this.handleChange}
                                dateFormat="MM/DD/YYYY"
                            />
                        </div>
                    )}
                <button type="button" style={{ height: 'fit-content'}} className="ui bottomalign right floated teal button" onClick={this.saveVisa}>Save</button>
            </div>
            


                  
               
            
        </div>)

    }
}

