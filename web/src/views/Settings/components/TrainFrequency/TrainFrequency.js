import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { Card, CardHeader, CardContent, CardActions, Divider, Button, TextField } from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles(() => ({
    root: {}
}))

const TrainFrequency = props => {
    const { className, ...rest } = props

    const classes = useStyles()

    const [values, setValues] = useState({
        day: 0,
        count: 0
    })

    const handleChange = event => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }
    const [fetchState, setFetchState] = useState(false)
    if (fetchState === false) {
        axios
            .get(global.config.API_ENDPOINT + '/system/getSettings', {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(response => {
                if (response.status === 200) {
                    var tmp = {}
                    tmp['count'] = response.data.data.find(o => o.key === 'train_count').value
                    tmp['day'] = response.data.data.find(o => o.key === 'train_day').value
                    console.log(tmp)
                    setValues(tmp)
                    setFetchState(true)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
    }

    const update = () => {
        axios
            .post(
                global.config.API_ENDPOINT + '/system/updateTrainFreq',
                {
                    train_count_value: values.count,
                    train_day_value: values.day
                },
                {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
    }
    return (
        <Card {...rest} className={clsx(classes.root, className)}>
            <form>
                <CardHeader subheader="Update Train Frequency" title="Train Frequency" />
                <Divider />
                <CardContent>
                    <TextField
                        fullWidth
                        label="Day"
                        name="day"
                        onChange={handleChange}
                        type="number"
                        value={values.day}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Count"
                        name="count"
                        onChange={handleChange}
                        style={{ marginTop: '1rem' }}
                        type="number"
                        value={values.count}
                        variant="outlined"
                    />
                </CardContent>
                <Divider />
                <CardActions>
                    <Button color="primary" variant="outlined" onClick={update}>
                        Update
                    </Button>
                </CardActions>
            </form>
        </Card>
    )
}

TrainFrequency.propTypes = {
    className: PropTypes.string
}

export default TrainFrequency
