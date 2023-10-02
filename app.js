const express = require('express')
const seed = require('./db/seeds/seed')
const {getAllTopics, getAllApi, getArticleByArticleId} = require('./controllers/controllers')

const app = express()

app.get('/api/topics',getAllTopics)
app.get('/api', getAllApi)
app.get('/api/articles/:article_id',getArticleByArticleId)


app.all('/*',(request, response) =>{
    response.status(404).send({ msg: 'URL does not exist'})
  })
  app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.message });
    } 
    else {
      res.status(500).send({ message: 'Internal server error' });
    }
  });
 
module.exports = app;