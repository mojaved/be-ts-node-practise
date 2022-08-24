import { Server } from './Server/Server';

class Launcher {

    // instance variables
    private name: string;
    private server: Server;

    constructor() {
        this.server = new Server();
        this.name = 'Muhammad Omer';
    }

    public launchApp() {
        console.log(`App is launched by ${this.name}`);
        this.server.createServer();
    }
}

new Launcher().launchApp();