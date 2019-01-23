const BN = require('bn.js')
const MockVouching = artifacts.require('MockVouching.sol')
const ZepToken = artifacts.require('ZepToken.sol')
const chalk = require('chalk')

const MINT_AMOUNT = new BN(web3.utils.toWei('1000', 'ether'))

async function bootstrap () {
  const mockVouching = await MockVouching.deployed()
  const zepToken = await ZepToken.deployed()

  async function mint (account, mintAmount) {
    const balance = await zepToken.balanceOf(account)
    if (balance.lt(mintAmount)) {
      console.log(chalk.green(`Minting 1000 tokens to ${account}...`))
      await zepToken.mint(account, mintAmount)
      await zepToken.approve(mockVouching.address, mintAmount, { from: account })
    }
  }

  const accounts = await web3.eth.getAccounts()
  const owner = accounts[0]
  const challenger1 = accounts[2]
  const challenger2 = accounts[3]

  const testAccounts = [
    owner,
    challenger1,
    challenger2
  ]

  for (i in testAccounts) {
    await mint(testAccounts[i], MINT_AMOUNT)
  }

  const firstPackageOwner = await mockVouching.owner('0')
  if (firstPackageOwner === '0x0000000000000000000000000000000000000000') {
    // create some vouched packages
    const firstPackage = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
    console.log(chalk.cyan(`Registering package ${firstPackage}...`))
    const firstMetadataUri = "https://raw.githubusercontent.com/zeppelinos/zos-vouching/master/package.json"
    const metadataHash = "0x0000000000000000000000000000000000000001"
    await mockVouching.register(
      firstPackage,
      web3.utils.toWei('88', 'ether'),
      firstMetadataUri,
      metadataHash,
      { from: owner }
    )
    await mockVouching.challenge(0, web3.utils.toWei('90', 'ether'), firstMetadataUri, metadataHash, { from: challenger1 })
  }

  const secondPackageOwner = await mockVouching.owner('1')
  if (secondPackageOwner === '0x0000000000000000000000000000000000000000') {
    const secondPackage = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    console.log(chalk.cyan(`Registering package ${secondPackage}...`))
    const secondMetadataUri = "https://raw.githubusercontent.com/zeppelinos/zos/98c9fc00699d0ed216950623539375fe1f0c2867/packages/lib/package.json"
    await mockVouching.register(
      secondPackage,
      web3.utils.toWei('100', 'ether'),
      secondMetadataUri,
      metadataHash,
      { from: owner }
    )

    await mockVouching.challenge(1, web3.utils.toWei('42', 'ether'), secondMetadataUri, metadataHash, { from: challenger1 })
    await mockVouching.challenge(1, web3.utils.toWei('17', 'ether'), secondMetadataUri, metadataHash, { from: challenger2 })
  }

  const thirdPackageOwner = await mockVouching.owner('2')
  if (thirdPackageOwner === '0x0000000000000000000000000000000000000000') {
    const thirdPackage = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
    console.log(chalk.cyan(`Registering package ${thirdPackage}...`))
    await mockVouching.register(
      thirdPackage,
      web3.utils.toWei('20', 'ether'),
      "https://raw.githubusercontent.com/gnosis/safe-contracts/102e632d051650b7c4b0a822123f449beaf95aed/package.json",
      metadataHash,
      { from: owner }
    )
  }

  let thirdPackageChallenger1VouchAmount = await mockVouching.vouchedAmount('2', challenger1)
  if (thirdPackageChallenger1VouchAmount.toString() === '0') {
    console.log(chalk.cyan(`Vouching 10 Z for package 2 by ${challenger1}`))
    await mockVouching.vouch('2', web3.utils.toWei('10', 'ether'), { from: challenger1 })
  }

  let thirdPackageChallenger2VouchAmount = await mockVouching.vouchedAmount('2', challenger2)
  if (thirdPackageChallenger2VouchAmount.toString() === '0') {
    console.log(chalk.cyan(`Vouching 22 Z for package 2 by ${challenger2}`))
    await mockVouching.vouch('2', web3.utils.toWei('22', 'ether'), { from: challenger2 })
  }

}

module.exports = function (callback) {
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
