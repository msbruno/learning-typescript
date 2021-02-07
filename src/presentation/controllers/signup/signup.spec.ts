import { SignUpController} from './signup'
import {HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, AccountModel} from './signup-protocols'
import {MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { AddAccountModel } from '../../../domain/use-cases/add-account'


interface SutTypes {
    sut: SignUpController,
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}


const makeSut = (): SutTypes => {

    class AddAccountStub implements AddAccount {
        async add(account : AddAccountModel): Promise<AccountModel>{
            const fakeAccount = {
                name:'valid_name',
                email: 'valid_email@gmail.com',
                password: 'valid_password',
                id:'valid_id'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
        
    }
    
    class EmailValidatorStub implements EmailValidator {
        isValid(email: String): Boolean {
            return true
        }
    }

    const emailValidatorStub = new EmailValidatorStub()
    const addAccount = new AddAccountStub()
    const sut = new SignUpController(emailValidatorStub, addAccount)
    

    return {
        sut,
        emailValidatorStub,
        addAccountStub: addAccount
    }
}


describe("SignUp Controller",  ()=> {

    test("Should return 4-- if no name is provided", async() => {

        //sut = system under test.
        const {sut} = makeSut()
        const httpRequest = {
            body : {
                email: 'any@mail.com',
                password: 'password'
            }
        }
        const httpResponse : HttpResponse  = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test("Should return 400 if no email is provided", async() => {

        //sut = system under test.
        const {sut} = makeSut()
        const httpRequest = {
            body : {
                name: 'teste',
                password: 'password'
            }
        }
        const httpResponse : HttpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test("Should return 400 if an invalid email is provided", async() => {

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
        const httpResponse : HttpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
        expect(isValidSpy).toHaveBeenCalledWith('email..')
    })

    test("Should return 500 if an exception occurs on EmailValidator", async() => {

        class EmailValidatorStub implements EmailValidator {
            isValid(email: String): Boolean {
                throw new Error()
            }
        }
    
        const emailValidatorStub = new EmailValidatorStub()
        const sut = new SignUpController(emailValidatorStub, makeSut()['addAccountStub'])

        
        const httpRequest = {
            body : {
                name: 'teste',
                email:'email..',
                password: 'password',
            }
        }
        const httpResponse : HttpResponse = await sut.handle(httpRequest)
        
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
        
    })

    test('Should call addAccount with correct values', async () => {
        const {sut, addAccountStub: addAccount} = makeSut()
        const addSpy = jest.spyOn(addAccount, 'add')
        
        const request = {
            body: {
                email: 'valid_email@gmail.com',
                name: 'Valid_Name',
                password: 'valid_password'
            }
        }

        const response = await sut.handle(request)
        expect(response.statusCode).toBe(200)
        expect(addSpy).toBeCalledTimes(1)
        expect(response.body).toEqual({
                name:'valid_name',
                email: 'valid_email@gmail.com',
                password: 'valid_password',
                id:'valid_id'
            })
        })
    })