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

    const challenge8Id = await challenge(mockVouching, 1, challenger4)
    console.log(chalk.red(`Rejecting challenge8Id ${challenge8Id} from ${owner}...`))
    await mockVouching.reject(challenge8Id, { from: owner })
    console.log(chalk.green(`Appealing challenge8Id ${challenge8Id} from ${appealer}...`))
    await mockVouching.appeal(challenge8Id, { from: appealer })
    console.log(chalk.cyan(`Dismissing appeal challenge8Id ${challenge8Id} from ${appealResolver}...`))
    await mockVouching.dismissAppeal(challenge8Id, { from: appealResolver })
  })
};
