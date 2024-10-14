const colors = {
    FgBlack : "\x1b[30m",
    FgRed : "\x1b[31m",
    FgGreen : "\x1b[32m",
    FgYellow : "\x1b[33m",
    FgBlue : "\x1b[34m",
    FgMagenta : "\x1b[35m",
    FgCyan : "\x1b[36m",
    FgWhite : "\x1b[37m",
    FgGray : "\x1b[90m",

    Reset : "\x1b[0m",
}

export const print = {
    greeting: (userName) =>  console.log(colors.FgYellow+`Welcome to the File Manager, ${userName}!`+colors.Reset),
    sayGoodBay: (userName) =>  console.log(colors.FgYellow+`Thank you for using File Manager,  ${userName}, goodbye!`+colors.Reset),
    currentDirectory: (path) =>  console.log(colors.FgMagenta+`You are currently in: ${path}`+colors.Reset),
    error: (...text) =>  console.log(colors.FgRed+`${text.join('')}`+colors.Reset),
    command: (item) => console.log(colors.FgYellow+`${item.command}`+colors.Reset+` | ${item.description}`),
    directory: (directoryName) => console.log(colors.FgYellow+`[directory] ${directoryName}`+colors.Reset),
    fileName: (fileName) => console.log(colors.FgGreen+`[file] ${fileName}`+colors.Reset),
}
