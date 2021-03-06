module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: '*' // Match any network id
    },
    chainskills: {
      host: 'localhost',
      port: 8545,
      network_id: '4224',
      gas: 4700000,
      from: '0x6d9b3eb6831731be46c07a518ec92244ef4a403c'
    },
    rinkeby: {
      host: 'localhost',
      port: 8545,
      network_id: 4, //rinkeby test network
      gas: 4700000
    }
  }
};
