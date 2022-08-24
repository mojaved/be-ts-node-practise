import { IAccount } from "../Server/Model";

export enum AccessRights {
    CREATE,
    READ,
    UPDATE,
    DELETE
}
export interface IUserCredentials extends IAccount {
    accessRights: AccessRights[];
}

export enum HTTP_CODES {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    UNAUTHORIZED = 401
}

export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT',
    OPTIONS = 'OPTIONS'
}

export interface User {
    id: string,
    name: string,
    age: number,
    email: string,
    workingPosition: WorkingPosition
}

export enum WorkingPosition {
    JUNIOR,
    PROGRAMMER,
    SENIOR,
    EXPERT,
    MANAGER
}