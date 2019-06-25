/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Table,Dropdown,Button,Input,Icon} from "semantic-ui-react";

const languageLevelOptions = () => {
    const levelOptions = ['Language Level', 'Basic', 'Fluent', 'Native']
    return levelOptions.reduce((result, next) => {
        result.push({
            key: next,
            text: next,
            value: next
        })
        return result
    }, [])
}



export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            languageData:[],
            showEditSection: false,
            language: {
                name: '',
                level: 'Language Level'
            },
            CurrentValname:'',
            CurrentVallevel:'',
            ActiveLang:null,
        }
        this.openEdit = this.openEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDropDownValueChange = this.handleDropDownValueChange.bind(this)
        this.saveLanguage = this.saveLanguage.bind(this)   

      
    }
    openEdit() {
        this.setState({
            showEditSection: true,
        })
    }
    saveLanguage(e) {

        if (this.props.languageData != null) {
            this.state.languageData = this.props.languageData;
        }
        if (this.state.language.level === 'Language Level')
            return TalentUtil.notification.show(
                'Please choose your language level',
                'error',
                null,
                null
            )
        const updatedLanguages = this.state.languageData
       
        updatedLanguages.push(this.state.language)
        this.props.updateProfileData({ languages: updatedLanguages })
        this.closeEdit()
    }

    handleChange(event) {
        
    const data = Object.assign({}, this.state.language)
    data[event.target.name] = event.target.value
    this.setState({
        language: data,
        CurrentValname:data.name
    })}

    handleDropDownValueChange(event, data) {

        const data1 = Object.assign({}, this.state.language)
        data1[data.name] = data.value
        this.setState({
            language: data1,
            CurrentVallevel:data1.level
        })
    }
    editData(index) {
        let updatedLanguages = this.props.languageData
        updatedLanguages[index].name = this.state.CurrentValname
        updatedLanguages[index].level=this.state.CurrentVallevel
        this.props.updateProfileData({ languages: updatedLanguages })
        turnOffEditMode()
    }

    turnOffEditMode() {
        this.setState({
            ActiveLang:null
        })
    }

    turnOnEditMode(name) {
        const currentValue = this.props.languageData.find(d => d.name === name)
        this.setState({
            ActiveLang: name,
            CurrentValname: currentValue.name,
            CurrentVallevel:currentValue.level

        })
      
    }

    deleteData(name) {
        let updatedLanguages = this.props.languageData
        updatedLanguages = updatedLanguages.filter(
            language => language.name !== name
        )
        this.props.updateProfileData({ languages: updatedLanguages })

    }


    closeEdit(e) {
        if (e) { e.preventDefault(); }

        this.setState({
            showEditSection: false,

        })
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        let Languagedetails = this.props.languageData ? this.props.languageData : this.state.languageData

        return (<div className="row">
            <div className="ui sixteen wide column">
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Language</Table.HeaderCell>
                            <Table.HeaderCell>Level</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">
                                <Button color="black" onClick={this.openEdit}>
                                    + Add New
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                
                            Languagedetails.length !== 0 &&
                            Languagedetails.map((d, index) => {
                                if (d.name != this.state.ActiveLang || this.state.ActiveLang == null) {
                                    return (

                                        <Table.Row key={index}>
                                            <Table.Cell>{d.name}</Table.Cell>
                                            <Table.Cell>{d.level}</Table.Cell>
                                            <Table.Cell textAlign="right">
                                                <Icon name="pencil" onClick={() => this.turnOnEditMode(d.name)} />
                                                <Icon name="close" onClick={() => this.deleteData(d.name)} />
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            })
                            }
                        {Languagedetails.length !== 0 && this.state.ActiveLang != null &&
                            Languagedetails.map((d, index) => {
                                if (d.name == this.state.ActiveLang) {
                                    return (

                                        <Table.Row key={index}>
                                            <Table.Cell>
                                                <ChildSingleInput inputType="text" name="name" value={this.state.CurrentValname}
                                                    controlFunc={this.handleChange} maxLength={80} style={{ marginRight: 20 }}
                                                    placeholder="Add Language" errorMessage="Please enter a valid Language" />

                                            </Table.Cell>
                                            <Table.Cell>
                                                <Dropdown
                                                    options={languageLevelOptions()} name="level"
                                                    selection
                                                    search
                                                    value={this.state.CurrentVallevel}
                                                    onChange={this.handleDropDownValueChange}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button onClick={() => this.editData(index)} basic color="blue"> Update</Button>
                                                <Button onClick={() => this.turnOffEditMode()} basic color="red">Cancel</Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                }
                            }
                    )}
                    </Table.Body>
                </Table>
            </div>
        </div>)
        
    }

    renderEdit() {
        return (<div className="row">
            <div className="ui sixteen wide column">
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>
                               <ChildSingleInput inputType="text" name="name" value={this.state.language.name}
                                controlFunc={this.handleChange} maxLength={80} style={{ marginRight: 20 }}
                                 placeholder="Add Language" errorMessage="Please enter a valid Language" />
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Dropdown options={languageLevelOptions()} selection search
                                    value={this.state.language.level} name="level"
                                 onChange={this.handleDropDownValueChange} style={{ marginRight: 20 }}/>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <button type="button" className="ui teal button" onClick={this.saveLanguage}>Add</button>
                                <button type="button" className="ui button" onClick={()=> this.closeEdit()}>Cancel</button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                       
                    </Table.Body>
                </Table>
            </div>
        </div>)

    }
}
