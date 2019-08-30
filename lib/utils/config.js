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
/** @file config.js
 * @authors:
 *   lijie <jieli@matrix.io>
 * @date 2018
 */

/**
 * Utils
 *
 * @module utils
 */

/**
 * Utility functions
 *
 * @class [utils] config
 * @constructor
 */


/// required to define MAN_BIGNUMBER_ROUNDING_MODE
var BigNumber = require('bignumber.js');

var MAN_UNITS = [
    'wei',
    'kwei',
    'Mwei',
    'Gwei',
    'szabo',
    'finney',
    'femtoman',
    'picoman',
    'nanoman',
    'microman',
    'milliman',
    'nano',
    'micro',
    'milli',
    'man',
    'grand',
    'Mman',
    'Gman',
    'Tman',
    'Pman',
    'Eman',
    'Zman',
    'Yman',
    'Nman',
    'Dman',
    'Vman',
    'Uman'
];

module.exports = {
    MAN_PADDING: 32,
    MAN_SIGNATURE_LENGTH: 4,
    MAN_UNITS: MAN_UNITS,
    MAN_BIGNUMBER_ROUNDING_MODE: { ROUNDING_MODE: BigNumber.ROUND_DOWN },
    MAN_POLLING_TIMEOUT: 1000/2,
    defaultBlock: 'latest',
    defaultAccount: undefined
};

