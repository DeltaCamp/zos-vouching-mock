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
      try {
        await zepToken.approve(mockVouching.address, mintAmount, { from: account })
      } catch (error) {
        console.log(chalk.red(`Was unable to approve mock vouching spend for ${account}`))
      }
    }
  }

  const accounts = await web3.eth.getAccounts()
  const owner = accounts[0]
  const challenger1 = accounts[2]
  const challenger2 = accounts[3]

  const testAccounts = [
    owner,
    challenger1,
    challenger2,
    '0x8f7F92e0660DD92ecA1faD5F285C4Dca556E433e',
    '0x883E6B4C10520E2bc2D5dEB78d8AE4C1f7752ce7',
    '0x7A8cda94b311F58291d6F9E681599c915E31c338'
  ]

  for (i in testAccounts) {
    await mint(testAccounts[i], MINT_AMOUNT)
  }

  const metadataHash = "0x0000000000000000000000000000000000000001"

  const firstPackage = await mockVouching.getEntry('0')
  const firstMetadataUri = "https://raw.githubusercontent.com/zeppelinos/zos-vouching/master/package.json"
  if (firstPackage[1] === '0x0000000000000000000000000000000000000000') {
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

  }

  console.log(chalk.yellow(`Challenging package 0 from ${challenger1}`))
  await mockVouching.challenge(0, web3.utils.toWei('0.4', 'ether'), firstMetadataUri, metadataHash, { from: challenger1 })

  const secondPackageEntry = await mockVouching.getEntry('1')
  const secondMetadataUri = "https://raw.githubusercontent.com/zeppelinos/zos/98c9fc00699d0ed216950623539375fe1f0c2867/packages/lib/package.json"
  if (secondPackageEntry[1] === '0x0000000000000000000000000000000000000000') {
    const secondPackage = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    console.log(chalk.cyan(`Registering package ${secondPackage}...`))
    await mockVouching.register(
      secondPackage,
      web3.utils.toWei('100', 'ether'),
      secondMetadataUri,
      metadataHash,
      { from: owner }
    )
  }

  console.log(chalk.yellow(`Challenging package 1 from ${challenger1}`))
  await mockVouching.challenge(1, web3.utils.toWei('0.4', 'ether'), secondMetadataUri, metadataHash, { from: challenger1 })

  console.log(chalk.yellow(`Challenging package 1 from ${challenger2}`))
  await mockVouching.challenge(1, web3.utils.toWei('0.17', 'ether'), secondMetadataUri, metadataHash, { from: challenger2 })

  const thirdPackageEntry = await mockVouching.getEntry('2')
  if (thirdPackageEntry[1] === '0x0000000000000000000000000000000000000000') {
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

  let thirdPackageChallenger1VouchAmount = await mockVouching.getVouched('2', challenger1)
  if (thirdPackageChallenger1VouchAmount.toString() === '0') {
    console.log(chalk.cyan(`Vouching 10 Z for package 2 by ${challenger1}`))
    await mockVouching.vouch('2', web3.utils.toWei('10', 'ether'), { from: challenger1 })
  }

  let thirdPackageChallenger2VouchAmount = await mockVouching.getVouched('2', challenger2)
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
