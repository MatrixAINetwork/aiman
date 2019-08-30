/*!
 * aiman.js - Matrix JavaScript API
 *
 * @license lgpl-3.0
 * @see https://github.com/matrix/aiman.js
*/

/*
 * This file is part of aiman.js.
 *
 * aiman.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * aiman.js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with aiman.js.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @file aiman.js
 */

var RequestManager = require('./manjs/requestmanager');
// var Iban = require('./manjs/iban');
var Man = require('./manjs/methods/man');
var Net = require('./manjs/methods/net');
var Personal = require('./manjs/methods/personal');
var Settings = require('./manjs/settings');
var version = require('./version.json');
var utils = require('./utils/utils');
var sha3 = require('./utils/sha3');
var extend = require('./manjs/extend');
var Batch = require('./manjs/batch');
var Property = require('./manjs/property');
var HttpProvider = require('./manjs/httpprovider');
var IpcProvider = require('./manjs/ipcprovider');
var BigNumber = require('bignumber.js');



function Manjs (provider) {
    this._requestManager = new RequestManager(provider);
    this.currentProvider = provider;
    this.man = new Man(this);
    this.net = new Net(this);
    this.personal = new Personal(this);
    this.settings = new Settings();
    this.version = {
        api: version.version
    };
    this.providers = {
        HttpProvider: HttpProvider,
        IpcProvider: IpcProvider
    };
    this._extend = extend(this);
    this._extend({
        properties: properties()
    });
}

// expose providers on the class
Manjs.providers = {
    HttpProvider: HttpProvider,
    IpcProvider: IpcProvider
};

Manjs.prototype.setProvider = function (provider) {
    this._requestManager.setProvider(provider);
    this.currentProvider = provider;
};

Manjs.prototype.reset = function (keepIsSyncing) {
    this._requestManager.reset(keepIsSyncing);
    this.settings = new Settings();
};

Manjs.prototype.BigNumber = BigNumber;
Manjs.prototype.toHex = utils.toHex;
Manjs.prototype.toAscii = utils.toAscii;
Manjs.prototype.toUtf8 = utils.toUtf8;
Manjs.prototype.fromAscii = utils.fromAscii;
Manjs.prototype.fromUtf8 = utils.fromUtf8;
Manjs.prototype.toDecimal = utils.toDecimal;
Manjs.prototype.fromDecimal = utils.fromDecimal;
Manjs.prototype.toBigNumber = utils.toBigNumber;
Manjs.prototype.toWei = utils.toWei;
Manjs.prototype.fromWei = utils.fromWei;
Manjs.prototype.isAddress = utils.isAddress;
Manjs.prototype.isChecksumAddress = utils.isChecksumAddress;
Manjs.prototype.toChecksumAddress = utils.toChecksumAddress;
Manjs.prototype.isIBAN = utils.isIBAN;
Manjs.prototype.padLeft = utils.padLeft;
Manjs.prototype.padRight = utils.padRight;


Manjs.prototype.sha3 = function(string, options) {
    return '0x' + sha3(string, options);
};

/**
 * Transforms direct icap to address
 */
// Manjs.prototype.fromICAP = function (icap) {
//     var iban = new Iban(icap);
//     return iban.address();
// };

var properties = function () {
    return [
        new Property({
            name: 'version.node',
            getter: 'man_clientVersion'
        }),
        new Property({
            name: 'version.network',
            getter: 'net_version',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.matrix',
            getter: 'man_protocolVersion',
            inputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'version.whisper',
            getter: 'shh_version',
            inputFormatter: utils.toDecimal
        })
    ];
};

Manjs.prototype.isConnected = function(){
    return (this.currentProvider && this.currentProvider.isConnected());
};

Manjs.prototype.createBatch = function () {
    return new Batch(this);
};

module.exports = Manjs;

