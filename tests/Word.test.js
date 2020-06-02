const DB = require('../database/index')

test('Word add', async () => {
    const data = await DB.Word.add({
        textID: '29325ea2-af37-4ca7-9afa-b84bad8c77fe',
        word: 'Hello'
    })
    expect(data.status).toBe(false)
})
