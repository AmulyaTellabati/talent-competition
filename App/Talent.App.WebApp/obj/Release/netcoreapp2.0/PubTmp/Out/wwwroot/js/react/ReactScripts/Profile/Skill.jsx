/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Table, Dropdown, Button, Input, Icon } from "semantic-ui-react";

const skillLevelOptions = () => {
    const levelOptions = ['Skill Level', 'Beginner', 'Intermediate', 'Expert']
    return levelOptions.reduce((result, next) => {
        result.push({
            key: next,
            text: next,
            value: next
        })
        return result
    }, [])
}



export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SkillData: [],
            showEditSection: false,
            skill: {
                name: '',
                level: 'Skill Level'
            },
            CurrentValname: '',
            CurrentVallevel: '',
            ActiveSkill: null,
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
        debugger;
        if (this.props.skillData != null) {
            this.state.SkillData = this.props.skillData;
        }
        if (this.state.skill.level === 'Skill Level')
            return TalentUtil.notification.show(
                'Please choose your Skill level',
                'error',
                null,
                null
            )
        const updatedSkills = this.state.SkillData

        //const isSkillAlreadyExist =
        //    updatedSkills.findIndex(skill => skill.name === oldName) !== -1
        //if (isSkillAlreadyExist)
        //    return TalentUtil.notification.show(
        //        'You already had this Skill',
        //        'error',
        //        null,
        //        null
        //    )
        updatedSkills.push(this.state.skill)
        this.props.updateProfileData({ skills: updatedSkills })
        this.closeEdit()
    }

    handleChange(event) {

        const data = Object.assign({}, this.state.skill)
        data[event.target.name] = event.target.value
        this.setState({
            skill: data,
            CurrentValname:data.name
        })
    }

    handleDropDownValueChange(event, data) {

        const data1 = Object.assign({}, this.state.skill)
        data1[data.name] = data.value
        this.setState({
            skill: data1,
            CurrentVallevel:data.level

        })
    }
    editData(index) {
        let updatedSkills = this.props.skillData
        updatedSkills[index].name = this.state.CurrentValname
        updatedSkills[index].level = this.state.CurrentVallevel
        this.props.updateProfileData({ skills: updatedSkills })
        turnOffEditMode()
    }

    turnOffEditMode() {
        this.setState({
            ActiveSkill: null
        })
    }

    turnOnEditMode(name) {
        const currentValue = this.props.skillData.find(d => d.name === name)
        this.setState({
            ActiveSkill: name,
            CurrentValname: currentValue.name,
            CurrentVallevel: currentValue.level

        })

    }

    deleteData(name) {
        let updatedskills = this.props.skillData
        updatedskills = updatedskills.filter(
            skill => skill.name !== name
        )
        this.props.updateProfileData({ skills: updatedskills })

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
        let Skilldetails = this.props.skillData ? this.props.skillData : this.state.SkillData

        return (<div className="row">
            <div className="ui sixteen wide column">
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Skill</Table.HeaderCell>
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

                            Skilldetails.length !== 0 &&
                            Skilldetails.map((d, index) => {
                                if (d.name != this.state.ActiveSkill || this.state.ActiveSkill == null) {
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
                        {Skilldetails.length !== 0  &&
                            Skilldetails.map((d, index) => {
                                if (d.name == this.state.ActiveSkill) {
                                    return (

                                        <Table.Row key={index}>
                                            <Table.Cell>
                                                <Input
                                                    value={this.state.CurrentValname}
                                                    onChange={this.handleChange}
                                                    name="name"
                                                    placeholder="Skill"
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Dropdown
                                                    options={skillLevelOptions()} name="level"
                                                    selection
                                                    search
                                                    value={this.state.CurrentVallevel}
                                                    onChange={this.handleDropDownValueChange}
                                                />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Button onClick={() => this.editData(index)} basic color="blue"> Update</Button>
                                                <Button onClick={()=>this.turnOffEditMode()} basic color="red">Cancel</Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            })}
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
                                <ChildSingleInput inputType="text" name="name" value={this.state.skill.name}
                                    controlFunc={this.handleChange} maxLength={80} style={{ marginRight: 20 }}
                                    placeholder="Add Skill" errorMessage="Please enter a valid skill" />
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <Dropdown options={skillLevelOptions()} selection search
                                    value={this.state.skill.level} name="level"
                                    onChange={this.handleDropDownValueChange} style={{ marginRight: 20 }} />
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <button type="button" className="ui teal button" onClick={this.saveLanguage}>Add</button>
                                <button type="button" className="ui button" onClick={() => this.closeEdit()}>Cancel</button>
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



