import { AddAccountRepository } from './add-account-repository';
import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './bd-add-account-protocols';

export class DbAddAccount implements AddAccount {

    private readonly encrypter: Encrypter
    private readonly addAccountRepository: AddAccountRepository

    constructor(encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
        this.encrypter = encrypter
        this.addAccountRepository = addAccountRepository
    } 

    async add(account: AddAccountModel): Promise<AccountModel> {
        const hashed_password = await this.encrypter.encrypt(account.password) 
        await this.addAccountRepository.add(Object.assign({}, account, {password: hashed_password}) )
        return new Promise(resolve => resolve(null))
    }

}