import { AddAccountModel } from "../../../../domain/use-cases/add-account"
import { MongoHelper } from "../helper/mongo-helper";
import {AccountMongoRepository} from "./account"

describe('Account Mongo Repository', ()=> {
    
    beforeAll( async ()=>{
        await MongoHelper.connect(process.env.MONGO_URL)
        console.log(process.env.MONGO_URL)
    })

    afterAll(async ()=>{
        await MongoHelper.disconnect();
    })

    test('Should return an account on success', async()=> {

        const sut = new AccountMongoRepository()
        const includedAccount = await sut.add(validAccount())
        expect(includedAccount).toBeTruthy()
        expect(includedAccount.id).toBeTruthy()
        expect(includedAccount.email).toEqual(validAccount().email)
        expect(includedAccount.name).toEqual(validAccount().name)
        expect(includedAccount.password).toEqual(validAccount().password)
    })
})

const validAccount = (): AddAccountModel => {
    return {
        name: 'valid_name',
        email:'valid_email',
        password: 'valid_password'
    }
}