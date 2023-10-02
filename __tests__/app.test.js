const app = require('../app')
const db = require('../db/connection')
const request = require('supertest')
const seed = require ('../db/seeds/seed')

const {articleData,commentData, topicData, userData} = require('../db/data/test-data/index')

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
