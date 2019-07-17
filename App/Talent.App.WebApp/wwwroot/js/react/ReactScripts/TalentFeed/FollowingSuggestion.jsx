import React from 'react';
import { Card,Header } from 'semantic-ui-react';

export default class FollowingSuggestion extends React.Component {
    render() {
        return (
            <Card className="content" style={{ margin: 0, alignSelf: 'flex-start' }}>
                <Header
                    size="medium"
                    style={{ margin: '10px 0 0 0' }}
                    textAlign="center"
                >
                    Follow Talent
        </Header>
                <div className="ui items following-suggestion">
                    <div className="item">
                        <div className="ui image">
                            <img className="ui circular image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
                        </div>
                        <div className="content">
                            <a className="">Veronika Ossi</a>
                            <button className="ui primary basic button"><i className="icon user"></i>Follow</button>
                        </div>
                    </div>
                    <div className="item">
                        <div className="ui image">
                            <img className="ui circular image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
                        </div>
                        <div className="content">
                            <a className="">Veronika Ossi</a>
                            <button className="ui primary basic button"><i className="icon user"></i>Follow</button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}