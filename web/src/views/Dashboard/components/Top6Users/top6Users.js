import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Link as RouterLink } from 'react-router-dom'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Link
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

const useStyles = makeStyles(() => ({
    root: {
        height: '100%'
    },
    content: {
        padding: 0
    },
    image: {
        height: 48,
        width: 48
    },
    actions: {
        justifyContent: 'flex-end'
    },
    nameC: {
        'text-transform': 'capitalize'
    }
}))

const Top6Users = props => {
    const { className, users, ...rest } = props

    const classes = useStyles()
    console.log(users)
    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader subtitle={`${users.length} in total`} title="Top 6 Users" />
            <Divider />
            <CardContent className={classes.content}>
                <List>
                    {users.map((user, i) => (
                        <ListItem divider={i < users.length - 1} key={i}>
                            <ListItemText
                                className={classes.nameC}
                                primary={user.name + ' ' + user.surname}
                                secondary={`Total Tag Count : ${user.textCount}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
                <Link component={RouterLink} to={'/users'} variant="h6">
                    <Button color="primary" size="small" variant="text">
                        View all <ArrowRightIcon />
                    </Button>
                </Link>
            </CardActions>
        </Card>
    )
}

Top6Users.propTypes = {
    className: PropTypes.string
}

export default Top6Users
