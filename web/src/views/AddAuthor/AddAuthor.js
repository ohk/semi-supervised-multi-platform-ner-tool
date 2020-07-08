import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import validate from 'validate.js'
import { makeStyles } from '@material-ui/styles'
import { Grid, Button, Checkbox, TextField, Typography } from '@material-ui/core'
import axios from 'axios'

import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const schema = {
    mainurl: {
        presence: { allowEmpty: false, message: 'is required' }
    },
    authorname: {
        presence: { allowEmpty: false, message: 'is required' }
    },
    category: {
        presence: { allowEmpty: false, message: 'is required' }
    }
}

const useStyles = makeStyles(theme => ({
    gridCenter: {
        height: '100%',
        display: 'flex',
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

const AddText = props => {
    const { history } = props
    try {
        if (localStorage.getItem('token').length < 0) {
            history.push('/')
        }
    } catch (error) {
        history.push('/')
    }
    const classes = useStyles()

    const [createState, setCreateState] = useState(false)
    const [errorState, setErrorState] = useState(false)
    const [errMessage, setErrMessage] = useState('')
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

    const handleSignUp = event => {
        event.preventDefault()
        axios
            .post(
                global.config.API_ENDPOINT + '/system/addAuthor',
                {
                    mainurl: formState.values.mainurl,
                    authorname: formState.values.authorname,
                    category: formState.values.category,
                    crawl: formState.values.correction,
                    count: formState.values.count
                },
                {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                console.log(response)
                setCreateState(true)
                setTimeout(() => {
                    history.push('/authors')
                }, 3000)
            })
            .catch(error => {
                if (createState === true) {
                    console.log(createState)
                } else {
                    try {
                        console.log(error.response)
                        const m = error.response.data.message
                        setErrMessage(m)
                        setErrorState(true)
                    } catch (error) {
                        console.log(error)
                        setErrMessage('Please contact the developer.')
                        setErrorState(true)
                    }
                }
            })
    }
    console.log()
    const hasError = field => (formState.touched[field] && formState.errors[field] ? true : false)

    console.log(errorState, errMessage)
    return (
        <div className={classes.root}>
            <Grid className={classes.grid} container>
                <Grid className={classes.content} item lg={7} xs={12}>
                    {createState === true ? (
                        <div className={classes.gridCenter}>
                            <Typography className={(classes.title, classes.gridCenter)} variant="h1">
                                Text Added. System Working. Please wait ... We Redirect you.
                            </Typography>
                        </div>
                    ) : (
                        <div className={classes.content}>
                            <div className={classes.contentBody}>
                                <form className={classes.form} onSubmit={handleSignUp}>
                                    {errorState === true ? (
                                        <Alert severity="error">{errMessage}</Alert>
                                    ) : (
                                        <p hidden></p>
                                    )}

                                    <TextField
                                        className={classes.textField}
                                        error={hasError('authorname')}
                                        fullWidth
                                        helperText={hasError('authorname') ? formState.errors.authorname[0] : null}
                                        label="Author Name"
                                        name="authorname"
                                        onChange={handleChange}
                                        type="text"
                                        value={formState.values.authorname || ''}
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={classes.textField}
                                        error={hasError('mainurl')}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        helperText={hasError('mainurl') ? formState.errors.mainurl[0] : null}
                                        label="URL"
                                        name="mainurl"
                                        onChange={handleChange}
                                        type="textarea"
                                        value={formState.values.mainurl || ''}
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={classes.textField}
                                        error={hasError('category')}
                                        fullWidth
                                        helperText={hasError('authorname') ? formState.errors.category[0] : null}
                                        label="Label"
                                        name="category"
                                        onChange={handleChange}
                                        type="text"
                                        value={formState.values.category || ''}
                                        variant="outlined"
                                    />
                                    <div className={classes.correction}>
                                        <Checkbox
                                            checked={formState.values.correction || false}
                                            className={classes.correctionCheckbox}
                                            color="primary"
                                            name="correction"
                                            onChange={handleChange}
                                        />
                                        <Typography
                                            className={classes.correctionText}
                                            color="textSecondary"
                                            variant="body1"
                                        >
                                            Would you like us to crawl past posts? If you have activated this feature,
                                            please remember to specify numbers.
                                        </Typography>
                                    </div>
                                    <TextField
                                        className={classes.textField}
                                        error={hasError('count')}
                                        fullWidth
                                        helperText={hasError('authorname') ? formState.errors.count[0] : null}
                                        label="Count"
                                        name="count"
                                        onChange={handleChange}
                                        type="text"
                                        value={formState.values.count || ''}
                                        variant="outlined"
                                    />
                                    <Button
                                        className={classes.signUpButton}
                                        color="primary"
                                        disabled={!formState.isValid}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                    >
                                        Add Author
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}
                </Grid>
            </Grid>
        </div>
    )
}

AddText.propTypes = {
    history: PropTypes.object
}

export default withRouter(AddText)
