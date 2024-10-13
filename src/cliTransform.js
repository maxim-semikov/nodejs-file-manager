import os from "node:os";
import {Transform} from "node:stream";
import {parsePrompt, print} from "./utils/index.js";
import {filesCommands, nwdCommands, osCommands} from "./commands/index.js";
import {MESSAGES} from "./consts.js";

export const cliTransform = new Transform({
  async  transform(chunk, _, callback) {
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
                print.error(MESSAGES.INVALID_INPUT);
            }
        }

        if (nwdCommands[command]) {
           await nwdCommands[command](args?.[0]);
        }

      if (filesCommands[command]) {
          await filesCommands[command](...args);
      }

      print.currentDirectory(process.cwd());
        callback();
    },
});
