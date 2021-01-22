import { SignUpController} from './signup'
import {HttpResponse} from '../protocols/http'
import {MissingParamError} from '../errors/missing-param-error'

describe("SignUp Controller", ()=> {

    test("Should return 4-- if no name is provided", () => {

        //sut = system under test.
        const sut = new SignUpController();
        const httpRequest = {
            body : {
                email: 'any@mail.com',
                password: 'password'
            }
        }
        const httpResponse : HttpResponse  = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test("Should return 400 if no email is provided", () => {

        //sut = system under test.
        const sut = new SignUpController();
        const httpRequest = {
            body : {
                name: 'teste',
                password: 'password'
            }
        }
        const httpResponse : HttpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })
})