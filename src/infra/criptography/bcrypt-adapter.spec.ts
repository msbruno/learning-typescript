import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols/encrypter'
import {BcryptAdapter} from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string>{
        return new Promise(resolve => resolve('hash'))
    }
}))


const makeSut = (): Encrypter => {
    const sut = new BcryptAdapter(12)
    return sut
}

describe('Bcrypt Adapter tests', () => {

    test('Should call bcrypt with correct value', async ()=> {
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', 12)

    })

    test('Should call bcrypt with correct value', async ()=> {
        const sut = makeSut()
        const encryptedValue = await sut.encrypt('any_value')
        expect(encryptedValue).toBe('hash')

    })

    test('Should throw if bcrypt throws', async() => {
        jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject)=> reject(new Error('mocked_error'))))
        const sut = makeSut()
        const promise = sut.encrypt('any_value')
        expect(promise).rejects.toBe(new Error('mocked_error'))

    })


})