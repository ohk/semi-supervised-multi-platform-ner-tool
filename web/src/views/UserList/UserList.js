import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";

import { UsersToolbar, UsersTable } from "./components";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const UserList = () => {
  const classes = useStyles();
  const [users,setUsers] = useState();

  axios
  .post(global.config.API_ENDPOINT + '/system/getusers', {
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

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default UserList;
