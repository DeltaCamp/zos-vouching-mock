const chalk = require('chalk')

module.exports = async function challenge (mockVouching, packageId, challenger) {
  const metadataHash = "0x0000000000000000000000000000000000000001"
  console.log(chalk.yellow(`Challenging package ${packageId} from ${challenger}`))
  const challengeUri = "https://raw.githubusercontent.com/TPL-protocol/tpl-contracts-eth/2a0f8b0a8185f52791ff84b7d1039cec25cef256/package.json"
  let challengeTx = await mockVouching.challenge(packageId, '100000000000000000', challengeUri, metadataHash, { from: challenger })
  let challengeId = challengeTx.logs[0].args.challengeID
  return challengeId
}
