/**
 * Return a list of sheet names in the Spreadsheet with the given ID.
 * @param {String} a Spreadsheet ID.
 * @return {Array} A list of sheet names.
 */

var sid="1CpwNLrurUVVLX2dmMgZHU-uQC7WQfyfWqLlaiooRaN8";
var sname="周回のるま";
var moment = Moment.load();
 

function doGet() {
  var ss = SpreadsheetApp.openById(sid);
  var sheets = ss.getSheetByName(sname);
  
　var last_row = sheets.getLastRow()-1;
　var last_col = 12;
  
  
   var values= sheets.getRange(1,1,last_row ,last_col).getValues();
  var str=JSON.stringify(values);
  
  var ss=JSON.parse(str);
  
  var kyoku="2017/08/22 00:00";
  var kikan= (moment()-moment(kyoku))/3600/24/30/1000; 
 
  for(var i=1;i<ss.length;i++)
  {
  for(var k=0;k<12;k++){
    if(k==5 && i>0){
      ss[i][k]=moment(ss[i][k]).format("YY/MM/DD HH:mm");
    }
    if(k==11 && i>0){
      ss[i][k]=moment(ss[i][k]).format("HH:mm");
    }
  }
  }  
  
 ss=filetercombine(ss);//分離後QS
ss.length=last_row-1;
   
  var st="曲追加ペース;" +  ((last_row-17)/kikan) +"<br>";
  
  
  for(var i=0;i<ss.length;i++)
  {
    st +="<tr>";
  for(var k=0;k<12;k++){
   
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

var init=[
"ココロがかえる場所",
"Blue Symphony",
"Sentimental Venus",
"Marionetteは眠らない"];


function initsort(data){

var BBD=[];
for(var i=0;i<4;i++){
BBD[i]=[];
for(var k=0;k<data[0].length;k++){
BBD[i][k]=data[i][k];
}}
var t=0;
for(var i=0;i<4;i++){
for(var k=0;k<4;k++){
if(init[i]==BBD[k][2]){
for(var j=0;j<data[0].length;j++){
data[t][j]=BBD[k][j];
}
t++;
}}}

  return data;
}

//0 no,1=属,2=name,3=hiara,4=条件,5=time,6=lv,7=uta
var no=0;
var zoku=1;
var song=2;
var jou=4;
var release=5;
var lv=6;
var uta=7;


function filetercombine(data){
//ブルーミングとヘッダー分離
//allと他 分離
//all QS式　歌い分け＞実装
//他　QS式　初期＞イベ＞コミュ＞実装

var head=[];
var extra=[];var r=0;
var all=[];var t=0;
var hoka=[];var s=0;
for(var i=0;i<data.length;i++){
all[t]=[];
hoka[s]=[];
extra[r]=[];
for(var k=0;k<data[0].length;k++){
if(i==0){
head[k]=data[i][k];
}
else if(data[i][4].indexOf("特")>0){//u7279 特
extra[r][k]=data[i][k];
if(k==data[0].length-1){r++;}
}
else if(data[i][1]=="all"){
all[t][k]=data[i][k];
if(k==data[0].length-1){t++;}
}
else{
hoka[s][k]=data[i][k];
if(k==data[0].length-1){s++;}
}}}
hoka.length=hoka.length-1;
all.length=all.length-1;

extra.sort(function(a,b){
return (moment("20"+a[release]) - moment("20"+b[release]));
});
  
all.sort(function(a,b){
return (moment("20"+a[release]) - moment("20"+b[release]));
}); 
all.sort(function(a,b){
        if(b[0].indexOf("e")) return 1;
        if(a[0]. indexOf("e")) return -1;
});  
all.sort(function(a,b){
        if(b[uta]) return 1;
        if(a[uta]) return -1;
});


hoka.sort(function(a,b){
        if(a[jou]=="コミュ") return -1;
        if(b[jou]=="コミュ") return 1;
});
hoka.sort(function(a,b){
        if(a[jou]=="イベ") return -1;
        if(b[jou]=="イベ") return 1;
});
hoka.sort(function(a,b){
        if(a[jou]=="初期") return -1;
        if(b[jou]=="初期") return 1;
});
hoka.sort(function(a,b){
        if(a[jou]==b[jou]){
        if(a[release]!=b[release]){ 
return (moment("20"+a[release]) - moment("20"+b[release]));
}
else{
return a[lv]-b[lv];
}
}
});

  
hoka=initsort(hoka);
  
data=[];
data[0]=[];
data[0]=head;
data=data.concat(all);
data=data.concat(hoka);
data=data.concat(extra);


  return data;
}


function compare(a, b) { 

if(a[no]=="NO."){
return -1;
}
if(b[no]=="NO."){
return 1;
}


if(a[song]=="Blooming Star"){
return 1;
}
if(b[song]=="Blooming Star"){
return -1;
}

if(a[zoku]=="all" && b[1]=="all"){
if(a[uta]==b[uta]){
return (moment("20"+a[release]) - moment("20"+b[release]));
}
if(a[uta]=="○"){
return -1;
}
if(b[uta]=="○"){
return 1;
}
return (moment("20"+a[release]) - moment("20"+b[release]));
}
else if(a[zoku]=="all"){
return 1;
}
else if(b[zoku]=="all"){
return -1;
}

if(a[jou]==b[jou]){
if(a[release]!=b[release]){
return (moment("20"+a[release]) - moment("20"+b[release]));
}
else{//コミュ
return a[lv]-b[lv];
}
}

if(a[jou]=="初期"){
return -1;
}
else if(b[jou]=="初期"){
return 1;
}

if(a[jou]=="イベ"){
return -1;
}
else if(b[jou]=="イベ"){
return 1;
}

if(a[jou]=="コミュ"){
return -1;
}
else if(b[jou]=="コミュ"){
return 1;
}

return (moment("20"+a[release]) - moment("20"+b[release]));

}

