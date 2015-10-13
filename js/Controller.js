var _gaq = _gaq || [];

$(document).ready(function() {
  var widthOffset = 345,
    heightOffset = 35,
    d = new DataConverter('converter'),
    sidebar = $('#header'),
    win = $(window),
    w = win.width() - widthOffset,
    h = win.height() - heightOffset;

  d.create(w,h);

  $('.settingsElement').change(updateSettings);

  $(window).resize(function() {
    w = win.width() - widthOffset;
    h = win.height() - heightOffset;
    d.resize(w,h);
    sidebar.height(h);
  });

  function updateSettings(evt) {

    if (evt) {
      _gaq.push(['_trackEvent', 'Settings', evt.currentTarget.id]);
    }

    d.includeWhiteSpace = $('#includeWhiteSpaceCB').prop('checked');

    if (d.includeWhiteSpace) {
      $('input[name=indentType]').removeAttr('disabled');
      var indentType = $('input[name=indentType]:checked').val();
      if (indentType === 'tabs') {
        d.indent = '\t';
      } else if (indentType === 'spaces') {
        d.indent = '  ';
      }
    } else {
      $('input[name=indentType]').prop('disabled', true);
    }

    d.headersProvided = $('#headersProvidedCB').prop('checked');

    if (d.headersProvided) {
      $('input[name=headerModifications]').removeAttr('disabled');

      var hm = $('input[name=headerModifications]:checked').val();
      if (hm === 'downcase') {
        d.downcaseHeaders = true;
        d.upcaseHeaders = false;
      } else if (hm === 'upcase') {
        d.downcaseHeaders = false;
        d.upcaseHeaders = true;
      } else if (hm === 'none') {
        d.downcaseHeaders = false;
        d.upcaseHeaders = false;
      }
    } else {
      $('input[name=headerModifications]').prop('disabled', true);
    }

    d.delimiter = $('input[name=delimiter]:checked').val();
    d.decimal = $('input[name=decimal]:checked').val();
    d.useUnderscores = true;
    d.convert();
  }

  updateSettings();

});