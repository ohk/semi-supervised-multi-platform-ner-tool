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
import { SearchInput } from 'components'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

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
    upDownIcon: {
        float: 'right',
        '&:hover': {
            background: '#e3e3e3'
        }
    },
    selected: {
        color: 'red',
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
    const [searchV, setSearchV] = useState('')
    const [sortType, setsortType] = useState(true)
    const [sortField, setSortField] = useState(0)

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
        var sort, field
        sortType === true ? (sort = 'ASC') : (sort = 'DESC')
        sortField === 0
            ? (field = 'default')
            : sortField === 1
            ? (field = 'authorname')
            : sortField === 2
            ? (field = 'category')
            : (field = 'textcount')

        axios
            .get(
                global.config.API_ENDPOINT + '/system/getauthors',

                {
                    params: { page: page, rows: rowsPerPage, search: searchV, sortField: field, sortType: sort },
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

    const unblockAuthor = event => {
        const id = event.target.parentNode.parentNode.parentNode.getAttribute('id')

        axios
            .post(
                global.config.API_ENDPOINT + '/system/unblockAuthor',
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
    const blockAuthor = event => {
        const id = event.target.parentNode.parentNode.parentNode.getAttribute('id')
        console.log(id)
        axios
            .post(
                global.config.API_ENDPOINT + '/system/blockAuthor',
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
    const unblockAuthorM = event => {
        const id = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
        console.log(id)
        axios
            .post(
                global.config.API_ENDPOINT + '/system/unblockAuthor',
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
    const blockAuthorM = event => {
        const id = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id')
        console.log(id)
        axios
            .post(
                global.config.API_ENDPOINT + '/system/blockAuthor',
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
                        <div className={classes.row}>
                            <SearchInput
                                className={classes.searchInput}
                                onChange={e => searchChange(e)}
                                placeholder="Search Author"
                            />
                        </div>
                        <PerfectScrollbar>
                            <div className={classes.content}>
                                <div className={classes.inner}>
                                    {
                                        <Table className={classes.table}>
                                            <TableHead>
                                                {sortField === 1 ? (
                                                    <TableRow>
                                                        <TableCell className={classes.selected}>
                                                            Author Name
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
                                                        <TableCell className={classes.tablecell}>URL</TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            Category
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 2)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            Textcount
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 3)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>Crawl</TableCell>
                                                        <TableCell className={classes.tablecell}>Actions</TableCell>
                                                    </TableRow>
                                                ) : sortField === 2 ? (
                                                    <TableRow>
                                                        <TableCell className={classes.tablecell}>
                                                            Author Name
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 1)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>URL</TableCell>
                                                        <TableCell className={classes.selected}>
                                                            Category
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
                                                        <TableCell className={classes.tablecell}>
                                                            Textcount
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 3)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>Crawl</TableCell>
                                                        <TableCell className={classes.tablecell}>Actions</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    <TableRow>
                                                        <TableCell className={classes.tablecell}>
                                                            Author Name
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 1)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>URL</TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            Category
                                                            <span
                                                                className={classes.upDownIcon}
                                                                onClick={() => sorter(true, 2)}
                                                            >
                                                                <ArrowDownwardIcon />
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className={classes.selected}>
                                                            Textcount
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
                                                        <TableCell className={classes.tablecell}>Crawl</TableCell>
                                                        <TableCell className={classes.tablecell}>Actions</TableCell>
                                                    </TableRow>
                                                )}
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
                                                            {authors.mainurl}
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            {authors.category}
                                                        </TableCell>
                                                        <TableCell className={classes.tablecell}>
                                                            {authors.textcount}
                                                        </TableCell>

                                                        {authors.crawl === true ? (
                                                            <TableCell className={classes.tablecell}>
                                                                <DoneIcon />
                                                            </TableCell>
                                                        ) : (
                                                            <TableCell className={classes.tablecell}>
                                                                <CloseIcon />
                                                            </TableCell>
                                                        )}
                                                        {authors.crawl === true ? (
                                                            <TableCell className={classes.tablecell}>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={e => {
                                                                        blockAuthor(e)
                                                                    }}
                                                                >
                                                                    <SupervisorAccountIcon />
                                                                    Block Crawl
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
                                                                    Unblock Crawl
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
                                            <TableCell className={classes.tablecellM}>URL</TableCell>
                                            <TableCell className={classes.tablecellM}>{author.mainurl}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecellM}>Text Count</TableCell>
                                            <TableCell className={classes.tablecellM}>{author.textcount}</TableCell>
                                        </TableRow>
                                        <TableRow className={classes.tableRow} hover>
                                            <TableCell className={classes.tablecellM}>Crawl</TableCell>
                                            {author.crawl === true ? (
                                                <TableCell className={classes.tablecellM}>
                                                    <DoneIcon />
                                                </TableCell>
                                            ) : (
                                                <TableCell className={classes.tablecellM}>
                                                    <CloseIcon />
                                                </TableCell>
                                            )}
                                        </TableRow>
                                        {author.crawl === true ? (
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
                                                        Block Crawl
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
                                                        Unblock Crawl
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
