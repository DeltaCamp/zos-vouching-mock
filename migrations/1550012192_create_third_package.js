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
    const thirdPackage = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
    console.log(chalk.cyan(`Registering package ${thirdPackage}...`))
    await mockVouching.register(
      thirdPackage,
      web3.utils.toWei('20', 'ether'),
      "https://raw.githubusercontent.com/levelkdev/registry-builder/9f657ff44d48664f2abb5e1b31c3d83f958e7333/package.json",
      metadataHash,
      { from: owner }
    )
  })
};
