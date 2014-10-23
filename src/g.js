/**
 * Does f or e, depending on the size of value.
 * Between <code>131071</code> and <code>-131072</code>, f is done. Outside, e.
 * Based on a preset bitshift action.
 * @param value
 * @param caps
 * @returns {String|undefined}
 */
module.exports = function(value, caps) {
	if (~~((value>>17) +.5)) {
		value = (+value).toExponential();
		return caps ? value.toUpperCase() : value;
	} else {
		return (+value).toLocaleString();
	}
};