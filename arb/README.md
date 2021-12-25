# Arbitrage example

The goal of this project is to show the feasibility of executing arbitrage trades on Avalanche. We start out by observing a couple of pairs and simply show notifications on opportunities.

The next step is then to mark those arbitrage opportunities and put them into a worker queue, where the arb transactions are actuall processed and tracked.

# Setup

This proof of concept uses nodejs and the `ethersjs` library to interact with the smart contracts. We use a local RPC node to quickly query blockchain data.

## Token Lists

I didn't find a proper token list so I built my own using the pangolin defi + stablecoin lists. Simply run the snippet below to get the up-to-date version.

```bash
cd assets
wget -c https://raw.githubusercontent.com/pangolindex/tokenlists/main/defi.tokenlist.json
wget -c https://raw.githubusercontent.com/pangolindex/tokenlists/main/stablecoin.tokenlist.json

list_1=$(cat defi.tokenlist.json | jq ".tokens")
list_2=$(cat stablecoin.tokenlist.json | jq ".tokens")
jq --argjson arr1 "$list_1" --argjson arr2 "$list_2" -n \
'$arr1 + $arr2 | group_by(.Key)' | jq ".[0]" > tokenlist.json

rm *.tokenlist.json
```
