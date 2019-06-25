/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Table, Dropdown, Button, Input, Icon , Header} from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';


export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            experienceData: [],
            showEditSection: false,
            experience: {
                company: '',
                position: '',
                responsibilities: '',
                start: '',
                end:''
            },
            index:-1,
            editActive: false,
        }
        this.openEdit = this.openEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveExperience = this.saveExperience.bind(this)
        this.addNew=this.addNew.bind(this)
        this.closeEdit=this.closeEdit.bind(this)
    }

    addNew() {
        this.setState({
            experience: {
                company: '',
                position: '',
                responsibilities: '',
                start: '',
                end: ''
            }
        })
        this.openEdit()
    }
    openEdit() {
        this.setState({
            showEditSection: true,
        })
    }

    saveExperience(e) {
        if (this.props.experienceData != null) {
            this.state.experienceData = this.props.experienceData;
        }
        const updatedExperience = this.state.experienceData
        if (this.state.editActive) {
            let index = this.state.index
            updatedExperience[index].company = this.state.experience.company
            updatedExperience[index].position = this.state.experience.position
            updatedExperience[index].start = this.state.experience.start
            updatedExperience[index].end = this.state.experience.end
            updatedExperience[index].responsibilities = this.state.experience.responsibilities
        }
        else { updatedExperience.push(this.state.experience) }
                
        this.props.updateProfileData({ experience: updatedExperience })
        this.closeEdit()
    }

    handleChange(e,data) {
        const data1 = Object.assign({}, this.state.experience)
        data1[data.name] = data.value
        this.setState({
            experience: data1
            
        })
    }

    turnOffEditMode() {
        this.setState({
            ActiveLang: null
        })
    }

    turnOnEditMode(index) {
        let updatedExperience = this.props.experienceData
        this.setState({
            experience: updatedExperience[index],
            editActive: true,
            index:index,
            showEditSection: true
        } )
    }

    deleteData(index) {
        let updatedExperience = this.props.experienceData
        updatedExperience = updatedExperience.filter(
            x => x.company !== updatedExperience[index].company
        )
        this.props.updateProfileData({ experience: updatedExperience })
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
        let Expdetails = this.props.experienceData ? this.props.experienceData : this.state.experienceData

        return (<div className="row">
            <div className="ui sixteen wide column">
                <Table padded>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Company</Table.HeaderCell>
                            <Table.HeaderCell>Position</Table.HeaderCell>
                            <Table.HeaderCell>Responsibilities</Table.HeaderCell>
                            <Table.HeaderCell>Start</Table.HeaderCell>
                            <Table.HeaderCell>End</Table.HeaderCell>
                            <Table.HeaderCell textAlign="right">
                                <Button color="black" onClick={this.addNew}>
                                    + Add New
                                </Button>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {

                            Expdetails.length !== 0 &&
                            Expdetails.map((d, index) => {
                                    return (

                                        <Table.Row key={index}>
                                            <Table.Cell>{d.company}</Table.Cell>
                                            <Table.Cell>{d.position}</Table.Cell>
                                            <Table.Cell>{d.responsibilities}</Table.Cell>
                                            <Table.Cell>{new Date(d.start).toGMTString().substring(5, 16)}</Table.Cell>
                                            <Table.Cell>{new Date(d.end).toGMTString().substring(5, 16)}</Table.Cell>
                                            <Table.Cell textAlign="right">
                                                <Icon name="pencil" onClick={() => this.turnOnEditMode(index)} />
                                                <Icon name="close" onClick={() => this.deleteData(index)} />
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                
                            })
                        }
                        
                    </Table.Body>
                </Table>
            </div>
        </div>)

    }

    renderEdit() {
        return (<div style={{display: 'flex',flexWrap: 'wrap',justifyContent: 'space-between'}}>
            <div style={{ width: '49%' }}>
                <Header style={{ margin: '10px 0' }} size="tiny">
                    Company
          </Header>
                <Input
                    placeholder="Company"
                    value={this.state.experience.company}
                    name="company"
                    fluid
                    onChange={this.handleChange}
                />
            </div>
            <div style={{ width: '49%' }}>
                <Header style={{ margin: '10px 0' }} size="tiny">
                    Position
          </Header>
                <Input
                    placeholder="Position"
                    value={this.state.experience.position}
                    name="position"
                    fluid
                    onChange={this.handleChange}
                />
            </div>
            <div style={{ width: '49%' }}>
                <Header style={{ margin: '10px 0' }} size="tiny">
                    Start Date
          </Header>
                <DateInput
                    name="start"
                    placeholder="Start Date"
                    value={this.state.experience.start}
                    iconPosition="left"
                    onChange={this.handleChange}
                    dateFormat="MM/DD/YYYY"
                />
            </div>
            <div style={{ width: '49%' }}>
                <Header style={{ margin: '10px 0' }} size="tiny">
                    End Date
          </Header>
                <DateInput
                    name="end"
                    placeholder="End Date"
                    value={this.state.experience.end}
                    iconPosition="left"
                    onChange={this.handleChange}
                    dateFormat="MM/DD/YYYY"
                />
            </div>
            <div style={{ width: '100%' }}>
                <Header style={{ margin: '10px 0' }} size="tiny">
                    Responsibilities
          </Header>
                <Input
                    name="responsibilities"
                    placeholder="Responsibilities"
                    value={this.state.experience.responsibilities}
                    fluid
                    onChange={this.handleChange}
                />
            </div>
            <div style={{ marginTop: 20 }}>
                <Button onClick={this.saveExperience} color="black">Save</Button>
                <Button onClick={this.closeEdit}>Cancel</Button>
            </div>
        </div>)

    }
}
