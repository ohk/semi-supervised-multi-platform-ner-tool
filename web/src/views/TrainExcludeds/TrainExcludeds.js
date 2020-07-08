import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import axios from 'axios'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import PersonIcon from '@material-ui/icons/Person'
import MuiAlert from '@material-ui/lab/Alert'

import {
    Card,
    CardActions,
    CardContent,
    Table,
    Link,
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
        marginTop: theme.spacing(2),
        padding: 10
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
    tablecellM: {
        'text-align': 'justify',
        width: '150px'
    },
    table: {
        'margin-bottom': '1.5rem',
        border: '1px solid #EEEEEE',
        display: 'table'
    }
}))

const Authors = props => {
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
                global.config.API_ENDPOINT + '/system/getTrainExcludes',

                {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                if (response.status === 200) {
                    setData(response.data.data)
                    setDcount(parseInt(response.data.data.length))
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

    const unblockAuthor = event => {
        const id = event.target.parentNode.parentNode.parentNode.getAttribute('id')
        console.log(id)
        axios
            .post(
                global.config.API_ENDPOINT + '/system/deleteTrainExcludes',
                { key: 'author', value: id },
                {
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
    const blockAuthor = event => {
        const id = event.target.parentNode.parentNode.parentNode.getAttribute('id')
        console.log(id)
        axios
            .post(
                global.config.API_ENDPOINT + '/system/addTrainExcludes',
                { key: 'author', value: id },
                {
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
    const unblockAuthorM = event => {
        const id = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
        console.log(id)
        axios
            .post(
                global.config.API_ENDPOINT + '/system/deleteTrainExcludes',
                { key: 'author', value: id },
                {
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

    const blockAuthorM = event => {
        const id = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
        console.log(id)
        axios
            .post(
                global.config.API_ENDPOINT + '/system/addTrainExcludes',
                { key: 'author', value: id },
                {
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
                    <CardContent className={classes.content}>
                        <span className={classes.spacer} />
                        <div className={classes.row}>
                            <span className={classes.spacer} />
                            <Link component={RouterLink} to={'/addAuthor'} variant="h6">
                                <Button color="primary" variant="contained">
                                    Add Author
                                </Button>
                            </Link>
                        </div>
                        <PerfectScrollbar>
                            <div className={classes.content}>
                                <div className={classes.inner}>
                                    {
                                        <Table className={classes.table}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tablecell}>Author Name</TableCell>
                                                    <TableCell className={classes.tablecell}>Textcount</TableCell>
                                                    <TableCell className={classes.tablecell}>Excluded</TableCell>
                                                    <TableCell className={classes.tablecell}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map(authors => (
                                                    <TableRow
                                                        className={classes.tableRow}
                                                        hover
                                                        key={authors.authorid}
                                                        id={authors.authorid}
                                                    >
                                                        <TableCell className={classes.tablecell}>
                                                            {authors.authorname}
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            {authors.textcount}
                                                        </TableCell>

                                                        {authors.block === true ? (
                                                            <TableCell className={classes.tablecell}>
                                                                <DoneIcon />
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell className={classes.tablecell}>
                                                                <CloseIcon />
                                                            </TableCell>
                                                        )}
                                                        {authors.block !== true ? (
                                                            <TableCell className={classes.tablecell}>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={e => {
                                                                        blockAuthor(e)
                                                                    }}
                                                                >
                                                                    <SupervisorAccountIcon />
                                                                    Block Author
                                                                </Button>
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell className={classes.tablecell}>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={e => {
                                                                        unblockAuthor(e)
                                                                    }}
                                                                >
                                                                    <PersonIcon />
                                                                    Unblock Author
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
                        {data.map(author => (
                            <div>
                                <span className={classes.spacer} />

                                <Table className={classes.table} key={author.authorid} id={author.authorid}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tablecellM}>Key</TableCell>
                                            <TableCell className={classes.tablecellM}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecellM}>Author Name</TableCell>
                                            <TableCell className={classes.tablecellM}>{author.authorname}</TableCell>
                                        </TableRow>

                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecellM}>Text Count</TableCell>
                                            <TableCell className={classes.tablecellM}>{author.textcount}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecellM}>Excluded</TableCell>
                                            {author.block === true ? (
                                                <TableCell className={classes.tablecellM}>
                                                    <DoneIcon />
                                                </TableCell>
                                            ) : (
                                                <TableCell className={classes.tablecellM}>
                                                    <CloseIcon />
                                                </TableCell>
                                            )}
                                        </TableRow>
                                        {author.block !== true ? (
                                            <TableRow className={classes.tablecellM}>
                                                <TableCell className={classes.tablecellM}>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={e => {
                                                            blockAuthorM(e)
                                                        }}
                                                    >
                                                        <SupervisorAccountIcon />
                                                        Block Author
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            <TableRow className={classes.tablecellM}>
                                                <TableCell className={classes.tablecellM}>
                                                    <Button
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={e => {
                                                            unblockAuthorM(e)
                                                        }}
                                                    >
                                                        <PersonIcon />
                                                        Unblock Author
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

Authors.propTypes = {
    history: PropTypes.object
}

export default withRouter(Authors)
