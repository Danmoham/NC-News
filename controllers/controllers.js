const {fetchAllTopics, fetchArticleById, fetchAllArticles, fetchArticleIdComments, addCommentsToArticle, patchVoteCount, removeComment, fetchArticlesByTopic} = require('../models/models')

const endPointJson = require('../endpoints.json')
const { query } = require('../db/connection')
exports.getAllTopics = (realRequest,realResponse,next) =>{
    fetchAllTopics().then((topic) =>{
        realResponse.status(200).send({myTopics : topic})

    })
}
exports.getAllApi = (realRequest,realResponse,next) =>{
        realResponse.status(200).send({endPointJson})
}
exports.getArticleByArticleId = (realRequest,realResponse,next) =>{
    const {params} = realRequest
    fetchArticleById(params.article_id).then((myArticle) =>{
        realResponse.status(200).send({myArticle})
    })
    .catch((err) => {
        next(err)
    })

}
exports.getAllArticles = (realRequest,realResponse,next) =>{
    const {query} = realRequest
    const promises = [fetchAllArticles(query)]
    if(query.topic){
        promises.push(fetchArticlesByTopic(query))
    }
    Promise.all(promises).then((article) =>{
        realResponse.status(200).send({articles : article[0]})
    })
    .catch((err) =>{
        next(err)
    })
}
exports.getArticleIdComments = (realRequest,realResponse,next) =>{
    const {params} = realRequest
    const promises = [fetchArticleById(params.article_id)]
    if (params.article_id){
        promises.push(fetchArticleIdComments(params.article_id))
    } 
    Promise.all(promises) 
    .then((myComments) =>{
    realResponse.status(200).send({myComments: myComments[1]})
    })
    .catch((err) => {
        next(err)
    })
}
exports.postCommentsToArticle = (realRequest,realResponse,next) =>{
    addCommentsToArticle(realRequest.params.article_id,realRequest.body)      
    .then((result) =>{
        realResponse.status(201).send(result)
    })
   .catch((err) =>{
    next(err)
    } ) 

}
exports.patchArticleId = (realRequest,realResponse,next) =>{
    const {params} = realRequest
    patchVoteCount(params.article_id, realRequest.body.inc_votes).then((result) =>{
        realResponse.status(200).send({updatedArticle : result})

    })
    .catch((err) =>{
        next(err)
    })
  
}
exports.deleteComment = (realRequest,realResponse,next) =>{
    const {params} = realRequest
    removeComment(params.comment_id).then((result) =>{
        realResponse.status(204).send()    
    })
    .catch((err) =>{
        next(err)
    })
    
}
exports.getAllUsers = (realRequest,realResponse,next) =>{
    fetchAllUsers().then((users) =>{
        realResponse.status(200).send({myUsers : users})
    })
}

