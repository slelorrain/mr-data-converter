/*!
 * Controller.js
 */

var d, settings;

function saveSettings() {
  var currentSettings = {};
  for (var i=0; i<settings.length; ++i) {
    var field = settings[i],
      key = field.name || field.id;
    switch (field.type) {
      case 'button': // Skip
        continue;
      case 'checkbox':
        currentSettings[key] = field.checked;
        break;
      case 'radio':
        if (field.checked) currentSettings[key] = field.value;
        break;
      default:
        currentSettings[key] = field.value;
    }
  }
  currentSettings['outputDataType'] = $('#data-selector').val();
  localStorage['settings'] = JSON.stringify(currentSettings);
}

$(document).ready(function() {
  d = new DataConverter('converter');

  d.init();

  settings = $('#settings-form')[0];

  // Load saved settings?
  if (localStorage['settings']) {
    var savedSettings;
    try {
      savedSettings = JSON.parse(localStorage['settings']);
    } catch(err) {}
    if (savedSettings) {
      for (var i in savedSettings) {
        if (i==='outputDataType') {
          $('#data-selector').val(savedSettings[i]).change();
        } else {
          if (typeof savedSettings[i]==='boolean') settings[i].checked = savedSettings[i];
          else settings[i].value = savedSettings[i];
        }
      }
    }
  }

  $('.settings-element').change(updateSettings);

  $('#restore').click(restoreDefaults);

  function restoreDefaults(evt) {
    if (evt) ga('send', 'event', 'Restore Defaults', evt.currentTarget.id);
    localStorage.clear();
    location.reload();
  }

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

    saveSettings();
  }

  updateSettings();

});
