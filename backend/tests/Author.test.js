const DB = require('../database/index')

test('Author add', async () => {
    const data = await DB.Author.add({
        authorname: Math.random().toString(36).substring(2),
        mainurl: Math.random().toString(36).substring(2),
        category: Math.random().toString(36).substring(2)
    })
    expect(data.status).toBe(true)
})

test('Author get', async () => {
    const data = await DB.Author.get()
    expect(data.status).toBe(true)
})
