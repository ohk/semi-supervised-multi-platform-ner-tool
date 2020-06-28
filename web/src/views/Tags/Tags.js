import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import axios from 'axios'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import BlockIcon from '@material-ui/icons/Block'

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
    Hidden
} from '@material-ui/core'

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
        border: '1px solid #EEEEEE'
    }
}))

const Tags = props => {
    const { history } = props
    const classes = useStyles()
    const [fetchState, setFetchState] = useState(false)
    const [data, setData] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(15)
    const [page, setPage] = useState(0)
    const [dCount, setDcount] = useState(100)
    try {
        if (localStorage.getItem('token').length < 0) {
            history.push('/')
        }
    } catch (error) {
        history.push('/')
    }
    if (fetchState === false) {
        axios
            .get(global.config.API_ENDPOINT + '/system/getusers', {
                params: { page: page, rows: rowsPerPage },
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(response => {
                if (response.status === 200) {
                    setData(response.data.data)
                    setDcount(response.data.count)
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

    const makeAdmin = event => {}
    const blockUser = event => {}

    const makeAdminM = event => {}
    const blockUserM = event => {}
    console.log(data)
    return (
        <div className={classes.content}>
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
                                                                <BlockIcon /> Block
                                                            </Button>
                                                        </TableCell>
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
                                        <TableRow className={classes.tableRow} hover>
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
                                                    <BlockIcon /> Block
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover></TableRow>
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

Tags.propTypes = {
    history: PropTypes.object
}

export default withRouter(Tags)
