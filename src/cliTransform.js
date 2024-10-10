import os from "node:os";
import {Transform} from "node:stream";
import {parsePrompt, print} from "./utils/index.js";
import {osCommands} from "./commands/index.js";

export const cliTransform = new Transform({
    transform(chunk, _, callback) {
        const {command, args} = parsePrompt(chunk.toString());

        if (command === 'os') {
            const isAvailableCommand = args?.length === 1 && osCommands[args[0]];
            if (isAvailableCommand) {
                const res = osCommands[args[0]]();
                if(res) {
                    this.push(res);
                    this.push(os.EOL);
                }
            } else {
                print.error('unavailable Command!');
            }
            print.currentDirectory(process.cwd());
        }

        callback();
    },
});
