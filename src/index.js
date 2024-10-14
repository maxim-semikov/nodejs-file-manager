import os from 'node:os';
import {pipeline} from "node:stream/promises";
import {getUserName, print} from "./utils/index.js";
import {cliTransform} from "./cliTransform.js";

const app = async () => {
    const userName = getUserName();
    print.greeting(userName);

    process.chdir(os.homedir());
    console.log('Please type the command. For more info use command "help"');
    print.currentDirectory(os.homedir());

    process.on('SIGINT', () => {
        console.log(os.EOL);
        print.sayGoodBay(userName);
        process.exit()
    });

    await pipeline(process.stdin, cliTransform, process.stdout);
}

app();
