const express = require('express')
const {getAllTopics, patchComment,getAllApi, getArticleByArticleId, getAllArticles, getArticleIdComments,getSpecifcUsername, postCommentsToArticle, patchArticleId, deleteComment, getAllUsers, postArticles} = require('./controllers/controllers')


const app = express()

app.use(express.json())
app.get('/api/topics',getAllTopics)
app.get('/api', getAllApi)
app.get('/api/articles/:article_id',getArticleByArticleId)
app.get('/api/articles',getAllArticles)
app.get('/api/articles/:article_id/comments',getArticleIdComments)
app.post('/api/articles/:article_id/comments',postCommentsToArticle)
app.patch('/api/articles/:article_id',patchArticleId)
app.delete('/api/comments/:comment_id',deleteComment)
app.get('/api/users',getAllUsers)
app.get('/api/users/:username',getSpecifcUsername)
app.patch('/api/comments/:commentid',patchComment)
app.post('/api/articles',postArticles)

app.all('/*',(request, response) =>{
    response.status(404).send({ msg: 'URL does not exist'})
  })

  app.use((err, req, res, next) => {
    if (err.code === '22P02'){
           res.status(400).send({msg : 'The key you gave is not a number - Bad Request!'})
    }else if (err.code === '23503'){
      res.status(404).send({msg: 'Part of your request is invalid'})
    }else if (err.code=== `23502`){
      res.status(400).send({msg : "This is not a key in this table. Bad Request!"})
    }else if (err.code === '42703'){
      res.status(400).send({msg : "Bad Request!"})
  }else if (err.status) {
      res.status(err.status).send({ msg: err.message });
    } 
    else {
      res.status(500).send({ message: 'Internal server error' });
    }
  });
 
module.exports = app;