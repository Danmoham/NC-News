const {fetchAllTopics} = require('../models/models')
exports.getAllTopics = (realRequest,realResponse,next) =>{
    fetchAllTopics().then((topic) =>{
        realResponse.status(200).send({myTopics : topic})

    })
}