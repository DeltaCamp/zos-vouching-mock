const BN = require('bn.js')
const MockVouching = artifacts.require('MockVouching.sol')
const ZepToken = artifacts.require('ZepToken.sol')
const chalk = require('chalk')

async function bootstrap() {
  const mockVouching = await MockVouching.deployed()
  const zepToken = await ZepToken.deployed()

  const accounts = await web3.eth.getAccounts()

  console.log('Found accounts: ', accounts)
  const mintAmount = web3.utils.toWei('1000', 'ether')
  for (i in accounts) {
    const account = accounts[i]
    if (i == 1) { continue }
    const balance = await zepToken.balanceOf(account)
    if (balance.lt(new BN(mintAmount))) {
      console.log(chalk.green(`Minting 1000 tokens to ${account}...`))
      await zepToken.mint(account, mintAmount)
      await zepToken.approve(mockVouching.address, mintAmount, { from: account })
    }
  }

  // create some vouches
  console.log(chalk.red(`Registering ${accounts[0]}...`))
  await mockVouching.register(
    accounts[0],
    web3.utils.toWei('100', 'ether'),
    "test_uri",
    "0x0000000000000000000000000000000000000001",
    { from: accounts[0] }
  )


  console.log(chalk.red(`Registering ${accounts[2]}...`))
  await mockVouching.register(
    accounts[2],
    web3.utils.toWei('100', 'ether'),
    "test_uri",
    "0x0000000000000000000000000000000000000001",
    { from: accounts[2] }
  )

  console.log(chalk.red(`Registering ${accounts[3]}...`))
  await mockVouching.register(
    accounts[3],
    web3.utils.toWei('100', 'ether'),
    "test_uri",
    "0x0000000000000000000000000000000000000001",
    { from: accounts[3] }
  )
}

module.exports = function(callback) {
  console.log('Starting bootstrap...')
  bootstrap()
    .catch(error => {
      console.error(error)
      callback()
    })
    .then(() => {
      console.log('Completed successfully')
      callback()
    })
}
