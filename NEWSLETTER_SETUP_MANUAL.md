# How to Activate Your Newsletter (Google Sheets Integration)

Since your website is "static" (it runs in the browser without a backend server), the best professional way to collect emails for free is by connecting your form to a **Google Sheet**. This acts as your database.

Follow these steps to make the newsletter fully functional.

### Phase 1: Create the Database (Google Sheet)

1.  Go to [Google Sheets](https://sheets.google.com) and create a **Blank Spreadsheet**.
2.  Name it: **Irfan Tech Brew Subscribers**.
3.  In the first row, add these two headers exactly:
    *   Cell A1: `Timestamp`
    *   Cell B1: `Email`

### Phase 2: Create the Backend Script

1.  In your Google Sheet, click on **Extensions** > **Apps Script**.
2.  Delete any code in the `Code.gs` file and **paste the following code**:

```javascript
/* 
  Irfan Tech Brew - Newsletter Script
  This script saves emails from your website to the Google Sheet.
*/

var sheetName = 'Sheet1';
var scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    var newRow = headers.map(function(header) {
      if(header === 'Timestamp'){
        return new Date();
      } else if(header === 'Email'){ // Matches the name="email" from your HTML form
        return e.parameter.email;
      }
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  finally {
    lock.releaseLock();
  }
}
```

3.  Press **Save** (Floppy disk icon).
4.  Run the setup function:
    *   Select `initialSetup` from the function dropdown (toolbar).
    *   Click **Run**.
    *   It will ask for permissions. Click **Review Permissions** -> Choose Account -> Advanced -> **Go to (Script Name) (unsafe)** -> **Allow**.

### Phase 3: Deploy to Web

1.  Click the blue **Deploy** button (top right) -> **New deployment**.
2.  Click the "Select type" gear icon -> **Web app**.
3.  Fill in:
    *   **Description**: Newsletter API
    *   **Execute as**: Me (your email)
    *   **Who has access**: **Anyone** (This is CRITICAL for the form to work).
4.  Click **Deploy**.
5.  **Copy the "Web App URL"** generated. It will look like `https://script.google.com/macros/s/.../exec`.

### Phase 4: Final Step

**Paste the Web App URL in the chat**, and I will finalize the code in `main.js` to connect everything!
