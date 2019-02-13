// 2_create_call_me_maybe.js
const shell = require('shelljs')
const tdr = require('truffle-deploy-registry')

const ZepToken = artifacts.require('ZepToken.sol')

module.exports = function(deployer, networkName, accounts) {
  if (tdr.isDryRunNetworkName(networkName)) { return }
  deployer.then(async () => {
    const zepToken = await ZepToken.deployed()
    const result = shell.exec(
      `zos create MockVouching --init initialize \
                               --args ${zepToken.address},${web3.utils.toWei('10', 'ether')},${web3.utils.toWei('10', 'ether')},${accounts[0]}  \
                               --network ${networkName} \
                               --from ${process.env.ADMIN_ADDRESS}`
    )
    if (result.code !== 0) {
      throw new Error('Migration failed')
    }
  })
};
