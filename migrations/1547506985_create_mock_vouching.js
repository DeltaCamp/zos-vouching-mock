// 2_create_call_me_maybe.js
const shell = require('shelljs')
const tdr = require('truffle-deploy-registry')

const ZepToken = artifacts.require('ZepToken.sol')

module.exports = function(deployer, networkName, accounts) {
  if (tdr.isDryRunNetworkName(networkName)) { return }
  deployer.then(async () => {
    const zepToken = await ZepToken.deployed()
    if (shell.exec(`zos create MockVouching --init initialize --args ${web3.utils.toWei('10', 'ether')},${zepToken.address}  --network ${networkName} --from ${accounts[1]}`).code !== 0) {
      throw new Error('Migration failed')
    }
  })
};
