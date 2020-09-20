import React, { useState, useEffect } from 'react'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import validate from 'validate.js'
import { makeStyles } from '@material-ui/styles'
import { Grid, Button, TextField, Link, Typography } from '@material-ui/core'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const schema = {
    loginCredit: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            maximum: 64
        }
    },
    password: {
        presence: { allowEmpty: false, message: 'is required' },
        length: {
            minimum: 8,
            maximum: 128
        }
    }
}

const useStyles = makeStyles(theme => ({
    captcha: {
        'padding-top': '20px',
        display: 'none'
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
    socialButtons: {
        marginTop: theme.spacing(3)
    },
    socialIcon: {
        marginRight: theme.spacing(1)
    },
    sugestion: {
        marginTop: theme.spacing(2)
    },
    textField: {
        marginTop: theme.spacing(2)
    },
    signInButton: {
        margin: theme.spacing(2, 0)
    }
}))

const SignIn = props => {
    const { history } = props
    try {
        if (localStorage.getItem('token').length > 0) {
            history.push('/dashboard')
        }
    } catch {}

    const classes = useStyles()
    const [errorState, setErrorState] = useState(0)
    const [formState, setFormState] = useState({
        isValid: false,
        values: {},
        touched: {},
        errors: {}
    })

    useEffect(() => {
        const errors = validate(formState.values, schema)

        setFormState(formState => ({
            ...formState,
            isValid: errors ? false : true,
            errors: errors || {}
        }))
    }, [formState.values])

    const handleChange = event => {
        event.persist()

        setFormState(formState => ({
            ...formState,
            values: {
                ...formState.values,
                [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
            },
            touched: {
                ...formState.touched,
                [event.target.name]: true
            }
        }))
    }

    const handleSignIn = event => {
        event.preventDefault()
        axios
            .post(global.config.API_ENDPOINT + '/user/login', {
                loginCredit: formState.values.loginCredit,
                password: formState.values.password
            })
            .then(response => {
                if (response.status === 200) {
                    const token = response.data.token
                    const isAdmin = response.data.isAdmin
                    localStorage.setItem('token', token)
                    localStorage.setItem('isAdmin', isAdmin)
                    history.push('/dashboard')
                    setErrorState(false)
                }
            })
            .catch(err => {
                setErrorState(true)
            })
    }

    /***
     * only for testing
     */
    const [recaptchaState, setRecaptchaState] = useState(true)
    const hasError = field => (formState.touched[field] && formState.errors[field] ? true : false)
    const recaptcha = value => {
        value !== null ? setRecaptchaState(true) : setRecaptchaState(false)
    }
    return (
        <div className={classes.root}>
            <Grid className={classes.grid} container>
                <Grid className={classes.quoteContainer} item lg={5}>
                    <div className={classes.quote}>
                        <div className={classes.quoteInner}></div>
                    </div>
                </Grid>
                <Grid className={classes.content} item lg={7} xs={12}>
                    <div className={classes.content}>
                        <div className={classes.contentBody}>
                            <form className={classes.form} onSubmit={handleSignIn}>
                                <Typography className={classes.title} variant="h2">
                                    Sign in
                                </Typography>
                                {errorState === true ? (
                                    <Alert severity="error">Wrong Username/Email or Password</Alert>
                                ) : (
                                    <p hidden></p>
                                )}
                                <TextField
                                    className={classes.textField}
                                    error={hasError('loginCredit')}
                                    fullWidth
                                    helperText={hasError('loginCredit') ? formState.errors.loginCredit[0] : null}
                                    label="Email address or Username"
                                    name="loginCredit"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.values.loginCredit || ''}
                                    variant="outlined"
                                />
                                <TextField
                                    className={classes.textField}
                                    error={hasError('password')}
                                    fullWidth
                                    helperText={hasError('password') ? formState.errors.password[0] : null}
                                    label="Password"
                                    name="password"
                                    onChange={handleChange}
                                    type="password"
                                    value={formState.values.password || ''}
                                    variant="outlined"
                                />
                                <div className={classes.captcha}>
                                    <ReCAPTCHA sitekey={global.config.GOOGLE_RECAPTCHA_KEY} onChange={recaptcha} />
                                </div>

                                <Button
                                    className={classes.signInButton}
                                    color="primary"
                                    disabled={!formState.isValid || recaptchaState !== true}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Sign in now
                                </Button>
                                <Typography color="textSecondary" variant="body1">
                                    Don't have an account?{' '}
                                    <Link component={RouterLink} to="/sign-up" variant="h6">
                                        Sign up
                                    </Link>
                                </Typography>
                                <Typography color="textSecondary" variant="body1">
                                    Forgot your password?{' '}
                                    <Link component={RouterLink} to="/forgot" variant="h6">
                                        Reset Password
                                    </Link>
                                </Typography>
                            </form>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
SignIn.propTypes = {
    history: PropTypes.object
}

export default withRouter(SignIn)
