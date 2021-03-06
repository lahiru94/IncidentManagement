import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Moment from 'react-moment';
import Button from '@material-ui/core/Button';

import EventList from './EventTrail/EventList';
import Comment from './EventTrail/Comment';
import {
    fetchIncidentEventTrail,
    submitIncidentComment,
    setIncidentStatus,
    setIncidentSeverity,
    resolveEvent,
    fetchAllUsers,
    setIncidentAssignee,
    fetchEscallateIncident
} from '../state/OngoingIncidents.actions';
import { fetchActiveIncidentData } from '../../shared/state/Shared.actions';
import { EventActions } from './EventTrail'

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import VerifyIncidentConfirm from './IncidentActions/VerifyIncidentConfirm';


function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

function LinkTab(props) {
    return <Tab component="a" onClick={event => event.preventDefault()} {...props} />;
}

const styles = theme => ({
    root: {
        backgroundColor: "transparent",
        boxShadow: "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
        border: "1px solid #ccc"
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margingBottom: 50,
    },
    label: {
        // color: '#757575'
    },
    editButtonWrapper: {
        marginBottom: theme.spacing.unit * 2,
        display: 'flex',
        justifyContent: 'space-around',
        flexGrow: 1

    },
    editButton: {
        flexGrow: 0
    },
    sidePane: {
        marginLeft: theme.spacing.unit*4

    },
    mainArea: {
        marginLeft: theme.spacing.unit * 4,
    },
    verifyIncidentDialog: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    }
});

/**
 * Basic Information TabView - (1)
 */
class BasicDetailTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            incident: props.incident,
            election: props.election,
            category: props.category,
        };
    }

    componentDidMount() {

    }

    render() {
        const { classes, incident } = this.props;

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper elevation={1} className={classes.paper}>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography className={classes.label}> Incident Ref ID </Typography>
                                    <Typography variant="h4" gutterBottom> {incident.refId} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Title </Typography>
                                    <Typography gutterBottom> {incident.title} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Description </Typography>
                                    <Typography gutterBottom> {incident.description} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Occurence </Typography>
                                    <Typography gutterBottom> {incident.occurence} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Date </Typography>
                                    <Typography gutterBottom> <Moment format="YYYY/MM/DD" unix>{incident.createdDate}</Moment> </Typography>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Time </Typography>
                                    <Typography gutterBottom> <Moment format="HH:mm" unix>{incident.createdDate}</Moment> </Typography>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper elevation={1} className={classes.paper}>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography className={classes.label}> Election </Typography>
                                    <Typography variant="h6" gutterBottom> {this.state.election.name} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Category </Typography>
                                    <Typography gutterBottom> {this.state.category.top_category} </Typography>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Sub Category </Typography>
                                    <Typography gutterBottom> {this.state.category.sub_category} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Information Channel </Typography>
                                    <Typography gutterBottom> {this.state.incident.channel} </Typography>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>


            </div>
        );
    }
}

/**
 * Location Information TabView - (2)
 */
class LocationTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            incident: props.incident
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper elevation={1} className={classes.paper}>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Name / Description </Typography>
                                    <Typography gutterBottom> Maligawata Road, Main Plaza </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Address </Typography>
                                    <Typography gutterBottom> 22/2, Maligawatta </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Coordinates </Typography>
                                    <Typography gutterBottom> 6.936047, 79.869638 </Typography>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>

                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper elevation={1} className={classes.paper}>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Province </Typography>
                                    <Typography variant="" gutterBottom> Western Province </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> District </Typography>
                                    <Typography gutterBottom> Colombo District </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Polling Division </Typography>
                                    <Typography gutterBottom> Maligawatta Division </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Ward </Typography>
                                    <Typography gutterBottom> Ward 7 </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Police Station </Typography>
                                    <Typography gutterBottom> Maligawatta Police Station </Typography>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}


/**
 * Contact Information TabView - (3)
 */
class ContactTab extends Component {

    constructor(props) {
        super(props);
        this.state = {
            incident: props.incident,
            reporter: props.reporter,
        };
    }

    render() {
        const { classes, reporter } = this.props;

        return (
            <div>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper elevation={1} className={classes.paper}>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Name </Typography>
                                    <Typography gutterBottom> {reporter.name} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Contact Number </Typography>
                                    <Typography gutterBottom> {reporter.telephone} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Email </Typography>
                                    <Typography gutterBottom> {reporter.email} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Address </Typography>
                                    <Typography gutterBottom> {reporter.address} </Typography>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

/**
 * Review Summary TabView - (4)
 */
class ReviewTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            incident: props.incident,
        };
    }

    render() {
        const { classes, incident } = this.props;

        return (
            <div>
                <Grid container spacing={24} >
                    <Grid item xs={12}>
                        <Paper elevation={1} className={classes.paper}>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography className={classes.label}> Incident Ref ID </Typography>
                                    <Typography variant="h4" gutterBottom> {incident.refId} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Status </Typography>
                                    <Typography gutterBottom> {incident.status} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Severity </Typography>
                                    <Typography gutterBottom> {incident.severity} </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Time since creation </Typography>
                                    <Typography gutterBottom> 10 hours </Typography>
                                </Grid>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Given reponse time </Typography>
                                    <Typography gutterBottom> 24 hours </Typography>
                                </Grid>
                            </Grid>


                        </Paper>
                    </Grid>
                </Grid>


                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper elevation={1} className={classes.paper}>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Time since last action </Typography>
                                    <Typography gutterBottom> 4 hours ago </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>
                                    <Typography variant="caption" className={classes.label}> Last assigned </Typography>
                                    <Typography gutterBottom> M Ekanayake (Police) </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs>

                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

/**
 * Tabular componenet
 */
class NavTabs extends Component {
    state = {
        value: 0,
        incident: {
            "id": 1,
            "token": 1024,
            "election_id": 1,
            "reporter_id": 2,
            "occurence": "Occurence.OCCURED",
            "category": 11,
            "district_id": 0,
            "ward_id": 0,
            "police_station_id": 0,
            "polling_station_id": 0,
            "location": 4096,
            "address": 4096,
            "coordinates": 4096,
            "channel": 4096,
            "timing_nature": 1024,
            "validity": 1024,
            "title": "Illegal picketing event",
            "description": "Nulla laborum voluptate laboris incididunt. Laborum elit excepteur labore anim quis eu amet eiusmod velit esse. In ex cupidatat laborum id aliquip nisi sit non voluptate. Nisi dolor incididunt veniam ipsum. Ad quis cupidatat sit aute laborum excepteur cillum do officia. Proident reprehenderit ut dolor qui fugiat. Sint consectetur magna aute proident ex id adipisicing aute aute officia et nostrud.",
            "sn_title": null,
            "sn_description": null,
            "tm_title": null,
            "tm_description": null,
            "created_date": 1553154348,
            "updated_date": 1553154348
        },
        election: {
            id: 1,
            name: "Provincial Election 2019",
        },
        category: {
            id: 11,
            top_category: "Violence",
            sub_category: "Interrupting propaganda"
        },
        district: {
            id: 0,
            name: "Colombo",
            province: "Western"
        },
        reporter: {
            id: 2,
            name: "Jagath Mallawaarchichi",
            contact: "jagathm@gamil.com",
            address: "33/3, Church road, Battaramulla."
        },
        isCommentVisible: false,
        open: false,
        verifyIncidentDialogOpen:false,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    componentDidMount() {
        if (this.props.paramIncidentId) {
            this.props.getIncident(this.props.paramIncidentId);
            this.props.getEvents(this.props.paramIncidentId);
        }
    }

    showCommentInput = () => {
        this.setState({ isCommentVisible: true })
    }

    hideCommentInput = () => {
        this.setState({ isCommentVisible: false })
    }

    onResolveEvent = (eventId, decision) => {
        const { activeIncident } = this.props;

        this.props.resolveEventApproval(activeIncident.id, eventId, decision);
    }

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };

    handleMouseLeave = event => {
        this.setState({open:false})
    }

    onVerifyClick = () => {
        this.setState((state)=>(
            {verifyIncidentDialogOpen:!state.verifyIncidentDialogOpen}
        ))
    }

    handleVerifyIncidentDialogClose = () => {
        this.setState({verifyIncidentDialogOpen:false})
    }

    render() {
        const { classes, postComment, activeIncident,
            reporter, changeStatus, changeSeverity,
            activeUser, users, getUsers,
            setIncidentAssignee
        } = this.props;

        const { value, open, verifyIncidentDialogOpen } = this.state;

        const EditIncidentLink = props => <Link to={`/app/review/${activeIncident.id}/edit`} {...props} />

        return (
            <NoSsr>
                <Grid container spacing={24}>
                    <Grid item xs={9}>
                        <div className={classes.mainArea}>
                            <div className={classes.root}>

                                <Tabs variant="fullWidth" value={value} onChange={this.handleChange} indicatorColor="primary" >
                                    <LinkTab label="Basic Information" href="page1" />
                                    <LinkTab label="Location Information" href="page2" />
                                    <LinkTab label="Contact Information" href="page3" />
                                </Tabs>

                                {value === 0 && <TabContainer> <BasicDetailTab classes={classes} incident={activeIncident} election={this.state.election} category={this.state.category} /> </TabContainer>}
                                {value === 1 && <TabContainer> <LocationTab classes={classes} incident={activeIncident} /> </TabContainer>}
                                {value === 2 && <TabContainer> <ContactTab classes={classes} reporter={reporter} /> </TabContainer>}
                                {value === 3 && <TabContainer> <ReviewTab classes={classes} incident={activeIncident} /> </TabContainer>}
                            </div>
                            <div>
                                <EventList
                                    events={this.props.events}
                                    resolveEvent={this.onResolveEvent}
                                />
                                <Comment
                                    postComment={postComment}
                                    activeIncident={activeIncident}
                                />
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                    <div className={classes.sidePane}>
                    <div className={classes.editButtonWrapper}>
                        <Button variant="outlined" size="large" color="secondary" onClick={this.onVerifyClick}>
                            Verify
                        </Button>
                        <Button component={EditIncidentLink} variant="outlined" size="large" color="primary" className={classes.editButton} >
                            Edit
                        </Button>
                        <Button
                            variant="outlined" size="large" color="primary"
                            buttonRef={node => {
                                this.anchorEl = node;
                            }}
                            aria-owns={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleToggle}
                            onMouseEnter={this.handleToggle}
                            // onMouseLeave={this.handleMouseLeave}
                        >
                            More
                        </Button>
                        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    id="menu-list-grow"
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={this.handleClose}>
                                            <MenuList>
                                                <MenuItem onClick={this.handleClose}>Request for Advice</MenuItem>
                                                <MenuItem onClick={(e)=>{
                                                    this.handleClose(e)
                                                    this.props.escallateIncident(activeIncident.id, activeIncident.assignees[0] && activeIncident.assignees[0].uid || 0)
                                                    }}>Escalate</MenuItem>
                                                <MenuItem onClick={this.handleClose}>Escalate to outside entity</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                    <EventActions
                        activeIncident={activeIncident}
                        onStatusChange={changeStatus}
                        onSeverityChange={changeSeverity}
                        activeUser={activeUser}
                        users={users}
                        getUsers={getUsers}
                        setIncidentAssignee={setIncidentAssignee}
                        events={this.props.events}
                    />
                </div>

                    </Grid>
                </Grid>

               

                <VerifyIncidentConfirm open={verifyIncidentDialogOpen} handleClose={this.handleVerifyIncidentDialogClose}/>


            </NoSsr>
        );
    }
}

NavTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return {
        events: state.ongoingIncidentReducer.events,
        activeIncident: state.sharedReducer.activeIncident.data,
        reporter: state.sharedReducer.activeIncidentReporter,
        activeUser: state.sharedReducer.signedInUser.data,
        users: state.ongoingIncidentReducer.users,
        ...ownProps
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getIncident: (incidentId) => {
            dispatch(fetchActiveIncidentData(incidentId));
        },
        getEvents: (incidentId) => {
            dispatch(fetchIncidentEventTrail(incidentId));
        },
        postComment: (incidentId, commentData) => {
            dispatch(submitIncidentComment(incidentId, commentData));
        },
        changeStatus: (incidentId, status) => {
            dispatch(setIncidentStatus(incidentId, status))
        },
        changeSeverity: (incidentId, severity) => {
            dispatch(setIncidentSeverity(incidentId, severity))
        },
        resolveEventApproval: (incidentId, eventId, decision) => {
            dispatch(resolveEvent(incidentId, eventId, decision));
        },
        getUsers: () => {
            dispatch(fetchAllUsers());
        },
        setIncidentAssignee: (incidentId, uid, actionType) => {
            dispatch(setIncidentAssignee(incidentId, uid, actionType));
        },
        escallateIncident: (incidentId, assigneeId) => {
            dispatch(fetchEscallateIncident(incidentId, assigneeId))
        }
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles))(NavTabs);