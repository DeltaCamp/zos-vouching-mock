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

    const challenge6Id = await challenge(mockVouching, 1, challenger4)
    console.log(chalk.red(`Rejecting challenge6Id ${challenge6Id} from ${owner}...`))
    await mockVouching.reject(challenge6Id, { from: owner })
    console.log(chalk.green(`Appealing challenge6Id ${challenge6Id} from ${appealer}...`))
    await mockVouching.appeal(challenge6Id, { from: appealer })
    console.log(chalk.magenta(`Affirming appeal challenge6Id ${challenge6Id} from ${appealResolver}...`))
    await mockVouching.affirmAppeal(challenge6Id, { from: appealResolver })
  })
};
