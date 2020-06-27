import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import axios from 'axios'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import {
    Card,
    CardActions,
    CardContent,
    Avatar,
    Checkbox,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
    Button
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    button: {
        marginRight: theme.spacing(1),
        float: 'right'
    },
    content: {
        padding: 0
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
    addTextbtn: {
        float: 'right'
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
    try {
        if (localStorage.getItem('token').length < 0) {
            history.push('/')
        }
    } catch (error) {
        history.push('/')
    }
    if (fetchState === false) {
        axios
            .get(global.config.API_ENDPOINT + props.location.pathname + '/list', {
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
    console.log(data)
    return (
        <div className={classes.content}>
            <Card className={classes.root}>
                <div className={classes.row}>
                    <span className={classes.spacer} />
                    <Link component={RouterLink} to={'/addText'}>
                        <Button color="primary" variant="contained" className={classes.addTextbtn}>
                            Add Text
                        </Button>
                    </Link>
                </div>
                <CardContent className={classes.content}>
                    <PerfectScrollbar>
                        <div className={classes.content}>
                            <div className={classes.inner}>
                                {
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Author</TableCell>
                                                <TableCell>Tag Count</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.map(text => (
                                                <TableRow className={classes.tableRow} hover key={text.textid}>
                                                    <TableCell>
                                                        <div className={classes.nameContainer}>
                                                            <Link
                                                                component={RouterLink}
                                                                to={'/text/' + text.textid}
                                                                variant="h6"
                                                            >
                                                                {text.title}
                                                            </Link>
                                                        </div>
                                                    </TableCell>

                                                    {text.authorname === 'root' ? (
                                                        <TableCell className={classes.nameC}>
                                                            {text.name + ' ' + text.surname}
                                                        </TableCell>
                                                    ) : (
                                                        <TableCell className={classes.nameC}>
                                                            {text.authorname}
                                                        </TableCell>
                                                    )}
                                                    <TableCell>{text.tagcount}</TableCell>
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
        </div>
    )
}

Text.propTypes = {
    history: PropTypes.object
}

export default withRouter(Text)
