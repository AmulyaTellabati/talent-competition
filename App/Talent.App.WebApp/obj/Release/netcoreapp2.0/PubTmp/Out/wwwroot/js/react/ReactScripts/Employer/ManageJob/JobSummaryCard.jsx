import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Label, Button, Icon, Dropdown } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    render() {
        const { job } = this.props;
        const { location } = job;

        return (
            <Card>
                <Card.Content>
                    <Card.Header>
                        {job.title}
                    </Card.Header>
                    <Label color='black' ribbon='right'>
                        <Icon name='user' />
                        {job.noOfSuggestions}
                    </Label>
                    <Card.Meta>
                        {location.city}, {location.country}
                    </Card.Meta>
                    <Card.Description>
                        {job.summary}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>

                    <Button.Group size='tiny' floated='right'>
                        <Button basic color='blue' onClick={this.props.closeJob}>
                            <Icon name='dont' />
                            Close
                        </Button>
                        <Button basic color='blue' href={'/EditJob/' + job.id} >
                            <Icon name='edit' />
                            Edit
                        </Button>
                        <Button basic color='blue' href={'/PostJob/' + job.id} >
                            <Icon name='copy outline' />
                            Copy
                        </Button>
                    </Button.Group>
                </Card.Content>
            </Card>
        );
    }
}


//<Button size='tiny' negative>
//    Expired
//                    </Button>