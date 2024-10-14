import fs from 'fs/promises';
import {print} from "../utils/index.js";
import {MESSAGES} from "../consts.js";

const goUpper = () => process.chdir('..');

const goToDirectory = (pathToDirectory) => {
    try {
        process.chdir(pathToDirectory);
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
};

const ls = async () => {
    try {
        const files = (await fs.readdir(process.cwd(), { withFileTypes: true }))?.sort((a, b) => {
            if ((a.isDirectory() && b.isDirectory()) || (!a.isDirectory() && !b.isDirectory())) {
                return a.name.localeCompare(b.name);
            }
            return a.isDirectory() ? -1 : 1;
        });
        files.forEach(file => file.isDirectory() ? print.directory(file.name) : print.fileName(file.name));
    } catch  {
        print.error(MESSAGES.OPERATION_FAILED);
    }
};

export const nwdCommands = {
    up: goUpper,
    cd: goToDirectory,
    ls,
}
