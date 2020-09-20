import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { Card, CardHeader, CardContent, CardActions, Divider, Button, TextField, Typography } from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles(() => ({
    root: {}
}))

const Password = props => {
    const { className, ...rest } = props

    const classes = useStyles()

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorState, setErrorState] = useState(false)
    const [successState, setSuccessState] = useState(false)

    const [values, setValues] = useState({
        password: '',
        confirm: ''
    })

    const handleChange = event => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    const handlePChange = event => {
        event.preventDefault()
        if (values.password === values.confirm) {
            axios
                .post(
                    global.config.API_ENDPOINT + '/system/changePassword',
                    {
                        password: values.password
                    },
                    {
                        headers: {
                            token: localStorage.getItem('token')
                        }
                    }
                )
                .then(response => {
                    if (response.status === 200) {
                        setSuccessMessage('Password changed successfully.')
                        setSuccessState(true)
                    }
                })
                .catch(err => {
                    console.log(err.response)
                    setErrorMessage(err.response.data)
                    setErrorState(true)
                })
        } else {
            setErrorState(true)
            setErrorMessage('Passwords have to be the same')
        }
    }

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <form>
                <CardHeader subheader="Update password" title="Password" />
                <Divider />
                {successState === true ? (
                    <div className={classes.content}>
                        <Typography className={(classes.title, classes.gridCenter)} variant="h1">
                            {successMessage}
                        </Typography>
                    </div>
                ) : null}
                {errorState === true ? (
                    <div className={classes.content}>
                        <Typography className={(classes.title, classes.gridCenter)} variant="h1">
                            {errorMessage}
                        </Typography>
                    </div>
                ) : null}
                <CardContent>
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Confirm password"
                        name="confirm"
                        onChange={handleChange}
                        style={{ marginTop: '1rem' }}
                        type="password"
                        value={values.confirm}
                        variant="outlined"
                    />
                </CardContent>
                <Divider />
                <CardActions>
                    <Button color="primary" variant="outlined" onClick={handlePChange}>
                        Update
                    </Button>
                </CardActions>
            </form>
        </Card>
    )
}

Password.propTypes = {
    className: PropTypes.string
}

export default Password
