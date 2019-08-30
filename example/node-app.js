#!/usr/bin/env node

var Aiman = require('../index.js');
var aiman = new Aiman();

aiman.setProvider(new aiman.providers.HttpProvider('http://localhost:8545'));

var coinbase = aiman.man.coinbase;
console.log(coinbase);

var balance = aiman.man.getBalance(coinbase);
console.log(balance[0].balance.toString(10));
