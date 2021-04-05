import {Router} from 'express'
import { makeSignupController } from '../factories/signup_factory'
import { adaptRoute } from '../route-adapter'

export default (router: Router): void => {
    router.post('/signup', adaptRoute(makeSignupController()))
}