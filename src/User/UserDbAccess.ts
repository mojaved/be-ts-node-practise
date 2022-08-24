import { IUserCredentials, User } from "../Shared/Model";
import * as Nedb from 'nedb';
export class UserDbAccess {
    nedb: Nedb;
    constructor() {
        this.nedb = new Nedb('database/Users.db');
        this.nedb.loadDatabase();
    }

    public async putUser(user: User): Promise<any> {
        if (!user.id) {
            user.id = Math.random().toString(36).slice(2);
        }
        return new Promise((resolve, reject) => {
            this.nedb.insert(user, (err: any, docs: any) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            })
        })
    }

    public async getUsers(): Promise<User[] | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({}, (err: any, docs: any) => {
                if (err) {
                    reject(err);
                }

                if (docs && docs.length > 0) {
                    resolve(docs);
                }
                else {
                    resolve(undefined);
                }
            })
        })
    }

    public async getUserById(id: string): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ id: id }, (err: any, docs: any) => {
                if (err) {
                    reject(err);
                }

                if (docs.length == 0) {
                    resolve(undefined);
                }
                else {
                    resolve(docs[0]);
                }
            })
        })
    }

    public async getUserByName(name: string): Promise<User[] | undefined> {
        const regExp = new RegExp(name);
        let query: any = {};
        if (name) {
            query = { name: regExp }
        }
        return new Promise((resolve, reject) => {
            this.nedb.find(query, (err: any, docs: any) => {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            })
        })
    }

    public async deleteUser(id: string): Promise<boolean> {
        const deleteSuccess = await this.deleteUserFromDb(id);
        this.nedb.loadDatabase();
        return deleteSuccess;
    }
    public async deleteUserFromDb(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.nedb.remove({ id: id }, (err: any, numRemoved: number) => {
                if (err) {
                    reject(err);
                }

                if (numRemoved == 0) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            })
        })
    }
}