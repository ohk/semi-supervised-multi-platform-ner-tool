const DB = require('../database/index')

test('Register User function: Username already exist', async () => {
    const data = await DB.User.register({
        name: 'hamid1',
        surname: 'surname',
        username: '1',
        password: '1',
        email: 'email35142'
    })
    expect(data.status).toBe(false)
})

test('Register User function: Email already exist', async () => {
    const data = await DB.User.register({
        name: 'hamid1',
        surname: 'surname',
        username: '3',
        password: '1',
        email: '2'
    })
    expect(data.status).toBe(false)
})

test('Register User function: Register Complete', async () => {
    const data = await DB.User.register({
        name: 'hamid1',
        surname: 'surname',
        username: Math.random().toString(36).substring(2),
        password: '1',
        email: Math.random().toString(36).substring(2)
    })
    expect(data.status).toBe(true)
})

test('Login User function: Email - Password Combination', async () => {
    const data = await DB.User.login({
        loginCredit: '2',
        password: '1',
        device: 'device',
        ipaddress: '192.168.1.1',
        location: 'localhost'
    })
    expect(data.status).toBe(true)
})

test('Login User function: Username - Password Combination', async () => {
    const data = await DB.User.login({
        loginCredit: '1',
        password: '1',
        device: 'device',
        ipaddress: '192.168.1.1',
        location: 'localhost'
    })
    expect(data.status).toBe(true)
})

test('Login User function: Invalid Credits', async () => {
    const data = await DB.User.login({
        loginCredit: Math.random().toString(36).substring(2),
        password: '1',
        device: 'device',
        ipaddress: '192.168.1.1',
        location: 'localhost'
    })
    expect(data.status).toBe(false)
})
