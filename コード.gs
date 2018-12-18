/**
 * Return a list of sheet names in the Spreadsheet with the given ID.
 * @param {String} a Spreadsheet ID.
 * @return {Array} A list of sheet names.
 */

var sid="1CpwNLrurUVVLX2dmMgZHU-uQC7WQfyfWqLlaiooRaN8";
var sname="周回のるま";

function doGet() {
  var ss = SpreadsheetApp.openById(sid);
  var sheets = ss.getSheetByName(sname);
  
　var last_row = sheets.getLastRow()-1;
　var last_col = 10;
  
  
   var values= sheets.getRange(1,1,last_row ,last_col).getValues();
  var str=JSON.stringify(values);
  
  var ss=JSON.parse(str);
  
  var kyoku="2017/08/22 00:00";
  var moment = Moment.load();
  var kikan= (moment()-moment(kyoku))/3600/24/30/1000;
  
  var st="曲追加ペース;" +  ((last_row-17)/kikan) +"<br>";
  
  
  for(var i=0;i<ss.length;i++)
  {
    st +="<tr>";
  for(var k=0;k<10;k++){
    if(k==5 && i>0){
      ss[i][k]=moment(ss[i][k]).format("YY/MM/DD HH:mm");
    }
    if(k==9 && i>0){
      ss[i][k]=moment(ss[i][k]).format("HH:mm");
    }
    
  st += "<td>"+ss[i][k] +"</td>";
  }
  st += "</tr>";
  }
  
  st = "<table><tbody>" +st + "<tbody></table>";
  
  return HtmlService.createHtmlOutput(st);
  //return ContentService.createTextOutput(st).setMimeType(ContentService.MimeType.TEXT);
    //JSON.stringify(sheet.getName());
}

function wmap_getSheetsName(sheets){
  //var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  var sheet_names = new Array();
  
  if (sheets.length >= 1) {  
    for(var i = 0;i < sheets.length; i++)
    {
      sheet_names.push(sheets[i].getName());
    }
  }
  return sheet_names;
}