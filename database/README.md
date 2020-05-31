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

### add

```
Params: {
    subURL: from which page was it crawl?
    path: Where is it held on disk
    userID: By which user. If by the system, the default value is assigned.
    title: If exist
    authorID: If it was crawled by the system, which author's article was crawled.
    type: Is this article added by the user or by the system.(0 = system - default, 1= user )
}
Description: Add new text
Return:
{
    status: Boolean,
    message: Status message
}
```

### get

```
Params: {
    textID: text id
}
Description: Returns information about that textID.
Return:
{
    status: Boolean,
    data: INFO
}
```

### list

> IN PROCESS / PAGINATION

```
Params: {
    //TODO
}
Description: Create the log with login credentials
Return:
{
    status: Boolean,
    data: INFO
}
```

---

## Word

| Function Name | Description  |
| ------------- | :----------: |
| add           | Add the word |

### add

> IN PROCESS / PAGINATION

```
Params: {
    word:
    textID:
}
Description: Add the new word to the database
Return:
{
    status: Boolean,
    message: Status message
}
```

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
