import React from 'react';
import { Loader, Card, CardContent, Image, Header, Icon } from 'semantic-ui-react';
import Cookies from 'js-cookie'

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyDetails:null
        }
    }

    componentDidMount() {
        var cookies = Cookies.get('talentAuthToken');
        //window.addEventListener('scroll', this.handleScroll); var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                this.setState({
                    companyDetails: res.employer
                })
                
            }.bind(this)
        })
    };

    render() {
        let companyData = this.state.companyDetails
       

        return (<div>
            {companyData && (
                <Card style={{ margin: 0, alignSelf: 'flex-start' }}>
                    <CardContent style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Image src='https://react.semantic-ui.com/images/wireframe/square-image.png' size="mini" circular></Image>
                        <Card.Header>{companyData.companyContact.name}</Card.Header>
                        <Header
                            size="tiny"
                            color="grey"
                            style={{ margin: '10px 20px 0 0' }}
                        >
                            <Icon style={{ margin: 0 }} name="location arrow" />{' '}
                            {companyData.companyContact.location.city} ,{' '}
                            {companyData.companyContact.location.country}
                        </Header>

                        <div style={{ margin: '10px 0 0 0', fontSize: 14 }}>
                            {companyData.skills.length === 0
                                ? 'We currently do not have specific skills that we desire'
                                : companyData.skills.length.map(skill => (
                                    <React.Fragment key={skill.name}>
                                        {skill.name}
                                    </React.Fragment>
                                ))}
                        </div>

                    </CardContent>
                    <Card.Content
                        extra
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{ display: 'flex', marginBottom: 10 }}>
                            <Icon name="phone" /> : {companyData.companyContact.phone}
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Icon name="mail" /> : {companyData.companyContact.email}
                        </div>
                    </Card.Content>

                </Card>)
            }
        </div>)
        
    }
}

