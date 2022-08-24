import * as Nedb from 'nedb';
import { ISessionToken } from '../Server/Model';

export class SessionTokenDbAccess {
    nedb: Nedb;
    constructor() {
        this.nedb = new Nedb('database/SessionToken.db');
        this.nedb.loadDatabase();
    }

    public async storeSessionToken(token: ISessionToken): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(token, (err: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            })
        })
    }

    public async getToken(tokenId: string): Promise<ISessionToken | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ tokenId: tokenId }, (err: Error, docs: any[]) => {
                if (err) {
                    reject(err)
                } else {
                    if (docs.length == 0) {
                        resolve(undefined)
                    } else {
                        resolve(docs[0]);
                    }
                }
            })
        });
    }
}