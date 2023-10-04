const {fetchAllTopics, fetchArticleById, fetchAllArticles, fetchArticleIdComments} = require('../models/models')
const endPointJson = require('../endpoints.json')
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
    fetchAllArticles().then((article) =>{
        realResponse.status(200).send({article : article})
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
