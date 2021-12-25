const ethers = require("ethers")
const IPangolinRouter = require("@pangolindex/exchange-contracts/artifacts/contracts/pangolin-periphery/interfaces/IPangolinRouter.sol/IPangolinRouter.json")
const IPangolinFactory = require("@pangolindex/exchange-contracts/artifacts/contracts/pangolin-core/interfaces/IPangolinFactory.sol/IPangolinFactory.json")
const IPangolinPair = require("@pangolindex/exchange-contracts/artifacts/contracts/pangolin-core/interfaces/IPangolinPair.sol/IPangolinPair.json")

class Dex {
 /**
  * Set up the decentralized exchange wrapper
  * @param {ethers.providers.JsonRpcProvider} provider
  * @param {String} routerAddress
  */
 constructor(provider, routerAddress, factoryAddress) {
  this.provider = provider
  this.routerContract = new ethers.Contract(routerAddress, IPangolinRouter.abi, provider)
  this.factoryContract = new ethers.Contract(factoryAddress, IPangolinFactory.abi, provider)
 }

 getPairContract = (address) => {
  return new ethers.Contract(address, IPangolinPair.abi, this.provider)
 }

 getReserves = async (address1, address2) => {
  const pair = await this.factoryContract.getPair(address1, address2) // e.g. 0x1fFB6ffC629f5D820DCf578409c2d26A2998a140
  const pairContract = this.getPairContract(pair)
  const [reserve1, reserve2, timestamp] = await pairContract.getReserves()
  return [reserve1, reserve2]
 }

 /**
  * Get a quote for two given tokens and a given amount we want to trade.
  */
 getQuote = async (token1, token2, amountIn) => {
  try {
   // get the token addresses
   const address1 = token1.address
   const address2 = token2.address

   // set the decimals
   const token1Decimals = token1.decimals
   const token2Decimals = token2.decimals

   //  get pair
   const [reserve1, reserve2] = await this.getReserves(address1, address2)

   // get quote
   const quote = await this.routerContract.quote(
    ethers.utils.parseUnits(String(amountIn), token1Decimals),
    reserve1,
    reserve2
   )

   // return reformatted quote
   const amount = quote * 10 ** -token2Decimals
   return Number(amount)
  } catch (error) {
   console.log(error)
   return false
  }
 }
}

module.exports = Dex
