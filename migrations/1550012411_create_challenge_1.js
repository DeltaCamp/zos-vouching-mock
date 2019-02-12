const chalk = require('chalk')
const tdr = require('truffle-deploy-registry')

const challenge = require('./support/challenge')

const MockVouching = artifacts.require('MockVouching.sol')

module.exports = function(deployer, networkName) {
  if (tdr.isDryRunNetworkName(networkName)) { return }
  deployer.then(async () => {
    const mockVouching = await MockVouching.deployed()
    const accounts = await web3.eth.getAccounts()
    const [appealResolver, admin, owner, challenger1, challenger2, challenger3, challenger4, appealer] = accounts

    const challenge1Id = await challenge(mockVouching, 1, challenger1)
    console.log(chalk.green(`Accepting challenge ${challenge1Id} from ${owner}...`))
    await mockVouching.accept(challenge1Id, { from: owner })
  })
};
