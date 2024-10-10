import fs from 'fs/promises';
import {print} from "../utils/index.js";

const goUpper = () => process.chdir('..');

const goToDirectory = (pathToDirectory) => {
    try {
        process.chdir(pathToDirectory);
    } catch {
        print.error('Operation failed');
    }
};

const ls = async () => {
    try {
        const files = await fs.readdir(process.cwd());
        console.log(files);
    } catch {
        print.error('Operation failed');
    }
};

export const nwdCommands = {
    up: goUpper,
    cd: goToDirectory,
    ls,
}
