import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import validate from 'validate.js'
import { makeStyles } from '@material-ui/styles'
import { Grid, Button, TextField, Checkbox, FormHelperText, Typography, Hidden } from '@material-ui/core'
import axios from 'axios'
import { SketchPicker } from 'react-color'
import queryString from 'query-string'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const schema = {
    tagname: {
        presence: { allowEmpty: false, message: 'is required' }
    },
    color: {
        presence: {
            allowEmpty: false,
            message: 'is required. Must be in HEX FORMAT.'
        },
        format: '^#(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$'
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
    correction: {
        marginTop: theme.spacing(1),
        display: 'flex',
        alignItems: 'center'
    },
    correctionCheckbox: {
        marginLeft: '-14px'
    },
    signUpButton: {
        margin: theme.spacing(2, 0)
    }
}))

const EditTag = props => {
    const { history } = props
    try {
        if (localStorage.getItem('token').length < 0) {
            history.push('/')
        }
    } catch (error) {
        history.push('/')
    }
    const classes = useStyles()

    const parsed = queryString.parse(props.location.search)
    console.log(parsed)
    const [createState, setCreateState] = useState(false)
    const [errorState, setErrorState] = useState(false)
    const [errMessage, setErrMessage] = useState('')
    const [color, setColor] = useState()
    const [first, setFirst] = useState(true)
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
    const handleTag = event => {
        event.preventDefault()
        axios
            .post(
                global.config.API_ENDPOINT + '/system/editTagType',
                {
                    tagtypeid: parsed.id,
                    tagalias: formState.values.tagname,
                    color: formState.values.color
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
                    history.push('/tags')
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

    const handleChangeC = color => {
        setColor(color)
        console.log(color.hex)
        formState.values.color = color.hex
    }
    console.log()
    const hasError = field => (formState.touched[field] && formState.errors[field] ? true : false)
    if (first === true) {
        setColor('#' + parsed.colorCode)
        console.log(color)
        formState.values.color = '#' + parsed.colorCode
        formState.values.tagname = parsed.alias
        setFirst(false)
    }
    console.log(errorState, errMessage)
    return (
        <div className={classes.root}>
            <Grid className={classes.grid} container>
                <Hidden only={['xs', 'sm']}>
                    <Grid className={classes.content} item xs={12} sm={6}>
                        {createState === true ? (
                            <div className={classes.gridCenter}>
                                <Typography className={(classes.title, classes.gridCenter)} variant="h1">
                                    Tag Edited. We will redirect you...
                                </Typography>
                            </div>
                        ) : (
                            <div className={classes.content}>
                                <div className={classes.contentBody}>
                                    <form className={classes.form} onSubmit={handleTag}>
                                        {errorState === true ? <Alert severity="error">{errMessage}</Alert> : <p></p>}

                                        <TextField
                                            className={classes.textField}
                                            error={hasError('tagname')}
                                            fullWidth
                                            helperText={hasError('tagname') ? formState.errors.tagname[0] : null}
                                            label="Tag Alias"
                                            name="tagname"
                                            onChange={handleChange}
                                            type="text"
                                            value={formState.values.tagname || ''}
                                            variant="outlined"
                                        />
                                        <TextField
                                            className={classes.textField}
                                            error={hasError('color')}
                                            fullWidth
                                            helperText={hasError('color') ? formState.errors.color[0] : null}
                                            label="Color"
                                            name="color"
                                            onChange={handleChange}
                                            type="text"
                                            value={formState.values.color || ''}
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
                                            Edit Tag
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Grid>
                    <Grid className={classes.content} item xs={12} sm={6}>
                        <div className={classes.content}>
                            <div className={classes.contentBody}>
                                <SketchPicker color={color} onChangeComplete={handleChangeC} />
                            </div>
                        </div>
                    </Grid>
                </Hidden>
                <Hidden only={['md', 'xl', 'lg']}>
                    <Grid className={classes.content} item xs={12} sm={6}>
                        {createState === true ? (
                            <div className={classes.gridCenter}>
                                <Typography className={(classes.title, classes.gridCenter)} variant="h1">
                                    Tag Added. We will redirect you...
                                </Typography>
                            </div>
                        ) : (
                            <div className={classes.content}>
                                <div className={classes.contentBody}>
                                    <form className={classes.form} onSubmit={handleTag}>
                                        {errorState === true ? <Alert severity="error">{errMessage}</Alert> : <p></p>}

                                        <TextField
                                            className={classes.textField}
                                            error={hasError('tagname')}
                                            fullWidth
                                            helperText={hasError('tagname') ? formState.errors.tagname[0] : null}
                                            label="Tag Name"
                                            name="tagname"
                                            onChange={handleChange}
                                            type="text"
                                            value={formState.values.tagname || ''}
                                            variant="outlined"
                                        />
                                        <TextField
                                            className={classes.textField}
                                            error={hasError('color')}
                                            fullWidth
                                            helperText={hasError('color') ? formState.errors.color[0] : null}
                                            label="Color"
                                            name="color"
                                            onChange={handleChange}
                                            type="text"
                                            value={formState.values.color || ''}
                                            variant="outlined"
                                        />
                                        <Grid className={classes.content} item xs={12} sm={6}>
                                            <div className={classes.content}>
                                                <div className={classes.contentBody}>
                                                    <SketchPicker color={color} onChangeComplete={handleChangeC} />
                                                </div>
                                            </div>
                                        </Grid>
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
                                                Once the tag is added, it can never be changed and deleted. Do you
                                                accept these terms?
                                            </Typography>
                                        </div>
                                        {hasError('correction') && (
                                            <FormHelperText error>{formState.errors.correction[0]}</FormHelperText>
                                        )}
                                        <Button
                                            className={classes.signUpButton}
                                            color="primary"
                                            disabled={!formState.isValid}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            variant="contained"
                                        >
                                            Add Tag Type
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </Grid>
                </Hidden>
            </Grid>
        </div>
    )
}

EditTag.propTypes = {
    history: PropTypes.object
}

export default withRouter(EditTag)
