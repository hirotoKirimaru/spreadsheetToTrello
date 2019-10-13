function random() {


    return Math.random;
}

function hogehoge(){
    //1. 現在のスプレッドシートを取得
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    // var spreadsheet = SpreadsheetApp.openById('1aRnCVDceRaasfasfar-R4oGFmta0SsafapGxl8AVk_gKVofafa5MO7ts');
    //2. 現在のシートを取得
    var sheet = spreadsheet.getSheetByName('設定');
    //3. 指定するセルの範囲（A1）を取得
    var range = sheet.getRange("A1");
    //4. 値を取得する
    var value = range.getValue();




    console.log(value)
}