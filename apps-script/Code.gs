// Incolla questo file così com'è in Estensioni → Apps Script del foglio lead.
var SHARED_SECRET = 'INSERISCI_QUI_LA_TUA_PASSWORD_SEGRETA';
var SHEET_ID = '1XjK4E0A0voVcsN-h2HI6u0PSA69j1LuN6CF_z5Z1wfs';
var TAB_NAME = 'Lead';
var HEADERS = ['Zeitstempel', 'Vorname', 'Nachname', 'E-Mail', 'Buch', 'Einwilligung'];

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (!data || data.secret !== SHARED_SECRET) return out_({ ok: false, error: 'unauthorized' });

    var email = String(data.email || '').trim().toLowerCase();
    if (!email || !data.vorname || !data.nachname) return out_({ ok: false, error: 'invalid' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var ss = SpreadsheetApp.openById(SHEET_ID);
      var sh = ss.getSheetByName(TAB_NAME);
      if (!sh) {
        sh = ss.insertSheet(TAB_NAME);
        sh.appendRow(HEADERS);
        sh.setFrozenRows(1);
      }
      var row = [data.timestamp || new Date().toISOString(), data.vorname, data.nachname, email, data.buch || '', data.consent ? 'Ja' : 'Nein'];
      var last = sh.getLastRow();
      var found = -1;
      if (last > 1) {
        var emails = sh.getRange(2, 4, last - 1, 1).getValues();
        for (var i = 0; i < emails.length; i++) {
          if (String(emails[i][0]).trim().toLowerCase() === email) { found = i + 2; break; }
        }
      }
      if (found > 0) {
        sh.getRange(found, 1, 1, row.length).setValues([row]);
      } else {
        sh.appendRow(row);
      }
    } finally {
      lock.releaseLock();
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: 'exception' });
  }
}

function doGet() {
  return out_({ ok: true, info: 'Lead-Endpoint aktiv' });
}
