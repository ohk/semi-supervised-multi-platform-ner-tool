import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Hidden } from '@material-ui/core'

import {
    TotalAuthor,
    TotalRequest,
    TotalTag,
    TotalText,
    TotalTrain,
    TotalUser,
    UsersByDevice,
    Top6Users,
    Top6Authors,
    Last10User,
    Last10Login
} from './components'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}))

const Dashboard = props => {
    const { history } = props
    const classes = useStyles()
    const [fetchState, setFetchState] = useState(false)
    const [data, setData] = useState()
    try {
        if (localStorage.getItem('token').length < 0) {
            history.push('/')
        }
    } catch (error) {
        history.push('/')
    }

    if (fetchState === false) {
        axios
            .get(global.config.API_ENDPOINT + '/dashboard', {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(response => {
                console.log(response.data)

                if (response.status === 200) {
                    setData(response.data)
                    setFetchState(true)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    console.log(data)
    return (
        <div className={classes.root}>
            {fetchState === true ? (
                <Grid container spacing={4}>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <TotalAuthor value={data.totalAuthor} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <TotalRequest value={data.totalRequest} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <TotalTag value={data.totalTag} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <TotalText value={data.totalText} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <TotalTrain value={data.totalTrain} />
                    </Grid>
                    <Grid item lg={3} sm={6} xl={3} xs={12}>
                        <TotalUser value={data.totalUser} />
                    </Grid>

                    <Hidden only={['xs', 'sm']}>
                        <Grid item lg={3} sm={6} xl={3} xs={12}></Grid>
                        <Grid item lg={3} sm={6} xl={3} xs={12}></Grid>
                    </Hidden>
                    <Grid item lg={4} md={6} xl={3} xs={12}>
                        <UsersByDevice devicesV={data.devices} />
                    </Grid>
                    <Grid item lg={4} md={6} xl={3} xs={12}>
                        <Top6Users users={data.top6User} />
                    </Grid>
                    <Grid item lg={4} md={6} xl={3} xs={12}>
                        <Top6Authors authors={data.top6Author} />
                    </Grid>
                    <Grid item lg={12} md={12} xl={9} xs={12}>
                        <Last10User users={data.last10User} />
                    </Grid>
                    <Grid item lg={12} md={12} xl={9} xs={12}>
                        <Last10Login logins={data.last10login} />
                    </Grid>
                </Grid>
            ) : (
                <p> Loading... </p>
            )}
        </div>
    )
}

Dashboard.propTypes = {
    history: PropTypes.object
}

export default withRouter(Dashboard)
