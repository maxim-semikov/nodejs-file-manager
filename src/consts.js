export const MESSAGES = {
    OPERATION_FAILED: 'Operation failed',
    INVALID_INPUT: 'Invalid input',
}


export const HELP = [
    {
        command: 'info',
        description: 'Print table with all command list',
    },
    {
        command: 'up',
        description: 'Go upper from current directory',
    },
    {
        command: 'cd path_to_directory',
        description: 'Go to dedicated folder from current directory',
    },
    {
        command: 'ls',
        description: 'Print in console list of all files and folders in current directory',
    },
    {
        command: 'cat path_to_file',
        description: "Read file and print it's content in console",
    },
    {
        command: 'add new_file_name',
        description: 'Create empty file in current working directory',
    },
    {
        command: 'rn path_to_file new_filename',
        description: 'Rename file',
    },
    {
        command: 'cp path_to_file path_to_new_directory',
        description: 'Copy file',
    },
    {
        command: 'mv path_to_file path_to_new_directory',
        description: 'Move file',
    },
    {
        command: 'rm path_to_file',
        description: 'Delete file',
    },
    {
        command: 'os --EOL',
        description: 'Get EOL (default system End-Of-Line) and print it to console\n',
    },
    {
        command: 'os --cpus',
        description: 'Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each' +
            ' of them) and print it to console',
    },
    {
        command: 'os --homedir',
        description: 'Get home directory and print it to console',
    },
    {
        command: 'os --username',
        description: 'Get current system user name (Do not confuse with the username that is set when the' +
            ' application starts) and print it to console',
    },
    {
        command: 'os --architecture',
        description: 'Get CPU architecture for which Node.js binary has compiled and print it to console',
    },
    {
        command: 'hash path_to_file',
        description: 'Calculate hash for file and print it into console',
    },
    {
        command: 'compress path_to_file path_to_destination',
        description: 'Compress file (using Brotli algorithm)',
    },
    {
        command: 'decompress path_to_file path_to_destination',
        description: 'Decompress file (using Brotli algorithm)',
    },
    {
        command: '.exit',
        description: 'Exit',
    }]
