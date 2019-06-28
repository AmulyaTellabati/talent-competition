import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Dropdown } from "semantic-ui-react";

const getCountryOptions = () => {
    return Object.keys(Countries).reduce((result, next) => {
        result.push({
            key: next,
            text: next,
            value: next
        })
        return result
    }, [])
}

export class Address extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showEditSection: false,
            address: {
                city: '',
                country: '',
                number: '',
                postCode: '',
                street: '',
                suburb: ''
            },
            cityOptions: []
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDropDownValueChange = this.handleDropDownValueChange.bind(this)
        this.saveContact=this.saveContact.bind(this)
    }
    openEdit() {
        const details = Object.assign({}, this.props.addressData)
        this.setState({
            showEditSection: true,
            address:details
        })
    }
    saveContact() {
        this.props.saveProfileData({ address: this.state.address })
        this.closeEdit()
    }
    handleChange(event) {
        const data = Object.assign({}, this.state.address)
        data[event.target.name] = event.target.value
        this.setState({
            address: data
        })
    }
    handleDropDownValueChange(event,data) {
        const data1 = Object.assign({}, this.state.address)
        data1[data.name] = data.value
        this.setState({
            address: data1
        })
    }
    getCityOptions() {
        return Countries[this.state.address.country]=((result, next) => {
            result.push({
                key: next,
                text: next,
                value: next
            })
            return result
        }, [])
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }
    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        let citiesOptions = [];
        if (this.state.address.country != "" && this.state.address.country != null) {
            var popCities = Countries[this.state.address.country].map(x => <option key={x} value={x}> {x}</option>);           
        }

        return (
            <div style={{padding: '10px 20px', width: '100%'}}>
                <div style={{ display: 'flex' }}>
                <ChildSingleInput
                    inputType="text"
                    label="Number"
                    name="number"
                    value={this.state.address.number}
                    controlFunc={this.handleChange}
                    maxLength={80} style={{ width: '25%', marginRight: 20 }}
                    placeholder="Unit:30-32"
                    errorMessage="Please enter a valid number"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Street"
                    name="street"
                        value={this.state.address.street}
                    controlFunc={this.handleChange}
                    maxLength={80} style={{ width: '40%', marginRight: 20 }}
                    placeholder="Enter your Street"
                    errorMessage="Please enter a valid street"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Suburb"
                    name="suburb" style={{ width: '25%' }}
                        value={this.state.address.suburb}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Kogarah"
                    errorMessage="Please enter a valid suburb"
                />
                </div>
                <div style={{ display: 'flex' }}>
                    <div className="field" style={{ width: '35%', marginRight: 20 }}>
                        <label>Country</label>
                        <Dropdown
                            options={getCountryOptions()}
                            placeholder="Your Country"
                            selection
                            search
                            value={this.state.address.country}
                            name="country"
                            onChange={this.handleDropDownValueChange}
                        />
                    </div>
                    <div className="field" style={{ width: '35%', marginRight: 20 }}>
                        <label>City</label>
                        <select
                            className="ui dropdown"
                            placeholder="City"
                            value={this.state.address.city}
                            onChange={this.handleChange}
                            name="city">
                            <option value="0"> Select a town or city</option>
                            {popCities}
                        </select>
                    </div>
                    <ChildSingleInput
                        inputType="text"
                        label="Post Code"
                        name="postCode"
                        value={this.state.address.postCode}
                        controlFunc={this.handleChange}
                        style={{ width: '20%' }}
                        placeholder="Post Code" errorMessage="Please enter a valid postcode"
                    />
                </div>

                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        const renderAddress = () => {
            const address = []
            if (this.props.addressData.number) address.push(this.props.addressData.number)
            if (this.props.addressData.street) address.push(this.props.addressData.street)
            if (this.props.addressData.suburb) address.push(this.props.addressData.suburb)
            if (this.props.addressData.postCode) address.push(this.props.addressData.postCode)

            return address.join(', ')
        }

        let City = this.props.addressData.city? this.props.addressData.city:""
        let Country=this.props.addressData.country?this.props.addressData.country:""

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {renderAddress()}</p>
                        <p>City: {City}</p>
                        <p>Country: {Country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        this.state ={
            nationality:''
        }
        this.handleDropDownValueChange = this.handleDropDownValueChange.bind(this)
    }

    handleDropDownValueChange(e, data) {

            data.name = data.value
            this.setState({
                nationality: data.value
        })

        this.props.saveProfileData( {nationality: data.value })
        

    }
    
    render() {
        let nation = this.props.nationalityData? this.props.nationalityData:this.state.nationality
        return (<div className="row">
            <div className="ui sixteen wide column">
                <Dropdown
                    options={getCountryOptions()}
                    placeholder="Your Country"
                    selection
                    search
                    value={nation}
                    name="country"
                    onChange={this.handleDropDownValueChange}
                />
            </div>
        </div>)
        
    }
}



//<label>City</label>
//    <Dropdown
//        options={this.getCityOptions()}
//        placeholder="Your City"
//        selection
//        search
//        value={this.state.address.city}
//        name="city"
//        onChange={this.handleDropDownValueChange}
//    />