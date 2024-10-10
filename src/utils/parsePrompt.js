
export const parsePrompt = (prompt) => {
    const [command, ...args] = prompt.trim()?.split(' ');
    return {
        command,
        args
    }
}
