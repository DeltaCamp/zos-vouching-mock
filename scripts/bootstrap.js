const BN = require('bn.js')
const MockVouching = artifacts.require('MockVouching.sol')
const ZepToken = artifacts.require('ZepToken.sol')
const chalk = require('chalk')

async function bootstrap() {
  const mockVouching = await MockVouching.deployed()
  const zepToken = await ZepToken.deployed()

  const accounts = await web3.eth.getAccounts()
  const account = accounts[0]

  const mintAmount = web3.utils.toWei('1000', 'ether')
  const balance = await zepToken.balanceOf(account)
  if (balance.lt(new BN(mintAmount))) {
    console.log(chalk.green(`Minting 1000 tokens to ${account}...`))
    await zepToken.mint(account, mintAmount)
  }
  await zepToken.approve(mockVouching.address, mintAmount, { from: account })

  // create some vouched packages
  const firstPackage = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
  console.log(chalk.red(`Registering ${firstPackage}...`))
  await mockVouching.register(
    firstPackage,
    web3.utils.toWei('88', 'ether'),
    "/testPackage1.json",
    "0x0000000000000000000000000000000000000001",
    { from: accounts[0] }
  )

  const secondPackage = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  console.log(chalk.red(`Registering ${secondPackage}...`))
  await mockVouching.register(
    secondPackage,
    web3.utils.toWei('100', 'ether'),
    "/testPackage2.json",
    "0x0000000000000000000000000000000000000001",
    { from: accounts[0] }
  )

  const thirdPackage = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
  console.log(chalk.red(`Registering ${thirdPackage}...`))
  await mockVouching.register(
    thirdPackage,
    web3.utils.toWei('20', 'ether'),
    "/testPackage3.json",
    "0x0000000000000000000000000000000000000001",
    { from: accounts[0] }
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
