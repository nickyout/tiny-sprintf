var path = require('path'),
	fs = require('fs'),
	UglifyJS = require("uglify-js"),
	typeReplace = /module\.exports\s*=\s*/,
	regFalse = /^(false|0|no)$/i,
	srcReplace = "/* type entry */",
	srcPath = 'src/sprintf.js',
	typeGlobPath = 'src/?.js',
	destFolderDefault = 'dist',
	destFileNameDefault = 'sprintf.custom.js';

module.exports = function(grunt, ROOT) {
	return {
		"description": "Build "+destFileNameDefault+" (optional args :[types]:[destPath]:[doMinify])",
		/**
		 * Build script. Run with <code>grunt build</code> to execute.
		 * @param {String} [types="(all)"] - string containing all type conversions you want to include.
		 * Default is all type conversions (single character js files) in the folder <code>type</code>
		 * @param {String} [destPath="dist/sprintf.custom.js"] - pass destination path.
		 * If path points to a dir, <code>"sprintf.custom.js"</code> is added.
		 * @param {String} [doMinify=true] - pass <code>"false"</code>, <code>"0"</code> or
		 * <code>"no"</code> to disable
		 */
		"execute": function(types, destPath, doMinify) {
			types = types ? types.toLowerCase() : '';
			destPath || (destPath = destFolderDefault);
			doMinify = !doMinify || doMinify.search(regFalse) == -1;
			if (grunt.file.isDir(destPath)) {
				// If name does not have an ext, append 'sprintf.custom.js'
				destPath = path.resolve(destPath, destFileNameDefault);
			}
			var typePaths = grunt.file.expand(typeGlobPath),
				typeStrings = [],
				typeChars = ['s'],
				hilit = ROOT.style.color,
				typePath,
				typeChar,
				outString,
				i = 0;

			while (typePath = typePaths[i++]) {
				typeChar = path.basename(typePath)[0].toLowerCase();
				if (!types || types.indexOf(typeChar) !== -1) {
					typeStrings.push(grunt.file.read(typePath).replace(typeReplace, 's.' + typeChar + '='));
					typeChars.push(typeChar);
				}
			}
			outString = grunt.file.read(srcPath).replace(srcReplace, typeStrings.join('\n'));
			if (doMinify) {
				outString = outString.replace(/\bundefined\b/g, 'u');
				outString = UglifyJS.minify(outString, {
					fromString: true,
					unsafe: true
				}).code;
			}
			grunt.file.write(destPath, outString);
			grunt.log.writeln(">> " +"Built sprintf with types "[hilit] + typeChars.join() +
				" to "[hilit] + destPath + (" (" + fs.statSync(destPath)['size'] + " bytes" + (doMinify ? ", minified" : "") + ")")[hilit]);
		},
		"visible": true
	}
};