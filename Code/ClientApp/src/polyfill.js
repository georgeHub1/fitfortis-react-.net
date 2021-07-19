import 'core-js/es/symbol';
import 'core-js/es/object';
import 'core-js/es/function';
import 'core-js/es/number';
import 'core-js/es/math';
import 'core-js/es/string';
import 'core-js/es/date';
import 'core-js/es/array';
import 'core-js/es/regexp';
import 'core-js/es/map';
import 'core-js/es/weak-map';
import 'core-js/es/set';
import 'core-js/es/reflect';
import 'core-js/es/promise';
import 'core-js/es/json';

if (!String.prototype.includes) {
	// eslint-disable-next-line
	String.prototype.includes = function (search, start) {
		// eslint-disable-next-line
		'use strict';
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		}
		return this.indexOf(search, start) !== -1;
	};
}


if (!Array.prototype.includes) {
	// eslint-disable-next-line
	Object.defineProperty(Array.prototype, 'includes', {
		// eslint-disable-next-line
		value: function (searchElement, fromIndex) {
			if (this == null) {
				throw new TypeError('"this" is null or not defined');
			}

			// 1. Let O be ? ToObject(this value).
			// eslint-disable-next-line
			var o = Object(this);

			// 2. Let len be ? ToLength(? Get(O, "length")).
			// eslint-disable-next-line
			var len = o.length >>> 0;

			// 3. If len is 0, return false.
			if (len === 0) {
				return false;
			}

			// 4. Let n be ? ToInteger(fromIndex).
			// (If fromIndex is undefined, this step produces the value 0.)
			// eslint-disable-next-line
			var n = fromIndex | 0;

			// 5. If n ≥ 0, then
			// a. Let k be n.
			// 6. Else n < 0,
			// a. Let k be len + n.
			// b. If k < 0, let k be 0.
			// eslint-disable-next-line
			var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

			function sameValueZero (x, y) {
				return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
			}

			// 7. Repeat, while k < len
			while (k < len) {
				// a. Let elementK be the result of ? Get(O, ! ToString(k)).
				// b. If SameValueZero(searchElement, elementK) is true, return true.
				if (sameValueZero(o[k], searchElement)) {
					return true;
				}
				// c. Increase k by 1.
				k++;
			}

			// 8. Return false
			return false;
		}
	});
}
