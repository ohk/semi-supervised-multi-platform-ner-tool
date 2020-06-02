const DB = require('../database/index')

test('get last id ', async () => {
    const data = await DB.Train.getLastTrainID()
    expect(data.status).toBe(true)
})

test('Train Excluded Add', async () => {
    const data = await DB.Train.addTrainExcluded({
        key: 'deneme',
        value: 'value'
    })

    expect(data.status).toBe(true)
})

test('Train Excluded Update', async () => {
    const data = await DB.Train.updateTrainExcluded({
        key: 'deneme',
        value: 'helloooooo'
    })

    expect(data.status).toBe(true)
})

test('Train Excluded Get', async () => {
    const data = await DB.Train.getTrainExcluded({ id: 1 })
    expect(data.status).toBe(true)
})

test('Train Excluded Delete', async () => {
    const data = await DB.Train.deleteTrainExcluded({
        key: 'deneme'
    })
    expect(data.status).toBe(true)
})

test('Train Record Add', async () => {
    const data = await DB.Train.addTrainRecord({
        version: '2'
    })

    expect(data.status).toBe(true)
})

test('Train Record Update', async () => {
    const data = await DB.Train.updateTrainRecord({
        version: '2',
        path: 'value'
    })

    expect(data.status).toBe(true)
})

test('Train Record Get', async () => {
    const data = await DB.Train.getTrainRecord()
    expect(data.status).toBe(true)
})

test('Train Record Delete', async () => {
    r = await DB.Train.getLastTrainID()
    const data = await DB.Train.deleteTrainRecord({
        recordid: r.data
    })
    expect(data.status).toBe(true)
})
