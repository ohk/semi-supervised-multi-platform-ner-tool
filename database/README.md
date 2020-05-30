# DATABASE FUNCTIONS

---

## Author

| Function Name |     Description     |
| ------------- | :-----------------: |
| get           | Get the all authors |
| add           |   Add the author    |

### get

```
Params: None
Description: Get the all authors
Return:
{
    status: Boolean,
    data: List
}
```

### add

```
Params: {
    authorname: Author Name
    mainurl: Newspaper link
    category: Which category like sport,econmy
}
Description: Add the author
Return:
{
    status: Boolean,
    message: Status message
}
```

---

## Text

| Function Name |     Description     |
| ------------- | :-----------------: |
| get           | Get the all authors |
| add           |   Add the author    |
| list          |   List the texts    |

---

## User

| Function Name |                 Description                  |
| ------------- | :------------------------------------------: |
| log           |    Create the log with login credentials     |
| register      |               Create new user                |
| login         |        Login: Check login credentials        |
| forgot        | Forgot Password function. It send reset code |
| reset         | Reset Password function. It check reset code |
| validate      |           Validate User with Email           |

### Log

```
Params: {
    device: Device Info
    ipaddress: Connection address
    location: Country based location
    userID: user id
}
Description: Create the log with login credentials
Return:
{
    status: Boolean,
    message: Status message
}
```

### Register

```
Params: {
    name
    surname
    username
    password
    email
}
Description: Create new user
Return:
{
    status: Boolean,
    message: Status message
}
```

### Login

```
Params: {
    loginCredit: username or email address
    password
}
Description: Login
Return:
{
    status: Boolean,
    auth-code: for cookies | If status true
    message: Status message
}
```

### Forgot

```
Params: {
    loginCredit: username or email address
}
Description: Forgot Password
Return:
{
    status: Boolean,
    message: Status message
}
```

### Reset

```
Params: {
    key: Reset Code
}
Description: Reset password
Return:
{
    status: Boolean,
    message: Status message
}
```

### Validate

```
Params: {
    key: Validate Code
}
Description: Validate user
THIS FUNCTION IS NOT COMPLETE. PLEASE CHECK LATER
}
```
