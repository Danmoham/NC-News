const express = require('express')
const seed = require('./db/seeds/seed')
const {getAllTopics} = require('./controllers/controllers')

const app = express()

app.get('/api/topics',getAllTopics)

app.all('/*',(request, response) =>{
    response.status(404).send({ msg: 'URL does not exist'})
  })
module.exports = app;