import fs from "node:fs/promises";

export const  checkFileAccess = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    } catch (err) {
        return false;
    }
}
