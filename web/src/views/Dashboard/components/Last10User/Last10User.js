import React, { useState } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import {
    Card,
    CardActions,
    CardHeader,
    CardContent,
    Button,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    TableSortLabel
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import { StatusBullet } from 'components'

const useStyles = makeStyles(theme => ({
    root: {},
    content: {
        padding: 0
    },
    inner: {
        minWidth: 1200
    },
    statusContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    status: {
        marginRight: theme.spacing(1)
    },
    actions: {
        justifyContent: 'flex-end'
    }
}))

const statusColors = {
    true: 'success',
    false: 'danger'
}

const Last10User = props => {
    const { className, users, ...rest } = props

    const classes = useStyles()

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader title="Last 10 Users" />
            <Divider />
            <CardContent className={classes.content}>
                <PerfectScrollbar>
                    <div className={classes.inner}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Creation Date</TableCell>
                                    <TableCell>Validation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow hover key={user.id}>
                                        <TableCell className={classes.nameC}>
                                            {user.name + ' ' + user.surname}
                                        </TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{moment(user.createdat).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell>
                                            <div className={classes.statusContainer}>
                                                <StatusBullet
                                                    className={classes.status}
                                                    color={statusColors[user.validation]}
                                                    size="sm"
                                                />
                                                {user.validation}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </PerfectScrollbar>
            </CardContent>
        </Card>
    )
}

Last10User.propTypes = {
    className: PropTypes.string
}

export default Last10User
