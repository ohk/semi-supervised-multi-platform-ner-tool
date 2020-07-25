import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import validate from 'validate.js'
import { makeStyles } from '@material-ui/styles'
import { Grid, Button, TextField, Typography } from '@material-ui/core'
import axios from 'axios'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const schema = {
    title: {
        presence: { allowEmpty: false, message: 'is required' }
    },
    content: {
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
    const [file, setFile] = useState()

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

    let fileReader
    let fileName = ''
    const handleFileRead = e => {
        console.log(fileReader)
        const content = fileReader.result
        console.log(content)
        formState.values.content = content
        formState.values.title = fileName
        formState.isValid = true
        console.log(formState.values.content)
        setFile(true)
        // … do something with the 'content' …
    }

    const handleFileChosen = file => {
        fileReader = new FileReader()
        fileReader.onloadend = handleFileRead
        fileReader.readAsText(file)
        fileName = file.name
        console.log(file)
    }

    const handleSignUp = event => {
        event.preventDefault()
        axios
            .post(
                global.config.API_ENDPOINT + '/text/add',
                {
                    content: formState.values.content,
                    title: formState.values.title
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
                    history.push('/text/' + response.data.textid)
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
                                        error={hasError('Title')}
                                        fullWidth
                                        helperText={hasError('Title') ? formState.errors.title[0] : null}
                                        label="Title"
                                        name="title"
                                        onChange={handleChange}
                                        type="text"
                                        value={formState.values.title || ''}
                                        variant="outlined"
                                    />
                                    <TextField
                                        className={classes.textField}
                                        error={hasError('content')}
                                        multiline
                                        rows={15}
                                        fullWidth
                                        helperText={hasError('content') ? formState.errors.content[0] : null}
                                        label="Text"
                                        name="content"
                                        onChange={handleChange}
                                        type="textarea"
                                        value={formState.values.content || ''}
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
                                        Add Text
                                    </Button>

                                    <div className="upload-expense">
                                        <input
                                            type="file"
                                            id="file"
                                            className="input-file"
                                            accept=".txt"
                                            onChange={e => handleFileChosen(e.target.files[0])}
                                        />
                                    </div>
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
