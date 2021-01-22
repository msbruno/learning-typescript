import { MissingParamError } from '../errors/missing-param-error'
import {HttpResponse, HttpRequest} from '../protocols/http'
import {badRequest} from '../helpers/http-helpers'
import { Controller } from '../protocols/controller'
import {EmailValidator} from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'


export class SignUpController implements Controller {

    private readonly emailValidador : EmailValidator

    constructor(emailValidator: EmailValidator) {
        this.emailValidador = emailValidator
    }

    handle(httpRequest: HttpRequest): HttpResponse {

        for (const field of this.requiredFields()) {
            if (!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }

        const isEmailValid = this.emailValidador.isValid(httpRequest.body.email)
        if(!isEmailValid) {
            return badRequest(new InvalidParamError('email'))
        }
        
    }

    requiredFields() {
        return ['name', 'email', 'password']
    }
}