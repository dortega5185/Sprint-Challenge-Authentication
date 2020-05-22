const supertest = require('supertest')

const server = require('./server')

describe('server', () => {
  describe('can run the tests', () => {
    expect(true).toBeTruthy()
  })
})

describe('GET /', () => {
  it('should return http status code 200 OK', () => {
    supertest(server)
      .get('/')
      .then((response) => {
        // .expect(200) from supertest
        // from jest
        expect(response.status).toBe(200)
      })
  })
})
