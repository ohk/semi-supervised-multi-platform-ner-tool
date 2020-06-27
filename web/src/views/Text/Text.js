import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    button: {
        marginRight: theme.spacing(1),
        float: 'right'
    }
}))

const Text = props => {
    const { history } = props
    const classes = useStyles()
    const [fetchState, setFetchState] = useState(false)
    const [data, setData] = useState([])
    const [op, setOp] = useState(0)
    const [mes, setMes] = useState('')
    // if (localStorage.getItem("isAdmin") !== true) {
    //   history.push("/dashboardUser");
    // }
    // try {
    //   if (localStorage.getItem("token").length < 0) {
    //     history.push("/");
    //   }
    // } catch (error) {
    //   history.push("/");
    // }
    if (fetchState === false) {
        axios
            .get(global.config.API_ENDPOINT + props.location.pathname + '/list', {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(response => {
                if (response.status === 200) {
                    setData(response.data.data)
                    setFetchState(true)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
    }
    console.log(data)
    return (
        <div className={classes.root}>
            {/*
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Tag Count</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(0, rowsPerPage).map(user => (
                                        <TableRow
                                            className={classes.tableRow}
                                            hover
                                            key={user.id}
                                            selected={selectedUsers.indexOf(user.id) !== -1}
                                        >
                                            <TableCell>
                                                <div className={classes.nameContainer}>
                                                    <Typography variant="body1">{user.name}</Typography>
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.surname}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.textCount}</TableCell>
                                        </TableRow>
                                    ))}
                    </TableBody>
                </Table>
                        */}
            <div>Hello World</div>
        </div>
    )
}

Text.propTypes = {
    history: PropTypes.object
}

export default withRouter(Text)
