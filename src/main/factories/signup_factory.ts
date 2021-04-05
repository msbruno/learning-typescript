import { DbAddAccount } from "../../data/usecases/db-add-account";
import { SignUpController } from "../../presentation/controllers/signup/signup";
import { EmailValidator } from "../../presentation/protocols/email-validator";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";

class EmailValidatorAdapter implements EmailValidator {

    isValid(email: String): Boolean {
        return true
    }

}

export const makeSignupController =(): SignUpController => {
    const salt = 12
    const encrypter = new BcryptAdapter(salt)
    const accountRepository = new AccountMongoRepository()
    const dbAddAccount = new DbAddAccount(encrypter, accountRepository)
    const emailValidator = new EmailValidatorAdapter()
    return new SignUpController(emailValidator, dbAddAccount)

}