/**
 * Typecasts to number, then returns octal string
 * @param {*} value
 * @param {Boolean} caps
 * @returns {String}
 */
module.exports = function(value, caps) {
	return caps ? "%O" : (+value).toString(8);
};