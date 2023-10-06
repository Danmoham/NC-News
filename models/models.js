const db = require('../db/connection')
const { reject404, reject400 } = require('./myUtils')
exports.fetchAllTopics = () =>{
    return db.query('SELECT * FROM topics')
    .then(({rows}) =>{
        return rows
    })
}
exports.fetchArticlesByTopic = (topic) =>{
    return db.query(`SELECT * FROM topics WHERE slug = $1`,[topic.topic]).then(({rows}) =>{
        if(rows.length === 0){
            return reject404()
        }
        return rows[0]
    })
}
exports.fetchArticleById = (id) =>{
     const checkerId = parseInt(id)
     return db.query(`SELECT articles.author,articles.title,articles.body, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url,CAST(count(comments.article_id)as INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1
    GROUP BY articles.article_id`,[checkerId]).then(({rows}) =>{
        if (rows.length === 0){
            return reject404()
        }
        return rows[0]
    })
  
}

    
exports.fetchAllArticles = (query) =>{
    if ((Object.keys(query).length) === 0){
    return db.query(`SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url,CAST(count(comments.article_id)as INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id ORDER BY articles.created_at DESC`).then(({rows}) =>{
        return rows
    })
    .catch((err) =>{
        console.log(err)
    })
}     
        if (((Object.keys(query)[0]) === "topic") && (Object.keys(query).length === 1)){
            return db.query(`SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url,CAST(count(comments.article_id)as INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE topic = $1 GROUP BY articles.article_id ORDER BY articles.created_at DESC`,[query.topic]).then(({rows}) =>{
                return rows        
            })
            }else if (((Object.keys(query)[0]) === "sort_by" )&& (Object.keys(query).length === 1)){
                return db.query(`SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url,CAST(count(comments.article_id)as INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${query.sort_by} DESC`).then(({rows}) =>{
                    if (rows[0][query.sort_by]){
                    return rows     
                    }   
                })
            }else if ((Object.keys(query)[0]) === "order"){
                const myQuery = query.order.toLowerCase()
                if((myQuery === "asc") || myQuery === "desc"){
                return db.query(`SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url,CAST(count(comments.article_id)as INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at ${myQuery}`,).then(({rows}) =>{
                    return rows    })
                }else{
                    return reject400()}
            }else if (query.sort_by && (Object.keys(query).length === 2)){
                const myQuery = query.order.toLowerCase()
                if ((myQuery === "asc") || (myQuery === "desc")){
                return db.query(`SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url,CAST(count(comments.article_id)as INTEGER) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${query.sort_by} ${myQuery}`).then(({rows}) =>{
                    console.log(rows)
                    return rows
                })
            }else{
                return reject400()
            }
    
            }
                return reject404()}


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
exports.patchVoteCount = (id, increment) =>{
   return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,[increment, id]).then(({rows}) =>{
    if (rows.length === 0){
        return reject404()
    }
    return rows[0]
   })
  
}
exports.removeComment = (id) =>{
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING*',[id]).then(({rows}) =>{
        if (rows.length === 0){
           return reject404()
        }
        return rows[0]
    })
}
exports.fetchAllUsers = () => {
    return db.query('SELECT *FROM users').then(({rows}) =>{
        return rows
    })
}