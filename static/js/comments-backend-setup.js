/*
 * ============================================================
 * COMMENTS BACKEND — Google Apps Script
 * ============================================================
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://sheets.new to create a new Google Sheet.
 *
 * 2. Rename the first sheet tab to "Comments" (exact spelling).
 *
 * 3. Add these headers in row 1:
 *      A1: id
 *      B1: slug
 *      C1: parentId
 *      D1: name
 *      E1: email
 *      F1: comment
 *      G1: timestamp
 *
 * 4. Go to Extensions > Apps Script.
 *
 * 5. Delete the default code and paste everything below this comment block.
 *
 * 6. Click Deploy > New Deployment.
 *    - Select type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click Deploy, then authorize when prompted.
 *
 * 7. Copy the Web App URL (looks like https://script.google.com/macros/s/.../exec).
 *
 * 8. In your blog's config.toml, add:
 *      [params]
 *        commentsEndpoint = "https://script.google.com/macros/s/YOUR_ID/exec"
 *
 * 9. Redeploy Hugo. Comments should now work!
 *
 * TO MODERATE: Simply delete rows from the Google Sheet.
 *              Comments disappear from the blog on next page load.
 *
 * ============================================================
 */

// --- PASTE BELOW THIS LINE INTO APPS SCRIPT ---

var SHEET_NAME = 'Comments';

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
}

/**
 * GET handler — returns comments for a given page slug as JSON.
 * Usage: ?slug=/your-post-slug/
 */
function doGet(e) {
  var slug = (e.parameter.slug || '').trim();
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var comments = [];

  // Row 0 is headers; data starts at row 1
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === slug) {
      comments.push({
        id:        data[i][0],
        slug:      data[i][1],
        parentId:  data[i][2] || null,
        name:      data[i][3],
        email:     data[i][4],
        comment:   data[i][5],
        timestamp: data[i][6]
      });
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify(comments))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST handler — adds a new comment.
 * Expects JSON body: { slug, parentId, name, email, comment }
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    // Basic validation
    if (!body.slug || !body.comment || !body.comment.trim()) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Comment text is required.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Simple length cap to prevent abuse
    var comment = body.comment.trim().substring(0, 5000);
    var name    = (body.name || 'Anonymous').trim().substring(0, 100);
    var email   = (body.email || '').trim().substring(0, 200);
    var slug    = body.slug.trim();
    var parentId = (body.parentId || '').trim();
    var id       = Utilities.getUuid();

    getSheet().appendRow([
      id,
      slug,
      parentId,
      name,
      email,
      comment,
      new Date().toISOString()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, id: id }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: 'Server error.' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
