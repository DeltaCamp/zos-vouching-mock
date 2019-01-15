// 2_create_call_me_maybe.js
const shell = require('shelljs')
const tdr = require('truffle-deploy-registry')

module.exports = function(deployer, networkName, accounts) {
  if (tdr.isDryRunNetworkName(networkName)) { return }
  deployer.then(() => {
    if (shell.exec(`zos create ZepToken --init initialize --args ${accounts[0]} --network ${networkName} --from ${accounts[1]}`).code !== 0) {
      throw new Error('Migration failed')
    }
  })
};
