/*
    This file is part of aiman.js.

    aiman.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    aiman.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with aiman.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file aiman.js
 * @author jie li <matrix.io>
 * @date 2018
 */

"use strict";

var formatters = require('../formatters');
var utils = require('../../utils/utils');
var Method = require('../method');
var Property = require('../property');
var c = require('../../utils/config');
var Contract = require('../contract');
var watches = require('./watches');
var Filter = require('../filter');
var IsSyncing = require('../syncing');
var namereg = require('../namereg');
var Iban = require('../iban');
var transfer = require('../transfer');

var blockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "man_getBlockByHash" : "man_getBlockByNumber";
};

var getSignAccountsCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "man_getSignAccountsByHash" : "man_getSignAccountsByNumber";
};

var transactionFromBlockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'man_getTransactionByBlockHashAndIndex' : 'man_getTransactionByBlockNumberAndIndex';
};

var uncleCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'man_getUncleByBlockHashAndIndex' : 'man_getUncleByBlockNumberAndIndex';
};

var getBlockTransactionCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'man_getBlockTransactionCountByHash' : 'man_getBlockTransactionCountByNumber';
};

var uncleCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'man_getUncleCountByBlockHash' : 'man_getUncleCountByBlockNumber';
};

function Man(man) {
    this._requestManager = man._requestManager;

    var self = this;

    methods().forEach(function (method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function (p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });


    this.iban = Iban;
    this.sendIBANTransaction = transfer.bind(null, this);
}

Object.defineProperty(Man.prototype, 'defaultBlock', {
    get: function () {
        return c.defaultBlock;
    },
    set: function (val) {
        c.defaultBlock = val;
        return val;
    }
});

Object.defineProperty(Man.prototype, 'defaultAccount', {
    get: function () {
        return c.defaultAccount;
    },
    set: function (val) {
        c.defaultAccount = val;
        return val;
    }
});

var methods = function () {
    var getBalance = new Method({
        name: 'getBalance',
        call: 'man_getBalance',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: formatters.outputBalanceFormatter
    });
    var getStorageAt = new Method({
        name: 'getStorageAt',
        call: 'man_getStorageAt',
        params: 4,
        inputFormatter: [null, utils.toHex, null, formatters.inputDefaultBlockNumberFormatter]
    });
    var getDeposit = new Method({
        name: 'getDeposit',
        call: 'man_getDeposit',
        params: 1,
        inputFormatter: [formatters.inputDefaultBlockNumberFormatter]
    });
    var getDepositByAddr = new Method({
        name: 'getDepositByAddr',
        call: 'man_getDepositByAddr',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter]
    });
    var getValidatorGroupInfo = new Method({
        name: 'getValidatorGroupInfo',
        call: 'man_getValidatorGroupInfo',
        params: 1,
        inputFormatter: [formatters.inputDefaultBlockNumberFormatter]
    });
    var getCode = new Method({
        name: 'getCode',
        call: 'man_getCode',
        params: 3,
        inputFormatter: [formatters.inputAddressFormatter, null, formatters.inputDefaultBlockNumberFormatter]
    });

    var getBlock = new Method({
        name: 'getBlock',
        call: blockCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, function (val) {
            return !!val;
        }],
        outputFormatter: formatters.outputBlockFormatter
    });

    var getUncle = new Method({
        name: 'getUncle',
        call: uncleCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
        outputFormatter: formatters.outputBlockFormatter,

    });

    var getCompilers = new Method({
        name: 'getCompilers',
        call: 'man_getCompilers',
        params: 0
    });

    var getBlockTransactionCount = new Method({
        name: 'getBlockTransactionCount',
        call: getBlockTransactionCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var getBlockUncleCount = new Method({
        name: 'getBlockUncleCount',
        call: uncleCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var getTransaction = new Method({
        name: 'getTransaction',
        call: 'man_getTransactionByHash',
        params: 1,
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionFromBlock = new Method({
        name: 'getTransactionFromBlock',
        call: transactionFromBlockCall,
        params: 3,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex, null],
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionReceipt = new Method({
        name: 'getTransactionReceipt',
        call: 'man_getTransactionReceipt',
        params: 1,
        outputFormatter: formatters.outputTransactionReceiptFormatter
    });

    var getTransactionCount = new Method({
        name: 'getTransactionCount',
        call: 'man_getTransactionCount',
        params: 2,
        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var sendRawTransaction = new Method({
        name: 'sendRawTransaction',
        call: 'man_sendRawTransaction',
        params: 1,
        inputFormatter: [null]
    });

    var sendTransaction = new Method({
        name: 'sendTransaction',
        call: 'man_sendTransaction',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    var signTransaction = new Method({
        name: 'signTransaction',
        call: 'man_signTransaction',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    var sign = new Method({
        name: 'sign',
        call: 'man_sign',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, null]
    });

    var call = new Method({
        name: 'call',
        call: 'man_call',
        params: 2,
        inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter]
    });

    var estimateGas = new Method({
        name: 'estimateGas',
        call: 'man_estimateGas',
        params: 1,
        inputFormatter: [formatters.inputCallFormatter],
        outputFormatter: utils.toDecimal
    });

    var compileSolidity = new Method({
        name: 'compile.solidity',
        call: 'man_compileSolidity',
        params: 1
    });

    var compileLLL = new Method({
        name: 'compile.lll',
        call: 'man_compileLLL',
        params: 1
    });

    var compileSerpent = new Method({
        name: 'compile.serpent',
        call: 'man_compileSerpent',
        params: 1
    });

    var submitWork = new Method({
        name: 'submitWork',
        call: 'man_submitWork',
        params: 3
    });

    var getWork = new Method({
        name: 'getWork',
        call: 'man_getWork',
        params: 0
    });
    var getEntrustList = new Method({
        name: 'getEntrustList',
        call: 'man_getEntrustList',
        params: 1
    });
    var getSignAccounts = new Method({
        name: 'getSignAccounts',
        call: getSignAccountsCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: formatters.outputVerifiedSignFormatter
    });
    var getSelfLevel = new Method({
        name: 'getSelfLevel',
        call: 'man_getSelfLevel',
        params: 0
    });
    var getFutureRewards = new Method({
        name: 'getFutureRewards',
        call: 'man_getFutureRewards',
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter]
    });
    var getTopologyStatus = new Method({
        name: 'getTopologyStatus',
        call: 'man_getTopologyStatusByNumber',
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter]
    });
    var getMatrixCoin = new Method({
        name: 'getMatrixCoin',
        call: 'man_getMatrixCoin',
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter]
    });
    var getMatrixStateByNum = new Method({
        name: 'getMatrixStateByNum',
        call: 'man_getMatrixStateByNum',
        params: 2,
        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter]
    });
    var getMatrixCoinConfig = new Method({
        name: 'getMatrixCoinConfig',
        call: 'man_getMatrixCoinConfig',
        params: 2,
        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter]
    });
    var getDestroyBalance = new Method({
        name: 'getDestroyBalance',
        call: 'man_getDestroyBalance',
        params: 1,
        inputFormatter: [formatters.inputDefaultBlockNumberFormatter]
    });
    var getBlackList = new Method({
        name: 'getBlackList',
        call: 'man_getBlackList',
    });
    var getUpTime = new Method({
        name: 'getUpTime',
        call: 'man_getUpTime',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter]
    });
    var newBlockFilter = new Method({
        name: 'newBlockFilter',
        call: 'man_newBlockFilter'
    });
    var newFilter = new Method({
        name: 'newFilter',
        call: 'man_newFilter',
        params: 1
    });
    var uninstallFilter = new Method({
        name: 'uninstallFilter',
        call: 'man_uninstallFilter',
        params: 1,
        inputFormatter: [utils.toHex]
    });
    var getFilterChanges = new Method({
        name: 'getFilterChanges',
        call: 'man_getFilterChanges',
        params: 1,
        inputFormatter: [utils.toHex]
    });
    var getFilterLogs = new Method({
        name: 'getFilterLogs',
        call: 'man_getFilterLogs',
        params: 1,
        inputFormatter: [utils.toHex]
    });
    var getLogs = new Method({
        name: 'getLogs',
        call: 'man_getLogs',
        params: 1
    });
    return [
        getBalance,
        getMatrixCoin,
        getDepositByAddr,
        getDeposit,
        getValidatorGroupInfo,
        getMatrixStateByNum,
        getStorageAt,
        getCode,
        getBlock,
        getUncle,
        getCompilers,
        getBlockTransactionCount,
        getBlockUncleCount,
        getTransaction,
        getTransactionFromBlock,
        getTransactionReceipt,
        getTransactionCount,
        call,
        estimateGas,
        sendRawTransaction,
        signTransaction,
        sendTransaction,
        sign,
        compileSolidity,
        compileLLL,
        compileSerpent,
        submitWork,
        getWork,
        getEntrustList,
        getSignAccounts,
        getFutureRewards,
        getTopologyStatus,
        getSelfLevel,
        getMatrixCoinConfig,
        getDestroyBalance,
        getBlackList,
        getUpTime,
        newBlockFilter,
        newFilter,
        uninstallFilter,
        getFilterChanges,
        getFilterLogs,
        getLogs
    ];
}

var properties = function () {
    return [
        new Property({
            name: 'coinbase',
            getter: 'man_coinbase'
        }),
        new Property({
            name: 'mining',
            getter: 'man_mining'
        }),
        new Property({
            name: 'hashrate',
            getter: 'man_hashrate',
            outputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'syncing',
            getter: 'man_syncing',
            outputFormatter: formatters.outputSyncingFormatter
        }),
        new Property({
            name: 'gasPrice',
            getter: 'man_gasPrice',
            outputFormatter: formatters.outputBigNumberFormatter
        }),
        new Property({
            name: 'accounts',
            getter: 'man_accounts'
        }),
        new Property({
            name: 'blockNumber',
            getter: 'man_blockNumber',
            outputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'protocolVersion',
            getter: 'man_protocolVersion'
        })
    ];
}

Man.prototype.contract = function (abi) {
    var factory = new Contract(this, abi);
    return factory;
};

Man.prototype.filter = function (options, callback, filterCreationErrorCallback) {
    return new Filter(options, 'man', this._requestManager, watches.man(), formatters.outputLogFormatter, callback, filterCreationErrorCallback);
};

Man.prototype.namereg = function () {
    return this.contract(namereg.global.abi).at(namereg.global.address);
};

Man.prototype.icapNamereg = function () {
    return this.contract(namereg.icap.abi).at(namereg.icap.address);
};

Man.prototype.isSyncing = function (callback) {
    return new IsSyncing(this._requestManager, callback);
};

module.exports = Man;
