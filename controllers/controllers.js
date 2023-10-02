const {fetchAllTopics, fetchArticleById} = require('../models/models')
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
