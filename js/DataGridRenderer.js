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
    var commentLine = '\'',
      commentLineEnd = '',
      outputText = '',
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
    var commentLine = '//',
      commentLineEnd = '',
      outputText = '',
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
  // HTML Table
  //---------------------------------------

  html: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '<!--',
      commentLineEnd = '-->',
      outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText += '<table>' + newLine;
    outputText += indent + '<thead>' + newLine;
    outputText += indent + indent + '<tr>' + newLine;
    for (var j=0; j<numColumns; ++j) {
      outputText += indent + indent + indent + '<th class="cell-' + headerNames[j].replace(/_/g, '-').toLowerCase() + '">' + headerNames[j] + '</th>' + newLine;
    }
    outputText += indent + indent + '</tr>' + newLine;
    outputText += indent + '</thead>' + newLine;
    outputText += indent + '<tbody>' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i],
        rowClassName = '';
      if (i === numRows-1) {
        rowClassName = ' class="last-row"';
      } else if (i === 0) {
        rowClassName = ' class="first-row"';
      }
      outputText += indent + indent + '<tr' + rowClassName + '>' + newLine;
      for (var j=0; j<numColumns; ++j) {
        outputText += indent + indent + indent + '<td class="cell-' + headerNames[j].replace(/_/g, '-').toLowerCase() + '">' + CSVParser.escapeText(row[j]) + '</td>' + newLine;
      }
      outputText += indent + indent + '</tr>' + newLine;
    }
    outputText += indent + '</tbody>' + newLine;
    outputText += '</table>';

    // Format data
    outputText = outputText.replace(/&quot;/g, '"');

    return outputText;
  },

  //---------------------------------------
  // JSON Properties
  //---------------------------------------

  json: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '//',
      commentLineEnd = '',
      outputText = '[',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += '{';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          var rowOutput = row[j] || 'undefined';
        } else {
          var rowOutput = '"' + (row[j]||'') + '"';
        }
        outputText += '"' + headerNames[j] + '":' + rowOutput;
        if (j < numColumns-1) outputText += ',';
      }
      outputText += '}';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += ']';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // JSON Array of Columns
  //---------------------------------------

  jsonArrayCols: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '//',
      commentLineEnd = '',
      outputText = '{' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numColumns; ++i) {
      outputText += indent + '"' + headerNames[i] + '":[';
      for (var j=0; j<numRows; ++j) {
        if (headerTypes[i]==='int' || headerTypes[i]==='float') {
          outputText += dataGrid[j][i] || 'undefined';
        } else {
          outputText += '"' + (dataGrid[j][i]||'') + '"';
        }
        if (j < numRows-1) outputText += ',';
      }
      outputText += ']';
      if (i < numColumns-1) outputText += ',' + newLine;
    }
    outputText += newLine + '}';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // JSON Array of Rows
  //---------------------------------------

  jsonArrayRows: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '//',
      commentLineEnd = '',
      outputText = '[' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      outputText += indent + '[';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          outputText += dataGrid[i][j] || 'undefined';
        } else {
          outputText += '"' + (dataGrid[i][j]||'') + '"';
        }
        if (j < numColumns-1) outputText += ',';
      }
      outputText += ']';
      if (i < numRows-1) outputText += ',' + newLine;
    }
    outputText += newLine + ']';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // JSON Dictionary
  //---------------------------------------

  jsonDict: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '//',
      commentLineEnd = '',
      outputText = '{' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    function _fmtVal(i, j) {
      if (headerTypes[j]==='int' || headerTypes[j]==='float') {
        return dataGrid[i][j] || 'undefined';
      } else {
        return '"' + (dataGrid[i][j]||'') + '"';
      }
    }

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      outputText += indent + '"' + dataGrid[i][0] + '":';
      if (numColumns === 2) {
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
    outputText += newLine + '}';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Lua Table as Dictionary
  //---------------------------------------

  luaDict: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '--',
      commentLineEnd = '',
      outputText = '{' + newLine,
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    function _fmtVal(i, j) {
      if (headerTypes[j]==='int' || headerTypes[j]==='float') {
        return dataGrid[i][j] || 'nil';
      } else {
        return '"' + (dataGrid[i][j]||'') + '"';
      }
    }

    // Begin render loop
    for (var i=0; i<numRows; ++i) {
      outputText += indent + '["' + dataGrid[i][0] + '"]=';
      if (numColumns === 2) {
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
    outputText += newLine + '}';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Lua Table as Array
  //---------------------------------------

  luaArray: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '--',
      commentLineEnd = '',
      outputText = '{' + newLine,
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
    outputText += newLine + '}';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // MySQL
  //---------------------------------------

  mysql: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '#',
      commentLineEnd = '',
      outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText += 'CREATE TABLE ' + d.tableName + ' (' + newLine;
    outputText += indent + 'id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,' + newLine;
    for (var j=0; j<numColumns; ++j) {
      var dataType = 'VARCHAR(255)';
      if (headerTypes[j]==='int' || headerTypes[j]==='float') {
        dataType = headerTypes[j].toUpperCase();
      }
      outputText += indent + headerNames[j] + ' ' + dataType;
      if (j < numColumns-1) outputText += ',';
      outputText += newLine;
    }
    outputText += ');' + newLine;
    outputText += 'INSERT INTO ' + d.tableName + ' ' + newLine + indent + '(';
    for (var j=0; j<numColumns; ++j) {
      outputText += headerNames[j].replace(/\W/g, '');
      if (j < numColumns-1) outputText += ',';
    }
    outputText += ') ' + newLine + 'VALUES ' + newLine;
    for (var i=0; i<numRows; ++i) {
      outputText += indent + '(';
      for (var j=0; j<numColumns; ++j) {
        if (headerTypes[j]==='int' || headerTypes[j]==='float') {
          outputText += dataGrid[i][j] || 'NULL';
        } else {
          if (dataGrid[i][j]) dataGrid[i][j] = dataGrid[i][j].replace(/'/g, "''");  // Escape single quotes
          else dataGrid[i][j] = '';
          outputText += '\'' + dataGrid[i][j] + '\'';
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
    var commentLine = '#',
      commentLineEnd = '',
      outputText = '(',
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
    outputText += ')';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // PHP
  //---------------------------------------

  php: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '//',
      commentLineEnd = '',
      outputText = 'array(' + newLine,
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
    outputText += newLine + ')';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Python Dictionary
  //---------------------------------------

  python: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '//',
      commentLineEnd = '',
      outputText = '[',
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
    outputText += ']';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // Ruby
  //---------------------------------------

  ruby: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '#',
      commentLineEnd = '',
      outputText = '[',
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
    outputText += ']';

    // Format data
    outputText = outputText.replace(/&quot;/g, '\\"');

    return outputText;
  },

  //---------------------------------------
  // XML Properties
  //---------------------------------------

  xmlProperties: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '<!--',
      commentLineEnd = '-->',
      outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText = '<?xml version="1.0" encoding="UTF-8"?>' + newLine;
    outputText += '<rows>' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += indent + '<row ';
      for (var j=0; j<numColumns; ++j) {
        outputText += headerNames[j] + '="' + CSVParser.escapeText(row[j], 'xml') + '" ';
      }
      outputText += '/>' + newLine;
    }
    outputText += '</rows>';

    // Format data
    outputText = outputText.replace(/&amp;quot;/g, '&quot;');

    return outputText;
  },

  //---------------------------------------
  // XML Nodes
  //---------------------------------------

  xml: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '<!--',
      commentLineEnd = '-->',
      outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText = '<?xml version="1.0" encoding="UTF-8"?>' + newLine;
    outputText += '<rows>' + newLine;
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
    outputText += '</rows>';

    // Format data
    outputText = outputText.replace(/&amp;quot;/g, '&quot;');

    return outputText;
  },

  //---------------------------------------
  // XML Illustrator
  //---------------------------------------

  xmlIllustrator: function(dataGrid, headerNames, headerTypes, indent, newLine) {
    // Inits...
    var commentLine = '<!--',
      commentLineEnd = '-->',
      outputText = '',
      numRows = dataGrid.length,
      numColumns = headerNames.length;

    // Begin render loop
    outputText = '<?xml version="1.0" encoding="utf-8"?>' + newLine;
    outputText += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20001102//EN" "http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd" [' + newLine;
    outputText += indent + '<!ENTITY ns_graphs "http://ns.adobe.com/Graphs/1.0/">' + newLine;
    outputText += indent + '<!ENTITY ns_vars "http://ns.adobe.com/Variables/1.0/">' + newLine;
    outputText += indent + '<!ENTITY ns_imrep "http://ns.adobe.com/ImageReplacement/1.0/">' + newLine;
    outputText += indent + '<!ENTITY ns_custom "http://ns.adobe.com/GenericCustomNamespace/1.0/">' + newLine;
    outputText += indent + '<!ENTITY ns_flows "http://ns.adobe.com/Flows/1.0/">' + newLine;
    outputText += indent + '<!ENTITY ns_extend "http://ns.adobe.com/Extensibility/1.0/">' + newLine;
    outputText += ']>' + newLine;
    outputText += '<svg>' + newLine;
    outputText += indent + '<variableSets xmlns="&ns_vars;">' + newLine;
    outputText += indent + indent + '<variableSet varSetName="binding1" locked="none">' + newLine;
    outputText += indent + indent + indent + '<variables>' + newLine;
    for (var i=0; i<numColumns; ++i) {
      outputText += indent + indent + indent + indent + '<variable varName="' + headerNames[i] + '" trait="textcontent" category="&ns_flows;"></variable>' + newLine;
    }
    outputText += indent + indent + indent + '</variables>' + newLine;
    outputText += indent + indent + indent + '<v:sampleDataSets xmlns:v="http://ns.adobe.com/Variables/1.0/" xmlns="http://ns.adobe.com/GenericCustomNamespace/1.0/">' + newLine;
    for (var i=0; i<numRows; ++i) {
      var row = dataGrid[i];
      outputText += indent + indent + indent + indent + '<v:sampleDataSet dataSetName="' + row[0] + '">' + newLine;
      for (var j=0; j<numColumns; ++j) {
        headerNames[j] = headerNames[j].replace(/\W/g, '');
        outputText += indent + indent + indent + indent + indent + '<' + headerNames[j] + '><p>' + CSVParser.escapeText(row[j], 'xml') + '</p></' + headerNames[j] + '>' + newLine;
      }
      outputText += indent + indent + indent + indent + '</v:sampleDataSet>' + newLine;
    }
    outputText += indent + indent + indent + '</v:sampleDataSets>' + newLine;
    outputText += indent + indent + '</variableSet>' + newLine;
    outputText += indent + '</variableSets>' + newLine;
    outputText += '</svg>';

    // Format data
    outputText = outputText.replace(/&amp;quot;/g, '&quot;');

    return outputText;
  },

};
