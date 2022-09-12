// ==UserScript==
// @name         Tsinghua GPA calculator
// @namespace    https://github.com/ZenithalHourlyRate
// @homepageURL  https://github.com/ZenithalHourlyRate/thuservices
// @version      1.2
// @description  Calculate the gpa on page
// @author       Zenithal, SuXY15
// @match        http://zhjw.cic.tsinghua.edu.cn/cj.cjCjbAll.do?m=*_yxkccj*
// @grant        none
// @license      MIT
// ==/UserScript==

// from https://stackoverflow.com/questions/6600868
var handler = {
  get: function(target, name) {
    return target.hasOwnProperty(name) ? target[name] : -1;
  }
};

var old_gpa_dict = new Proxy({
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F':  0
}, handler);

var new_gpa_dict = new Proxy({
    'A+': 4.0, 'A': 4.0, 'A-': 4.0,
    'B+': 3.6, 'B': 3.3, 'B-': 3.0,
    'C+': 2.6, 'C': 2.3, 'C-': 2.0,
    'D+': 1.6, 'D': 1.3, 'F':  0
}, handler);
function calc() {
    var table = document.getElementsByClassName('table')[0];
    var oldSum=0, newSum=0, credit=0;
    var rOldSum=0, rNewSum=0, rCredit=0; // Required and Restricted selective

    for(var i=1; i<table.rows.length; ++i){ // skip the first row
        var r = table.rows[i]
        if(r.cells.length != 12) { // make sure current row has course data
            continue;
        }
        if(!table.rows[i].cells[0].querySelector("input").checked){
            continue;
        }
        var c = parseInt(r.cells[3].innerText);
        var g = r.cells[5].innerText;
        var o = old_gpa_dict[g];
        var n = new_gpa_dict[g];
        if(o != -1){
            oldSum += c*o;
            newSum += c*n;
            credit += c;
            if(r.cells[8].innerText=="必修" || r.cells[8].innerText=="限选"){
                rOldSum += c*o;
                rNewSum += c*n;
                rCredit += c;
            }
        }
    }
    var rdiv=document.getElementById('result');
    var s = "New " + (newSum/credit).toString() + "\n" +
            "Old " + (oldSum/credit).toString() + "\n";
    if(rCredit > 0){ // there is no "必修"/"限选" for graduate students
        s+= "R New " + (rNewSum/rCredit).toString() + "\n" +
            "R Old " + (rOldSum/rCredit).toString();
    }
    rdiv.innerText=s;
};

function init(){
    var table = document.getElementsByClassName('table')[0];
    for(var i=1; i<table.rows.length; ++i){ // skip the first row
        var r=table.rows[i];
        if(r.cells.length != 12) { // make sure current row has course data
            continue;
        }
        var d=r.cells[0].firstChild;
        var cb= document.createElement("input");
        cb.setAttribute("type","checkbox");
        cb.setAttribute("style","vertical-align: top;");
        cb.checked=true;
        cb.onchange=calc;
        d.insertBefore(cb,d.firstChild);
    }
    var div= document.createElement("div")
    div.setAttribute("style","font-size:18px;");
    div.setAttribute("align","center");
    div.setAttribute("id","result");
    var text= document.createTextNode("text");
    div.appendChild(text);
    table.parentNode.insertBefore(div,table.nextSibling);
    calc();
};
init();
