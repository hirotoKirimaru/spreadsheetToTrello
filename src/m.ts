var key = "";
var token = "";

const contextRootURI = "https://api.trello.com/1";

function findBoardId(organazationId: string) {
    return "";
}

function findListId(boardId: string) {
    return "5da2fd3cd32c7332e172e7f4";
}

function sprintStart() {
    setup();

    var organizationId = findOrganizationId();
    var boardId = findBoardId(organizationId);
    var listId = findListId(boardId);

    // forで回す
    var cardId = createCard(listId);
    addEstimateTime(cardId);
}

function setup() {
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    // var spreadsheet = SpreadsheetApp.openById('1aRnCVDceRaasfasfar-R4oGFmta0SsafapGxl8AVk_gKVofafa5MO7ts');
    let sheet = spreadsheet.getSheetByName('設定');
    key = getCellValue(sheet, "B2");
    token = getCellValue(sheet, "B3");
}

function getCellValue(sheet, cell) {
    let range = sheet.getRange(cell);
    return range.getValue();
}


function findOrganizationId() {
    return "";
}


function addEstimateTime(cardId: string) {

}

function createCard(listId: string) {
    const rootUrl = "/cards";

    var url = contextRootURI + rootUrl + "?" + "idList=" + listId + getAuthQuery();
    var options = {
        "method": "POST"
    };
    let httpResponse = UrlFetchApp.fetch(url, options);
    return "";

}

function getAuthQuery() {
    return "&key=" + key + "&token=" + token;
}