import { AddAccountRepository } from "../../../../data/usecases/add-account/add-account-repository";
import { AccountModel } from "../../../../domain/model/account-model";
import { AddAccountModel } from "../../../../domain/use-cases/add-account";
import { MongoHelper } from "../helper/mongo-helper";


export class AccountMongoRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const account = result.ops[0]
        const {_id, ...accountWithoutid} = Object.assign({}, account, {id: account._id}) 
        return accountWithoutid
    }
}