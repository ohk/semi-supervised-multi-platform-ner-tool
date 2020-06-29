import React, { useState } from 'react'
import clsx from 'clsx'
import moment from 'moment'
import PerfectScrollbar from 'react-perfect-scrollbar'
import ReactCountryFlag from 'react-country-flag'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import LanguageIcon from '@material-ui/icons/Language'

import { countries } from 'country-data'
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
        minWidth: 800
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
    delivered: 'success',
    pending: 'info',
    refunded: 'danger'
}

const Logins = props => {
    const { className, logins, ...rest } = props

    const classes = useStyles()

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader title="Last 10 Login" />
            <Divider />
            <CardContent className={classes.content}>
                <PerfectScrollbar>
                    <div className={classes.inner}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>IP Address</TableCell>
                                    <TableCell>Country</TableCell>
                                    <TableCell>Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logins.map(login => (
                                    <TableRow hover key={login.logid}>
                                        <TableCell>{login.name + ' ' + login.surname}</TableCell>
                                        <TableCell>{login.username}</TableCell>
                                        <TableCell>{login.ipaddress}</TableCell>
                                        {login.country === 'unknown' ? (
                                            <TableCell>
                                                <ReactCountryFlag countryCode="TR" />
                                                {countries['TR'].name}
                                            </TableCell>
                                        ) : (
                                            <TableCell>
                                                <ReactCountryFlag countryCode={login.country} />
                                                {countries[login.country].name}
                                            </TableCell>
                                        )}
                                        <TableCell>{moment(login.createdat).fromNow()}</TableCell>
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

Logins.propTypes = {
    className: PropTypes.string
}

export default Logins
