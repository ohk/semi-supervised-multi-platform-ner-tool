import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import axios from 'axios';

import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const schema = {
  loginCredit: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  gridCenter: {
    height: '45%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    //alignItems: 'center',
    textAlign: 'center'
    //flexBasis: '600px'
  },
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

const ForgotPassword = props => {
  const { history } = props;

  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorState, setErrorState] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleReset = event => {
    event.preventDefault();
    axios
      .post(global.config.API_ENDPOINT + '/user/forgot', {
        loginCredit: formState.values.loginCredit
      })
      .then(response => {
        if (response.status === 200) {
          setSuccessMessage('Reset email sent.');
          setSuccessState(true);
          setTimeout(() => history.push('/'), 5000);
        }
      })
      .catch(err => {
        console.log(err.response);
        setErrorMessage(err.response.data);
        setErrorState(true);
      });
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}></div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              {successState === true ? (
                <div className={classes.content}>
                  <Typography
                    className={(classes.title, classes.gridCenter)}
                    variant="h1">
                    {successMessage}
                  </Typography>
                </div>
              ) : (
                <form className={classes.form} onSubmit={handleReset}>
                  <Typography className={classes.title} variant="h2">
                    Sign in
                  </Typography>
                  {errorState === true ? (
                    <Alert severity="error">{errorMessage}</Alert>
                  ) : (
                    <p hidden></p>
                  )}
                  <TextField
                    className={classes.textField}
                    error={hasError('loginCredit')}
                    fullWidth
                    helperText={
                      hasError('loginCredit')
                        ? formState.errors.loginCredit[0]
                        : null
                    }
                    label="Username/Email"
                    name="loginCredit"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.loginCredit || ''}
                    variant="outlined"
                  />
                  <Button
                    className={classes.signInButton}
                    color="primary"
                    disabled={!formState.isValid}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained">
                    Reset Password
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
ForgotPassword.propTypes = {
  history: PropTypes.object
};

export default withRouter(ForgotPassword);
