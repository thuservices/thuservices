// ==UserScript==
// @name         Tsinghua GPA calculator
// @namespace    https://github.com/ZenithalHourlyRate
// @homepageURL  https://github.com/ZenithalHourlyRate/thuservices
// @version      0.1
// @description  Calculate the gpa on page
// @author       Zenithal
// @match        http://zhjw.cic.tsinghua.edu.cn/cj.cjCjbAll.do?m=bks_yxkccj*
// @grant        none
// ==/UserScript==

function old_gpa_convert(g){
    switch(g){
        case 'A+':return 40;
        case 'A':return 40;
        case 'A-':return 37;
        case 'B+':return 33;
        case 'B':return 30;
        case 'B-':return 27;
        case 'C+':return 23;
        case 'C':return 20;
        case 'C-':return 17;
        case 'D+':return 13;
        case 'D':return 10;
        case 'F':return 0;
        default:return -1;
    }
}

function new_gpa_convert(g){
    switch(g){
        case 'A+':return 40;
        case 'A':return 40;
        case 'A-':return 40;
        case 'B+':return 36;
        case 'B':return 33;
        case 'B-':return 30;
        case 'C+':return 26;
        case 'C':return 23;
        case 'C-':return 20;
        case 'D+':return 16;
        case 'D':return 13;
        case 'F':return 0;
        default:return -1;
    }
}

(function() {
    var table = document.getElementsByClassName('table')[0];
    var oldSum=0,newSum=0,credit=0;
    var rOldSum=0,rNewSum=0,rCredit=0; // Required and Restricted selective
    for(var i=1;i<table.rows.length-1;++i){ // skip the first and last row
        var r = table.rows[i]
        if(r.cells.length != 12) {
            continue;
        }
        var c = parseInt(r.cells[3].innerText);
        var g = r.cells[5].innerText;
        var o = old_gpa_convert(g);
        var n = new_gpa_convert(g);

        if(o!=-1){
            oldSum+=c*o;
            newSum+=c*n;
            credit+=c;
            if(r.cells[8].innerText=="必修" || r.cells[8].innerText=="限选"){
                rOldSum+=c*o;
                rNewSum+=c*n;
                rCredit+=c;
            }
        }

    }


    var s =
        "New " + (newSum/credit/10).toString() + "\n" +
        "Old " + (oldSum/credit/10).toString() + "\n" +
        "R New " + (rNewSum/rCredit/10).toString() + "\n" +
        "R Old " + (rOldSum/rCredit/10).toString();

    alert(s);
})();