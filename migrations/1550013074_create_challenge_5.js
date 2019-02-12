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

    const challenge5Id = await challenge(mockVouching, 1, challenger3)
    console.log(chalk.green(`Accepting challenge5Id ${challenge5Id} from ${owner}...`))
    await mockVouching.accept(challenge5Id, { from: owner })
    console.log(chalk.green(`Appealing challenge5Id ${challenge5Id} from ${appealer}...`))
    await mockVouching.appeal(challenge5Id, { from: appealer })
    console.log(chalk.magenta(`Affirming appeal challenge5Id ${challenge5Id} from ${appealResolver}...`))
    await mockVouching.affirmAppeal(challenge5Id, { from: appealResolver })
  })
};
