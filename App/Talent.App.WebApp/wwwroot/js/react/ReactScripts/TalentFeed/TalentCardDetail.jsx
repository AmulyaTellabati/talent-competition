import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
import { Card, Header, Icon, Rating, Button } from 'semantic-ui-react'
import TalentDetail from './TalentDetail.jsx'


export default class TalentCardDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'default'
        }
    }

    toggleMode() {
        var Cmode = this.state.mode == 'default' ? 'detail' : 'default'

        this.setState({
            mode: Cmode
        })

    }

    render() {

        let talentData = this.props.talentData
       

        return (
            <Card style={{ margin: '0 0 10px 0', width: '100%' }}>
                <Card.Content>
                    <Card.Header
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            paddingBottom: 0
                        }}
                    >
                        <Header size="small">{talentData.name}</Header>
                        <Rating size="huge" />
                    </Card.Header>
                </Card.Content>
                {this.state.mode == 'default' ? (
                    <div style={{ position: 'relative' }}>
                        <ReactPlayer width="100%" heigh="280px" url={talentData.videoUrl} />
                        {!talentData.videoUrl && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '35%',
                                    left: '10%',
                                    transform: 'rotate(-43deg)',
                                    fontSize: 19
                                }}
                            >
                                Introduction video is not available at the moment
            </span>
                        )}
                    </div>
                ) : (
                        <TalentDetail detailedTalentData={talentData} />
                    )}
                <Card.Content
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginLeft: 60
                    }}
                >
                    <Icon
                        onClick={() => this.toggleMode()}
                        size="large"
                        style={{ cursor: 'pointer' }}
                        name={this.state.mode == 'default' ? 'user' : 'video camera'}
                    />
                    <a href={talentData.cvUrl || '#'}>
                        <Icon size="large" name="file pdf outline" />
                    </a>
                    <a href={talentData.linkedIn || '#'}>
                        <Icon size="large" name="linkedin" />
                    </a>
                    <a href={talentData.github || '#'}>
                        <Icon size="large" name="github" />
                    </a>
                </Card.Content>
                <Card.Content extra>
                    {talentData.skills.length !== 0 ? (
                        talentData.skills.map(skill => (
                            <Button key={skill} color="blue" size="mini" basic>
                                {skill}
                            </Button>
                        ))
                    ) : (
                            <span>Skill is not available</span>
                        )}
                </Card.Content>
            </Card>
            )


        
    }
}