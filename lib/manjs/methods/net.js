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
/** @file net.js
 * @authors: lijie <jieli@matrix.io>
 * @date 2018
 */

var utils = require('../../utils/utils');
var Property = require('../property');

var Net = function (man) {
    this._requestManager = man._requestManager;

    var self = this;

    properties().forEach(function(p) {
        p.attachToObject(self);
        p.setRequestManager(man._requestManager);
    });
};

/// @returns an array of objects describing aiman.man api properties
var properties = function () {
    return [
        new Property({
            name: 'listening',
            getter: 'net_listening'
        }),
        new Property({
            name: 'peerCount',
            getter: 'net_peerCount',
            outputFormatter: utils.toDecimal
        })
    ];
};

module.exports = Net;
