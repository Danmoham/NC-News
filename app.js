const express = require('express')
const {getAllTopics, getAllApi, getArticleByArticleId, getAllArticles} = require('./controllers/controllers')

const app = express()

app.get('/api/topics',getAllTopics)
app.get('/api', getAllApi)
app.get('/api/articles/:article_id',getArticleByArticleId)
app.get('/api/articles',getAllArticles)


app.all('/*',(request, response) =>{
    response.status(404).send({ msg: 'URL does not exist'})
  })
  app.use((err, req, res, next) => {
    if (err.code === '22P02'){
     res.status(400).send({msg : 'URL does not exist, the key you gave is not a number - Bad Request!'})
    } else if (err.status) {
      res.status(err.status).send({ msg: err.message });
    } 
    else {
      res.status(500).send({ message: 'Internal server error' });
    }
  });
 
module.exports = app;