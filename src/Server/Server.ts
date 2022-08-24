import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../Authorization/Authorizer';
import { LoginHandler } from './LoginHandler';
import { UserHandler } from './UserHandler';
import { Utils } from './Utils';
export class Server {

    private authorizer: Authorizer = new Authorizer();
    private loginHandler: LoginHandler = new LoginHandler(this.authorizer);
    private userHandler: UserHandler = new UserHandler(this.authorizer);
    public createServer() {
        createServer(
            async (req: IncomingMessage, res: ServerResponse) => {
                this.addCorsHeader(res);
                const basePath = Utils.getUrlBasePath(req.url);
                switch (basePath) {
                    case 'login':
                        this.loginHandler.setRequest(req);
                        this.loginHandler.setResponse(res);
                        await this.loginHandler.handleRequest();
                        // await new LoginHandler(req, res, this.authorizer).handleRequest();
                        break;
                    case 'users':
                        this.userHandler.setRequest(req);
                        this.userHandler.setResponse(res);
                        await this.userHandler.handleRequest();
                        break;
                    default:
                        break;
                }
                res.end();
            }
        ).listen(8080);
        console.log('server started');
    }

    private addCorsHeader(res: ServerResponse) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
    }
}