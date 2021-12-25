const ethers = require("ethers")
const tokenlist = require("./assets/tokenlist.json")
const RPC_URL = "http://127.0.0.1:9650/ext/bc/C/rpc"
const Dex = require("./dex")

const routers = {
 png: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
 joe: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
}

const factories = {
 png: "0xefa94DE7a4656D787667C749f7E1223D71E9FD88",
 joe: "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10",
}

// returns the ethersjs provider
function getProvider() {
 return new ethers.providers.JsonRpcProvider(RPC_URL)
}

// returns token for a given symbol
function getToken(symbol) {
 return tokenlist.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase())
}

async function main() {
 const provider = getProvider()

 const joe = new Dex(provider, routers.joe, factories.joe)
 const png = new Dex(provider, routers.png, factories.png)

 const token1 = getToken("usdt.e")
 const token2 = getToken("usdc.e")

 const quote_png = await png.getQuote(token1, token2, 1, provider)
 const quote_joe = await joe.getQuote(token1, token2, 1, provider)

 console.log(quote_png, quote_joe)
}

main()
