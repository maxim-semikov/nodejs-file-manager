import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import {Writable} from "node:stream";
import {pipeline} from "node:stream/promises";
import {createBrotliCompress, createBrotliDecompress} from 'zlib';
import {createReadStream, createWriteStream} from 'node:fs';
import {checkFileAccess} from "../utils/checkFileAccess.js";
import {getUserName, print} from "../utils/index.js";
import {HELP, MESSAGES} from "../consts.js";

const catFile = async (pathToFile) => {
    try {
        const filePath = path.resolve(pathToFile);
        if(await checkFileAccess(filePath)) {
            const readStream = createReadStream(filePath, { encoding: 'utf8' });
            const writable = new Writable({
                decodeStrings: false,
                write(chunk, encoding, callback) {
                    console.log(chunk);
                    callback();
                }
            })

            await pipeline(readStream, writable);
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
        const isDestinationFolderPathAlreadyExists = await checkFileAccess(destinationFolderPath);
        const isSourcePathExists = await checkFileAccess(sourcePath);

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

const getFileHash = async (pathToFile) => {
    try {
        const sourcePath = path.resolve(pathToFile);
        const hash = crypto.createHash('sha256');
        const readStream = createReadStream(sourcePath);

        await pipeline(readStream, hash);
        console.log(hash.digest('hex'));
    } catch (e) {
        console.log(e)
        print.error(print.error(MESSAGES.OPERATION_FAILED));
    }
}

const compressFile = async (pathToFile, pathToDestination) => {
    try {
        const sourcePath = path.resolve(pathToFile);
        const fileName = path.basename(sourcePath);
        const destinationFolderPath = path.resolve(pathToDestination);

        const isSourcePathExists = await checkFileAccess(sourcePath);
        const isFile =  (await fs.stat(sourcePath)).isFile();
        const destinationFilePath =  path.join(destinationFolderPath, `${fileName}.br`);
        const isDestinationPathExists = await checkFileAccess(destinationFilePath);

        if (isSourcePathExists && isFile && !isDestinationPathExists) {
            await pipeline(
                createReadStream(sourcePath),
                createBrotliCompress(),
                createWriteStream(destinationFilePath)
            );
        } else {
            print.error(MESSAGES.OPERATION_FAILED);
        }
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

const decompressFile = async (pathToFile, pathToDestination) => {
    try {
        const sourcePath = path.resolve(pathToFile);
        const fileExt = path.extname(sourcePath);
        const destinationFileName = path.basename(sourcePath).replace(fileExt, '');

        const destinationPath = path.resolve(pathToDestination);
        const isSourcePathExists = await checkFileAccess(sourcePath);
        const isFile =  (await fs.stat(sourcePath)).isFile();

        const destinationFilePath =  path.join(destinationPath, destinationFileName);
        const isDestinationPathExists = await checkFileAccess(destinationFilePath);

        if (isSourcePathExists && isFile && !isDestinationPathExists && fileExt === '.br') {
            await pipeline(
                createReadStream(sourcePath),
                createBrotliDecompress(),
                createWriteStream(destinationFilePath)
            );
        } else {
            print.error(MESSAGES.OPERATION_FAILED);
        }
    } catch {
        print.error(MESSAGES.OPERATION_FAILED);
    }
}

export const exit = () => {
    print.sayGoodBay(getUserName());
    process.stdin.pause();
    process.exit();
}

export const printHelp = () => {
    console.log('Command | Description');
    console.log('---------------------');
    HELP.map( item => {
        print.command(item);
    })
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
    '.exit': exit,
    help: printHelp
}
