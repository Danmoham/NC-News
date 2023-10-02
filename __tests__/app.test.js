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
