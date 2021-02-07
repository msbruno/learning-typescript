import {HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount} from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors/'
import {badRequest, serverError, ok} from '../../helpers/http-helpers'

export class SignUpController implements Controller {

    private readonly emailValidador : EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidador = emailValidator
        this.addAccount = addAccount
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            for (const field of this.requiredFields()) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }

            if(!this.isEmailValid(httpRequest.body.email)) {
                return badRequest(new InvalidParamError('email'))
            }

            const account = await this.addAccount.add({
                name:httpRequest.body.name,
                email: httpRequest.body.email,
                password: httpRequest.body.password
            })

            return ok(account)

        } catch(err) {
            return serverError()
        }
    }

    isEmailValid(email: String): Boolean {
        return this.emailValidador.isValid(email)
    }

    requiredFields() {
        return ['name', 'email', 'password']
    }
}