/*!
 * CSVParser.js
 * Mr-Data-Converter
 *
 * Input CSV or Tab-delimited data and this will parse it into a Data Grid Javascript object
 */

var isDecimalRe = /^\s*(\+|-)?((\d+([,\.]\d+)?)|([,\.]\d+))\s*$/,
  CSVParser = {

  //---------------------------------------
  // UTILS
  //---------------------------------------

  escapeText: function(string, format) {
    if (string===undefined) return '';
    if (format===undefined) format = 'html';
    if (format==='xml') {
      string = string.replace(/&/g, '&amp;');  // This needs to be first
      //string = string.replace(/"/g, '&quot;');  // Already converted
      string = string.replace(/'/g, '&apos;');
    }
    if (format==='rtf') {
      string = string.replace(/\\/g, '\\\'5c');  // This needs to be first
      string = string.replace(/\{/g, '\\\'7b');
      string = string.replace(/\}/g, '\\\'7d');
      string = string.replace(/~/g, '\\\'98');
    } else {
      string = string.replace(/</g, '&lt;');
      string = string.replace(/>/g, '&gt;');
    }
    // Common punctuation
    string = string.replace(/…/g, (format==='rtf')?'\\\'85':'&hellip;');
    string = string.replace(/‘/g, (format==='rtf')?'\\\'91':'&lsquo;');
    string = string.replace(/’/g, (format==='rtf')?'\\\'92':'&rsquo;');
    string = string.replace(/“/g, (format==='rtf')?'\\\'93':'&ldquo;');
    string = string.replace(/”/g, (format==='rtf')?'\\\'94':'&rdquo;');
    string = string.replace(/–/g, (format==='rtf')?'\\\'96':'&ndash;');
    string = string.replace(/—/g, (format==='rtf')?'\\\'97':'&mdash;');
    string = string.replace(/‹/g, (format==='rtf')?'\\\'8b':'&lsaquo;');
    string = string.replace(/›/g, (format==='rtf')?'\\\'9b':'&rsaquo;');
    string = string.replace(/«/g, (format==='rtf')?'\\\'ab':'&laquo;');
    string = string.replace(/»/g, (format==='rtf')?'\\\'bb':'&raquo;');
    string = string.replace(/¡/g, (format==='rtf')?'\\\'a1':'&iexcl;');
    string = string.replace(/¿/g, (format==='rtf')?'\\\'bf':'&iquest;');
    string = string.replace(/ /g, (format==='rtf')?'\\~':'&nbsp;');
    // Common symbols
    string = string.replace(/€/g, (format==='rtf')?'\\\'80':'&euro;');
    string = string.replace(/†/g, (format==='rtf')?'\\\'86':'&dagger;');
    string = string.replace(/‡/g, (format==='rtf')?'\\\'87':'&Dagger;');
    string = string.replace(/•/g, (format==='rtf')?'\\\'95':'&bull;');
    string = string.replace(/™/g, (format==='rtf')?'\\\'99':'&trade;');
    string = string.replace(/¢/g, (format==='rtf')?'\\\'a2':'&cent;');
    string = string.replace(/£/g, (format==='rtf')?'\\\'a3':'&pound;');
    string = string.replace(/¤/g, (format==='rtf')?'\\\'a4':'&curren;');
    string = string.replace(/¥/g, (format==='rtf')?'\\\'a5':'&yen;');
    string = string.replace(/§/g, (format==='rtf')?'\\\'a7':'&sect;');
    string = string.replace(/©/g, (format==='rtf')?'\\\'a9':'&copy;');
    string = string.replace(/®/g, (format==='rtf')?'\\\'ae':'&reg;');
    string = string.replace(/°/g, (format==='rtf')?'\\\'b0':'&deg;');
    string = string.replace(/±/g, (format==='rtf')?'\\\'b1':'&plusmn;');
    string = string.replace(/²/g, (format==='rtf')?'\\\'b2':'&sup2;');
    string = string.replace(/³/g, (format==='rtf')?'\\\'b3':'&sup3;');
    string = string.replace(/µ/g, (format==='rtf')?'\\\'b5':'&micro;');
    string = string.replace(/¶/g, (format==='rtf')?'\\\'b6':'&para;');
    string = string.replace(/·/g, (format==='rtf')?'\\\'b7':'&middot;');
    string = string.replace(/¼/g, (format==='rtf')?'\\\'bc':'&frac14;');
    string = string.replace(/½/g, (format==='rtf')?'\\\'bd':'&frac12;');
    string = string.replace(/¾/g, (format==='rtf')?'\\\'be':'&frac34;');
    string = string.replace(/×/g, (format==='rtf')?'\\\'d7':'&times;');
    string = string.replace(/÷/g, (format==='rtf')?'\\\'f7':'&divide;');
    // Common diacritics
    string = string.replace(/á/g, (format==='rtf')?'\\\'e1':'&aacute;');
    string = string.replace(/Á/g, (format==='rtf')?'\\\'c1':'&Aacute;');
    string = string.replace(/à/g, (format==='rtf')?'\\\'e0':'&agrave;');
    string = string.replace(/À/g, (format==='rtf')?'\\\'c0':'&Agrave;');
    string = string.replace(/â/g, (format==='rtf')?'\\\'e2':'&acirc;');
    string = string.replace(/Â/g, (format==='rtf')?'\\\'c2':'&Acirc;');
    string = string.replace(/ä/g, (format==='rtf')?'\\\'e4':'&auml;');
    string = string.replace(/Ä/g, (format==='rtf')?'\\\'c4':'&Auml;');
    string = string.replace(/ã/g, (format==='rtf')?'\\\'e3':'&atilde;');
    string = string.replace(/Ã/g, (format==='rtf')?'\\\'c3':'&Atilde;');
    string = string.replace(/å/g, (format==='rtf')?'\\\'e5':'&aring;');
    string = string.replace(/Å/g, (format==='rtf')?'\\\'c5':'&Aring;');
    string = string.replace(/æ/g, (format==='rtf')?'\\\'e6':'&aelig;');
    string = string.replace(/Æ/g, (format==='rtf')?'\\\'c6':'&AElig;');
    string = string.replace(/ç/g, (format==='rtf')?'\\\'e7':'&ccedil;');
    string = string.replace(/Ç/g, (format==='rtf')?'\\\'c7':'&Ccedil;');
    string = string.replace(/ð/g, (format==='rtf')?'\\\'f0':'&eth;');
    string = string.replace(/Ð/g, (format==='rtf')?'\\\'d0':'&ETH;');
    string = string.replace(/é/g, (format==='rtf')?'\\\'e9':'&eacute;');
    string = string.replace(/É/g, (format==='rtf')?'\\\'c9':'&Eacute;');
    string = string.replace(/è/g, (format==='rtf')?'\\\'e8':'&egrave;');
    string = string.replace(/È/g, (format==='rtf')?'\\\'c8':'&Egrave;');
    string = string.replace(/ê/g, (format==='rtf')?'\\\'ea':'&ecirc;');
    string = string.replace(/Ê/g, (format==='rtf')?'\\\'ca':'&Ecirc;');
    string = string.replace(/ë/g, (format==='rtf')?'\\\'eb':'&euml;');
    string = string.replace(/Ë/g, (format==='rtf')?'\\\'cb':'&Euml;');
    string = string.replace(/í/g, (format==='rtf')?'\\\'ed':'&iacute;');
    string = string.replace(/Í/g, (format==='rtf')?'\\\'cd':'&Iacute;');
    string = string.replace(/ì/g, (format==='rtf')?'\\\'ec':'&igrave;');
    string = string.replace(/Ì/g, (format==='rtf')?'\\\'cc':'&Igrave;');
    string = string.replace(/î/g, (format==='rtf')?'\\\'ee':'&icirc;');
    string = string.replace(/Î/g, (format==='rtf')?'\\\'ce':'&Icirc;');
    string = string.replace(/ï/g, (format==='rtf')?'\\\'ef':'&iuml;');
    string = string.replace(/Ï/g, (format==='rtf')?'\\\'cf':'&Iuml;');
    string = string.replace(/ñ/g, (format==='rtf')?'\\\'f1':'&ntilde;');
    string = string.replace(/Ñ/g, (format==='rtf')?'\\\'d1':'&Ntilde;');
    string = string.replace(/ó/g, (format==='rtf')?'\\\'f3':'&oacute;');
    string = string.replace(/Ó/g, (format==='rtf')?'\\\'d3':'&Oacute;');
    string = string.replace(/ò/g, (format==='rtf')?'\\\'f2':'&ograve;');
    string = string.replace(/Ò/g, (format==='rtf')?'\\\'d2':'&Ograve;');
    string = string.replace(/ô/g, (format==='rtf')?'\\\'f4':'&ocirc;');
    string = string.replace(/Ô/g, (format==='rtf')?'\\\'d4':'&Ocirc;');
    string = string.replace(/ö/g, (format==='rtf')?'\\\'f6':'&ouml;');
    string = string.replace(/Ö/g, (format==='rtf')?'\\\'d6':'&Ouml;');
    string = string.replace(/õ/g, (format==='rtf')?'\\\'f5':'&otilde;');
    string = string.replace(/Õ/g, (format==='rtf')?'\\\'d5':'&Otilde;');
    string = string.replace(/ø/g, (format==='rtf')?'\\\'f8':'&oslash;');
    string = string.replace(/Ø/g, (format==='rtf')?'\\\'d8':'&Oslash;');
    string = string.replace(/œ/g, (format==='rtf')?'\\\'9c':'&#339;');
    string = string.replace(/Œ/g, (format==='rtf')?'\\\'8c':'&#338;');
    string = string.replace(/ß/g, (format==='rtf')?'\\\'df':'&szlig;');
    string = string.replace(/ú/g, (format==='rtf')?'\\\'fa':'&uacute;');
    string = string.replace(/Ú/g, (format==='rtf')?'\\\'da':'&Uacute;');
    string = string.replace(/ù/g, (format==='rtf')?'\\\'f9':'&ugrave;');
    string = string.replace(/Ù/g, (format==='rtf')?'\\\'d9':'&Ugrave;');
    string = string.replace(/û/g, (format==='rtf')?'\\\'fb':'&ucirc;');
    string = string.replace(/Û/g, (format==='rtf')?'\\\'db':'&Ucirc;');
    string = string.replace(/ü/g, (format==='rtf')?'\\\'fc':'&uuml;');
    string = string.replace(/Ü/g, (format==='rtf')?'\\\'dc':'&Uuml;');
    string = string.replace(/ý/g, (format==='rtf')?'\\\'fd':'&yacute;');
    string = string.replace(/Ý/g, (format==='rtf')?'\\\'dd':'&Yacute;');
    string = string.replace(/ÿ/g, (format==='rtf')?'\\\'ff':'&yuml;');
    string = string.replace(/Ÿ/g, (format==='rtf')?'\\\'9f':'&#376;');
    string = string.replace(/´/g, (format==='rtf')?'\\\'b4':'&acute;');
    if (format!=='rtf') string = string.replace(/`/g, '&#96;');
    return string;
  },
  isNumber: function(string) {
    return string!=='' && !(isNaN(string) || /^0\d/.test(string));
  },
  repeat: function(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
      if (count & 1) result += pattern;
      count >>= 1, pattern += pattern;
    }
    return result + pattern;
  },

  //---------------------------------------
  // PARSE
  //---------------------------------------

  parse: function(input, delimiterType, decimalSign, headersIncluded, safeHeaders, downcaseHeaders, upcaseHeaders) {
    var columnDelimiter,
      dataArray = [],
      errors = [];

    // Test for delimiter
    switch (delimiterType) {
      case 'comma':
        columnDelimiter = ',';
        break;
      case 'tab':
        columnDelimiter = '\t';
        break;
      default:
        // Give priority to tab
        columnDelimiter = /\t/.test(input) ? '\t' : ',';
    }

    // Kill extra empty lines (if more than one column)
    if (input.indexOf(columnDelimiter) > -1) {
      var re = new RegExp('^' + d.rowDelimiter + '+|' + d.rowDelimiter + '+$', 'g');
      input = input.replace(re, '');
    }

    //dataArray = jQuery.csv(columnDelimiter)(input);
    dataArray = this.CSVToArray(input, columnDelimiter);

    // Escape out any tabs or returns or new lines
    for (var i=dataArray.length-1; i>=0; --i) {
      for (var j=dataArray[i].length-1; j>=0; --j) {
        dataArray[i][j] = dataArray[i][j].replace('\t', '\\t');
        dataArray[i][j] = dataArray[i][j].replace('\n', '\\n');
        dataArray[i][j] = dataArray[i][j].replace('\r', '\\r');
      }
    }

    var headerNames = [],
      headerTypes = [],
      numColumns = dataArray[0].length,
      numRows = dataArray.length;

    if (headersIncluded) {
      // Remove header row
      headerNames = dataArray.splice(0,1)[0];
      numRows = dataArray.length;
    } else { // If no headerNames provided
      // Create generic property names
      for (var i=0; i<numColumns; ++i) {
        headerNames.push('val' + i);
        headerTypes.push('');
      }
    }

    // Format column headers
    for (var i=headerNames.length-1; i>=0; --i) {
      // Trim leading and trailing spaces
      headerNames[i] = $.trim(headerNames[i]);
      if (safeHeaders) {
        // Strip non-alphanumeric characters
        headerNames[i] = headerNames[i].replace(/[^\w -]|&quot;/g, '');
        // Convert spaces to underscores
        headerNames[i] = headerNames[i].replace(/ +/g, '_');
        // To be safe, prefix columns with leading digits
        if (/^[^a-z]/i.test(headerNames[i])) headerNames[i] = 'col' + headerNames[i];
      }
      // Convert case?
      if (upcaseHeaders) {
        headerNames[i] = headerNames[i].toUpperCase();
      } else if (downcaseHeaders) {
        headerNames[i] = headerNames[i].toLowerCase();
      }
    }

    // Test all the rows for proper number of columns.
    for (var i=0, imax=dataArray.length; i<imax; ++i) {
      var numValues = dataArray[i].length;
      if (numValues!==numColumns) {
        this.log('Error parsing row ' + i + '. Wrong number of columns.');
      }
    }

    // Test columns for number data type
    var numRowsToTest = dataArray.length;

    for (var i=0, imax=headerNames.length; i<imax; ++i) {
      var numStrings = 0,
        numInts = 0,
        numFloats = 0;

      for (var r=0; r<numRowsToTest; ++r) {
        if (dataArray[r]) {
          // Replace comma with dot if comma is decimal separator
          if (decimalSign==='comma' && isDecimalRe.test(dataArray[r][i])) {
            dataArray[r][i] = dataArray[r][i].replace(',', '.');
          }
          if (CSVParser.isNumber(dataArray[r][i])) {
            ++numInts;
            if ((dataArray[r][i]+'').indexOf('.') > -1) {
              ++numFloats;
            }
          } else if (dataArray[r][i]!=='') {
            ++numStrings;
          }
        }

      }

      headerTypes[i] = (numStrings || (!numInts && !numFloats)) ? 'string' : ((numFloats===0) ? 'int' : 'float');
    }

    return {
      'dataGrid': dataArray,
      'headerNames': headerNames,
      'headerTypes': headerTypes,
      'errors': this.getLog()
    };

  },

  //---------------------------------------
  // ERROR LOGGING
  //---------------------------------------
  errorLog:[],

  resetLog: function() {
    this.errorLog = [];
  },

  log: function(l) {
    this.errorLog.push(l);
  },

  getLog: function() {
    var out = '';
    if (this.errorLog.length > 0) {
      for (var i=0, imax=this.errorLog.length; i<imax; ++i) {
        out += ('!!' + this.errorLog[i] + '!!\n');
      }
      out += '\n';
    }
    return out;
  },

  //---------------------------------------
  // UTIL
  //---------------------------------------

    // This will parse a delimited string into an array of arrays. The default
    // delimiter is the comma, but this can be overriden in the second argument.
    //
    // CSV Parsing Function from Ben Nadel:
    // http://www.bennadel.com/blog/1504-Ask-Ben-Parsing-CSV-Strings-With-Javascript-Exec-Regular-Expression-Command.htm
    CSVToArray: function(strData, strDelimiter) {
      // Check to see if the delimiter is defined.
      // If not, then default to comma.
      strDelimiter = strDelimiter || ',';

      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp(
        (
          /* Delimiters */
          '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +
          /* Quoted fields */
          '(?:"([^"]*(?:""[^"]*)*)"|' +
          /* Standard fields */
          '([^"\\' + strDelimiter + '\\r\\n]*))'
        ),
          /* Global, case insensitive */
          'gi'
        );

      // Create an array to hold our data.
      // Give the array a default empty first row.
      var arrData = [[]];

      // Create an array to hold our individual pattern matching groups.
      var arrMatches = null;

      // Handle cases where data is pasted directly from Excel (THD)
      if (strDelimiter==='\t') {
        // First, escape tabs inside quoted fields so 2nd replacement works
        strData = strData.replace(/(\t|\r?\n|\r|^)(".+?")([\t\n\r])/g, function(match, p1, p2, p3) {
          return p1 + p2.replace(/\t/g, '\\t') + p3;
        });
        // Temporarily convert all double quotes to &quot; in non-quoted fields
        strData = strData.replace(/(\t|\r?\n|\r|^)([^\t"][^\t]+)/g, function(match, p1, p2) {
          return p1 + p2.replace(/"/g, '&quot;');
        });
      }

      // Keep looping over the regular expression matches until we can no longer
      // find a match.
      while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length (is not the start of
        // string) and if it matches field delimiter. If it does not, then we
        // know that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && strMatchedDelimiter!==strDelimiter) {
          // Since we have reached a new row of data, add an empty row to our
          // data array.
          arrData.push([]);
        }

        // Now that we have our delimiter out of the way, let's check to see
        // which kind of value we captured (quoted or unquoted).
        if (arrMatches[2]) {
          // We found a quoted value.
          // When we capture this value, convert it to HTML entity (THD)
          var strMatchedValue = arrMatches[2].replace(/""/g, '&quot;');
        } else {
          // We found a non-quoted value.
          var strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add it to the data array.
        arrData[arrData.length-1].push(strMatchedValue);
      }

      // Return the parsed data.
      return arrData;
    }

  };
