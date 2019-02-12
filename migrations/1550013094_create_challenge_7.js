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

    const challenge7Id = await challenge(mockVouching, 1, challenger3)
    console.log(chalk.green(`Accepting challenge7Id ${challenge7Id} from ${owner}...`))
    await mockVouching.accept(challenge7Id, { from: owner })
    console.log(chalk.green(`Appealing challenge7Id ${challenge7Id} from ${appealer}...`))
    await mockVouching.appeal(challenge7Id, { from: appealer })
    console.log(chalk.cyan(`Dismissing appeal challenge7Id ${challenge7Id} from ${appealResolver}...`))
    await mockVouching.dismissAppeal(challenge7Id, { from: appealResolver })
  })
};
