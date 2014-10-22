# tiny-sprintf
Tiny but complete.

*   Implements sprintf based on the [php doc][php]. They have some nice examples. 
*   Is only 550B minified (I guess that's even less gzipped). 
*   By default only supports conversion type `s`, but that can be easily extended. I don't really see why you need these conversions when everything gets typecasted to string anyway. 

## Install

```
npm install tiny-sprintf
```

## What does it do

It makes it easy to create monospace text with indenting and alignment. 

Stuff like this:

```
   name  type        description
   ===== =========== ========================
   a     value...... contains nothing
   ab    property... is important
   abc   method..... deprecated
   test  method..... unused
   toolo method..... too long
   metho method..... method with cut off name
```

Possible with this (for the values of each line):

```javascript
sprintf("  %-5.5s %-'.-11.11s %-25.25s", name, type, description);
```

So if you want that stuff in the console or anywhere in your application, you can use sprintf. 

## Format
The full format (where `[]` means optional element) is:
```javascript
"%[+][index$]['padchar][-][minWidth][.maxWidth]type"
```
Explanation of elements:

1.  `%` 
    *   defines the start of a substring to interpret. 
2.  `+` 
    *   if type is `d` and positive, prepend value with a `+` character. Not implemented by default.
3.  `index$` 
    *   where index is an integer. 
    *   Points to argument to use as value. 
    *   Default is using an index, starting at 1, that is incremented with each replace done. 
    *   Note: `0$` will point to the string to replace, and you probably don't want that.
4.  `'padchar`
    *   where padchar is a single character of any kind. 
    *   It must be preceded by a single quote (`'`). 
    *   Default is `" "`
    *   Note: define your string with double qoutes and everything will be fine. If padchar is zero (`0`), you can leave out the quote. 
5.  `-` 
    *   If added, the value gets left aligned. 
    *   Default is is right aligned. 
    *   Note: only makes sense with `minWidth` or `maxWidth` defined.
6.  `minWidth` 
    *   where minWidth is an integer. 
    *   If the value (see `index$`) in string form is shorter than this, the rest gets filled up with the padchar. It's added on the left or right of value, depending on the alignment setting (see `-`).
7.  `.maxWidth` 
    *   where maxWidth is an integer. 
    *   If the value with padding is longer than this value, it gets cut off. Alignment is the same as with minWidth.
8.  `type` 
    *   where type is a string `s`, but this collection can be extended. 
    *   Does typecasting on the value before it is converted to string. Most of the times, you will probably just want to use `s`

## Adding conversion types
Punch functions into the `sprintf` function under the same property as the type character. Expect args `value, plusChar` and return the value in the desired format. You don't have to convert it to string. 

For example, adding `d` (typecast to Number, add plus if desired) is like: 

```javascript
sprintf.d = function(value, plusChar) {
    return (plusChar || '') + (+value);
};
```

Most times, you will not need `plusChar`. 

## Examples
```javascript
sprintf.d = function(value, plusChar) {
    return (plusChar || '') + (+value);
};
// Type casting...
sprintf('%s', 10); // '10'
sprintf('%s', 'abc'); // 'abc'
sprintf('%d', 12); // '12'
sprintf('%d', 'abc'); // 'NaN'

// Limit length
sprintf("%.5s", 'abcdef'); // 'bcdef'
sprintf("%-.5s", 'abcdef'); // 'abcde'

// Indent to length
sprintf("%5s", 'a'); // '    a'
sprintf("%-5s", 'a'); // 'a    '
sprintf("%5.4s", 'abc'); // ' abc'
sprintf("%-5.4s", 'abc'); // 'abc '

// Use pad chars
sprintf("%04s", 10); // "0010"
sprintf("%'#4s", 10); // "##10"

// Use arguments in order
sprintf("%1$s, %2$s, %2$s, %1$s!", 'left', 'right'); // 'left, right, right, left!'

// Escape anything else
sprintf('%%', 1); // '%'
sprintf('%T', 'abc'); // 'T'
```

## Run tests

Enter the sprintf directory, run `npm install` then run `npm test`. It uses [Grunt][grunt], so make sure you have that installed. That, or run [nodeunit][nunit] on the file `./test/sprintf.js` directly. 

[php]: http://php.net/manual/en/function.sprintf.php "Php sprintf"
[grunt]: http://gruntjs.com/getting-started "Grunt getting started"
[nunit]: https://github.com/caolan/nodeunit "Nodeunit on Github"
