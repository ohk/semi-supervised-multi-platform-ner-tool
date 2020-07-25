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
    Typography,
    TablePagination,
    Button,
    Hidden
} from '@material-ui/core'
import { SearchInput } from 'components'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    selected: {
        color: 'red'
    },
    upDownIcon: {
        float: 'right',
        '&:hover': {
            background: '#e3e3e3'
        }
    },
    searchInput: {
        marginRight: theme.spacing(1)
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
    }
}))

const Text = props => {
    const { history } = props
    const classes = useStyles()
    const [fetchState, setFetchState] = useState(false)
    const [data, setData] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(15)
    const [page, setPage] = useState(0)
    const [searchV, setSearchV] = useState('')
    const [dCount, setDcount] = useState(100)
    const [sortType, setsortType] = useState(true)
    const [sortField, setSortField] = useState(3)
    try {
        if (localStorage.getItem('token').length < 0) {
            history.push('/')
        }
    } catch (error) {
        history.push('/')
    }
    if (fetchState === false) {
        var sort, field
        sortType === true ? (sort = 'ASC') : (sort = 'DESC')
        sortField === 1 ? (field = 'title') : sortField === 2 ? (field = 'authorname') : (field = 'tagcount')
        axios
            .get(global.config.API_ENDPOINT + props.location.pathname + '/list', {
                params: { page: page, rows: rowsPerPage, search: searchV, sortField: field, sortType: sort },
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data.data)
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

    const searchChange = event => {
        setSearchV(event.target.value)
        setFetchState(false)
    }
    const sorter = (type, value) => {
        setsortType(type)
        setSortField(value)
        setFetchState(false)
    }
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
                    <div className={classes.row}>
                        <SearchInput
                            className={classes.searchInput}
                            onChange={e => searchChange(e)}
                            placeholder="Search Text or Author"
                        />
                    </div>
                    <CardContent className={classes.content}>
                        <span className={classes.spacer} />

                        <PerfectScrollbar>
                            <div className={classes.content}>
                                <div className={classes.inner}>
                                    {
                                        <Table>
                                            <TableHead>
                                                {sortField === 1 ? (
                                                    <TableRow>
                                                        <TableCell className={classes.selected}>
                                                            Title
                                                            {sortType === true ? (
                                                                <span
                                                                    className={classes.upDownIcon}
                                                                    onClick={() => sorter(false, 1)}
                                                                >
                                                                    <ArrowUpwardIcon />
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className={classes.upDownIcon}
                                                                    onClick={() => sorter(true, 1)}
                                                                >
                                                                    <ArrowDownwardIcon />
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            Author
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 2)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            Tag Count
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 3)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : sortField === 2 ? (
                                                    <TableRow>
                                                        <TableCell>
                                                            Title
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 1)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={classes.selected}>
                                                            Author
                                                            {sortType === true ? (
                                                                <span
                                                                    className={classes.upDownIcon}
                                                                    onClick={() => sorter(false, 2)}
                                                                >
                                                                    <ArrowUpwardIcon />
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className={classes.upDownIcon}
                                                                    onClick={() => sorter(true, 2)}
                                                                >
                                                                    <ArrowDownwardIcon />
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            Tag Count
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 3)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    <TableRow>
                                                        <TableCell>
                                                            Title
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 1)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            Author
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 2)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={classes.selected}>
                                                            Tag Count
                                                            {sortType === true ? (
                                                                <span
                                                                    className={classes.upDownIcon}
                                                                    onClick={() => sorter(false, 3)}
                                                                >
                                                                    <ArrowUpwardIcon />
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    className={classes.upDownIcon}
                                                                    onClick={() => sorter(true, 3)}
                                                                >
                                                                    <ArrowDownwardIcon />
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )}
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
            </Hidden>
            <Hidden only={['md', 'xl', 'lg']}>
                <div>
                    <Card className={classes.root} variant="outlined">
                        <div className={classes.row}>
                            <span className={classes.spacer} />
                            <Link component={RouterLink} to={'/addText'} variant="h6">
                                <Button color="primary" variant="contained">
                                    Add Text
                                </Button>
                            </Link>
                        </div>
                        {data.map(text => (
                            <div>
                                <span className={classes.spacer} />
                                <CardContent className={classes.content}>
                                    <Typography variant="h5" component="h2">
                                        <Link component={RouterLink} to={'/text/' + text.textid} variant="h6">
                                            {text.title}
                                        </Link>
                                    </Typography>

                                    {text.authorname === 'root' ? (
                                        <Typography className={classes.nameC} color="textSecondary">
                                            {text.name + ' ' + text.surname}
                                        </Typography>
                                    ) : (
                                        <Typography className={classes.nameC} color="textSecondary">
                                            {text.authorname}
                                        </Typography>
                                    )}

                                    <Typography variant="body2" component="p">
                                        Total Tag Count: {text.tagcount}
                                    </Typography>
                                </CardContent>
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
