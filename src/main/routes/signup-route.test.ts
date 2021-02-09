import request from 'supertest'
import app from "../config/app";

describe('SignUp routes', () => {

    test('Should return 200 on route post', async() => {
        await 
            request(app)
            .post('/api/signup')
            .send({
                name: 'valid_name',
                email: 'valid_email@gmail.com',
                password: '12345'
            })
            .expect(200)
    })

})
