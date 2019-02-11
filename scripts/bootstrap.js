const BN = require('bn.js')
const MockVouching = artifacts.require('MockVouching.sol')
const ZepToken = artifacts.require('ZepToken.sol')
const chalk = require('chalk')

const MINT_AMOUNT = new BN(web3.utils.toWei('1000', 'ether'))

async function bootstrap () {
  const mockVouching = await MockVouching.deployed()
  const zepToken = await ZepToken.deployed()
  const metadataHash = "0x0000000000000000000000000000000000000001"

  async function challenge (packageId, challenger) {
    console.log(chalk.yellow(`Challenging package ${packageId} from ${challenger}`))
    const challengeUri = "https://raw.githubusercontent.com/TPL-protocol/tpl-contracts-eth/2a0f8b0a8185f52791ff84b7d1039cec25cef256/package.json"
    let challengeTx = await mockVouching.challenge(packageId, web3.utils.toWei('0.1', 'ether'), challengeUri, metadataHash, { from: challenger })
    let challengeId = challengeTx.logs[0].args.challengeID
    return challengeId
  }

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
  const [appealResolver, admin, owner, challenger1, challenger2, challenger3, challenger4, appealer] = accounts

  const extraAccounts = [
    '0x8f7F92e0660DD92ecA1faD5F285C4Dca556E433e',
    '0x883E6B4C10520E2bc2D5dEB78d8AE4C1f7752ce7',
    '0x7A8cda94b311F58291d6F9E681599c915E31c338'
  ]

  // Mint to all of the accounts
  await Promise.all(accounts.concat(extraAccounts).map(account => mint(account, MINT_AMOUNT)))

  const firstMetadataUri = "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-eth/0b1e1810b193c06c3fd0edab591f6738c6577bb5/package.json"
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

  console.log(chalk.yellow(`Challenging package 0 from ${challenger1}`))
  await mockVouching.challenge(0, web3.utils.toWei('0.4', 'ether'), firstMetadataUri, metadataHash, { from: challenger1 })

  const secondMetadataUri = "https://raw.githubusercontent.com/TPL-protocol/tpl-contracts-eth/2a0f8b0a8185f52791ff84b7d1039cec25cef256/package.json"
  const secondPackage = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  console.log(chalk.cyan(`Registering package ${secondPackage}...`))
  await mockVouching.register(
    secondPackage,
    web3.utils.toWei('100', 'ether'),
    secondMetadataUri,
    metadataHash,
    { from: owner }
  )

  const challenge1Id = await challenge(1, challenger1)
  console.log(chalk.green(`Accepting challenge ${challenge1Id} from ${owner}...`))
  await mockVouching.accept(challenge1Id, { from: owner })

  const challenge2Id = await challenge(1, challenger2)
  console.log(chalk.red(`Rejecting challenge ${challenge2Id} from ${owner}...`))
  await mockVouching.reject(challenge2Id, { from: owner })

  const challenge3Id = await challenge(1, challenger1)
  console.log(chalk.green(`Accepting challenge ${challenge3Id} from ${owner}...`))
  await mockVouching.accept(challenge3Id, { from: owner })
  await mockVouching.appeal(challenge3Id, { from: appealer })

  const challenge4Id = await challenge(1, challenger2)
  console.log(chalk.red(`Rejecting challenge ${challenge4Id} from ${owner}...`))
  await mockVouching.reject(challenge4Id, { from: owner })
  await mockVouching.appeal(challenge4Id, { from: appealer })

  const challenge5Id = await challenge(1, challenger3)
  console.log(chalk.green(`Accepting challenge ${challenge5Id} from ${owner}...`))
  await mockVouching.accept(challenge5Id, { from: owner })
  await mockVouching.appeal(challenge5Id, { from: appealer })
  await mockVouching.affirmAppeal(challenge5Id, { from: appealResolver })

  const challenge6Id = await challenge(1, challenger4)
  console.log(chalk.red(`Rejecting challenge ${challenge6Id} from ${owner}...`))
  await mockVouching.reject(challenge6Id, { from: owner })
  await mockVouching.appeal(challenge6Id, { from: appealer })
  await mockVouching.affirmAppeal(challenge6Id, { from: appealResolver })

  const challenge7Id = await challenge(1, challenger3)
  console.log(chalk.green(`Accepting challenge ${challenge7Id} from ${owner}...`))
  await mockVouching.accept(challenge7Id, { from: owner })
  await mockVouching.appeal(challenge7Id, { from: appealer })
  await mockVouching.dismissAppeal(challenge7Id, { from: appealResolver })

  const challenge8Id = await challenge(1, challenger4)
  console.log(chalk.red(`Rejecting challenge ${challenge8Id} from ${owner}...`))
  await mockVouching.reject(challenge8Id, { from: owner })
  await mockVouching.appeal(challenge8Id, { from: appealer })
  await mockVouching.dismissAppeal(challenge8Id, { from: appealResolver })

  const thirdPackageEntry = await mockVouching.getEntry('2')
  if (thirdPackageEntry[1] === '0x0000000000000000000000000000000000000000') {
    const thirdPackage = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
    console.log(chalk.cyan(`Registering package ${thirdPackage}...`))
    await mockVouching.register(
      thirdPackage,
      web3.utils.toWei('20', 'ether'),
      "https://raw.githubusercontent.com/levelkdev/registry-builder/9f657ff44d48664f2abb5e1b31c3d83f958e7333/package.json",
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
