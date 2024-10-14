import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import {Writable} from "node:stream";
import {pipeline} from "node:stream/promises";
import {createBrotliCompress, createBrotliDecompress} from 'zlib';
import {createReadStream, createWriteStream} from 'node:fs';
import {checkFileAccess} from "../utils/checkFileAccess.js";
import {print} from "../utils/index.js";
import {MESSAGES} from "../consts.js";

const catFile = async (pathToFile, ...args) => {
    if(!pathToFile || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }
    try {
        const filePath = path.resolve(pathToFile);
        const isFileExists= await checkFileAccess(filePath);
        if(!isFileExists) {
            throw new Error(MESSAGES.OPERATION_FAILED);
        }

        const readStream = createReadStream(filePath, { encoding: 'utf8' });
        const writable = new Writable({
            decodeStrings: false,
            write(chunk, _, callback) {
                console.log(chunk);
                callback();
            }
        })

        await pipeline(readStream, writable);
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const addFile = async (fileName, ...args) => {
    if(!fileName || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }

    try {
        await fs.writeFile(path.resolve(path.join(fileName)), '', {flag: 'wx'});
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const renameFile = async (pathToFile, newFileName, ...args) => {
    if(!pathToFile || !newFileName || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }

    try {
        const filePath = path.resolve(pathToFile);
        const newFilePath =  path.join(path.dirname(filePath), newFileName);
        const isFileExists = await checkFileAccess(filePath);
        const isNewFileExists = await checkFileAccess(newFilePath);

        if(!isFileExists && isNewFileExists) {
           throw new Error(MESSAGES.OPERATION_FAILED);
        }

        await fs.rename(filePath, newFilePath);

    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const copyFile = async (pathToFile, pathToNewDirectory, ...args) => {
    if(!pathToFile || !pathToNewDirectory || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return false;
    }

    try {
        const sourcePath = path.resolve(pathToFile);
        const fileName = path.basename(sourcePath);
        const destinationPath = path.resolve(pathToNewDirectory, fileName);

        const isFile = (await fs.stat(sourcePath)).isFile();
        const isDestinationPathAlreadyExists = await checkFileAccess(destinationPath);
        const isSourcePathExists = await checkFileAccess(sourcePath);

        if(!isSourcePathExists || !isFile || isDestinationPathAlreadyExists) {
            throw new Error(MESSAGES.OPERATION_FAILED);
        }

        const readStream = createReadStream(sourcePath);
        const writeStream = createWriteStream(destinationPath);

        await pipeline(readStream, writeStream);
        return true;
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
        return false;
    }
}

const deleteFile = async (pathToFile, ...args) => {
    if(!pathToFile || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }

    try {
        const sourcePath = path.resolve(pathToFile);
        await fs.rm(sourcePath);
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const moveFile = async (pathToFile, pathToNewDirectory, ...args) => {
    if(!pathToFile || !pathToNewDirectory || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }

    try {
        const isSuccess = await copyFile(pathToFile, pathToNewDirectory);
        if (isSuccess) {
            await deleteFile(pathToFile);
        }
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }

}

const getFileHash = async (pathToFile, ...args) => {
    if(!pathToFile || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }

    try {
        const sourcePath = path.resolve(pathToFile);
        const hash = crypto.createHash('sha256');
        const readStream = createReadStream(sourcePath);

        await pipeline(readStream, hash);
        console.log(hash.digest('hex'));
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const compressFile = async (pathToFile, pathToDestination, ...args) => {
    if(!pathToFile || !pathToDestination || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }

    try {
        const sourcePath = path.resolve(pathToFile);
        const fileName = path.basename(sourcePath);
        const destinationFolderPath = path.resolve(pathToDestination);

        const isSourcePathExists = await checkFileAccess(sourcePath);
        const isFile =  (await fs.stat(sourcePath)).isFile();
        const destinationFilePath =  path.join(destinationFolderPath, `${fileName}.br`);
        const isDestinationPathExists = await checkFileAccess(destinationFilePath);

        if(!isSourcePathExists || !isFile || isDestinationPathExists) {
            throw new Error(MESSAGES.OPERATION_FAILED);
        }


        await pipeline(
            createReadStream(sourcePath),
            createBrotliCompress(),
            createWriteStream(destinationFilePath)
        );

    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const decompressFile = async (pathToFile, pathToDestination, ...args) => {
    if(!pathToFile || !pathToDestination || args?.length) {
        print.error(MESSAGES.INVALID_INPUT);
        return;
    }

    try {
        const sourcePath = path.resolve(pathToFile);
        const fileExt = path.extname(sourcePath);
        const destinationFileName = path.basename(sourcePath).replace(fileExt, '');

        const destinationPath = path.resolve(pathToDestination);
        const isSourcePathExists = await checkFileAccess(sourcePath);
        const isFile =  (await fs.stat(sourcePath)).isFile();

        const destinationFilePath =  path.join(destinationPath, destinationFileName);
        const isDestinationPathExists = await checkFileAccess(destinationFilePath);

        if(!isSourcePathExists || !isFile || fileExt !== '.br' || isDestinationPathExists) {
            throw new Error(MESSAGES.OPERATION_FAILED);
        }

        await pipeline(
            createReadStream(sourcePath),
            createBrotliDecompress(),
            createWriteStream(destinationFilePath)
        );

    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}



export const filesCommands = {
    cat: catFile,
    add: addFile,
    rn: renameFile,
    cp: copyFile,
    rm: deleteFile,
    mv: moveFile,
    hash: getFileHash,
    compress: compressFile,
    decompress: decompressFile,
}
