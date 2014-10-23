/**
 * Returns value only if lowercase s.
 * @param {*} value
 * @param {Boolean} caps
 * @returns {String}
 */
module.exports = function(value, caps) {
	return caps ? '%S' : value;
};