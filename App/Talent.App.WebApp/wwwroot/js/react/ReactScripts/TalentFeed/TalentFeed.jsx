import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }

        this.init = this.init.bind(this);
        this.updateData = this.updateData.bind(this)
        this.loadNewData = this.loadNewData.bind(this)
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.loadData(() => this.setState({ loaderData }))

        //this.setState({ loaderData });//comment this
    }

    componentDidMount() {
       
        this.init()
    };

    updateData(newValues) {
      
        this.setState({ feedData:newValues})
    }

    loadNewData() {
        this.setState({ loadPosition: this.state.loadPosition + 5 })

        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false
        this.loadData(() => this.setState({ loaderData }))
    }

    loadData(callback) {
        const { loadNumber: number } = this.state
        const { loadPosition: position } = this.state
        
        const query = [`position=${position}`, `number=${number}`].join('&')
        let url = 'http://localhost:60290/profile/profile/getTalent?'+ query
        let cookies = Cookies.get('talentAuthToken')
        // your ajax call and other logic goes here

        $.ajax({
            url,
            headers: {
                Authorization: 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    //const newData = [...this.state.feedData, ...res.data]
                    this.updateData(res.data)
                    callback()
                } else {
                    TalentUtil.notification.show(
                        'Something wrong happened while loading data, please refresh your browser',
                        'error',
                        null,
                        null
                    )
                }
            }.bind(this),
            error: function () {
                TalentUtil.notification.show(
                    'Something wrong happened while loading data, please refresh your browser',
                    'error',
                    null,
                    null
                )
            }
        })
    }
    render() {

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <CompanyProfile
                    companyData={this.state.companyDetails}
                    updateCompany={this.updateData}
                    />
                    <TalentCard
                        loadNewData={this.loadNewData}
                        talentData={this.state.feedData}
                    />
                    <FollowingSuggestion />
                </div>
            </BodyWrapper>
        )
    }
}