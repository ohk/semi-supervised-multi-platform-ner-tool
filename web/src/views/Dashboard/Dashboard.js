import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import {
    Budget,
    TotalUsers,
    TasksProgress,
    TotalProfit,
    LatestSales,
    UsersByDevice,
    LatestProducts,
    LatestOrders
} from './components'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}))

const Dashboard = props => {
    const { history } = props
    const classes = useStyles()

    try {
        if (localStorage.getItem('token').length < 0) {
            history.push('/')
        }
    } catch (error) {
        history.push('/')
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={4}>
                <Grid item lg={3} sm={6} xl={3} xs={12}>
                    <Budget />
                </Grid>
                <Grid item lg={3} sm={6} xl={3} xs={12}>
                    <TotalUsers />
                </Grid>
                <Grid item lg={3} sm={6} xl={3} xs={12}>
                    <TasksProgress />
                </Grid>
                <Grid item lg={3} sm={6} xl={3} xs={12}>
                    <TotalProfit />
                </Grid>
                <Grid item lg={8} md={12} xl={9} xs={12}>
                    <LatestSales />
                </Grid>
                <Grid item lg={4} md={6} xl={3} xs={12}>
                    <UsersByDevice />
                </Grid>
                <Grid item lg={4} md={6} xl={3} xs={12}>
                    <LatestProducts />
                </Grid>
                <Grid item lg={8} md={12} xl={9} xs={12}>
                    <LatestOrders />
                </Grid>
            </Grid>
        </div>
    )
}

Dashboard.propTypes = {
    history: PropTypes.object
}

export default withRouter(Dashboard)
