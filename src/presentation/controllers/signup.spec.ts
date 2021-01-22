import { SignUpController} from './signup'
import {HttpResponse} from '../protocols/http'
import {MissingParamError} from '../errors/missing-param-error'
import {EmailValidator} from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator
}


const makeSut = (): SutTypes => {

    class EmailValidatorStub implements EmailValidator {
        isValid(email: String): Boolean {
            return true;
        }
    }

    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    return {
        sut,
        emailValidatorStub
    }
}


describe("SignUp Controller", ()=> {

    test("Should return 4-- if no name is provided", () => {

        //sut = system under test.
        const {sut} = makeSut()
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
        const {sut} = makeSut()
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

    test("Should return 400 if an invalid email is provided", () => {

        //sut = system under test.
        const {sut, emailValidatorStub} = makeSut()
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
        isValidSpy.mockReturnValueOnce(false)

        const httpRequest = {
            body : {
                name: 'teste',
                email:'email..',
                password: 'password',
            }
        }
        const httpResponse : HttpResponse = sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
        expect(isValidSpy).toHaveBeenCalledWith('email..')
    })
})