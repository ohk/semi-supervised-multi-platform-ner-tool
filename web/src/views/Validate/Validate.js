import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Grid, Typography } from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    gridCenter: {
        height: '45%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //alignItems: 'center',
        textAlign: 'center'
        //flexBasis: '600px'
    },
    gridCenter2: {
        height: '55%',
        display: 'inline-block',
        justifyContent: 'center',
        alignItems: 'center',
        //alignItems: 'center',
        textAlign: 'center'
        //flexBasis: '600px'
    },
    root: {
        backgroundColor: theme.palette.background.default,
        height: '100%'
    },
    grid: {
        height: '100%'
    },
    quoteContainer: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    quote: {
        backgroundColor: theme.palette.neutral,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/images/auth.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    },
    quoteInner: {
        textAlign: 'center',
        flexBasis: '600px'
    },
    quoteText: {
        color: theme.palette.white,
        fontWeight: 300
    },
    name: {
        marginTop: theme.spacing(3),
        color: theme.palette.white
    },
    bio: {
        color: theme.palette.white
    },
    contentContainer: {},
    content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    contentHeader: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing(5),
        paddingBototm: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    logoImage: {
        marginLeft: theme.spacing(4)
    },
    contentBody: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center'
        }
    },
    form: {
        paddingLeft: 100,
        paddingRight: 100,
        paddingBottom: 125,
        flexBasis: 700,
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },
    title: {
        marginTop: theme.spacing(3)
    },
    textField: {
        marginTop: theme.spacing(2)
    },
    policy: {
        marginTop: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    policyCheckbox: {
        marginLeft: '-14px'
    },
    signUpButton: {
        margin: theme.spacing(2, 0)
    }
}))

const Validate = props => {
    const { history } = props
    try {
        if (localStorage.getItem('token').length > 0) {
            history.push('/dashboard')
        }
    } catch {}
    const [validateState, setValidateState] = useState(false)
    const classes = useStyles()
    axios
        .post(global.config.API_ENDPOINT + '/user' + props.location.pathname)
        .then(response => {
            console.log(response)
            if (response.status === 200) {
                setValidateState(true)
            }
            setTimeout(() => {
                history.push('/')
            }, 3000)
        })
        .catch(error => {
            console.log(error.response)
        })
    console.log()

    return (
        <div className={classes.root}>
            <Grid className={classes.grid} container>
                <Grid className={classes.quoteContainer} item lg={5}>
                    <div className={classes.quote}>
                        <div className={classes.quoteInner}></div>
                    </div>
                </Grid>
                <Grid className={classes.content} item lg={7} xs={12}>
                    {validateState === true ? (
                        <div className={classes.content}>
                            <Typography className={(classes.title, classes.gridCenter)} variant="h1">
                                VALIDATION
                            </Typography>
                            <Typography className={(classes.title, classes.gridCenter2)} variant="h1">
                                Validation is completed.
                            </Typography>
                        </div>
                    ) : (
                        <div className={classes.content}>
                            <Typography className={(classes.title, classes.gridCenter)} variant="h1">
                                VALIDATION
                            </Typography>
                            <Typography className={(classes.title, classes.gridCenter2)} variant="h1">
                                Token Error.
                            </Typography>
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}

Validate.propTypes = {
    history: PropTypes.object
}

export default withRouter(Validate)
