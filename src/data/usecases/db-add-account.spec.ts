import { Encrypter } from "../protocols/encrypter"
import { DbAddAccount } from "./db-add-account"

interface SubType {
    sut: DbAddAccount,
    encrypter: Encrypter
}

const makeSut = (): SubType => {

    class EncrypterStub implements Encrypter { 
        encrypt(value: string):Promise<string> {
            return new Promise(resolve => resolve(''))
        }
    }

    const encrypter = new EncrypterStub()
    const sut = new DbAddAccount(encrypter)

    return {
        sut,
        encrypter
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
})