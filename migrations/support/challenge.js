const chalk = require('chalk')

module.exports = async function challenge (mockVouching, packageId, challenger) {
  const metadataHash = "0x0000000000000000000000000000000000000001"
  console.log(chalk.yellow(`Challenging package ${packageId} from ${challenger}`))
  const challengeUri = "https://api.github.com/repos/zeppelinos/zos/issues/366"
  let challengeTx = await mockVouching.challenge(packageId, '100000000000000000', challengeUri, metadataHash, { from: challenger })
  let challengeId = challengeTx.logs[0].args.challengeID
  return challengeId
}
