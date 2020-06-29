import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core'
import AutorenewIcon from '@material-ui/icons/Autorenew'

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%'
        //backgroundColor: theme.palette.primary.main,
        //color: theme.palette.primary.contrastText
    },
    content: {
        alignItems: 'center',
        display: 'flex'
    },
    title: {
        fontWeight: 700
    },
    avatar: {
        backgroundColor: theme.palette.white,
        color: theme.palette.primary.main,
        height: 56,
        width: 56
    },
    icon: {
        height: 32,
        width: 32
    },
    item: {
        padding: 10
    }
}))

const TotalTag = props => {
    const { className, value, ...rest } = props

    const classes = useStyles()

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardContent>
                <Grid container justify="space-evenly">
                    <Grid item>
                        <Avatar className={classes.avatar}>
                            <AutorenewIcon className={classes.icon} />
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography className={classes.title} color="inherit" gutterBottom variant="body2">
                            TOTAL TRAIN COUNT
                        </Typography>
                        <Typography color="inherit" variant="h3">
                            {value + 1}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

TotalTag.propTypes = {
    className: PropTypes.string
}

export default TotalTag
