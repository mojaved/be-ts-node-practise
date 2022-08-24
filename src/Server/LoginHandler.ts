import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../Authorization/Authorizer";
import { HTTP_CODES, HTTP_METHODS } from "../Shared/Model";
import { BaseRequestHandler } from "./BaseRequestHandler";
import { IAccount, ITokenGenerator } from "./Model";

export class LoginHandler extends BaseRequestHandler {
    private tkGenerator: ITokenGenerator;

    constructor(tg: ITokenGenerator, req?: IncomingMessage, res?: ServerResponse) {
        super({} as any, {} as any)
        this.tkGenerator = tg;
    }

    public async handleRequest(): Promise<any> {
        switch (this.req.method) {
            case HTTP_METHODS.POST:
                await this.handlePost();
                break;
            case HTTP_METHODS.OPTIONS:
                await this.res.writeHead(HTTP_CODES.OK);
                break;
            default:
                this.handleNotFound();
                break;
        }
    }

    private async handlePost(): Promise<any> {
        try {
            const body: IAccount = await this.getRequestBody();
            const sessionToken = await this.tkGenerator.generateToken(body);
            if (sessionToken) {
                this.respondJsonObject(HTTP_CODES.CREATED, sessionToken);
            }
            else {
                this.handleNotFound();
            }
        } catch (error: any) {
            this.respondBadRequest(error.message);
        }
    }
}