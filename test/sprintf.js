var sprintf = require('../sprintf');

sprintf.pass = /d|s/;

sprintf.d = function(value, plusChar) {
	return (plusChar || '') + (+value);
};

module.exports = {
	"type": function(test) {
		test.equal(sprintf('%s', 10), '10', "s converts to string");
		test.equal(sprintf('%s', 'abc'), 'abc');
		test.equal(sprintf('%d', 12), '12', "d converts to number");
		test.equal(sprintf('%d', 'abc'), 'NaN', 'd converts to NaN');
		test.done();
	},

	"plusChar": function(test) {
		test.equal(sprintf('%+d', 10), "+10", 'works with d');
		test.equal(sprintf('%+s', 10), "10", 'does not work with s');
		test.done();
	},

	"argIndex": function(test) {
		test.equal(sprintf('%2$s%1$s', 'a', 'b'), 'ba', 'selectable args by index');
		test.done();
	},

	"minSpace": function(test) {
		test.equal(sprintf("%5s", 'a'), '    a', 'defaults to right aligned');
		test.equal(sprintf("%-5s", 'a'), 'a    ');
		test.done();
	},

	"maxSpace": function(test) {
		test.equal(sprintf("%.5s", 'abcdef'), 'bcdef', 'defaults to right aligned');
		test.equal(sprintf("%-.5s", 'abcdef'), 'abcde');
		test.equal(sprintf("%5.4s", 'abc'), ' abc', 'cuts off minSpace as well');
		test.equal(sprintf("%-5.4s", 'abc'), 'abc ', '...in both ways');
		test.done();
	},

	"padchar": function(test) {
		test.equal(sprintf("%04s", 10), "0010", "Zero char");
		test.equal(sprintf("%'#4s", 10), "##10", "Custom char");
		test.equal(sprintf("%'#-4s", 10), "10##", "Left aligned char");
		test.done();
	},

	"escape": function(test) {
		test.equal(sprintf("%%", 1), "%", "Escapes anything else");
		test.equal(sprintf("%T%A%S", "a"), "TAS");
		test.equal(sprintf("%%s%s%s"), "%sundefinedundefined", "Escapes with lastIndex");
		test.done();
	},

	"empty": function(test) {
		test.equal(sprintf("%s"), "undefined", "At least it is consistent");
		test.done();
	},

	"multi": function(test) {
		test.equal(sprintf("%1$s, %2$s, %2$s, %1$s!", 'left', 'right'), "left, right, right, left!");
		test.done();
	}
};
