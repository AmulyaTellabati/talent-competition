import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import { Card, Header, Image} from 'semantic-ui-react'

export default class TalentDetail extends React.Component {

    constructor(props) {
        super(props)
    }
   
    render() {
        let detailedTalentData = this.props.detailedTalentData

        return (
            <Card.Content style={{ display: 'flex', padding: 0 }}>
                <div style={{ width: '50%' }}>
                    <Image
                        src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
                        ui={false}
                        fluid
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ marginLeft: 20 }}>
                    <Header style={{ margin: '20px 0 0 0' }} size="small">
                        Talent snapshot
        </Header>
                    <Header style={{ margin: '10px 0 0 0' }} size="tiny">
                        CURRENT EMPLOYER
        </Header>
                    <p>{detailedTalentData.currentEmployer || 'Data is not available'}</p>
                    <Header style={{ margin: '10px 0 0 0' }} size="tiny">
                        VISA STATUS
        </Header>
                    <p>{detailedTalentData.visa || 'Data is not available'}</p>
                    <Header style={{ margin: '10px 0 0 0' }} size="tiny">
                        POSITION
        </Header>
                    <p>{detailedTalentData.currentPosition || 'Data is not available'}</p>
                </div>
            </Card.Content>
            )
    }
}