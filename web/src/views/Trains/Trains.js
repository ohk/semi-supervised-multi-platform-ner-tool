import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import axios from 'axios'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import MuiAlert from '@material-ui/lab/Alert'
import moment from 'moment'
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

const Records = props => {
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
            history.push('/unrecordized')
        }
    } catch (error) {
        history.push('/')
    }
    if (fetchState === false) {
        axios
            .get(
                global.config.API_ENDPOINT + '/system/getTrains',

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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpen(false)
    }

    const manuelTrain = (event, reason) => {
        console.log(localStorage.getItem('token'))
        axios
            .post(
                global.config.API_ENDPOINT + '/system/manuelTrain',
                {},
                {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                if (response.status === 200) {
                    setSevere('success')
                    setMes('Manuel Train Started')
                    setOpen(true)
                }
            })
            .catch(error => {
                setMes('Manuel Train Failed')
                setSevere('error')
                setOpen(true)
                console.log(error.response)
            })
    }
    console.log(data)

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
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={e => {
                                    manuelTrain(e)
                                }}
                            >
                                Manuel Train
                            </Button>
                        </div>
                        <PerfectScrollbar>
                            <div className={classes.content}>
                                <div className={classes.inner}>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.tablecell}>Record ID</TableCell>
                                                <TableCell className={classes.tablecell}>Created Date</TableCell>
                                                <TableCell className={classes.tablecell}>Local Path</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.map(records => (
                                                <TableRow
                                                    className={classes.tableRow}
                                                    hover
                                                    key={records.recordid}
                                                    id={records.recordid}
                                                >
                                                    <TableCell className={classes.tablecell}>
                                                        {records.recordid}
                                                    </TableCell>
                                                    <TableCell className={classes.tablecell}>
                                                        {moment(records.createdat).fromNow()}
                                                    </TableCell>
                                                    <TableCell className={classes.tablecell}>{records.path}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

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
                        <span className={classes.spacer} />
                        <div className={classes.row}>
                            <span className={classes.spacer} />
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={e => {
                                    manuelTrain(e)
                                }}
                            >
                                Manuel Train
                            </Button>
                        </div>
                        {data.map(record => (
                            <div>
                                <span className={classes.spacer} />

                                <Table className={classes.table} key={record.recordid} id={record.recordid}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.tablecellM}>Key</TableCell>
                                            <TableCell className={classes.tablecellM}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecellM}>Record ID</TableCell>
                                            <TableCell className={classes.tablecellM}>{record.recordid}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecellM}>Creation Date</TableCell>
                                            <TableCell className={classes.tablecellM}>
                                                {moment(record.createdat).fromNow()}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecellM}>Local Path</TableCell>
                                            <TableCell className={classes.tablecellM}>{record.path}</TableCell>
                                        </TableRow>
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

Records.propTypes = {
    history: PropTypes.object
}

export default withRouter(Records)
