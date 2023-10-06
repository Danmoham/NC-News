exports.reject404 = () =>{
     return Promise.reject ({
        status : 404,
        message : "Key not available"

    })
    
}
exports.reject400 = () =>{
    return Promise.reject ({
        status : 400,
        message : "Bad Request!"

    })
}
