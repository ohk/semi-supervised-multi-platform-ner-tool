import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Drawer } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import TextFieldsIcon from '@material-ui/icons/TextFields'
import SettingsIcon from '@material-ui/icons/Settings'
import CreateIcon from '@material-ui/icons/Create'
import LabelIcon from '@material-ui/icons/Label'
import { SidebarNav } from './components'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

const useStyles = makeStyles(theme => ({
    drawer: {
        width: 240,
        [theme.breakpoints.up('lg')]: {
            marginTop: 64,
            height: 'calc(100% - 64px)'
        }
    },
    root: {
        backgroundColor: theme.palette.white,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: theme.spacing(2)
    },
    divider: {
        margin: theme.spacing(2, 0)
    },
    nav: {
        marginBottom: theme.spacing(2)
    }
}))

const Sidebar = props => {
    const { open, variant, onClose, className, history, ...rest } = props
    var pages = []
    const classes = useStyles()
    if (localStorage.getItem('isAdmin') === 'true') {
        pages = [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: <DashboardIcon />
            },
            {
                title: 'Users',
                href: '/users',
                icon: <PeopleIcon />
            },
            {
                title: 'Authors',
                href: '/authors',
                icon: <CreateIcon />
            },
            {
                title: 'Tag Types',
                href: '/tagtypes',
                icon: <LabelIcon />
            },
            {
                title: 'Trains',
                href: '/trains',
                icon: <AutorenewIcon />
            },
            {
                title: 'Add Text',
                href: '/addText',
                icon: <CreateIcon />
            },
            {
                title: 'Texts',
                href: '/text',
                icon: <TextFieldsIcon />
            },
            {
                title: 'Settings',
                href: '/settings',
                icon: <SettingsIcon />
            },
            {
                title: 'Logout',
                href: '/',
                icon: <ExitToAppIcon />
            }
        ]
    } else {
        pages = [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: <DashboardIcon />
            },
            {
                title: 'Add Text',
                href: '/addText',
                icon: <CreateIcon />
            },
            {
                title: 'Texts',
                href: '/text',
                icon: <TextFieldsIcon />
            },
            {
                title: 'Settings',
                href: '/settings',
                icon: <SettingsIcon />
            },
            {
                title: 'Logout',
                href: '/',
                icon: <ExitToAppIcon />
            }
        ]
    }

    return (
        <Drawer anchor="left" classes={{ paper: classes.drawer }} onClose={onClose} open={open} variant={variant}>
            <div {...rest} className={clsx(classes.root, className)}>
                <SidebarNav className={classes.nav} pages={pages} />
            </div>
        </Drawer>
    )
}

Sidebar.propTypes = {
    history: PropTypes.object,
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired
}

export default Sidebar
