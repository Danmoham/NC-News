const db = require('../db/connection')
exports.fetchAllTopics = () =>{
    return db.query('SELECT * FROM topics')
    .then(({rows}) =>{
        return rows
    })
}
exports.fetchArticleById = (id) =>{
     const checkerId = parseInt(id)
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
exports.fetchAllArticles = () =>{
  
    return db.query(`SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url,CAST( count(articles.article_id)as INTEGER) as comment_count FROM articles RIGHT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`).then(({rows}) =>{
        return rows
    })
}

exports.fetchArticleIdComments = (id) =>{
    return db.query(`Select * From comments WHERE comments.article_id = $1 ORDER BY created_at DESC`,[id]).then(({rows}) =>{
        return rows
    })
}
exports.addCommentsToArticle = (id,comment) =>{
    return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1,$2,$3) RETURNING *`,[id, comment.username, comment.body]).then(({rows}) =>{
        return rows[0]
    })
}