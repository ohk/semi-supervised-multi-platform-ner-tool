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
    }
}))

const Top6Authors = props => {
    const { className, authors, ...rest } = props

    const classes = useStyles()

    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <CardHeader subtitle={`${authors.length} in total`} title="Top 6 Authors" />
            <Divider />
            <CardContent className={classes.content}>
                <List>
                    {authors.map((author, i) => (
                        <ListItem divider={i < authors.length - 1} key={author.authorid}>
                            <ListItemText
                                primary={author.authorname}
                                secondary={`Total Text Count : ${author.textcount}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
            <Divider />
            <CardActions className={classes.actions}>
                <Link component={RouterLink} to={'/authors'} variant="h6">
                    <Button color="primary" size="small" variant="text">
                        View all <ArrowRightIcon />
                    </Button>
                </Link>
            </CardActions>
        </Card>
    )
}

Top6Authors.propTypes = {
    className: PropTypes.string
}

export default Top6Authors
