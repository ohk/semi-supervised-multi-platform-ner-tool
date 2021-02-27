import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Button,Link } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Link as RouterLink } from 'react-router-dom'
import { saveAs } from 'file-saver';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    button: {
        marginRight: theme.spacing(1),
        float: 'right'
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
                    setTypes(
                        response.data.data.types.sort(function(a, b) {
                            return a.tagtypeid - b.tagtypeid
                        })
                    )
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
        updateState(typeID, wordid)
    }

    const exportData = () => {
        const exportObj = {
            tagTypes: types,
            data: tags,
        }
        const fileName = props.location.pathname.replace('/text/','')
        const fileToSave = new Blob([JSON.stringify(exportObj)], {
            type: 'application/json',
            name: fileName
        });
        
        // Save the file
        saveAs(fileToSave, fileName);
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
                        history.push('/text')
                    }, 1000)
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

    return (
        <div className={classes.root}>
             <div className={classes.row}>
                        <span className={classes.spacer} />
                        <Link component={RouterLink} onClick={exportData} variant="h6">
                            <Button color="primary" variant="contained">
                                Export
                            </Button>
                        </Link>
                    </div>
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
                                            type={types[tag.tagtypeid - 1].tagalias}
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
                                                    {type.tagalias}
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
                                                    {type.tagalias}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                        })}
                        <div>
                            <Button color="primary" variant="contained" className={classes.button} onClick={saveClick}>
                                Save
                            </Button>
                        </div>
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
