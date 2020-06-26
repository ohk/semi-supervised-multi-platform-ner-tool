import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  FormHelperText,
  Checkbox,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';

import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 2,
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 2,
      maximum: 32
    }
  },
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 6,
      maximum: 32
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      minimum: 8,
      maximum: 128
    }
  },
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
  }
};

const useStyles = makeStyles(theme => ({
  gridCenter: {
    height: '100%',
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
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignUp = props => {
  const { history } = props;

  try {
    if (localStorage.getItem('token').length > 0) {
      history.push('/dashboard');
    }
  } catch {}

  const classes = useStyles();

  const [createState, setCreateState] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [errMessage, setErrMessage] = useState('');
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

  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    event.preventDefault();
    const username = formState.values.username;
    console.log(username.includes('@'));
    if (username.includes('@')) {
      setErrMessage('username cannot contain @');
      setErrorState(true);
    } else {
      axios
        .post(global.config.API_ENDPOINT + '/user/register', {
          name: formState.values.firstName,
          surname: formState.values.lastName,
          username: formState.values.username,
          password: formState.values.password,
          email: formState.values.email
        })
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            setCreateState(true);
          }
        })
        .catch(error => {
          if (createState === true) {
            console.log(createState);
          } else {
            try {
              console.log(error.response);
              const m = error.response.data.message;
              setErrMessage(m);
              setErrorState(true);
            } catch (error) {
              console.log(error);
              setErrMessage('Please contact the developer.');
              setErrorState(true);
            }
          }
        });
    }
  };
  console.log();
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  console.log(errorState, errMessage);
  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}></div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          {createState === true ? (
            <div className={classes.gridCenter}>
              <Typography
                className={(classes.title, classes.gridCenter)}
                variant="h1">
                Your account created. Please check your email and validate your
                account.
              </Typography>
            </div>
          ) : (
            <div className={classes.content}>
              <div className={classes.contentHeader}>
                <IconButton onClick={handleBack}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
              <div className={classes.contentBody}>
                <form className={classes.form} onSubmit={handleSignUp}>
                  <Typography className={classes.title} variant="h2">
                    Create new account
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Use your email to create new account
                  </Typography>
                  {errorState === true ? (
                    <Alert severity="error">{errMessage}</Alert>
                  ) : (
                    <p hidden></p>
                  )}

                  <TextField
                    className={classes.textField}
                    error={hasError('firstName')}
                    fullWidth
                    helperText={
                      hasError('firstName')
                        ? formState.errors.firstName[0]
                        : null
                    }
                    label="First name"
                    name="firstName"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.firstName || ''}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('lastName')}
                    fullWidth
                    helperText={
                      hasError('lastName') ? formState.errors.lastName[0] : null
                    }
                    label="Last name"
                    name="lastName"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.lastName || ''}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('username')}
                    fullWidth
                    helperText={
                      hasError('username') ? formState.errors.username[0] : null
                    }
                    label="username"
                    name="username"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.username || ''}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('email')}
                    fullWidth
                    helperText={
                      hasError('email') ? formState.errors.email[0] : null
                    }
                    label="Email address"
                    name="email"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.email || ''}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    error={hasError('password')}
                    fullWidth
                    helperText={
                      hasError('password') ? formState.errors.password[0] : null
                    }
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={formState.values.password || ''}
                    variant="outlined"
                  />
                  <div className={classes.policy}>
                    <Checkbox
                      checked={formState.values.policy || false}
                      className={classes.policyCheckbox}
                      color="primary"
                      name="policy"
                      onChange={handleChange}
                    />
                    <Typography
                      className={classes.policyText}
                      color="textSecondary"
                      variant="body1">
                      I have read the{' '}
                      <Link
                        color="primary"
                        component={RouterLink}
                        to="#"
                        underline="always"
                        variant="h6">
                        Terms and Conditions
                      </Link>
                    </Typography>
                  </div>
                  {hasError('policy') && (
                    <FormHelperText error>
                      {formState.errors.policy[0]}
                    </FormHelperText>
                  )}
                  <Button
                    className={classes.signUpButton}
                    color="primary"
                    disabled={!formState.isValid}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained">
                    Sign up now
                  </Button>
                  <Typography color="textSecondary" variant="body1">
                    Have an account?{' '}
                    <Link component={RouterLink} to="/" variant="h6">
                      Sign in
                    </Link>
                  </Typography>
                </form>
              </div>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
