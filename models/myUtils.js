exports.reject404 = () =>{
     return Promise.reject ({
        status : 404,
        message : "Key not available"

    })
}