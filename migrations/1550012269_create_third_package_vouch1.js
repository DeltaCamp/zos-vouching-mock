const MockVouching = artifacts.require('MockVouching.sol')
const chalk = require('chalk')
const tdr = require('truffle-deploy-registry')

module.exports = function(deployer, networkName) {
  if (tdr.isDryRunNetworkName(networkName)) { return }
  deployer.then(async () => {
    const mockVouching = await MockVouching.deployed()

    const accounts = await web3.eth.getAccounts()
    const [appealResolver, admin, owner, challenger1, challenger2, challenger3, challenger4, appealer] = accounts

    console.log(chalk.cyan(`Vouching 10 Z for package 2 by ${challenger1}`))
    await mockVouching.vouch('2', web3.utils.toWei('10', 'ether'), { from: challenger1 })
  })
};
