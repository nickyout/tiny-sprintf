/**
 * Typecasts to number, then returns the equivalent ASCII char code.
 * @param {*} value
 * @param {Boolean} caps
 * @returns {String}
 */
module.exports = function(value, caps) {
	return caps ? "%C" : String.fromCharCode(+value);
};