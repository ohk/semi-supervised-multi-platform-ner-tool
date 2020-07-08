import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import axios from 'axios'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Link as RouterLink, withRouter } from 'react-router-dom'

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
        padding: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    contentBody: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center'
        }
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
        paddingLeft: 100,
        paddingRight: 100,
        paddingBottom: 125,
        flexBasis: 700,
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
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
        } else if (localStorage.getItem('isAdmin') === 'false') {
            history.push('/unauthorized')
        }
    } catch (error) {
        history.push('/')
    }
    if (fetchState === false) {
        axios
            .get(global.config.API_ENDPOINT + '/system/getTagTypes', {
                params: { page: page, rows: rowsPerPage },
                headers: {
                    token: localStorage.getItem('token')
                }
            })
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

    return (
        <div className={classes.content}>
            <Card className={classes.root}>
                <div className={classes.row}>
                    <span className={classes.spacer} />
                    <Link component={RouterLink} to={'/addTag'} variant="h6">
                        <Button color="primary" variant="contained">
                            Add Tag Type
                        </Button>
                    </Link>
                </div>
                <CardContent className={classes.content}>
                    <span className={classes.spacer} />
                    <Hidden only={['xs', 'sm']}>
                        <PerfectScrollbar>
                            <div className={classes.content}>
                                <div className={classes.contentBody}>
                                    {
                                        <Table className={classes.table}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tablecell}>Tagname</TableCell>
                                                    <TableCell className={classes.tablecell}>Color</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.map(type =>
                                                    type.tagname !== 'O' ? (
                                                        <TableRow
                                                            className={classes.tableRow}
                                                            hover
                                                            key={type.tagtypeid}
                                                            id={type.tagtypeid}
                                                        >
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ color: type.color }}
                                                            >
                                                                {type.tagname}
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ background: type.color, color: 'white' }}
                                                            >
                                                                {type.color}
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        <TableRow
                                                            className={classes.tableRow}
                                                            hover
                                                            key={type.tagtypeid}
                                                            id={type.tagtypeid}
                                                        >
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ color: 'black' }}
                                                            >
                                                                {type.tagname}
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ background: type.color, color: 'black' }}
                                                            >
                                                                {type.color}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    }
                                </div>
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
                        </PerfectScrollbar>
                    </Hidden>

                    <Hidden only={['md', 'xl', 'lg']}>
                        <div>
                            <Card className={classes.root} variant="outlined">
                                {data.map(type => (
                                    <div>
                                        <span className={classes.spacer} />
                                        <PerfectScrollbar>
                                            {type.tagname !== 'O' ? (
                                                <Table
                                                    className={classes.table}
                                                    key={type.tagtypeid}
                                                    id={type.tagtypeid}
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tablecell}>Key</TableCell>
                                                            <TableCell className={classes.tablecell}>Value</TableCell>
                                                        </TableRow>
                                                    </TableHead>

                                                    <TableBody>
                                                        <TableRow className={classes.tableRow} hover>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ color: type.color }}
                                                            >
                                                                Tag Name
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ color: type.color }}
                                                            >
                                                                {type.tagname}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className={classes.tableRow} hover>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ background: type.color, color: 'white' }}
                                                            >
                                                                Color
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ background: type.color, color: 'white' }}
                                                            >
                                                                {type.color}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <Table
                                                    className={classes.table}
                                                    key={type.tagtypeid}
                                                    id={type.tagtypeid}
                                                >
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tablecell}>Key</TableCell>
                                                            <TableCell className={classes.tablecell}>Value</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow className={classes.tableRow} hover>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ color: 'black' }}
                                                            >
                                                                Tag Name
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ color: 'black' }}
                                                            >
                                                                {type.tagname}
                                                            </TableCell>
                                                        </TableRow>
                                                        <TableRow className={classes.tableRow} hover>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ background: type.color, color: 'black' }}
                                                            >
                                                                Color
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tablecell}
                                                                style={{ background: type.color, color: 'black' }}
                                                            >
                                                                {type.color}
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </PerfectScrollbar>
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
                </CardContent>
            </Card>
        </div>
    )
}

Tags.propTypes = {
    history: PropTypes.object
}

export default withRouter(Tags)
