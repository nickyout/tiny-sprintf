/**
 * Typecasts to number, returns as byte string
 * @param {*} value
 * @param {Boolean} caps
 * @returns {String}
 */
module.exports = function(value, caps) {
	return caps ? "%B" : (+value).toString(2);
};