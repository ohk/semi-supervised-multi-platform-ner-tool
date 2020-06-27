import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    button: {
        marginRight: theme.spacing(1),
        float: 'right'
    }
}))

const Tagger = props => {
    const { history } = props
    const classes = useStyles()
    const [fetchState, setFetchState] = useState(false)
    const [types, setTypes] = useState([])
    const [tags, setTags] = useState([])
    const [op, setOp] = useState(0)
    const [mes, setMes] = useState('')
    // if (localStorage.getItem("isAdmin") !== true) {
    //   history.push("/dashboardUser");
    // }
    // try {
    //   if (localStorage.getItem("token").length < 0) {
    //     history.push("/");
    //   }
    // } catch (error) {
    //   history.push("/");
    // }
    if (fetchState === false) {
        axios
            .get(global.config.API_ENDPOINT + props.location.pathname, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(response => {
                if (response.status === 200) {
                    setTags(response.data.data.text)
                    setTypes(response.data.data.types)
                    setFetchState(true)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
    }
    const updateState = (typeID, wordid) => {
        var tagsV = [...tags]
        tagsV.forEach(tag => {
            if (tag.wordid === wordid) {
                tag.tagtypeid = typeID
            }
        })
        setTags(tagsV)
    }

    const handleClick = e => {
        const typeID = e.target.getAttribute('id')
        const wordid = e.target.parentNode.parentNode.getAttribute('id')
        console.log(typeID, wordid)
        updateState(typeID, wordid)
    }

    const saveClick = e => {
        axios
            .post(
                global.config.API_ENDPOINT + props.location.pathname,
                { tags: tags },
                {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )
            .then(response => {
                if (response.data.status === true) {
                    console.log(response)
                    setOp(1)
                    setMes(response.data.message)
                    setTimeout(() => {
                        history.push('/dashboard')
                    }, 3000)
                } else {
                    setOp(-1)
                    setMes(response.data.message)
                }
            })
            .catch(error => {
                console.log(error.response)
                setOp(-1)
                setMes(error.response.data.message)
            })
    }
    if (types.length > 0) {
        console.log(types[1].color)
    }
    return (
        <div className={classes.root}>
            {op === 0 ? (
                types.length > 0 && tags.length > 0 ? (
                    <div className="entities">
                        {tags.map(tag => {
                            if (types[tag.tagtypeid - 1].tagname !== 'O') {
                                return (
                                    <div
                                        key={tag.wordid}
                                        id={tag.wordid}
                                        value={tag.word}
                                        className="dropdown"
                                        tagtypeid={tag.tagtypeid}
                                    >
                                        <mark
                                            type={types[tag.tagtypeid - 1].tagname}
                                            className="data-entity"
                                            key={tag.wordid}
                                            style={{
                                                background: types[tag.tagtypeid - 1].color + '80',
                                                borderColor: types[tag.tagtypeid - 1].color,
                                                '--tooltip-color': types[tag.tagtypeid - 1].color
                                            }}
                                        >
                                            {tag.word}
                                        </mark>{' '}
                                        <div className="dropdown-content">
                                            {types.map(type => (
                                                <span
                                                    key={type.tagtypeid}
                                                    id={type.tagtypeid}
                                                    className="dropdown-item"
                                                    style={{
                                                        '--tooltip-color': type.color,
                                                        '--tooltip-color-80': type.color + 'CC'
                                                    }}
                                                    onClick={e => {
                                                        handleClick(e)
                                                    }}
                                                >
                                                    {type.tagname}
                                                </span>
                                            ))}
                                        </div>
                                        &nbsp;
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={tag.wordid} id={tag.wordid} value={tag.word} className="dropdown">
                                        <span className="data-blank">{tag.word}</span>
                                        &nbsp;
                                        <div className="dropdown-content">
                                            {types.map(type => (
                                                <span
                                                    key={type.tagtypeid}
                                                    id={type.tagtypeid}
                                                    className="dropdown-item"
                                                    style={{
                                                        '--tooltip-color': type.color,
                                                        '--tooltip-color-80': type.color + 'CC'
                                                    }}
                                                    onClick={e => {
                                                        handleClick(e)
                                                    }}
                                                >
                                                    {type.tagname}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                        })}
                        <Button color="primary" variant="contained" className={classes.button} onClick={saveClick}>
                            Save
                        </Button>
                    </div>
                ) : (
                    <div>Loading...</div>
                )
            ) : (
                <div>{mes}</div>
            )}
            <div></div>
        </div>
    )
}

Tagger.propTypes = {
    history: PropTypes.object
}

export default withRouter(Tagger)
