/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        const details = props.linkedAccounts ?
            Object.assign({}, props.linkedAccounts)
            : {
                linkedIn: "",
                github: ""
            }
        this.state = {
            showEditSection: false,
            linkedAccounts: details
        }
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveAccount= this.saveAccount.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.openURL = this.openURL.bind(this)
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.linkedAccounts)
        data[event.target.name] = event.target.value
        this.setState({
            linkedAccounts: data
        })
    }

    openEdit() {
        const details = Object.assign({}, this.props.linkedAccounts)
        this.setState({
            showEditSection: true,
            linkedAccounts: details
        })
    }

    openURL(URL) {
        window.open(URL, '_blank');
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }
    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    saveAccount() {
        
        this.props.saveProfileData({linkedAccounts:this.state.linkedAccounts})
        this.closeEdit()
    }

    render() {
            return (
                this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
            )
        }
    renderDisplay() {
        let linkedin = this.props.linkedAccounts ? this.props.linkedAccounts.linkedIn : this.state.linkedAccounts.linkedIn
        let github = this.props.linkedAccounts ? this.props.linkedAccounts.github : this.state.linkedAccounts.github
            return (<div className="row"><div className="ui sixteen wide column">
                <button className="ui primary button" onClick={()=>this.openURL(linkedin)}><i className="linkedin icon"></i>LinkedIn</button>
                <button className="ui secondary button" onClick={()=>this.openURL(github)}><i className="github icon"></i>GitHub</button>
            <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button></div></div>)
    
    }

    renderEdit() {
        

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.linkedAccounts.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="https://www.linkedin.com/"
                    errorMessage="Please enter a valid URL"
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.linkedAccounts.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="https://github.com/"
                    errorMessage="Please enter a valid URL"
                />             
               <button type="button" className="ui teal button" onClick={this.saveAccount}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

}
