function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("new");
    var data = JSON.parse(e.postData.contents);

    // Check for required fields
    var required = ['community', 'management', 'phone', 'email', 'specials', 'commissionSend', 'commissionEscort'];
    var missing = required.filter(function (k) {
      return !data || data[k] == null || String(data[k]).trim() === '';
    });
    if (missing.length) {
      return ContentService.createTextOutput(
        JSON.stringify({ result: "error", error: "Missing fields: " + missing.join(', ') })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(),
      data.community,
      data.management,
      data.phone,
      data.email,
      data.specials,
      data.commissionSend,
      data.commissionEscort
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    )
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
