const server = require('./server')

const request = require('supertest')
const db = require('../database/dbConfig')

beforeEach(() => {
  return db.migrate.rollback().then(() => db.migrate.latest())
  // .then(() => db.seed.run())
})

describe('restrict get users', () => {
  it('get /', async () => {
    const res = await request(server).get('/users')
    expect(res.status).toBe(404)
  })
})

describe('get users, validate user', () => {
  it('get all users', async () => {
    const register = await request(server)
      .post('/api/auth/register')
      .send({ username: 'david', password: 'jesus' })
    const login = await request(server)
      .post('/api/auth/login')
      .send({ username: 'david', password: 'jesus' })
    const res = await request(server)
      .get('/api/users')
      .set('authorization', login.body.token)
    expect(res.body.users).toHaveLength(1)
    console.log(res.body)
    expect(res.body.users[0]).toHaveProperty('id')
    expect(res.body.users[0]).toMatchObject({ id: 1 })
  })
})

describe('test register', () => {
  it('post /api/auth/register to be successful', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ username: 'david', password: 'jesus' })
    expect(res.status).toBe(201)
    expect(res.body.data).toMatchObject({
      username: 'david',
    })
  })
})

it('post /api/auth/register to fail', async () => {
  const res = await request(server)
    .post('/api/auth/register')
    .send({ username: 'david' })
  expect(res.status).toBe(400)
  expect(res.body).toMatchObject({
    message:
      'please provide username and password and the password shoud be alphanumeric',
  })
})

describe('test login post', () => {
  test('post /api/auth/login to be successful', async () => {
    const register = await request(server)
      .post('/api/auth/register')
      .send({ username: 'david', password: 'jesus' })
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: 'david', password: 'jesus' })
    expect(res.type).toBe('application/json')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })
})

test('post /api/auth/login to fail', async () => {
  const register = await request(server)
    .post('/api/auth/register')
    .send({ username: 'david', password: 'jesus' })
  const res = await request(server)
    .post('/api/auth/login')
    .send({ username: 'david', password: 'jesuschrist' })
  expect(res.status).toBe(401)
  expect(res.body).toMatchObject({ message: 'Invalid credentials' })
})

describe('get jokes', () => {
  it('get all jokes as long as you are logged in', async () => {
    return request(server)
      .get('/api/jokes')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoibXVmZmluIiwiaWF0IjoxNTkwMTg0MDY0LCJleHAiOjE1OTAyNzA0NjR9.5vtCjtw2iyzFDFrZCFeXN0ye24yxRz_qfwzW7duWY4o'
      )
      .expect(200)
  })
})

describe('fail to get jokes without auth', () => {
  it('get /api/jokes to fail', async () => {
    const res = await request(server).get('/api/jokes')
    expect(res.status).toBe(401)
  })
})
