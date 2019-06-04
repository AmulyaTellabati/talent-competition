import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Container, Card,Confirm,Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            totalJobs: 0,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            confirmClose: {
                show: false,
                job: null
            }
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleSort = this.handleSort.bind(this);
          
        this.updateWithoutSave = this.updateWithoutSave.bind(this)



    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
        console.log(this.state.loaderData)
    }
    handleSort(e, { value }) {
        this.setState(() => {return { sortBy: { date: value } }},() => this.loadNewData(this.state.loaderData))
    }
    componentDidMount() {
        this.init();
    };

    pageChange(e, { activePage }) {       
            this.setState(() => {return { activePage }},() => this.loadNewData(this.state.loaderData))       
    }

    loadData(callback) {
        const { sortBy } = this.state
        const { filter } = this.state
        const { activePage } = this.state

        const query = [
            `sortbyDate=${sortBy.date}`,
            `showActive=${filter.showActive}`,
            `showClosed=${filter.showClosed}`,
            `showDraft=${filter.showDraft}`,
            `showExpired=${filter.showExpired}`,
            `showUnexpired=${filter.showUnexpired}`,
            `activePage=${activePage}`
        ].join('&')


        var link = 'http://talentservicetalen.azurewebsites.net/listing/listing/getSortedEmployerJobs?'+query;
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log(res);
                let loadJobs = null
                let totalPages = 1
                if (res.myJobs) {
                    loadJobs = res.myJobs
                    totalPages = Math.ceil(res.totalCount / 6)
                }
                this.updateWithoutSave(loadJobs, totalPages)
                callback()   
            }.bind(this),
            error: function (res) {
                
            }.bind(this)
        })

    }

    updateWithoutSave(newData, totalPages) {
        this.setState({
            loadJobs: newData,
            totalPages
        })
    }

    showJobCloseConfirm(showConfirm, jobIdToClose) {
        this.setState({
            confirmClose: {
                show: showConfirm,
                job: jobIdToClose
            }
        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    handleFilter(e, { value }) {
        const filter = TalentUtil.deepCopy(this.state.filter)
        if (value.length === 0) return

        Object.keys(filter).forEach(k => {
            if (value.includes(k)) filter[k] = true
            else filter[k] = false
        })
        if (filter['showActive'] && filter['showClosed']) {
            const shouldShow = value[value.length - 1]
            if (shouldShow === 'showActive') {
                filter['showActive'] = true
                filter['showClosed'] = false
            } else {
                filter['showActive'] = false
                filter['showClosed'] = true
            }
        }

        if (filter['showUnexpired'] && filter['showExpired']) {
            const shouldShow = value[value.length - 1]
            if (shouldShow === 'showUnexpired') {
                filter['showUnexpired'] = true
                filter['showExpired'] = false
            } else {
                filter['showUnexpired'] = false
                filter['showExpired'] = true
            }
        }

        this.setState(
            prev => {
                return { filter }
            },
            () => this.loadNewData(this.state.loaderData)
        )
    }

    getCurrentFilterValue() {
        const currentValues = []
        const {
            showActive,
            showClosed,
            showDraft,
            showExpired,
            showUnexpired
        } = this.state.filter

        if (showActive) currentValues.push('showActive')
        if (showClosed) currentValues.push('showClosed')
        if (showDraft) currentValues.push('showDraft')
        if (showExpired) currentValues.push('showExpired')
        if (showUnexpired) currentValues.push('showUnexpired')

        return currentValues
    }

    closeJob() {
        const link = 'http://talentservicetalen.azurewebsites.net/listing/listing/closeJob';
        const cookies = Cookies.get('talentAuthToken');
        const jobToClose = this.state.confirmClose.job;

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies
            },
            type: 'POST',
            data: `"${jobToClose}"`,
            contentType: 'application/json',
            dataType: 'json',
            success: function (res) {
                if (res.success) {
                    const currentLoadJobs = TalentUtil.deepCopy(this.state.loadJobs)
                    const index = currentLoadJobs.findIndex(job => job.id === jobToClose)
                    if (currentLoadJobs[index].status === 1) {
                        return TalentUtil.notification.show('Job already closed','error',null,null)
                    }
                    const updatedLoadJobs = currentLoadJobs.filter(job => job.id !== jobToClose)
                    this.setState({ loadJobs: updatedLoadJobs })
                    TalentUtil.notification.show(res.message, "success", null, null);
                   
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }
            }.bind(this)
        });

        this.showJobCloseConfirm(false);
    }

    render() {
        const jobdata = this.state.loadJobs.length > 0 ? this.renderJobs() : <p>No Jobs Found</p>;
        const sortoptions = [
            { key: 'Newest first', text: 'Newest first', value: 'asc' },
            { key: 'Oldest first', text: 'Oldest first', value: 'desc' }
        ];
        const filteroptions = [
            { key: 'showActive', text: 'Active', value: 'showActive' },
            { key: 'showClosed', text: 'Closed', value: 'showClosed' },
            { key: 'showExpired', text: 'Expired', value: 'showExpired' },
            { key: 'showUnexpired', text: 'Unexpired', value: 'showUnexpired' }
        ];


        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h1>List of Jobs</h1>
                    <div className='controls'>
                        <React.Fragment>
                            <Icon name='filter' /> Filter: <Dropdown inline options={filteroptions} value={this.getCurrentFilterValue()} multiple onChange={this.handleFilter} />
                        </React.Fragment>
                        <React.Fragment>
                            <Icon name='calendar alternate' /> Sort by date: <Dropdown inline options={sortoptions} defaultValue='asc' onChange={this.handleSort} />
                        </React.Fragment>
                    </div>
                        <Card.Group>
                            {jobdata}
                        </Card.Group>
                    <Container textAlign='center'>
                        <Pagination activePage={this.state.activePage} totalPages={this.state.totalPages} onPageChange={this.pageChange} />
                    </Container>
                    <Confirm content='Are you sure you want to close this job?' open={this.state.confirmClose.show} onConfirm={() => this.closeJob()}
                        onCancel={() => this.showJobCloseConfirm(false)}/>
                </div>
            </BodyWrapper>
        )
    }
    renderJobs() {
        return this.state.loadJobs.map(
            (job) => (
                <JobSummaryCard
                    key={job.id}
                    job={job}
                    closeJob={() => this.showJobCloseConfirm(true, job.id)}
                />
            )
        );
    }
}



