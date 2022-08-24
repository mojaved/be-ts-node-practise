import { IncomingMessage, ServerResponse } from "http";
import { AccessRights, HTTP_CODES, HTTP_METHODS, User } from "../Shared/Model";
import { UserDbAccess } from "../User/UserDbAccess";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { IAccount, ITokenGenerator, TokenValidator } from "./Model";
import { Utils } from "./Utils";
type ErrorWithMessage = {
    message: string
}
export class UserHandler extends BaseRequestHandler {

    private userDbAccess: UserDbAccess = new UserDbAccess();
    private tokenValidtor: TokenValidator;
    constructor(tokenValidtor: TokenValidator, req?: IncomingMessage, res?: ServerResponse) {
        super({} as any, {} as any);
        this.tokenValidtor = tokenValidtor;
    }
    isErrorWithMessage(error: unknown): error is ErrorWithMessage {
        return (
            typeof error === 'object' &&
            error !== null &&
            'message' in error &&
            typeof (error as Record<string, unknown>).message === 'string'
        )
    }
    toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
        if (this.isErrorWithMessage(maybeError)) return maybeError

        try {
            return new Error(JSON.stringify(maybeError))
        } catch {
            // fallback in case there's an error stringifying the maybeError
            // like with circular references for example.
            return new Error(String(maybeError))
        }
    }
    public async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.OPTIONS:
                await this.res.writeHead(HTTP_CODES.OK);
                break;
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;
            case HTTP_METHODS.PUT:
                await this.handlePut();
                break;
            case HTTP_METHODS.DELETE:
                await this.handleDelete();
                break;
            default:
                this.handleNotFound();
                break;
        }
    }

    private async handleGet(): Promise<any> {
        try {
            const isAuthorized = await this.operationAuthorized(AccessRights.READ);
            if (isAuthorized) {
                const parsedUri = Utils.getUrlParameters(this.req.url);
                if (parsedUri) {
                    if (parsedUri.query.id) {
                        const user = await this.userDbAccess.getUserById(parsedUri.query.id as string);
                        if (user) {
                            this.respondJsonObject(HTTP_CODES.OK, user);
                        } else {
                            this.handleNotFound();
                        }
                    } else if (parsedUri.query.name) {
                        const users = await this.userDbAccess.getUserByName(parsedUri.query.name as string);
                        if (users) {
                            this.respondJsonObject(HTTP_CODES.OK, users);
                        } else {
                            this.handleNotFound();
                        }
                    } else {
                        const users = await this.userDbAccess.getUserByName('');
                        if (users) {
                            this.respondJsonObject(HTTP_CODES.OK, users);
                        } else {
                            this.handleNotFound();
                        }
                    }
                }
            }
            else {
                this.respondUnAuthorized('missing or invalid authentication');
            }
        } catch (error: unknown) {
            this.res.write(this.toErrorWithMessage(error).message);
        }

    }

    private async handlePut(): Promise<any> {
        const isAuthorized = await this.operationAuthorized(AccessRights.CREATE);
        if (isAuthorized) {
            try {
                const user: User = await this.getRequestBody();
                await this.userDbAccess.putUser(user);
                this.respondText(HTTP_CODES.CREATED,
                    `user ${user.name} created`);
            } catch (error: any) {
                this.respondBadRequest(error.message);
            }
        } else {
            this.respondUnAuthorized('missing or invalid authentication');
        }
    }

    private async handleDelete(): Promise<any> {
        const isAuthorized = await this.operationAuthorized(AccessRights.DELETE);
        if (isAuthorized) {
            const parsedUri = Utils.getUrlParameters(this.req.url);
            if (parsedUri) {
                if (parsedUri.query.id) {
                    const deleteResult = await this.userDbAccess.deleteUser(parsedUri.query.id as string);
                    if (deleteResult) {
                        this.respondText(HTTP_CODES.OK, `user ${parsedUri.query.id} deleted`);
                    } else {
                        this.respondText(HTTP_CODES.OK, `user ${parsedUri.query.id} was not found`);
                    }
                } else {
                    this.respondBadRequest('Missing id in the request');
                }
            }
        } else {
            this.respondUnAuthorized('missing or invalid authentication');
        }
    }

    public async operationAuthorized(op: AccessRights): Promise<boolean> {
        const tokenId = this.req.headers.authorization;
        if (tokenId) {
            const tokenRights = await this.tokenValidtor.validateToken(tokenId);
            if (tokenRights && tokenRights.accessRights.includes(op)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}