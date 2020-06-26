const DB = require('../database/index')

test('Text add', async () => {
    const data = await DB.Text.add({
        path: Math.random().toString(36).substring(2),
        subURL: Math.random().toString(36).substring(2),
        title: Math.random().toString(36).substring(2),
        authorID: 1
    })
    expect(data.status).toBe(true)
})

test('Text Get', async () => {
    const data = await DB.Text.get({
        textID: '29325ea2-af37-4ca7-9afa-b84bad8c77fe'
    })
    expect(data.status).toBe(true)
})

test('Text List', async () => {
    const data = await DB.Text.list()
    expect(data.status).toBe(true)
})
