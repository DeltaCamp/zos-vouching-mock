const MockVouching = artifacts.require('MockVouching.sol')
const chalk = require('chalk')
const tdr = require('truffle-deploy-registry')

module.exports = function(deployer, networkName) {
  if (tdr.isDryRunNetworkName(networkName)) { return }
  deployer.then(async () => {
    const mockVouching = await MockVouching.deployed()

    const accounts = await web3.eth.getAccounts()
    const [appealResolver, admin, owner, challenger1, challenger2, challenger3, challenger4, appealer] = accounts

    const metadataHash = "0x0000000000000000000000000000000000000001"
    const secondMetadataUri = "https://raw.githubusercontent.com/TPL-protocol/tpl-contracts-eth/2a0f8b0a8185f52791ff84b7d1039cec25cef256/package.json"
    const secondPackage = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    console.log(chalk.cyan(`Registering package ${secondPackage}...`))
    await mockVouching.register(
      secondPackage,
      web3.utils.toWei('100', 'ether'),
      secondMetadataUri,
      metadataHash,
      { from: owner }
    )
  })
};
