const router = require('express').Router()

const Users = require('./users-model.js')
const authenticate = require('../auth/authenticate-middleware.js')
const { isValid } = require('./users-service.js')

router.get('/', authenticate, (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json({ users, jwt: req.jwt })
    })
    .catch((err) => res.send(err))
})

router.post('/', authenticate, (req, res) => {
  const user = req.body

  if (isValid(user)) {
    Users.add(user)
      .then((saved) => {
        res.status(201).json({ data: saved })
      })
      .catch((error) => {
        res.status(500).json({ message: error.message })
      })
  } else {
    res.status(400).json({ message: 'please provide all user information' })
  }
})

module.exports = router
