import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Grid } from '@material-ui/core'

import { TrainFrequency, Password } from './components'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}))

const Settings = () => {
    const classes = useStyles()
    const isAdmin = localStorage.getItem('isAdmin')

    return (
        <div className={classes.root}>
            <Grid container spacing={4}>
                <Grid item md={5} xs={12}>
                    <Password />
                </Grid>
                <Grid item md={5} xs={12}>
                    {isAdmin === 'true' ? <TrainFrequency /> : <div></div>}
                </Grid>
            </Grid>
        </div>
    )
}

export default Settings
