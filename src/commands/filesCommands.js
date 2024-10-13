import path from 'node:path';
import fs from 'node:fs/promises';
import {createReadStream, createWriteStream} from 'node:fs';
import {checkFileAccess} from "../utils/checkFileAccess.js";
import {print} from "../utils/index.js";
import {MESSAGES} from "../consts.js";
import {pipeline} from "node:stream/promises";

const catFile = async (pathToFile) => {
    try {
        const filePath = path.resolve(pathToFile);
        if(await checkFileAccess(filePath)) {
            const readStream = createReadStream(filePath, { encoding: 'utf8' });

            // todo: for thinking: may be use cliTransform push
            await readStream.pipe(process.stdout);
        } else {
            print.error(MESSAGES.OPERATION_FAILED);
        }
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const addFile = async (fileName) => {
    try {
        await fs.writeFile(path.resolve(path.join(fileName)), '', {flag: 'wx'});
    } catch (e) {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const renameFile = async ( pathToFile, newFileName) => {
    try {
        const filePath = path.resolve(pathToFile);
        const newFilePath =  path.join(path.dirname(filePath), newFileName);
        if(await checkFileAccess(filePath) && ! await checkFileAccess(newFilePath)) {
            await fs.rename(filePath, newFilePath);
        } else {
            print.error(MESSAGES.OPERATION_FAILED);
        }
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const copyFile = async (pathToFile, pathToNewDirectory) => {
    try {
        const sourcePath = path.resolve(pathToFile);
        const fileName = path.basename(sourcePath);
        const destinationFolderPath = path.resolve(pathToNewDirectory, fileName);

        const isFile = (await fs.stat(sourcePath)).isFile();
        const isDestinationFolderPathAlreadyExists =await checkFileAccess(destinationFolderPath);
        const isSourcePathExists =await checkFileAccess(sourcePath);

        if(isSourcePathExists && isFile && !isDestinationFolderPathAlreadyExists) {
            const readStream = createReadStream(sourcePath);
            const writeStream = createWriteStream(destinationFolderPath);
            await pipeline(readStream, writeStream);
        } else {
            print.error(MESSAGES.OPERATION_FAILED);
        }
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const deleteFile = async (pathToFile) => {
    try {
        const sourcePath = path.resolve(pathToFile);
        await fs.rm(sourcePath);
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const moveFile = async (pathToFile, pathToNewDirectory) => {
    try {
        await copyFile(pathToFile, pathToNewDirectory);
        //todo: return only one message 'Operation failed'
        await deleteFile(pathToFile);
    } catch {
        print.error(print.error(MESSAGES.OPERATION_FAILED));
    }

}

export const filesCommands = {
    cat: catFile,
    add: addFile,
    rn: renameFile,
    cp: copyFile,
    rm: deleteFile,
    mv: moveFile
}
