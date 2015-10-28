//
//  CSVParser.js
//  Mr-Data-Converter
//
//  Input CSV or Tab-delimited data and this will parse it into a Data Grid Javascript object

var isDecimalRe = /^\s*(\+|-)?((\d+([,\.]\d+)?)|([,\.]\d+))\s*$/,
  CSVParser = {

  //---------------------------------------
  // UTILS
  //---------------------------------------

  escapeText: function(string, format) {
    if (string===undefined) return '';
    if (format==='xml') {
      string = string.replace(/&/g, '&amp;');
      //string = string.replace(/"/g, '&quot;');  // Already converted
      string = string.replace(/'/g, '&apos;');
    }
    string = string.replace(/</g, '&lt;');
    string = string.replace(/>/g, '&gt;');
    // Punctuation
    string = string.replace(/–/g, '&ndash;');
    string = string.replace(/—/g, '&mdash;');
    string = string.replace(/¡/g, '&iexcl;');
    string = string.replace(/¿/g, '&iquest;');
    string = string.replace(/“/g, '&ldquo;');
    string = string.replace(/”/g, '&rdquo;');
    string = string.replace(/‘/g, '&lsquo;');
    string = string.replace(/’/g, '&rsquo;');
    string = string.replace(/«/g, '&laquo;');
    string = string.replace(/»/g, '&raquo;');
    string = string.replace(/ /g, '&nbsp;');
    // Symbols
    string = string.replace(/¢/g, '&cent;');
    string = string.replace(/©/g, '&copy;');
    string = string.replace(/÷/g, '&divide;');
    string = string.replace(/µ/g, '&micro;');
    string = string.replace(/·/g, '&middot;');
    string = string.replace(/¶/g, '&para;');
    string = string.replace(/±/g, '&plusmn;');
    string = string.replace(/€/g, '&euro;');
    string = string.replace(/£/g, '&pound;');
    string = string.replace(/®/g, '&reg;');
    string = string.replace(/§/g, '&sect;');
    string = string.replace(/™/g, '&trade;');
    string = string.replace(/¥/g, '&yen;');
    string = string.replace(/°/g, '&deg;');
    // Diacritics
    string = string.replace(/á/g, '&aacute;');
    string = string.replace(/Á/g, '&Aacute;');
    string = string.replace(/à/g, '&agrave;');
    string = string.replace(/À/g, '&Agrave;');
    string = string.replace(/â/g, '&acirc;');
    string = string.replace(/Â/g, '&Acirc;');
    string = string.replace(/å/g, '&aring;');
    string = string.replace(/Å/g, '&Aring;');
    string = string.replace(/ã/g, '&atilde;');
    string = string.replace(/Ã/g, '&Atilde;');
    string = string.replace(/ä/g, '&auml;');
    string = string.replace(/Ä/g, '&Auml;');
    string = string.replace(/æ/g, '&aelig;');
    string = string.replace(/Æ/g, '&AElig;');
    string = string.replace(/ç/g, '&ccedil;');
    string = string.replace(/Ç/g, '&Ccedil;');
    string = string.replace(/é/g, '&eacute;');
    string = string.replace(/É/g, '&Eacute;');
    string = string.replace(/è/g, '&egrave;');
    string = string.replace(/È/g, '&Egrave;');
    string = string.replace(/ê/g, '&ecirc;');
    string = string.replace(/Ê/g, '&Ecirc;');
    string = string.replace(/ë/g, '&euml;');
    string = string.replace(/Ë/g, '&Euml;');
    string = string.replace(/í/g, '&iacute;');
    string = string.replace(/Í/g, '&Iacute;');
    string = string.replace(/ì/g, '&igrave;');
    string = string.replace(/Ì/g, '&Igrave;');
    string = string.replace(/î/g, '&icirc;');
    string = string.replace(/Î/g, '&Icirc;');
    string = string.replace(/ï/g, '&iuml;');
    string = string.replace(/Ï/g, '&Iuml;');
    string = string.replace(/ñ/g, '&ntilde;');
    string = string.replace(/Ñ/g, '&Ntilde;');
    string = string.replace(/ó/g, '&oacute;');
    string = string.replace(/Ó/g, '&Oacute;');
    string = string.replace(/ò/g, '&ograve;');
    string = string.replace(/Ò/g, '&Ograve;');
    string = string.replace(/ô/g, '&ocirc;');
    string = string.replace(/Ô/g, '&Ocirc;');
    string = string.replace(/ø/g, '&oslash;');
    string = string.replace(/Ø/g, '&Oslash;');
    string = string.replace(/õ/g, '&otilde;');
    string = string.replace(/Õ/g, '&Otilde;');
    string = string.replace(/ö/g, '&ouml;');
    string = string.replace(/Ö/g, '&Ouml;');
    string = string.replace(/ß/g, '&szlig;');
    string = string.replace(/ú/g, '&uacute;');
    string = string.replace(/Ú/g, '&Uacute;');
    string = string.replace(/ù/g, '&ugrave;');
    string = string.replace(/Ù/g, '&Ugrave;');
    string = string.replace(/û/g, '&ucirc;');
    string = string.replace(/Û/g, '&Ucirc;');
    string = string.replace(/ü/g, '&uuml;');
    string = string.replace(/Ü/g, '&Uuml;');
    string = string.replace(/ÿ/g, '&yuml;');
    string = string.replace(/´/g, '&acute;');
    string = string.replace(/`/g, '&#96;');
    return string;
  },
  isNumber: function(string) {
    return (!(string==='' || isNaN(+string) || /^0\d+/.test(string)));
  },

  //---------------------------------------
  // PARSE
  //---------------------------------------
  //var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);

  parse: function(input, headersIncluded, delimiterType, downcaseHeaders, upcaseHeaders, decimalSign) {
    var dataArray = [],
      errors = [];

    // Test for delimiter
    // Count the number of commas
    var RE = new RegExp('[^,]', 'gi'),
      numCommas = input.replace(RE, '').length;

    // Count the number of tabs
    RE = new RegExp('[^\t]', 'gi');
    var numTabs = input.replace(RE, '').length;

    // Set delimiter
    var rowDelimiter = '\n',
      columnDelimiter = ',';
    if (numTabs > numCommas) {
      columnDelimiter = '\t';
    }

    if (delimiterType === 'comma') {
      columnDelimiter = ',';
    } else if (delimiterType === 'tab') {
      columnDelimiter = '\t';
    }

    // Kill extra empty lines (if more than one column)
    if (numCommas > 0 || numTabs > 0) {
      RE = new RegExp('^' + rowDelimiter + '+', 'gi');
      input = input.replace(RE, '');
      RE = new RegExp(rowDelimiter + '+$', 'gi');
      input = input.replace(RE, '');
    }

    //var arr = input.split(rowDelimiter);
    //for (var i=0; i<arr.length; i++) {
    //  dataArray.push(arr[i].split(columnDelimiter));
    //}

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
      // Strip non-alphanumeric characters
      headerNames[i] = headerNames[i].replace(/&quot;|[^\w ]/g, '');
      // Convert spaces to underscores
      headerNames[i] = headerNames[i].replace(/ +/g, '_');
      // To be safe, prefix columns with leading digits
      if (/^\d/.test(headerNames[i])) headerNames[i] = 'col' + headerNames[i];
      headerNames[i] = headerNames[i].replace(/\W/g, '');
      // Convert case?
      if (upcaseHeaders) {
        headerNames[i] = headerNames[i].toUpperCase();
      }
      if (downcaseHeaders) {
        headerNames[i] = headerNames[i].toLowerCase();
      }
    }

    // Test all the rows for proper number of columns.
    for (var i=0, imax=dataArray.length; i<imax; ++i) {
      var numValues = dataArray[i].length;
      if (numValues !== numColumns) {
        this.log('Error parsing row ' + i + '. Wrong number of columns.');
      }
    }

    // Test columns for number data type
    var numRowsToTest = dataArray.length,
      threshold = 0.9;

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

      if (numInts/numRowsToTest > threshold || (numStrings===0 && numInts > 0)) {
        headerTypes[i] = (numFloats===0) ? 'int' : 'float';
      } else {
        headerTypes[i] = 'string';
      }
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