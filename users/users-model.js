const db = require('../database/dbConfig.js')

module.exports = {
  add,
  find,
  findBy,
  findById,
}

function find() {
  return db('users').select('id', 'username').orderBy('id')
}

function findBy(filter) {
  return db('users').where(filter).orderBy('id')
}

// for the admin post only

// function find() {
//   return db("users as u")
//     .join("roles as r", "u.role", "r.id")
//     .select("u.id", "u.username", "r.name as role")
//     .orderBy("u.id");
// }

// function findBy(filter) {
//   console.log("filter", filter);
//   return db("users as u")
//     .join("roles as r", "u.role", "r.id")
//     .where(filter)
//     .select("u.id", "u.username", "r.name as role", "u.password")
//     .orderBy("u.id");
// }

async function add(user) {
  try {
    const [id] = await db('users').insert(user, 'id')

    return findById(id)
  } catch (error) {
    throw error
  }
}

function findById(id) {
  return db('users').where({ id }).first()
}
