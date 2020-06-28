import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import axios from 'axios'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import PermIdentityIcon from '@material-ui/icons/PermIdentity'
import PersonIcon from '@material-ui/icons/Person'
import MuiAlert from '@material-ui/lab/Alert'

import {
    Card,
    CardActions,
    CardContent,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    Hidden,
    Snackbar
} from '@material-ui/core'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },

    button: {
        float: 'right',
        display: 'block',
        padding: 10
    },
    content: {
        padding: 10
    },
    inner: {
        minWidth: 1050
    },
    nameContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: theme.spacing(2)
    },
    actions: {
        justifyContent: 'flex-end'
    },
    content: {
        marginTop: theme.spacing(2)
    },
    nameC: {
        'text-transform': 'capitalize'
    },
    title: {
        fontSize: 14
    },
    pos: {
        marginBottom: 12
    },
    row: {
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1)
    },
    spacer: {
        flexGrow: 1
    },
    tablecell: {
        'text-align': 'center'
    },
    table: {
        'margin-bottom': '1.5rem',
        border: '1px solid #EEEEEE',
        display: 'table'
    }
}))

const Text = props => {
    const { history } = props
    const classes = useStyles()
    const [fetchState, setFetchState] = useState(false)
    const [data, setData] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(15)
    const [page, setPage] = useState(0)
    const [dCount, setDcount] = useState(100)
    const [mes, setMes] = useState('')
    const [open, setOpen] = React.useState(false)
    const [severe, setSevere] = useState('')
    try {
        if (localStorage.getItem('token').length < 0) {
            history.push('/')
        } else if (localStorage.getItem('isAdmin') === 'false') {
            history.push('/unauthorized')
        }
    } catch (error) {
        history.push('/')
    }
    if (fetchState === false) {
        axios
            .get(
                global.config.API_ENDPOINT + '/system/getusers',

                {
                    params: { page: page, rows: rowsPerPage },
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                if (response.status === 200) {
                    setData(response.data.data)
                    setDcount(parseInt(response.data.count))
                    setFetchState(true)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    const handlePageChange = (event, page) => {
        setPage(page)
        setFetchState(false)
    }

    const handleRowsPerPageChange = event => {
        setRowsPerPage(event.target.value)
        setFetchState(false)
    }

    const makeAdmin = event => {
        const id = event.target.parentNode.parentNode.parentNode.getAttribute('id')
        axios
            .post(
                global.config.API_ENDPOINT + '/system/makeAdmin',
                {},
                {
                    params: { paramid: id },
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                console.log(response.data)
                if (response.data.status === true) {
                    setMes(response.data.message)
                    setSevere('success')
                    setOpen(true)
                    setFetchState(false)
                } else {
                    setMes(response.data.message)
                    setSevere('error')
                    setOpen(true)
                    setFetchState(false)
                }
            })
            .catch(error => {
                setMes(error.response.data.message)
                setSevere('error')
                setOpen(true)
                setFetchState(false)
            })
    }
    const blockUser = event => {
        const id = event.target.parentNode.parentNode.parentNode.getAttribute('id')
        axios
            .post(
                global.config.API_ENDPOINT + '/system/blockUser',
                {},
                {
                    params: { paramid: id },
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                console.log(response.data)
                if (response.data.status === true) {
                    setMes(response.data.message)
                    setSevere('success')
                    setOpen(true)
                    setFetchState(false)
                } else {
                    setMes(response.data.message)
                    setSevere('error')
                    setOpen(true)
                    setFetchState(false)
                }
            })
            .catch(error => {
                setMes(error.response.data.message)
                setSevere('error')
                setOpen(true)
                setFetchState(false)
            })
    }

    const makeAdminM = event => {
        const id = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
        axios
            .post(
                global.config.API_ENDPOINT + '/system/makeAdmin',
                {},
                {
                    params: { paramid: id },
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                console.log(response.data)
                if (response.data.status === true) {
                    setMes(response.data.message)
                    setSevere('success')
                    setOpen(true)
                    setFetchState(false)
                } else {
                    setMes(response.data.message)
                    setSevere('error')
                    setOpen(true)
                    setFetchState(false)
                }
            })
            .catch(error => {
                setMes(error.response.data.message)
                setSevere('error')
                setOpen(true)
                setFetchState(false)
            })
    }
    const blockUserM = event => {
        const id = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
        axios
            .post(
                global.config.API_ENDPOINT + '/system/blockUser',
                {},
                {
                    params: { paramid: id },
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                console.log(response.data)
                if (response.data.status === true) {
                    setMes(response.data.message)
                    setSevere('success')
                    setOpen(true)
                    setFetchState(false)
                } else {
                    setMes(response.data.message)
                    setSevere('error')
                    setOpen(true)
                    setFetchState(false)
                }
            })
            .catch(error => {
                setMes(error.response.data.message)
                setSevere('error')
                setOpen(true)
                setFetchState(false)
            })
    }
    const makeUserM = event => {
        const id = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
        axios
            .post(
                global.config.API_ENDPOINT + '/system/makeUser',
                {},
                {
                    params: { paramid: id },
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                console.log(response.data)
                if (response.data.status === true) {
                    setMes(response.data.message)
                    setSevere('success')
                    setOpen(true)
                    setFetchState(false)
                } else {
                    setMes(response.data.message)
                    setSevere('error')
                    setOpen(true)
                    setFetchState(false)
                }
            })
            .catch(error => {
                setMes(error.response.data.message)
                setSevere('error')
                setOpen(true)
                setFetchState(false)
            })
    }
    const makeUser = event => {
        const id = event.target.parentNode.parentNode.parentNode.getAttribute('id')
        axios
            .post(
                global.config.API_ENDPOINT + '/system/makeUser',
                {},
                {
                    params: { paramid: id },
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                console.log(response.data)
                if (response.data.status === true) {
                    setMes(response.data.message)
                    setSevere('success')
                    setOpen(true)
                    setFetchState(false)
                } else {
                    setMes(response.data.message)
                    setSevere('error')
                    setOpen(true)
                    setFetchState(false)
                }
            })
            .catch(error => {
                setMes(error.response.data.message)
                setSevere('error')
                setOpen(true)
                setFetchState(false)
            })
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    return (
        <div className={classes.content}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severe}>
                    {mes}
                </Alert>
            </Snackbar>
            <Hidden only={['xs', 'sm']}>
                <Card className={classes.root}>
                    <div className={classes.row}>
                        <span className={classes.spacer} />
                        <Link component={RouterLink} to={'/addText'} variant="h6">
                            <Button color="primary" variant="contained">
                                Add Text
                            </Button>
                        </Link>
                    </div>
                    <CardContent className={classes.content}>
                        <span className={classes.spacer} />

                        <PerfectScrollbar>
                            <div className={classes.content}>
                                <div className={classes.inner}>
                                    {
                                        <Table className={classes.table}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tablecell}>Name</TableCell>
                                                    <TableCell className={classes.tablecell}>Surname</TableCell>
                                                    <TableCell className={classes.tablecell}>Username</TableCell>
                                                    <TableCell className={classes.tablecell}>Email</TableCell>
                                                    <TableCell className={classes.tablecell}>Role</TableCell>
                                                    <TableCell className={classes.tablecell}>Tag Count</TableCell>
                                                    <TableCell className={classes.tablecell}>Request Count</TableCell>
                                                    <TableCell className={classes.tablecell}>Validation</TableCell>
                                                    <TableCell className={classes.tablecell}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map(user => (
                                                    <TableRow
                                                        className={classes.tableRow}
                                                        hover
                                                        key={user.userid}
                                                        id={user.userid}
                                                    >
                                                        <TableCell className={classes.tablecell}>{user.name}</TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            {user.surname}
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            {user.username}
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            {user.email}
                                                        </TableCell>
                                                        {user.role === 1 ? (
                                                            <TableCell className={classes.tablecell}>User</TableCell>
                                                        ) : user.role === -1 ? (
                                                            <TableCell className={classes.tablecell}>Blocked</TableCell>
                                                        ) : (
                                                            <TableCell className={classes.tablecell}>Admin</TableCell>
                                                        )}

                                                        <TableCell className={classes.tablecell}>
                                                            {user.textcount}
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            {user.requestcount}
                                                        </TableCell>
                                                        {user.validation === true ? (
                                                            <TableCell className={classes.tablecell}>
                                                                <DoneIcon />
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell className={classes.tablecell}>
                                                                <CloseIcon />
                                                            </TableCell>
                                                        )}
                                                        {user.role === 1 ? (
                                                            <TableCell className={classes.tablecell}>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={e => {
                                                                        makeAdmin(e)
                                                                    }}
                                                                >
                                                                    <SupervisorAccountIcon />
                                                                    Admin
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={e => {
                                                                        blockUser(e)
                                                                    }}
                                                                >
                                                                    <PermIdentityIcon /> Block
                                                                </Button>
                                                            </TableCell>
                                                        ) : user.role === -1 ? (
                                                            <TableCell className={classes.tablecell}>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={e => {
                                                                        makeUser(e)
                                                                    }}
                                                                >
                                                                    <PersonIcon />
                                                                    makeUser
                                                                </Button>
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell className={classes.tablecell}>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={e => {
                                                                        makeUser(e)
                                                                    }}
                                                                >
                                                                    <PersonIcon /> User
                                                                </Button>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={e => {
                                                                        blockUser(e)
                                                                    }}
                                                                >
                                                                    <PermIdentityIcon /> Block
                                                                </Button>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    }
                                    <CardActions className={classes.actions}>
                                        <TablePagination
                                            component="div"
                                            count={dCount}
                                            onChangePage={handlePageChange}
                                            onChangeRowsPerPage={handleRowsPerPageChange}
                                            page={page}
                                            rowsPerPage={rowsPerPage}
                                            rowsPerPageOptions={[15, 25, 50]}
                                        />
                                    </CardActions>
                                </div>
                            </div>
                        </PerfectScrollbar>
                    </CardContent>
                </Card>
            </Hidden>
            <Hidden only={['md', 'xl', 'lg']}>
                <div>
                    <Card className={classes.root} variant="outlined">
                        {data.map(user => (
                            <div>
                                <span className={classes.spacer} />

                                <Table className={classes.table} key={user.userid} id={user.userid}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tablecell}>Key</TableCell>
                                            <TableCell className={classes.tablecell}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecell}>Name</TableCell>
                                            <TableCell className={classes.tablecell}>{user.name}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecell}>Surname</TableCell>
                                            <TableCell className={classes.tablecell}>{user.surname}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecell}>Username</TableCell>
                                            <TableCell className={classes.tablecell}>{user.username}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecell}>Email</TableCell>
                                            <TableCell className={classes.tablecell}>{user.email}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecell}>Role</TableCell>
                                            {user.role === 1 ? (
                                                <TableCell className={classes.tablecell}>User</TableCell>
                                            ) : user.role === -1 ? (
                                                <TableCell className={classes.tablecell}>Blocked</TableCell>
                                            ) : (
                                                <TableCell className={classes.tablecell}>Admin</TableCell>
                                            )}
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecell}>Tag Count</TableCell>
                                            <TableCell className={classes.tablecell}>{user.textcount}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecell}>Request Count</TableCell>
                                            <TableCell className={classes.tablecell}>{user.requestcount}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecell}>Validation</TableCell>
                                            {user.validation === true ? (
                                                <TableCell className={classes.tablecell}>
                                                    <DoneIcon />
                                                </TableCell>
                                            ) : (
                                                <TableCell className={classes.tablecell}>
                                                    <CloseIcon />
                                                </TableCell>
                                            )}
                                        </TableRow>
                                        {user.role === 1 ? (
                                            <TableRow
                                                className={classes.tableRow}
                                                hover
                                                style={{ 'justify-content': 'center' }}
                                            >
                                                <TableCell className={classes.tablecell}>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={e => {
                                                            makeAdminM(e)
                                                        }}
                                                    >
                                                        <SupervisorAccountIcon />
                                                        Admin
                                                    </Button>
                                                </TableCell>
                                                <TableCell className={classes.tablecell}>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={e => {
                                                            blockUserM(e)
                                                        }}
                                                    >
                                                        <PermIdentityIcon /> Block
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ) : user.role === -1 ? (
                                            <TableRow
                                                className={classes.tableRow}
                                                hover
                                                style={{ 'justify-content': 'center' }}
                                            >
                                                <TableCell className={classes.tablecell}>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={e => {
                                                            makeUserM(e)
                                                        }}
                                                    >
                                                        <PersonIcon />
                                                        makeUser
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow
                                                className={classes.tableRow}
                                                hover
                                                style={{ 'justify-content': 'center' }}
                                            >
                                                <TableCell className={classes.tablecell}>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={e => {
                                                            makeUserM(e)
                                                        }}
                                                    >
                                                        <PersonIcon /> User
                                                    </Button>
                                                </TableCell>
                                                <TableCell className={classes.tablecell}>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={e => {
                                                            blockUserM(e)
                                                        }}
                                                    >
                                                        <PermIdentityIcon /> Block
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </Card>

                    <CardActions className={classes.actions}>
                        <TablePagination
                            component="div"
                            count={dCount}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[15, 25, 50]}
                        />
                    </CardActions>
                </div>
            </Hidden>
        </div>
    )
}

Text.propTypes = {
    history: PropTypes.object
}

export default withRouter(Text)
