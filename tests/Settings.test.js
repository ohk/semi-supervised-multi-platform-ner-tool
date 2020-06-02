const DB = require('../database/index')

test('Settings Add', async () => {
    const data = await DB.Settings.add({
        key: Math.random().toString(36).substring(2),
        value: 'value'
    })
    expect(data.status).toBe(true)
})

test('Settings Delete', async () => {
    await DB.Settings.add({
        key: 'deneme',
        value: 'value'
    })
    const data = await DB.Settings.deleteS({
        key: 'deneme'
    })
    expect(data.status).toBe(true)
})

test('Settings Update', async () => {
    const data = await DB.Settings.update({
        key: 'value',
        value: 'HelloWorld'
    })
    expect(data.status).toBe(true)
})

test('Settings List', async () => {
    const data = await DB.Settings.get()
    expect(data.status).toBe(true)
})
