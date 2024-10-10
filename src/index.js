import os from 'node:os';
import {pipeline} from "node:stream/promises";
import {getUserName, print} from "./utils/index.js";
import {cliTransform} from "./cliTransform.js";

const app = async () => {
    const userName = getUserName();
    print.greeting(userName);

    process.chdir(os.homedir());
    print.currentDirectory(os.homedir());

    await pipeline(process.stdin, cliTransform, process.stdout)

    process.on('SIGINT', () => {
        console.log(os.EOL);
        print.sayGoodBay(userName);
        process.exit()
    });
}

app();
