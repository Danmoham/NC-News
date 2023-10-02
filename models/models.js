const db = require('../db/connection')
exports.fetchAllTopics = () =>{
    return db.query('SELECT * FROM topics')
    .then(({rows}) =>{
        return rows
    })
}
exports.fetchArticleById = (id) =>{
     const checkerId = parseInt(id)
    /*if (isNaN(checkerId)){
        return Promise.reject ({
            status : 400,
            message : "URL does not exist, the key you gave is not a number - Bad Request!"

        })
    }else */
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[id])
    .then(({rows}) =>{
        if (rows.length === 0){
            return Promise.reject ({
                status : 404,
                message : "Key not available"

            })
        }
        return rows[0]
    })
  
}


