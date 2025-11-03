// lightweight logger, can be extended to winston
const log = (...args) => console.log(new Date().toISOString(), ...args);

export default { log };