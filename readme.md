# File Manager on nodejs
### Run File Manager

```npm run start -- --username=your_username```

### Commands:
`help` Print command list'

`up` Go upper from current directory

`cd path_to_directory` description: 'Go to dedicated folder from current directory'

`ls` Print in console list of all files and folders in current directory

`cat path_to_file` Read file and print it's content in console

`add new_file_name` Create empty file in current working directory

`rn path_to_file new_filename` Rename file

`cp path_to_file path_to_new_directory` Copy file

`mv path_to_file path_to_new_directory` Move file

`rm path_to_file` Delete file

`os --EOL` Get EOL (default system End-Of-Line) and print it to console

`os --cpus` Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for 
each of them) and print it to console


`os --homedir` Get home directory and print it to console

`os --username` Get current system user name (Do not confuse with the username that is set when the' +
' application starts) and print it to console

`os --architecture` Get CPU architecture for which Node.js binary has compiled and print it to console

`hash path_to_file` Calculate hash for file and print it into console

`compress path_to_file path_to_destination` Compress file (using Brotli algorithm)

`decompress path_to_file path_to_destination` Decompress file (using Brotli algorithm)

`.exit` Exit

