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

  this.nodeId            = nodeId;
  this.node              = $('#' + nodeId);
  this.outputDataType    = 'json';
  this.columnDelimiter   = '\t';
  this.rowDelimiter      = '\n';
  this.inputText         = '';
  this.outputText        = '';
  this.newLine           = '\n';
  this.indent            = '  ';
  this.commentLine       = '//';
  this.commentLineEnd    = '';
  this.tableName         = 'MrDataConverter';
  this.useUnderscores    = true;
  this.headersProvided   = true;
  this.downcaseHeaders   = false;
  this.upcaseHeaders     = false;
  this.includeWhiteSpace = true;
  this.useTabsForIndent  = false;

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function() {
  var self = this;

  // Show loader (based on http://projects.lukehaas.me/css-loaders/)
  $('#converter > .wrapper').append(
    '<div class="loader">' +
    '  <span class="loader-text">Loading...</span>' +
    '  <i class="loader-icon"></i>' +
    '</div>');

  // Build HTML for converter
  this.inputTextArea = $('#data-input');
  this.outputTextArea = $('#data-output');

  // Bind event handlers
  this.inputTextArea.add(this.outputTextArea).click(function() {
    this.select();
  });

  $('#insert-sample').click(function(evt) {
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
    _gaq.push(['_trackEvent', 'SampleData', 'InsertGeneric']);
  });

  this.inputTextArea.on({
    change: function() {
      self.convert();
      _gaq.push(['_trackEvent', 'DataType', self.outputDataType]);
    },
    keyup: function() {
      var $this = $(this);
      if (!$this.data('wait')) {
        $this.data('wait', true);  // Prevent duplicate firing of event
        self.convert();
        setTimeout(function() {
          // Reset wait state
          $this.data('wait', false);
        }, 500);
      }
    }
  });

  $('#data-selector').change(function() {
    self.outputDataType = $(this).val();
    self.convert();
  });

  // Done! Clean up
  $('.loader').remove();
  this.node.addClass('loaded');

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
    var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders, this.decimal),
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