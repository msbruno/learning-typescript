import { AccountModel } from "../../domain/model/account-model"
import { AddAccountModel } from "../../domain/use-cases/add-account"
import { Encrypter } from "../protocols/encrypter"
import { AddAccountRepository } from "./add-account-repository"
import { DbAddAccount } from "./db-add-account"

interface SubType {
    sut: DbAddAccount,
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
}
const  makeAddAccountRepositoryStub = ():AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(account : AddAccountModel): Promise<AccountModel> {
            const fakeAccount = makeFakeAccount()
            return fakeAccount
        }
    }
    return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => {
    return {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@gmail.com',
        password: 'hashed_password',
    } 
} 

const makeEncrypterStyb = () : Encrypter => {
    class EncrypterStub implements Encrypter { 
        encrypt(value: string):Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    return new EncrypterStub()
}

const makeSut = (): SubType => {

    const addAccountRepository = makeAddAccountRepositoryStub()
    const encrypter = makeEncrypterStyb()
    const sut = new DbAddAccount(encrypter, addAccountRepository)
    
    return {
        sut,
        encrypter,
        addAccountRepository
    }
}


describe('', ()=>{

    test('Should call Encrypter whith correct password.', async ()=> {

        const {encrypter: encrypterStub, sut} = makeSut()
        
        const account = {
            name:'valid name',
            email:'valid_email@gmail.com',
            password: 'valid_password'
        }

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
        await sut.add(account)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
        
    })

    test('Should call Encrypter whith correct password.', async ()=> {

        const {encrypter: encrypterStub, sut} = makeSut()
        
        const account = {
            name:'valid name',
            email:'valid_email@gmail.com',
            password: 'valid_password'
        }

        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            new Promise((resolve, reject)=> reject(new Error('ErroMock')))
        )
        
        const promise = sut.add(account)
        expect(encryptSpy).toHaveBeenCalledWith('valid_password')
        expect(promise).rejects.toThrow()
    })


    test('Should call AddAccountRepository.', async ()=> {

        const {addAccountRepository: addAccountRepositoryStub,   sut} = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

        const account = {
            name:'valid name',
            email:'valid_email@gmail.com',
            password: 'valid_password'
        }

        await sut.add(account)
        expect(addSpy).toHaveBeenCalledWith({
            name:'valid name',
            email:'valid_email@gmail.com',
            password: 'hashed_password'
        })
    })

    test('Should return an account on success.', async ()=> {

        const {sut} = makeSut()
        
        const account = {
            name:'valid name',
            email:'valid_email@gmail.com',
            password: 'valid_password'
        }

        const addedAccount = await sut.add(account)
        expect(addedAccount).toEqual(makeFakeAccount())
    })
    
})