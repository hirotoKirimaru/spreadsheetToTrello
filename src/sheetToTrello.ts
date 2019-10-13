var key, token, userId, teamName, boardName, targetSheet;
const listName = "TODO";

const contextRootURI = "https://api.trello.com/1";

function sprintStart() {
    setup();

    let organizationId = findOrganizationId();
    let boardId = findBoardId(organizationId);
    let listId = findListId(boardId);

    let taskList = getTask();

    for (const task of taskList) {
        let cardId = createCard(task, listId);
        addEstimateTime(task, cardId);
    }
}

function getTask() {
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(targetSheet);
    let range = sheet.getRange("A4:G100");
    var values = range.getDisplayValues();
    return values.filter(existValue);
}

let existValue = (arr: object[]) => {
    // タスクの時間が0以上であること　かつ　タスクの名前が入っていること(SUMは無視したい)
    if (arr[arr.length - 1] != 0) {
        if (arr[0] != 0) {
            return true;
        }
    }
}

function setup() {
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('設定');
    key = getCellValue(sheet, "B2");
    token = getCellValue(sheet, "B3");
    userId = getCellValue(sheet, "B4");
    teamName = getCellValue(sheet, "B5");
    boardName = getCellValue(sheet, "B6");
    targetSheet = getCellValue(sheet, "B9")
}


function getCellValue(sheet, cell) {
    let range = sheet.getRange(cell);
    return range.getValue();
}

function findOrganizationId() {
    const rootUrl = "/members/" + userId + "/organizations";
    var url = contextRootURI + rootUrl + "?" + getAuthQuery() + "&fields=displayName";
    var httpResponse = sendGet(url);

    for (const element of httpResponse) {
        if (teamName.equals(element.displayName)) {
            return element.id;
        }
    }
}

function findBoardId(organizationId: string) {
    const rootUrl = "/members/" + userId + "/boards";
    var url = contextRootURI + rootUrl + "?" + getAuthQuery() + "&fields=name,idOrganization";
    let httpResponse = sendGet(url);
    for (const element of httpResponse) {
        if (organizationId.equals(element.idOrganization)) {
            return element.id;
        }
    }
}

function findListId(boardId: string) {
    const rootUrl = "/boards/" + boardId + "/lists";
    var url = contextRootURI + rootUrl + "?" + getAuthQuery() + "&fields=name";
    let httpResponse = sendGet(url);

    for (const element of httpResponse) {
        if (listName.equals(element.name)) {
            return element.id;
        }
    }
}

function addEstimateTime(task, cardId: string) {
    const rootUrl = "/cards/" + cardId + "/actions/comments";
    let comment = "plus @0/" + task[task.length - 1];
    var url = contextRootURI + rootUrl + "?" + getAuthQuery() + "&text=" + comment;
    let httpResponse = sendPost(url);
}

function createCard(task, listId: string) {
    const rootUrl = "/cards";
    let title = "%7B" + task[1] + "%7D" + task[2];
    var url = contextRootURI + rootUrl + "?" + "idList=" + listId + getAuthQuery() + "&name=" + title;
    var httpResponse = sendPost(url);
    return httpResponse.shortLink;
}

function sendGet(url: string) {
    console.log(url);
    let httpResponse = UrlFetchApp.fetch(url);
    console.log(httpResponse);
    return JSON.parse(httpResponse);
}

function sendPost(url: string) {
    var options = {
        "method": "POST"
    };
    console.log(url);
    // @ts-ignore
    let httpResponse = UrlFetchApp.fetch(url, options);
    console.log(httpResponse);
    return JSON.parse(httpResponse);
}

function getAuthQuery() {
    return "&key=" + key + "&token=" + token;
}