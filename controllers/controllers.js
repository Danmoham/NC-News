const {fetchAllTopics} = require('../models/models')
exports.getAllTopics = (realRequest,realResponse,next) =>{
    fetchAllTopics().then((body) =>{
        realResponse.status(200).send({myTopics : body})

    })
}