/**
 * sprintf implementation. Get pretty indented monospace strings.
 * <p/>
 * The full format (where <code>[]</code> means optional element) is:</br>
 * <code>"%[+][index$]['padchar][-][minWidth][.maxWidth]type"</code>
 * <p/>
 * Explanation of elements:
 * <ol>
 *     <li><code>%</code> defines the start of a substring to interpret. </code>
 *     <li><code>+</code> means, when type is <code>d</code> and positive, prepend value with a <code>+</code> character</li>
 *     <li><code>index$</code> where index is an integer. Points to argument to use as value.
 *     Default is using an index, starting at 1, that is incremented with each replace done.
 *     Note that <code>0$</code> will point to the string to replace, and you probably don't want that.</li>
 *     <li><code>'padchar</code> where padchar is a single character of any kind. It must be preceded by a single quote
 *     (<code>'</code>). Define your string with double qoutes and everything will be fine. If padchar is zero
 *     (<code>0</code>), you can leave out the quote. The default is the space (<code>" "</code>) character</li>
 *     <li><code>-</code> means the value gets left aligned. Leave it out for right aligned, the default. Only makes
 *     sense with minWidth or maxWidth defined.</li>
 *     <li><code>minWidth</code> where minWidth is an integer. If the value (see index$) in string form is shorter than
 *     this, the rest gets filled up with the padchar. It's added on the left or right of value, depending on the
 *     alignment setting (see -).
 *     <li><code>.maxWidth</code> where maxWidth is an integer. If the value with padding is longer than this value,
 *     it gets cut off. Alignment is the same as with minWidth.
 *     <li><code>type</code> where type is a string that is either <code>s</code> or <code>d</code>. Does typecasting
 *     on the value before it is converted to string. <code>s</code> typecasts to string,
 *     <code>d</code> typecasts to number. Most of the times, you will probably just want to use <code>s</code></li>
 * </ol>
 * @param {String} str - the string to parse
 * @param {...*} args - arguments, used in order, or referenced by n$
 * @returns {String}
 * @method module:h-util.sprintf
 * @example
 * // Type casting...
 * sprintf('%s', 10); // '10'
 * sprintf('%s', 'abc'); // 'abc'
 * sprintf('%d', 12); // '12'
 * sprintf('%d', 'abc'); // 'NaN'
 *
 * // Escape anything else
 * sprintf('%%', 1); // '%'
 * sprintf('%T', 'abc'); // 'T'
 *
 * // Limit length
 * sprintf("%.5s", 'abcdef'); // 'bcdef'
 * sprintf("%-.5s", 'abcdef'); // 'abcde'
 *
 * // Indent to length
 * sprintf("%5s", 'a'); // '    a'
 * sprintf("%-5s", 'a'); // 'a    '
 * sprintf("%5.4s", 'abc'); // ' abc'
 * sprintf("%-5.4s", 'abc'); // 'abc '
 *
 * // Use pad chars
 * sprintf("%04s", 10); // "0010"
 * sprintf("%'#4s", 10); // "##10"
 *
 * // Use arguments in order
 * sprintf("%1$s, %2$s, %2$s, %1$s!", 'left', 'right'); // 'left, right, right, left!'
 */
var undefined,
	r = /%(\+)?(\d+\$)?(0|'.)?(-)?(\d+)?(\.\d+)?(.)/g,
	s = function(str) {
		var length = 'length',
			substr = 'substr',
			lastIndex = 'lastIndex',
			value,
			index = 1,
			execMatch,
			argIndex,
			padChar,
			leftAlign,
			minDist,
			maxDist;
		while (execMatch = r.exec(str)) {
			var plusChar = execMatch[1],
				type = execMatch[7],
				typeLowerCase = type.toLowerCase();

			// arg from index
			if ((argIndex = execMatch[2]) && argIndex[(padChar = argIndex[length] - 1)] == "$") {
				argIndex = argIndex[substr](0, padChar);
			}

			if (s[typeLowerCase] && (value = s[typeLowerCase](arguments[argIndex || index], /[A-Z]/.test(type), plusChar)) !== undefined) {

				// pad char
				if (padChar = execMatch[3]) {
					if (padChar[0] == "'") {
						padChar = padChar[1];
					}
				} else {
					padChar = ' ';
				}

				leftAlign = execMatch[4];
				minDist = execMatch[5];

				// cutoff
				if ((maxDist = execMatch[6]) && maxDist[0] == '.' && maxDist[substr](1)) {
					maxDist = maxDist[substr](1);
				}

				value+='';
				if (minDist) while (value[length] < minDist) {
					value = leftAlign ? (value + padChar) : (padChar + value);
				}
				if (maxDist && value[length] > maxDist) {
					value = leftAlign ? value[substr](0, maxDist) : value[substr](value[length] - maxDist);
				}
				index++;
			} else {
				value = type;
			}
			str = str[substr](0, plusChar = execMatch.index) + value + str[substr](r[lastIndex]);
			r[lastIndex] = value[length] + plusChar;
		}
		return str;
	};

/**
 * Typecasts to number, returns as byte string
 * @param {*} value
 * @param {Boolean} caps
 * @returns {String}
 */
s.b=function(value, caps) {
	return caps ? undefined : (+value).toString(2);
};
/**
 * Typecasts to number, then returns the equivalent ASCII char code.
 * @param {*} value
 * @param {Boolean} caps
 * @returns {String}
 */
s.c=function(value, caps) {
	return caps ? undefined : String.fromCharCode(+value);
};
/**
 * Typecasts to number, adds plus char if desired.
 * @param {*} value
 * @param {Boolean} caps
 * @param {String} [plusChar]
 * @returns {String}
 */
s.d=function(value, caps, plusChar) {
	return caps ? undefined : (plusChar || '') + (+value);
};
/**
 * Typecasts to number, then return 'scientific notation' (toExponential)
 * @param {*} value
 * @param {Boolean} caps
 * @returns {string}
 */
s.e=function(value, caps) {
	value = (+value).toExponential();
	return caps ? value.toUpperCase() : value;
};
/**
 * Typecasts to number, then returns locale aware format (toLocaleString).
 * @param {*} value
 * @returns {string}
 */
s.f=function(value) {
	return (+value).toLocaleString();
};
/**
 * Does f or e, depending on the size of value.
 * Between <code>131071</code> and <code>-131072</code>, f is done. Outside, e.
 * Based on a preset bitshift action.
 * @param value
 * @param caps
 */
s.g=function(value, caps) {
	if (~~((value>>17) +.5)) {
		value = (+value).toExponential();
		return caps ? value.toUpperCase() : value;
	} else {
		return (+value).toLocaleString();
	}
};
/**
 * Typecasts to number, then returns octal string
 * @param {*} value
 * @param {Boolean} caps
 * @returns {String}
 */
s.o=function(value, caps) {
	return caps ? undefined : (+value).toString(8);
};
/**
 * Returns string value only if lowercase s.
 * @param {*} value
 * @param {Boolean} caps
 * @returns {String}
 */
s.s=function(value, caps) {
	return caps ? undefined : value+'';
};
/**
 * Typecasts to number, then returns hexadecimal string
 * @param {*} value
 * @param {Boolean} caps
 * @return {String}
 */
s.x=function(value, caps) {
	value = (+value).toString(16);
	if (caps) {
		value = value.toUpperCase();
	}
	return value
};

module.exports = s;