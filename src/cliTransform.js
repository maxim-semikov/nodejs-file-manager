import {Transform} from "node:stream";

export const cliTransform = new Transform({
    transform(chunk, _, callback) {
        this.push(`User prompt is: ${chunk.toString()}`);
        callback();


    },
});
