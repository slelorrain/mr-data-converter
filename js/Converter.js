//
//  Converter.js
//  Mr-Data-Converter
//
//  Created by Shan Carter on 2010-09-01.
//

function DataConverter(nodeId) {

  //---------------------------------------
  // PUBLIC PROPERTIES
  //---------------------------------------

  this.nodeId          = nodeId;
  this.node            = $('#' + nodeId);
  this.outputDataTypes = [
    {'text':'ActionScript',         'id':'as',             'notes':''},
    {'text':'ASP/VBScript',         'id':'asp',            'notes':''},
    {'text':'HTML',                 'id':'html',           'notes':''},
    {'text':'JSON - Properties',    'id':'json',           'notes':''},
    {'text':'JSON - Column Arrays', 'id':'jsonArrayCols',  'notes':''},
    {'text':'JSON - Row Arrays',    'id':'jsonArrayRows',  'notes':''},
    {'text':'JSON - Dictionary',    'id':'jsonDict',       'notes':''},
    {'text':'MySQL',                'id':'mysql',          'notes':''},
    {'text':'PHP',                  'id':'php',            'notes':''},
    {'text':'Python - Dictionary',  'id':'python',         'notes':''},
    {'text':'Ruby',                 'id':'ruby',           'notes':''},
    {'text':'XML - Properties',     'id':'xmlProperties',  'notes':''},
    {'text':'XML - Nodes',          'id':'xml',            'notes':''},
    {'text':'XML - Illustrator',    'id':'xmlIllustrator', 'notes':''}
  ];
  this.outputDataType    = 'json';
  this.columnDelimiter   = '\t';
  this.rowDelimiter      = '\n';
  this.inputTextArea     = {};
  this.outputTextArea    = {};
  this.inputHeader       = {};
  this.outputHeader      = {};
  this.dataSelect        = {};
  this.inputText         = '';
  this.outputText        = '';
  this.newLine           = '\n';
  this.indent            = '  ';
  this.commentLine       = '//';
  this.commentLineEnd    = '';
  this.tableName         = 'MrDataConverter';
  this.useUnderscores    = true;
  this.headersProvided   = true;
  this.downcaseHeaders   = true;
  this.upcaseHeaders     = false;
  this.includeWhiteSpace = true;
  this.useTabsForIndent  = false;

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function(w, h) {
  var self = this;

  // Build HTML for converter
  this.inputHeader = $('<div id="inputHeader" class="groupHeader"><p class="groupHeadline">Input CSV or tab-delimited data. <span class="subhead">Using Excel? Simply copy and paste. No data on hand? <a href="javascript:;" id="insertSample">Use sample</a></span></p></div>');
  this.inputTextArea = $('<textarea id="dataInput" class="textInputs"></textarea>');
  var outputHeaderText =
    '<div id="inputHeader" class="groupHeader">' +
      '<p class="groupHeadline">Output as' +
        '<select id="dataSelector" name="Data Types">';
  for (var i=0, imax=this.outputDataTypes.length; i<imax; ++i) {
    outputHeaderText += '<option value="' + this.outputDataTypes[i]['id'] + '"' + (this.outputDataTypes[i]['id'] === this.outputDataType ? ' selected' : '') + '>' + this.outputDataTypes[i]['text'] + '</option>';
  }
  outputHeaderText +=
        '</select>' +
        '<span id="outputNotes" class="subhead"></span>' +
      '</p>' +
    '</div>';
  this.outputHeader = $(outputHeaderText);
  this.outputTextArea = $('<textarea id="dataOutput" class="textInputs"></textarea>');
  this.node.append(this.inputHeader);
  this.node.append(this.inputTextArea);
  this.node.append(this.outputHeader);
  this.node.append(this.outputTextArea);
  this.dataSelect = this.outputHeader.find('#dataSelector');

  // Add event listeners
  //$('#convertButton').click(function(evt) {
  //  evt.preventDefault();
  //  self.convert();
  //});

  this.outputTextArea.add(this.inputTextArea).click(function(evt) {
    this.select();
  });

  $('#insertSample').click(function(evt) {
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
    _gaq.push(['_trackEvent', 'SampleData', 'InsertGeneric']);
  });

  $('#dataInput').on({
    keyup: function() {
      self.convert();
    },
    change: function() {
      self.convert();
      _gaq.push(['_trackEvent', 'DataType', self.outputDataType]);
    }
  });

  $('#dataSelector').change(function(evt) {
    self.outputDataType = $(this).val();
    self.convert();
  });

  this.resize(w, h);
};

DataConverter.prototype.resize = function(w, h) {
  var paneWidth = w,
    paneHeight = (h-90)/2-20;
  this.node.css('width', paneWidth);
  this.inputTextArea.css({
    width: paneWidth-20,
    height: paneHeight
  });
  this.outputTextArea.css({
    width: paneWidth-20,
    height: paneHeight
  });
};

DataConverter.prototype.convert = function() {
  this.inputText = this.inputTextArea.val();
  this.outputText = '';

  // Make sure there is input data before converting...
  if (this.inputText.length > 0) {

    if (this.includeWhiteSpace) {
      this.newLine = '\n';
    } else {
      this.indent = '';
      this.newLine = '';
    }

    CSVParser.resetLog();
    var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders),
      dataGrid = parseOutput.dataGrid,
      headerNames = parseOutput.headerNames,
      headerTypes = parseOutput.headerTypes,
      errors = parseOutput.errors;

    this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine);
    this.outputTextArea.val(errors + this.outputText);

  } // End test for existence of input text
};

DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val('NAME\tVALUE\tCOLOR\tDATE\nAlan\t12\tblue\tSep. 25, 2009\nShan\t13\t"green\tblue"\tSep. 27, 2009\nJohn\t45\torange\tSep. 29, 2009\nMinna\t27\tteal\tSep. 30, 2009');
};