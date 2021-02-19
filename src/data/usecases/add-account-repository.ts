import { AccountModel } from "../../domain/model/account-model";
import { AddAccountModel } from "../../domain/use-cases/add-account";

export interface AddAccountRepository {

    add(account : AddAccountModel): Promise<AccountModel>
}