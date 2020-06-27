import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'

import { UsersTable } from './components'
import axios from 'axios'

import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}))

const UserList = props => {
    const { history } = props
    if (localStorage.getItem('isAdmin') !== 'true') {
        history.push('/dashboard')
    }

    const classes = useStyles()

    const [users, setUsers] = useState()
    const [errorMessage, setErrorMessage] = useState()
    const [errorState, setErrorState] = useState()
    /*axios
        .get(global.config.API_ENDPOINT + '/system/getusers', {
            token: localStorage.getItem('token')
        })
        .then(response => {
            if (response.status === 200) {
                setUsers(response.data)
            } else {
                setUsers([])
            }
        })
        .catch(err => {
            setUsers([])
            console.log(err.response)
            setErrorMessage(err.response.data)
            setErrorState(true)
        })*/
    console.log(users)

    return (
        <div className={classes.root}>
            <div className={classes.content}>
                <UsersTable users={users} />
            </div>
        </div>
    )
}

UserList.propTypes = {
    history: PropTypes.object
}

export default withRouter(UserList)
