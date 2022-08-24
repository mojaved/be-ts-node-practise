import { IAccount, ISessionToken, ITokenGenerator, TokenRights, TokenState, TokenValidator } from "../Server/Model";
import { logInvocation } from "../Shared/MethodDecorator";
import { SessionTokenDbAccess } from "./SessionTokenDbAccess";
import { UserCredentialDBAccess } from "./UserCredentialDBAccess";

export class Authorizer implements ITokenGenerator, TokenValidator {

    userDbAccess: UserCredentialDBAccess = new UserCredentialDBAccess();
    tokenDbAcc: SessionTokenDbAccess = new SessionTokenDbAccess();
    @logInvocation
    public async generateToken(account: IAccount): Promise<ISessionToken | undefined> {
        const result = await this.userDbAccess.getUserCredentials(account.username, account.password);
        if (result) {
            const token: ISessionToken = {
                accessRights: result.accessRights,
                username: result.username,
                expirationTime: this.generateExpirationTime(),
                tokenId: this.generateAccessToken(),
                valid: true
            }
            await this.tokenDbAcc.storeSessionToken(token);
            return token;
        }
        else {
            return undefined;
        }
    }
    public async validateToken(tokenId: string): Promise<TokenRights> {
        const token = await this.tokenDbAcc.getToken(tokenId);
        if (!token || !token.valid) {
            return {
                accessRights: [],
                state: TokenState.INVALID
            };
        } else if (token.expirationTime < new Date()) {
            return {
                accessRights: [],
                state: TokenState.EXPIRED
            };
        }

        return {
            accessRights: token.accessRights,
            state: TokenState.VALID
        };
    }
    private generateExpirationTime() {
        return new Date(Date.now() + 60 * 60 * 1000);
    }
    private generateAccessToken() {
        return Math.random().toString(36).slice(2);
    }

}