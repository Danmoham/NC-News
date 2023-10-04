const express = require('express')
const seed = require('./db/seeds/seed')
const {getAllTopics, getAllApi, getArticleByArticleId, getAllArticles, getArticleIdComments, postCommentsToArticle, patchArticleId} = require('./controllers/controllers')


const app = express()

app.use(express.json())
app.get('/api/topics',getAllTopics)
app.get('/api', getAllApi)
app.get('/api/articles/:article_id',getArticleByArticleId)
app.get('/api/articles',getAllArticles)
app.get('/api/articles/:article_id/comments',getArticleIdComments)
app.post('/api/articles/:article_id/comments',postCommentsToArticle)
app.patch('/api/articles/:article_id',patchArticleId)


app.all('/*',(request, response) =>{
    response.status(404).send({ msg: 'URL does not exist'})
  })
  app.use((err, req, res, next) => {
    if (err.code === '22P02'){
           res.status(400).send({msg : 'The key you gave is not a number - Bad Request!'})
    }else if (err.code === '23503'){
      res.status(404).send({msg: 'Part of your request is invalid'})
  }else if (err.status) {
      res.status(err.status).send({ msg: err.message });
    } 
    else {
      res.status(500).send({ message: 'Internal server error' });
    }
  });
 
module.exports = app;