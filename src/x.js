/**
 * Typecasts to number, then returns hexadecimal string
 * @param {*} value
 * @param {Boolean} caps
 * @return {String}
 */
module.exports = function(value, caps) {
	value = (+value).toString(16);
	if (caps) {
		value = value.toUpperCase();
	}
	return value
};