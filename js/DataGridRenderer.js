/*!
 * DataGridRenderer.js
 * Part of Mr-Data-Converter
 *
 * Created by Shan Carter on 2010-10-18.
 */

var DataGridRenderer = {

  //---------------------------------------
  // ASP / VBScript
  //---------------------------------------

  asp: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // By default this language has no statement terminator
    newLine = newLine || ':';

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || 'Empty';
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += 'myArray(' + j + ',' + i + ') = ' + rowOutput + newLine;
      }
    }
    outputText = 'Dim myArray(' + (j-1) + ',' + (i-1) + ')' + newLine + outputText;

    // Format data
    outputText = outputText.replace(/&quot;/g, '""');

    return outputText;
  },

  //---------------------------------------
  // C# DataTable
  //---------------------------------------

  csharp: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText += 'DataTable ' + d.tableName + ' = new DataTable();' + newLine;
    for (var j=0; j<numColumns; ++j) {
      outputText += d.tableName + '.Columns.Add("' + headerNames[j] + '", typeof(' + ((headerTypes[j]==='int' || headerTypes[j]==='float')?headerTypes[j]:'string') + '));' + newLine;
    }
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += d.tableName + '.Rows.Add(';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          outputText += row[j] || 'null';
        } else {
          outputText += '"' + (row[j]||'') + '"';
        }
        if (j < numColumns-1) outputText += ', ';
      }
      outputText += ');' + newLine;
    }

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // ColdFusion Array of Structs
  //---------------------------------------

  cfml: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '[',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += '{';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || '""';  // ColdFusion has no null value
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += '"' + headerNames[j] + '"=' + rowOutput;
        if (j < numColumns-1) outputText += ',';
      }
      outputText += '}';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += ']' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Go Array of Structs
  //---------------------------------------

  go: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText += 'type rows struct{';
    for (var j=0; j<numColumns; ++j) {
      outputText += headerNames[j] + ' ' + ((headerTypes[j]==='int' || headerTypes[j]==='float')?headerTypes[j]+'64':'string');
      if (j < numColumns-1) outputText += '; ';
    }
    outputText +=
      '}' + (newLine||';') +
      d.tableName + ' := []rows{' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += indent + '{'
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          outputText += row[j] || 'nil';
        } else {
          outputText += '"' + (row[j]||'') + '"';
        }
        if (j < numColumns-1) outputText += ', ';
      }
      outputText +=  '},' + newLine;
    }
    outputText += '}' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // HTML Table
  //---------------------------------------

  html: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length,
      _getClass = function(i) {
        return d.includeHtmlClass ? ' class="cell-' + (d.headersProvided?headerNames[i].replace(/_/g, '-').toLowerCase():'col'+(i+1)) + '"': '';
      };

    // Begin render loop
    outputText += '<table>' + newLine;
    if (d.headersProvided) {
      outputText +=
        indent + '<thead>' + newLine +
        indent + indent + '<tr>' + newLine;
      for (var j=0; j<numColumns; ++j) {
        outputText += indent + indent + indent + '<th' + _getClass(j) + '>' + headerNames[j].replace(/^col(\d)/, '$1') + '</th>' + newLine;
      }
      outputText +=
        indent + indent + '</tr>' + newLine +
        indent + '</thead>' + newLine;
    }
    outputText += indent + '<tbody>' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i],
        rowClassName = '';
      if (i===numRows-1) {
        rowClassName = d.includeHtmlClass ? ' class="last-row"' : '';
      } else if (i===0) {
        rowClassName = d.includeHtmlClass ? ' class="first-row"' : '';
      }
      outputText += indent + indent + '<tr' + rowClassName + '>' + newLine;
      for (var j=0; j<numColumns; ++j) {
        outputText += indent + indent + indent + '<td' + _getClass(j) + '>' + CSVParser.escapeText(row[j]) + '</td>' + newLine;
      }
      outputText += indent + indent + '</tr>' + newLine;
    }
    outputText +=
      indent + '</tbody>' + newLine +
      '</table>' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '"');

    return outputText;
  },

  //---------------------------------------
  // JSON Properties
  //---------------------------------------

  json: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '[',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += '{';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || 'null';
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += '"' + headerNames[j] + '":' + rowOutput;
        if (j < numColumns-1) outputText += ',';
      }
      outputText += '}';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += ']' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // JSON Array of Columns
  //---------------------------------------

  jsonArrayCols: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '{' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var j=0; j<numColumns; ++j) {
      outputText += indent + '"' + headerNames[j] + '":[';
      for (var i=0; i<numRows; ++i) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          outputText += dataGrid[i][j] || 'null';
        } else {
          outputText += '"' + (dataGrid[i][j]||'') + '"';
        }
        if (i < numRows-1) outputText += ',';
      }
      outputText += ']';
      if (j < numColumns-1) outputText += ',' + newLine;
    }
    outputText += newLine + '}' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // JSON Array of Rows
  //---------------------------------------

  jsonArrayRows: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '[' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      outputText += indent + '[';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          outputText += dataGrid[i][j] || 'null';
        } else {
          outputText += '"' + (dataGrid[i][j]||'') + '"';
        }
        if (j < numColumns-1) outputText += ',';
      }
      outputText += ']';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += newLine + ']' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // JSON Dictionary
  //---------------------------------------

  jsonDict: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '{' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length,
      _fmtVal = function(i, j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          return dataGrid[i][j] || 'null';
        } else {
          return '"' + (dataGrid[i][j]||'') + '"';
        }
      };

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      outputText += indent + '"' + dataGrid[i][0] + '":';
      if (numColumns===2) {
        outputText += _fmtVal(i, 1);
      } else {
        outputText += '{';
        for (var j=1; j<numColumns; ++j) {
          if (j > 1) outputText += ',';
          outputText += '"' + headerNames[j] + '":' + _fmtVal(i, j);
        }
        outputText += '}';
      }
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += newLine + '}' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Lua Table as Dictionary
  //---------------------------------------

  luaDict: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '{' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length,
      _fmtVal = function(i, j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          return dataGrid[i][j] || 'nil';
        } else {
          return '"' + (dataGrid[i][j]||'') + '"';
        }
      };

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      outputText += indent + '["' + dataGrid[i][0] + '"]=';
      if (numColumns===2) {
        outputText += _fmtVal(i, 1);
      } else {
        outputText += '{';
        for (var j=1; j<numColumns; ++j) {
          if (j > 1) outputText += ',';
          outputText += '["' + headerNames[j] + '"]=' + _fmtVal(i, j);
        }
        outputText += '}';
      }
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += newLine + '}' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Lua Table as Array
  //---------------------------------------

  luaArray: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '{' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += indent + '[' + (i+1) + ']={';  // Lua has 1-based index
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || 'nil';
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += '["' + headerNames[j] + '"]=' + rowOutput;
        if (j < numColumns-1) outputText += ',';
      }
      outputText += '}';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += newLine + '}' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Markdown Table
  //---------------------------------------

  markdown: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length,
      headerLengths = [];

    // Begin render loop
    outputText += '|';
    for (var j=0; j<numColumns; ++j) {
      outputText += ' ' + headerNames[j] + ' |';
      headerLengths.push((headerNames[j].length+2) + ((headerTypes[j]==='int' || headerTypes[j]==='float')?'r':''));
    }
    outputText += newLine + '|';
    for (var j=0; j<numColumns; ++j) {
      outputText += ((headerLengths[j].indexOf('r')<0) ? CSVParser.repeat('-', headerLengths[j]) : CSVParser.repeat('-', parseInt(headerLengths[j])-1) + ':') + '|';
    }
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += newLine + '|';
      for (var j=0; j<numColumns; ++j) {
        outputText += ' ' + CSVParser.escapeText(row[j]).replace(/\|/g, '&#124;') + ' |';
      }
    }
    outputText += newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '"');

    return outputText;
  },

  //---------------------------------------
  // MySQL
  //---------------------------------------

  mysql: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText +=
      'CREATE TABLE ' + d.tableName + ' (' + newLine +
      indent + 'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,' + newLine;
    for (var j=0; j<numColumns; ++j) {
      var dataType = 'VARCHAR(255)';
      if (headerTypes[j]==='int' || headerTypes[j]==='float') {
        dataType = headerTypes[j].toUpperCase();
      }
      outputText += indent + headerNames[j] + ' ' + dataType;
      if (j < numColumns-1) outputText += ',';
      outputText += newLine;
    }
    outputText +=
      ');' + newLine +
      'INSERT INTO ' + d.tableName + newLine +
      indent + '(';
    for (var j=0; j<numColumns; ++j) {
      outputText += headerNames[j].replace(/\W/g, '');
      if (j < numColumns-1) outputText += ',';
    }
    outputText += ')' + newLine + 'VALUES' + newLine;
    for (var i=0; i<numRows; ++i) {
      outputText += indent + '(';
      for (var j=0; j<numColumns; ++j) {
        var cellValue = dataGrid[i][j];
        if (headerTypes[j]==='int' || headerTypes[j]==='float' || headerNames[j].slice(-3)==='_id') {
          outputText += cellValue || 'NULL';
        } else {
          if (cellValue) cellValue = cellValue.replace(/'/g, "''");  // Escape single quotes
          else cellValue = '';
          outputText += '\'' + cellValue + '\'';
        }
        if (j < numColumns-1) outputText += ',';
      }
      outputText += ')';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += ';' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '"');

    return outputText;
  },

  //---------------------------------------
  // Perl
  //---------------------------------------

  perl: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '(',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += '{';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || 'undef';
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += '"' + headerNames[j] + '"=>' + rowOutput;
        if (j < numColumns-1) outputText += ',';
      }
      outputText += '}';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += ')' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // PHP
  //---------------------------------------

  php: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = 'array(' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += indent + 'array(';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || 'NULL';
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += '"' + headerNames[j] + '"=>' + rowOutput;
        if (j < numColumns-1) outputText += ',';
      }
      outputText += ')';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += newLine + ')' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Python Dictionary
  //---------------------------------------

  python: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '[',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += '{';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || 'None';
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += '"' + headerNames[j] + '":' + rowOutput;
        if (j < numColumns-1) outputText += ',';
      }
      outputText += '}';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += ']' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Rich Text Format (RTF) Table
  //---------------------------------------

  rtf: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length,
      rowDefinition = '',
      twips = Math.round(9000/numColumns),  /* 9000 twips fit inside A4 document with 1" margins */
      border = '\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs';

    // Begin render loop
    outputText += '\\trowd\\trgaph144';  // Horizontal gap of 144 twips = 0.1" left/right margins
    for (var j=0; j<numColumns; ++j) {
      outputText += border + '\\cellx' + twips*(j+1);
    }
    rowDefinition = outputText;
    for (var j=0; j<numColumns; ++j) {
      outputText += '\\pard\\intbl\\qc\\b{' + headerNames[j] + '}\\cell'
    }
    outputText += '\\row' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += rowDefinition;
      for (var j=0; j<numColumns; ++j) {
        outputText += '\\pard\\intbl' + ((headerTypes[j]==='int' || headerTypes[j]==='float')?'\\qr':'') + '\\plain{' + CSVParser.escapeText(row[j], 'rtf') + '}\\cell';
      }
      outputText += '\\row' + newLine;
    }

    // Format data
    outputText = outputText.replace(/&quot;/g, '"');

    return outputText;
  },

  //---------------------------------------
  // Ruby
  //---------------------------------------

  ruby: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '[',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += '{';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || 'nil';
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += '"' + headerNames[j] + '"=>' + rowOutput;
        if (j < numColumns-1) outputText += ',';
      }
      outputText += '}';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += ']' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Trac Table
  //---------------------------------------

  trac: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText += '||=';
    for (var j=0; j<numColumns; ++j) {
      outputText += ' ' + headerNames[j] + ' =||';
      if (j < numColumns-1) outputText += '=';
    }
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += newLine + '||';
      for (var j=0; j<numColumns; ++j) {
        outputText += ' ' + CSVParser.escapeText(row[j]).replace(/\|/g, '&#124;') + ((headerTypes[j]==='int' || headerTypes[j]==='float')?'':' ') + '||';
      }
    }
    outputText += newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '"');

    return outputText;
  },

  //---------------------------------------
  // Wiki Table
  //---------------------------------------

  wiki: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText +=
      '{| class="wikitable sortable"' + newLine +
      '! ';
    for (var j=0; j<numColumns; ++j) {
      outputText += 'scope="col" | ' + headerNames[j];
      if (j < numColumns-1) outputText += ' || ';
    }
    outputText += newLine + '|-' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += '| ';
      for (var j=0; j<numColumns; ++j) {
        outputText += ((headerTypes[j]==='int' || headerTypes[j]==='float')?'style="text-align:right" | ':'') + CSVParser.escapeText(row[j]).replace(/\|/g, '&#124;');
        if (j < numColumns-1) outputText += ' || ';
      }
      if (i < numRows-1) outputText += newLine + '|-' + newLine;
    }
    outputText += newLine + '|}' + newLine;

    // Format data
    outputText = outputText.replace(/&quot;/g, '"');

    return outputText;
  },

  //---------------------------------------
  // XML Properties
  //---------------------------------------

  xmlProperties: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText +=
      '<?xml version="1.0" encoding="UTF-8"?>' + newLine +
      '<rows>' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += indent + '<row ';
      for (var j=0; j<numColumns; ++j) {
        outputText += headerNames[j] + '="' + CSVParser.escapeText(row[j], 'xml') + '" ';
      }
      outputText += '/>' + newLine;
    }
    outputText += '</rows>' + newLine;

    // Format data
    outputText = outputText.replace(/&amp;quot;/g, '&quot;');

    return outputText;
  },

  //---------------------------------------
  // XML Nodes
  //---------------------------------------

  xml: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText +=
      '<?xml version="1.0" encoding="UTF-8"?>' + newLine +
      '<rows>' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += indent + '<row>' + newLine;
      for (var j=0; j<numColumns; ++j) {
        if (row[j]) row[j] = CSVParser.escapeText(row[j], 'xml');  // Convert to HTML entities
        else row[j] = '';
        headerNames[j] = headerNames[j].replace(/\W/g, '');
        outputText += indent + indent + '<' + headerNames[j] + '>' + row[j] + '</' + headerNames[j] + '>' + newLine;
      }
      outputText += indent + '</row>' + newLine;
    }
    outputText += '</rows>' + newLine;

    // Format data
    outputText = outputText.replace(/&amp;quot;/g, '&quot;');

    return outputText;
  },

  //---------------------------------------
  // XML Illustrator
  //---------------------------------------

  xmlIllustrator: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText +=
      '<?xml version="1.0" encoding="utf-8"?>' + newLine +
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20001102//EN" "http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd" [' + newLine +
      indent + '<!ENTITY ns_graphs "http://ns.adobe.com/Graphs/1.0/">' + newLine +
      indent + '<!ENTITY ns_vars "http://ns.adobe.com/Variables/1.0/">' + newLine +
      indent + '<!ENTITY ns_imrep "http://ns.adobe.com/ImageReplacement/1.0/">' + newLine +
      indent + '<!ENTITY ns_custom "http://ns.adobe.com/GenericCustomNamespace/1.0/">' + newLine +
      indent + '<!ENTITY ns_flows "http://ns.adobe.com/Flows/1.0/">' + newLine +
      indent + '<!ENTITY ns_extend "http://ns.adobe.com/Extensibility/1.0/">' + newLine +
      ']>' + newLine +
      '<svg>' + newLine +
      indent + '<variableSets xmlns="&ns_vars;">' + newLine +
      indent + indent + '<variableSet varSetName="binding1" locked="none">' + newLine +
      indent + indent + indent + '<variables>' + newLine;
    for (var j=0; j<numColumns; ++j) {
      outputText += indent + indent + indent + indent + '<variable varName="' + headerNames[j] + '" trait="textcontent" category="&ns_flows;"></variable>' + newLine;
    }
    outputText +=
      indent + indent + indent + '</variables>' + newLine +
      indent + indent + indent + '<v:sampleDataSets xmlns:v="http://ns.adobe.com/Variables/1.0/" xmlns="http://ns.adobe.com/GenericCustomNamespace/1.0/">' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += indent + indent + indent + indent + '<v:sampleDataSet dataSetName="' + row[0] + '">' + newLine;
      for (var j=0; j<numColumns; ++j) {
        headerNames[j] = headerNames[j].replace(/\W/g, '');
        outputText += indent + indent + indent + indent + indent + '<' + headerNames[j] + '><p>' + CSVParser.escapeText(row[j], 'xml') + '</p></' + headerNames[j] + '>' + newLine;
      }
      outputText += indent + indent + indent + indent + '</v:sampleDataSet>' + newLine;
    }
    outputText +=
      indent + indent + indent + '</v:sampleDataSets>' + newLine +
      indent + indent + '</variableSet>' + newLine +
      indent + '</variableSets>' + newLine +
      '</svg>' + newLine;

    // Format data
    outputText = outputText.replace(/&amp;quot;/g, '&quot;');

    return outputText;
  },

  //---------------------------------------
  // YAML
  //---------------------------------------

  yaml: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length,
      headerMaxLength = headerNames.sort(function(a, b) {
        return b.length - a.length;
      })[0].length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      for (var j=0; j<numColumns; ++j) {
        outputText += ((j>0)?'  ':'- ') + headerNames[j] + ': ' + CSVParser.repeat(' ', headerMaxLength-headerNames[j].length) + (row[j]||'') + newLine;
      }
    }

    // Format data
    outputText = outputText.replace(/&quot;/g, '"');

    return outputText;
  },

};
