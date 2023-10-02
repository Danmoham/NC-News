const db = require('../db/connection')
exports.fetchAllTopics = () =>{
    return db.query('SELECT * FROM topics')
    .then(({rows}) =>{
        return rows
    })
}
exports.fetchArticleById = (id) =>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[id])
    .then(({rows}) =>{
        if (rows.length === 0){
            return Promise.reject ({
                status : 400,
                message : "Bad request"

            })
        }
        return rows[0]
    })
}
