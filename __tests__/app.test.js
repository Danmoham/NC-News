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
            expect(response.body.msg).toBe('URL does not exist, the key you gave is not a number - Bad Request!')
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
            console.log(body.articles)
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