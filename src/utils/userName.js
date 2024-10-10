const argv = process.argv.slice(2);
const userNameParamsPrefix= '--username=';
export const getUserName = () => argv?.length ? argv.join(' ').replace(userNameParamsPrefix, '') : 'Unknown User';
