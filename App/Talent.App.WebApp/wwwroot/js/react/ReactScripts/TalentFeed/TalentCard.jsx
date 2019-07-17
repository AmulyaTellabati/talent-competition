
import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'
import TalentCardDetail from './TalentCardDetail.jsx'

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading:false
        }
        this.handleScroll = this.handleScroll.bind(this)
    };

    componentDidMount() {
        // When the component is mounted, add your DOM listener to the "nv" elem.
        // (The "nv" elem is assigned in the render function.)
        this.nv.addEventListener('scroll', this.handleScroll);
    }

    handleScroll(e) {
        const { scrollHeight, scrollTop, offsetHeight } = e.target
        const isBottom = scrollHeight - offsetHeight <= scrollTop

        if (isBottom) {
            this.setState({ showLoading: true })
            this.props.loadNewData()
        } else {
            this.setState({ showLoading: false })
        }
    }

    
    
    render() {
        return (<div ref={elem => this.nv = elem} style={{ width: '45%', padding: 2, height: 700, overflow: 'auto' }}>
            {this.props.talentData.map(talent => (
                <TalentCardDetail key={talent.id} talentData={talent} />
            ))}
            {this.state.showLoading && <Loader active />}
        </div>)
    }
}

