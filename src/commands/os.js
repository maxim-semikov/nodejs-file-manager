import os from 'node:os';

const getEOL = () => os.EOL.replace(/\n/g, '\\n').replace(/\r/g, '\\r');

const getCpus = () => {
    const cpus = os.cpus().map(cpu => ({model: cpu.model, speed: `${cpu.speed / 1000} GHz`}));
    console.log('Total amount of CPUS: ', cpus.length);
    console.table(cpus)
}

const getHomedir = () => os.homedir();

const getSystemUserName = () => process.env.USER || process.env.USERNAME;

const getArchitecture = () => process.arch;


export const osCommands = {
    '--EOL': getEOL,
    '--cpus': getCpus,
    '--homedir': getHomedir,
    '--username': getSystemUserName,
    '--architecture': getArchitecture
}

