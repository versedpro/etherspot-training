# Event Registry

This project is made with transaction Kit from EtherSpot. Using Account abraction same provided by banana wallet. Also Created a folder of contract in root of this project to push Contract code written in Solidity.

it is been deployed and Verified on Genosis Blockchain.

Contract Addess
`https://gnosisscan.io/address/0x9DC78b651F640244211c792a703fceD2c41F16f8#code`

Chiado Contract Address
`https://blockscout.chiadochain.net/address/0x90339ccA04A8532Bb76358d8CFFDEfEBD1938377/contracts`

Blocker :

There was issue when running the etherspot library even with there give getting-started examples. Looking and debugging at it.

Below is description of the issue

````ERROR in ./node_modules/@etherspot/eip1271-verification-util/dist/esm/index.js 3:0-19
Module not found: Error: Can't resolve 'os' in '/Users/testproject/txkit-quickstart/node_modules/@etherspot/eip1271-verification-util/dist/esm'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.```
````
Resolved :

Blocker has been resolved by adding react-app-rewired and config-override.js config file.


# trainingtest

