const MockVouching = artifacts.require('MockVouching.sol')
const chalk = require('chalk')
const tdr = require('truffle-deploy-registry')

module.exports = function(deployer, networkName) {
  if (tdr.isDryRunNetworkName(networkName)) { return }
  deployer.then(async () => {
    const mockVouching = await MockVouching.deployed()

    const accounts = await web3.eth.getAccounts()
    const [appealResolver, admin, owner, challenger1, challenger2, challenger3, challenger4, appealer] = accounts

    const firstMetadataUri = "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-eth/0b1e1810b193c06c3fd0edab591f6738c6577bb5/package.json"
    const metadataHash = "0x0000000000000000000000000000000000000001"
    // create some vouched packages
    const firstPackageAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
    console.log(chalk.cyan(`Registering package ${firstPackageAddress}...`))
    await mockVouching.register(
      firstPackageAddress,
      web3.utils.toWei('88', 'ether'),
      firstMetadataUri,
      metadataHash,
      { from: owner }
    )
  })
};
