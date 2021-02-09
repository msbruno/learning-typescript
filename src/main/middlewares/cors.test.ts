import request from 'supertest'
import app from '../config/app'

describe('', () => {

    test('Should enable CORS', async() => {

        app.get('/test-cors', (req, res) => {
            res.send(req.body)
        })

        await request(app)
            .get('/test-cors')
            .expect('access-control-allow-origin', '*')
    })
})