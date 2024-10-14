import {nwdCommands} from "./nwd.js";
import {filesCommands} from "./filesCommands.js";
import {getOsCommands} from "./os.js";
import {getUserName, print} from "../utils/index.js";
import {HELP, MESSAGES} from "../consts.js";

export const exit = (...args) => {
    if (!!args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }
    print.sayGoodBay(getUserName());
    process.stdin.pause();
    process.exit();
}

export const printHelp = (...args) => {
    if (!!args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }

    console.log('Command | Description');
    console.log('---------------------');
    HELP.map( item => {
        print.command(item);
    })
}


export const Commands = {
    os: getOsCommands,
    ...nwdCommands,
    ...filesCommands,
    help: printHelp,
    '.exit': exit,
}
