import { MissingParamError } from '../errors/missing-param-error'
import {HttpResponse, HttpRequest} from '../protocols/http'
import {badRequest} from '../helpers/http-helpers'

export class SignUpController {
    handle(httpRequest: HttpRequest): HttpResponse {

        for (const field of this.requiredFields()) {
            if (!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }

        return {
            statusCode : 200, 
            body: {}
        }
    }

    requiredFields() {
        return ['name', 'email', 'password']
    }
}