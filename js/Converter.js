/*!
 * Converter.js
 * Mr-Data-Converter
 *
 * Created by Shan Carter on 2010-09-01.
 */

function DataConverter(nodeId) {

  //---------------------------------------
  // PUBLIC PROPERTIES
  //---------------------------------------

  this.nodeId            = nodeId;
  this.node              = $('#' + nodeId);
  this.outputDataType    = 'json';
  this.rowDelimiter      = '\n';
  this.inputText         = '';
  this.outputText        = '';
  this.indent            = '  ';
  this.tableName         = 'your_table_name';
  this.headersProvided   = true;
  this.safeHeaders       = true;
  this.downcaseHeaders   = false;
  this.upcaseHeaders     = false;
  this.includeWhiteSpace = true;
  this.useTabsForIndent  = false;

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.init = function() {
  var self = this;
  this.inputTextArea = $('#data-input');
  this.outputTextArea = $('#data-output');
  this.dataSelector = $('#data-selector');
  this.outputNotes = $('#output-notes');

  // Show loader (based on http://projects.lukehaas.me/css-loaders/)
  $('#converter > .wrapper').append(
    '<div class="loader">' +
    '  <span class="loader-text">Loading...</span>' +
    '  <i class="loader-icon"></i>' +
    '</div>');

  // Re-convert if arriving from Back button
  if (this.outputTextArea.val()) {
    self.outputDataType = this.dataSelector.children('option:selected').val();
    self.convert();
  }

  // Bind event handlers
  this.inputTextArea.add(this.outputTextArea).click(function() {
    this.select();
  });

  $('#insert-sample').click(function(evt) {
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
    ga('send', 'event', 'SampleData', 'InsertGeneric');
  });

  this.inputTextArea.on({
    change: function() {
      self.convert();
      ga('send', 'event', 'DataType', self.outputDataType);
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

  this.dataSelector.change(function() {
    self.outputDataType = $(this).val();
    if (self.outputDataType==='xmlSmart') {
      self.outputNotes.text('This format requires safe header names to be disabled.');
      $('#headersUnsafe').click();
    } else {
      self.outputNotes.text('');
    }
    self.convert();
    self.outputTextArea.select();
    saveSettings();
  });

  // Done! Clean up
  $('.loader').remove();
  this.node.addClass('loaded');

};

DataConverter.prototype.convert = function() {
  this.inputText = this.inputTextArea.val();

  // Make sure there is input data before converting...
  if (this.inputText.length > 0) {

    if (this.includeWhiteSpace) {
      this.newLine = '\n';
    } else {
      this.indent = '';
      this.newLine = '';
    }

    CSVParser.resetLog();
    var parseOutput = CSVParser.parse(this.inputText, this.delimiter, this.decimal, this.headersProvided, this.safeHeaders, this.downcaseHeaders, this.upcaseHeaders),
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
