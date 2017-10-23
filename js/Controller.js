/*!
 * Controller.js
 */

var d;

$(document).ready(function() {
  d = new DataConverter('converter');

  d.init();

  $('.settings-element').change(updateSettings);

  function updateSettings(evt) {

    if (evt) ga('send', 'event', 'Settings', evt.currentTarget.id);

    d.delimiter = $('input[name=delimiter]:checked').val();
    d.decimal = $('input[name=decimal]:checked').val();

    d.headersProvided = $('#headersProvidedCB').prop('checked');
    if (d.headersProvided) {
      $('#headerGroup input').prop('disabled', false);
      d.safeHeaders = $('input[name=headerType]:checked').val()==='safe';
      switch ($('input[name=headerModifications]:checked').val()) {
        case 'none':
          d.downcaseHeaders = false;
          d.upcaseHeaders = false;
          break;
        case 'downcase':
          d.downcaseHeaders = true;
          d.upcaseHeaders = false;
          break;
        case 'upcase':
          d.downcaseHeaders = false;
          d.upcaseHeaders = true;
          break;
      }
    } else {
      $('#headerGroup input').prop('disabled', true);
    }

    d.includeWhiteSpace = $('#includeWhiteSpaceCB').prop('checked');
    if (d.includeWhiteSpace) {
      $('#indentGroup input').prop('disabled', false);
      switch ($('input[name=indentType]:checked').val()) {
        case 'spaces':
          d.indent = '  ';
          break;
        case 'tabs':
          d.indent = '\t';
          break;
      }
    } else {
      $('#indentGroup input').prop('disabled', true);
    }

    d.includeHtmlClass = $('#includeHtmlClassCB').prop('checked');

    d.convert();
  }

  updateSettings();

});
