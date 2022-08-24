import { AccessRights } from "../Shared/Model";

export interface IAccount {
    username: string;
    password: string;
}
export interface ISessionToken {
    tokenId: string;
    username: string;
    valid: boolean;
    expirationTime: Date;
    accessRights: AccessRights[]
}

export interface ITokenGenerator {
    generateToken(account: IAccount): Promise<ISessionToken | undefined>
}

export enum TokenState {
    VALID,
    INVALID,
    EXPIRED
}

export interface TokenRights {
    accessRights: AccessRights[],
    state: TokenState
}

export interface TokenValidator {
    validateToken(tokenId: string): Promise<TokenRights>
}