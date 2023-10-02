const express = require('express')
const seed = require('./db/seeds/seed')
const {getAllTopics, getAllApi} = require('./controllers/controllers')

const app = express()

app.get('/api/topics',getAllTopics)
app.get('/api', getAllApi)

app.all('/*',(request, response) =>{
    response.status(404).send({ msg: 'URL does not exist'})
  })
module.exports = app;