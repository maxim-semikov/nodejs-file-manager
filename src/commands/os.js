import os from 'node:os';
import {print} from "../utils/index.js";
import {MESSAGES} from "../consts.js";

const getEOL = () => {
    console.log(os.EOL.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));
};

const getCpus = () => {
    const cpus = os.cpus().map(cpu => ({model: cpu.model, speed: `${cpu.speed / 1000} GHz`}));
    console.log('Total amount of CPUS: ', cpus.length);
    console.table(cpus);
}

const getHomedir = () => console.log(os.homedir());

const getSystemUserName = () => console.log(process.env.USER || process.env.USERNAME);

const getArchitecture = () => console.log(process.arch);


const osCommands = {
    '--EOL': getEOL,
    '--cpus': getCpus,
    '--homedir': getHomedir,
    '--username': getSystemUserName,
    '--architecture': getArchitecture
}

export const getOsCommands = async ([command, ...args]) => {
    const isAvailableCommand = osCommands?.[command] && !args?.length;
    if (isAvailableCommand) {
        await osCommands[command]();
    } else {
        print.error(MESSAGES.INVALID_INPUT);
    }
}
