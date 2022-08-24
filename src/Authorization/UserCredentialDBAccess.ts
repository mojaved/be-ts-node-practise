import { IUserCredentials } from "../Shared/Model";
import * as Nedb from 'nedb';
import { delayResponse } from "../Shared/MethodDecorator";
export class UserCredentialDBAccess {
    nedb: Nedb;
    constructor() {
        this.nedb = new Nedb('database/UserCredentials.db');
        this.nedb.loadDatabase();
    }
    public async putUserCredentials(uc: IUserCredentials): Promise<any> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(uc, (err: any, docs: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            })
        })
    }
    // @delayResponse(5000)
    public async getUserCredentials(username: string, password: string): Promise<IUserCredentials | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ username: username, password: password }, (err: any, docs: IUserCredentials[]) => {
                if (err) {
                    reject(err);
                } else {
                    if (docs.length === 0) {
                        resolve(undefined);
                    } else {
                        console.log('method finished');
                        resolve(docs[0]);
                    }
                }
            })
        })
    }
}