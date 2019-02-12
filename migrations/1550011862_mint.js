const BN = require('bn.js')
const chalk = require('chalk')
const tdr = require('truffle-deploy-registry')

const ZepToken = artifacts.require('ZepToken.sol')
const MockVouching = artifacts.require('MockVouching.sol')

const MINT_AMOUNT = new BN(web3.utils.toWei('1000', 'ether'))

module.exports = function(deployer, networkName) {
  if (tdr.isDryRunNetworkName(networkName)) { return }
  deployer.then(async function () {
    const mockVouching = await MockVouching.deployed()
    const zepToken = await ZepToken.deployed()

    async function mint (account, mintAmount) {
      const balance = await zepToken.balanceOf(account)
      if (balance.lt(mintAmount)) {
        console.log(chalk.green(`Minting 1000 tokens to ${account}...`))
        await zepToken.mint(account, mintAmount)
        try {
          await zepToken.approve(mockVouching.address, mintAmount, { from: account })
        } catch (error) {
          console.log(chalk.red(`Was unable to approve mock vouching spend for ${account}: ${error.message}`))
        }
      }
    }

    // Use deployer to state migration tasks.
    const accounts = await web3.eth.getAccounts()
    const extraAccounts = [
      // Chuck's addresses:
      '0x8f7F92e0660DD92ecA1faD5F285C4Dca556E433e',
      '0x883E6B4C10520E2bc2D5dEB78d8AE4C1f7752ce7',
      '0x7A8cda94b311F58291d6F9E681599c915E31c338',
      // Ramon's addresses:
      '0x15b7FeC273F6f09786ae3Efc6E0aA9Ea33f56508',
      '0x5C681875A0ef659D6d97Bc51c077783Db474dE47',
      '0xE3D450F1C50757fFB2b5ddE03A1A0d7Bc32F0153'
    ]

    // Mint to all of the accounts
    await Promise.all(accounts.concat(extraAccounts).map(account => mint(account, MINT_AMOUNT)))
  })
}
