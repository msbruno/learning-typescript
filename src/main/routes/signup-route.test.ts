import request from 'supertest'
import app from "../config/app";

describe('SignUp routes', () => {

    test('Should return 200 on route post', async() => {
        await 
            request(app)
            .post('/api/signup')
            .send({
                name: 'aaavalid_name',
                email: 'aavalid_email@gmail.com',
                password: '11112345'
            })
            .expect(200)
    })

})
