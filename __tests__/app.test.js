const app = require('../app')
const db = require('../db/connection')
const request = require('supertest')
const seed = require ('../db/seeds/seed')

const {articleData,commentData, topicData, userData} = require('../db/data/test-data/index')
const articles = require('../db/data/test-data/articles')

beforeEach(() =>{
    return seed({topicData, userData, articleData, commentData})
})
afterAll(() =>{
    db.end()
})

describe('Endpoint for api/topics',() =>{
    test('Test that it returns an okay 200 message',() =>{
        return request(app)
        .get('/api/topics')
        .expect(200)
    })
    test('Expect Test to return an array of topic objects that have slug and descirption keys',() =>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) =>{
            expect(body.myTopics).toHaveLength(3)
            body.myTopics.forEach((topic) =>{
            expect(typeof (topic.description)).toBe('string')
            expect(typeof(topic.slug)).toBe("string")
            })
        })
    })
    test('test the outcomes come back as expected',() =>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) =>{
            expect(body.myTopics).toHaveLength(3)
        expect(body.myTopics[0].slug).toBe('mitch')
        expect(body.myTopics[0].description).toBe('The man, the Mitch, the legend')
    })
    
})
})

describe('Testing general errors',() =>{
    test('Testing a 404 error returns the error expected',() =>{
    return request(app)
    .get('/api/notTopics')
    .expect(404)
    .then((response) =>{
        expect(response.body.msg).toBe('URL does not exist');
    })
})
    })

describe('Testing for All Api list',() =>{
    test('Expect to return a status of 200 when ran correctly',() =>{
        return request(app)
        .get('/api')
        .expect(200)
    })
    test('Expect to return an object',() =>{
        return request(app)
        .get('/api')
        .expect(200)    
        .then(({body}) =>{
            expect(typeof({body})).toBe('object')
        })
    })
    test('expect to be able to access the example responses in the array and the queries ',() =>{
        return request(app)
        .get('/api')
        .expect(200)    
        .then(({body}) =>{
            expect(body.endPointJson['GET /api/articles'].exampleResponse).toEqual({
                "articles": [
                  {
                    "title": "Seafood substitutions are increasing",
                    "topic": "cooking",
                    "author": "weegembump",
                    "body": "Text from the article..",
                    "created_at": "2018-05-30T15:59:13.341Z",
                    "votes": 0,
                    "comment_count": 6
                  }
                ]
              })

              expect(body.endPointJson['GET /api/articles'].queries).toEqual(["author", "topic", "sort_by", "order"])

              expect(body.endPointJson['GET /api'].description).toBe('serves up a json representation of all the available endpoints of the api')
        })
    })
})

describe('Checks for valid ID returns the correct Article', () =>{
    test('Tests that correct ID returns a Article',() =>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) =>{
            expect(typeof (body.myArticle.article_id)).toBe('number')
            expect(typeof (body.myArticle.title)).toBe('string')
            expect(typeof(body.myArticle.topic)).toBe("string")
            expect(typeof(body.myArticle.body)).toBe('string')
            expect(typeof(body.myArticle.created_at)).toBe('string')
            expect(typeof(body.myArticle.votes)).toBe('number')
            expect(typeof(body.myArticle.article_img_url)).toBe('string')
            expect((body.myArticle.article_id)).toBe(1)
            expect((body.myArticle.topic)).toBe("mitch")
            expect((body.myArticle.title)).toBe('Living in the shadow of a great man')
            expect((body.myArticle.created_at)).toBe('2020-07-09T20:11:00.000Z')
            expect((body.myArticle.votes)).toBe(100)
            expect((body.myArticle.article_img_url)).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
    test('Tests for bad request if invalid response given',() =>{
        return request(app)
        .get('/api/articles/giwigd')
        .expect(400).then((response) =>{
            expect(response.body.msg).toBe('The key you gave is not a number - Bad Request!')
        })
    })
    test('Tests for invalid input',() =>{
        return request(app).get('/api/articles/7399')
        .expect(404).then((response) =>{
            expect(response.body.msg).toBe('Key not available')
        })
    })

})
describe('Checks all Articles for the NC news',() =>{
    test('Testing it returns all articles with the following properties author title, article_id, topic,created_at,votes, article_img_url, comment_count',() =>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) =>{
            body.articles.forEach((articles) =>{
                expect(body.articles.length).toBe(13)
                expect(typeof(articles.title)).toBe('string')
                expect(typeof(articles.author)).toBe('string')
                expect(typeof(articles.article_id)).toBe('number')
                expect(typeof(articles.created_at)).toBe('string')
                expect(typeof(articles.votes)).toBe('number')
                expect(typeof(articles.topic)).toBe('string')
                expect(typeof(articles.article_img_url)).toBe('string')
                expect(typeof(articles.comment_count)).toBe('number')
            })
        })
    })
    test('Testing specific comments are correct and the by order works',() =>{
        return request(app)
        .get('/api/articles')
        .then(({body}) =>{
            expect(body.articles).toBeSortedBy('created_at', { descending : true})
            const myArticles = body.articles
            for (let i = 0; i < myArticles.length;i++){
                if (myArticles[i].article_id === 5){
                    expect(myArticles[i].comment_count === 2)
                }else if (myArticles[i].article_id === 6){
                    expect(myArticles[i].comment_count === 1)
                }else if (myArticles[i].article_id === 4){
                    expect(myArticles[i].comment_count === 0)
                }
            }
        })
    })
    

})

describe('checks specific articles comments',() =>{
    test('Response with correct comments',() =>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) =>{
            expect(body.myComments.length).toBe(11)
            expect(body.myComments).toBeSortedBy('created_at', { descending : true})
        body.myComments.forEach((comment) =>{
            expect(typeof(comment.comment_id)).toBe('number')
            expect(typeof(comment.body)).toBe('string')
            expect(typeof(comment.article_id)).toBe('number')
            expect(typeof(comment.author)).toBe('string')
            expect(typeof(comment.votes)).toBe('number')
            expect(typeof(comment.created_at)).toBe('string')
        })
        })
       
    })
    test('Expect bad request to return error status',() =>{
        return request(app)
        .get('/api/articles/NaN/comments')
        .expect(400).then((response) =>{
            expect(response.body.msg).toBe('The key you gave is not a number - Bad Request!')
        })
    })
    test('Expect 200 for no comments',() =>{
        return request(app)
        .get('/api/articles/4/comments')
        .expect(200).then((response) =>{
            expect(response.body.myComments).toEqual([])
        })
    })
    test('expect 404 error for an id that does not exist',() =>{
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404).then((response) =>{
            expect(response.body.msg).toBe('Key not available')})
    })
})

describe('posting a new comment to a specific article',() =>{
    test('testing it returns a 201 status',() =>{
        const myPost = {
            username : "butter_bridge",
            body : "Great article"
        }
        return request(app)
        .post('/api/articles/4/comments').send(myPost)
        .expect(201)
        .then((result) =>{
            expect(result.body.comment_id).toBe(19)
            expect(result.body.body).toBe('Great article')
            expect(result.body.article_id).toBe(4)
            expect(result.body.author).toBe('butter_bridge')
            expect(result.body.votes).toBe(0)
            expect(typeof(result._body.created_at)).toBe('string')
        })
    })
    test('Test for username who does not exist',() =>{
        const myPost = {
            username : "dan",
            body : "Great article"
        }
        return request(app)
        .post('/api/articles/4/comments').send(myPost)
        .expect(404).then((response) =>{
        expect(response.body.msg).toBe('Part of your request is invalid')
    })
    })
    test('Tests for an invalid id',() =>{
        const myPost = {
            username : "butter_bridge",
            body : "Great article"
        }
        return request(app)
        .post('/api/articles/bvifb/comments').send(myPost)
        .expect(400).then((response) =>{
            expect(response.body.msg).toBe('The key you gave is not a number - Bad Request!')
        })
    })
    test('Tests for an article not existing',() =>{
        const myPost = {
            username : "butter_bridge",
            body : "Great article"
        }
        return request(app)
        .post('/api/articles/9999/comments').send(myPost)
        .expect(404).then((response) =>{
            expect(response.body.msg).toBe('Part of your request is invalid')})
    })
    })
    
describe('Patching an article id',() =>{
test('Test an article returns updated with status 200 code',() =>{
    const voteUpdate = {
        inc_votes : 2
    }
   return request(app).patch('/api/articles/1')
   .send(voteUpdate)
   .expect(200)
   .then (({body}) => {
    expect(body.updatedArticle).toMatchObject({
        article_id : 1,
        topic : "mitch",
        votes : 102
    })
})
})
test('Testing article without a votes status already on it',() =>{
    const voteUpdate = {
        inc_votes : 2
    }
   return request(app).patch('/api/articles/2')
   .send(voteUpdate)
   .expect(200)
   .then (({body}) => {
    expect(body.updatedArticle).toMatchObject({
        article_id : 2,
        votes :2 
    })
}) 
})
test('Testing for invalid votes key',() =>{
    const voteUpdate = {
        inc_votes : "hi"
    }
   return request(app).patch('/api/articles/2')
   .send(voteUpdate)
   .expect(400)
   .then ((response) => {
    expect(response.body.msg).toBe("The key you gave is not a number - Bad Request!")
   
})
   })
test('Testing for 404 error',() =>{
    const voteUpdate = {
        inc_votes : 2
    }
   return request(app).patch('/api/articles/898937')
   .send(voteUpdate)
   .expect(404)
   .then ((response) => {
    expect(response.body.msg).toBe("Key not available")
   
})
})
test('Test for invalid ID',() =>{
    const voteUpdate = {
        inc_votes : 2
    }
   return request(app).patch('/api/articles/addd')
   .send(voteUpdate)
   .expect(400)
   .then ((response) => {
    expect(response.body.msg).toBe("The key you gave is not a number - Bad Request!")
})
})
})

describe('Deleting a comment',() =>{
    test('testing if deletes a comment that is valid',() =>{

 return request(app)
    .delete(`/api/comments/1`)
    .expect(204)
    .then(() =>{
     return request(app)
     .get('/api/comments/1')
     .expect(404)
     
    })
    })
    test('testing if comment not valid will return an error',() =>{
        return request(app)
        .delete(`/api/comments/1997464`)
        .expect(404).then((response) =>{
            expect(response.body.msg).toBe('Key not available')
        })
    }) 
    test('testing if deletes a comment that is valid',() =>{

        return request(app)
           .delete(`/api/comments/hhuiii`)
           .expect(400).then((response)=>{
            expect(response.body.msg).toBe("The key you gave is not a number - Bad Request!")
           })    })
          
        })

describe('Handling article query topic',() =>{
    test('expects to return queries with all specific topics',() =>{
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) =>{
            expect(body.articles.length).toBe(12)
            body.articles.forEach((articles) =>{
                expect(typeof(articles.title)).toBe('string')
                expect(typeof(articles.author)).toBe('string')
                expect(typeof(articles.article_id)).toBe('number')
                expect(typeof(articles.created_at)).toBe('string')
                expect(typeof(articles.votes)).toBe('number')
                expect(typeof(articles.topic)).toBe('string')
                expect(typeof(articles.article_img_url)).toBe('string')
                expect(typeof(articles.comment_count)).toBe('number')
            })
               
        })
    })
   
    test('Expects queries that are not current queries to be a 404 error',() =>{
        return request(app)
        .get('/api/articles?lol=dan')
        .expect(404).then((response) =>{
            expect(response.body.msg).toBe("Key not available")
        })
    })
    test('Test for 404 error with a topic that is undefined',() =>{
        return request(app)
        .get('/api/articles?topic=dan')
            .expect(404).then((response) =>{
                expect(response.body.msg).toBe("Key not available")
            })
    })
    test('Test for 200 error with a topic that is undefined',() =>{
        return request(app)
        .get('/api/articles?topic=paper')
            .expect(200).then((response) =>{
                expect(response.body.articles).toEqual([])
    })
})
})
describe('Getting Api/users',() =>{
    test('Expects 200 with all users',() =>{
    return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) =>{
            expect(body.myUsers.length).toBe(4)
            body.myUsers.forEach((user) =>{
                expect(typeof (user.username)).toBe('string')
                expect(typeof (user.name)).toBe('string')
                expect(typeof (user.avatar_url)).toBe('string')
                
            })
            expect(body.myUsers[0].username).toBe('butter_bridge')
                expect(body.myUsers[0].name).toBe('jonny')
                expect(body.myUsers[0].avatar_url).toBe('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')
        })
    })
})

describe('Adding comment count to article ID',() =>{
    test('testing that it returns a comment count',() =>{
    return request(app)
    .get('/api/articles/1')
    .expect(200)
    .then(({body}) =>{
        expect(typeof(body.myArticle.comment_count)).toBe('number')
        expect(body.myArticle.comment_count).toBe(11)

    })
    })
    test('test it will return a comment count when 0',() =>{
        return request(app)
    .get('/api/articles/4')
    .expect(200)
    .then(({body}) =>{
        expect(typeof(body.myArticle.comment_count)).toBe('number')
        expect(body.myArticle.comment_count).toBe(0)

    })
    })
    
})
describe('Task 15 sort by and order by queries',() =>{
        test('testing a 200 if using sort by',() =>{
            return request(app)
            .get('/api/articles?sort_by=comment_count')
            .expect(200)
            .then(({body}) =>{
                expect(body.articles[0].comment_count).toBe(11)
                expect(body.articles[5].comment_count).toBe(0)

            })
        })
        test('Testing a 200 using a order by ASC',() =>{
            return request(app)
            .get('/api/articles?order=ASC')
                .expect(200)
                .then(({body}) =>{
                    expect(body.articles[0].created_at).toBe('2020-01-07T14:08:00.000Z')
                    expect(body.articles[body.articles.length-1].created_at).toBe('2020-11-03T09:12:00.000Z')
                })
            
        })
        test('testing a 200 using sort by article id',() =>{
            return request(app)
            .get('/api/articles?sort_by=article_id')
                .expect(200)
                .then(({body}) =>{
                    expect(body.articles).toBeSortedBy(body.articles.article_id)
                    expect(body.articles[0].article_id).toBe(13)
                    expect(body.articles[body.articles.length-1].article_id).toBe(1)
        })
    }) 
        test('testing a 200 by DESC',() =>{
            return request(app)
            .get('/api/articles?order=desc')
            .expect(200)
            .then(({body}) =>{
                expect(body.articles[body.articles.length-1].created_at).toBe('2020-01-07T14:08:00.000Z')
                expect(body.articles[0].created_at).toBe('2020-11-03T09:12:00.000Z')
            })
        })
        test('Expect Sort by invalid to return 400',() =>{
            return request(app)
            .get('/api/articles?sort_by=lol')
            .expect(400)
            .then((response) =>{
                expect(response.body.msg).toBe("Bad Request!")

            })
        })
         test('Expect order invalid to return 400',() =>{
            return request(app)
            .get('/api/articles?order=nothing')
            .expect(400)
            .then((response) =>{
                expect(response.body.msg).toBe("Bad Request!")

            })
        })
})