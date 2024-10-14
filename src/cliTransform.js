import os from "node:os";
import {Transform} from "node:stream";
import {parsePrompt, print} from "./utils/index.js";
import {Commands} from "./commands/index.js";
import {MESSAGES} from "./consts.js";

export const cliTransform = new Transform({
  async  transform(chunk, _, callback) {
        const {command, args} = parsePrompt(chunk.toString());

        try {
            if (Commands?.[command]) {

                await Commands[command](args);

                this.push(os.EOL);
                print.currentDirectory(process.cwd());
            } else {
                print.error(MESSAGES.INVALID_INPUT);
            }
        } catch {
            print.error(MESSAGES.OPERATION_FAILED);
        }
        callback();
    },
});
