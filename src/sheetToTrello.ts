var key, token, userId, teamName, boardName, targetSheet;
const listName: string = "TODO";

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
    let range = sheet.getRange(Task.TASK_RANGE);
    let values = range.getDisplayValues();
    return values.filter(existValue);
}

class Task {
    static readonly TASK_RANGE = "A4:J100";
    static readonly ROW = 0;
    static readonly PBI_NO = 1;
    static readonly PBI_NAME = 2;
    static readonly TASK_NAME = 3;
    static readonly ESTIMATE_TIME = 7;
    static readonly ACTUAL_TIME = 8;
    static readonly CARD_LINK = 9;
}

let existValue = (arr: Task[]) => {
    // タスクの時間が0以上であること　かつ　タスクの名前が入っていること(SUMは無視したい)
    if (arr[Task.ESTIMATE_TIME] != 0) {
        if (arr[Task.TASK_NAME] != 0) {
            return true;
        }
    }
};

function setup() {
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('設定');
    key = getCellValue(sheet, "B2");
    token = getCellValue(sheet, "B3");
    userId = getCellValue(sheet, "B4");
    teamName = getCellValue(sheet, "B5");
    boardName = getCellValue(sheet, "B6");
    targetSheet = getCellValue(sheet, "B9");
}


function getCellValue(sheet, cell) {
    let range = sheet.getRange(cell);
    return range.getValue();
}

function findOrganizationId() {
    const rootUrl = "/members/" + userId + "/organizations";
    let url = contextRootURI + rootUrl + "?" + getAuthQuery() + "&fields=displayName";
    let httpResponse = sendGet(url);

    for (const element of httpResponse) {
        if (teamName.equals(element.displayName)) {
            return element.id;
        }
    }
}

function findBoardId(organizationId: string) {
    const rootUrl = "/members/" + userId + "/boards";
    let url = contextRootURI + rootUrl + "?" + getAuthQuery() + "&fields=name,idOrganization";
    let httpResponse = sendGet(url);
    for (const element of httpResponse) {
        if (organizationId === element.idOrganization) {
            return element.id;
        }
    }
}

function findListId(boardId: string) {
    const rootUrl = "/boards/" + boardId + "/lists";
    let url = contextRootURI + rootUrl + "?" + getAuthQuery() + "&fields=name";
    let httpResponse = sendGet(url);

    for (const element of httpResponse) {
        if (listName === element.name) {
            return element.id;
        }
    }
}

function addEstimateTime(task, cardId: string) {
    const rootUrl = "/cards/" + cardId + "/actions/comments";
    let comment = "plus! @global 0/" + task[Task.ESTIMATE_TIME];
    const url = contextRootURI + rootUrl + "?" + getAuthQuery() + "&text=" + comment;
    sendPost(url);
}

function createCard(task, listId: string) {
    const rootUrl = "/cards";
    let title = "%7B" + task[Task.PBI_NAME] + "%7D" + task[Task.TASK_NAME];
    const url = contextRootURI + rootUrl + "?" + "idList=" + listId + getAuthQuery() + "&name=" + title;
    const httpResponse = sendPost(url);
    return httpResponse.shortLink;
}

function sendGet(url: string) {
    console.log(url);
    let httpResponse = UrlFetchApp.fetch(url);
    console.log(httpResponse);
    // @ts-ignore
    return JSON.parse(httpResponse);
}

function sendPost(url: string) {
    const options = {
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