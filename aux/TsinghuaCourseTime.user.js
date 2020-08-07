// ==UserScript==
// @name         TsinghuaCourseConflictMarker
// @namespace    https://github.com/ZenithalHourlyRate
// @homepageURL  https://github.com/ZenithalHourlyRate/thuservices
// @version      1
// @description  Tsinghua Course Time Confliction Marker
// @author       Zenithal
// @match        http://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=selectKc*
// @match        http://zhjwxkyw.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=selectKc*
// @grant        none
// ==/UserScript==


function courseConflict(){

var a=document.getElementById('iframe2').contentWindow.document.getElementsByClassName("trunk");// get the iframe of selected courses
var b=[];
for(var i=0;i!=a.length;++i){
  if(a[i].text.match(/.-.(.*)/gi)){ // get the span with time information
    if(a[i].title == ""){ // some text is abbrevated
      b.push(a[i].text)
    }else{
      var c=a[i].title.split(","); // some has multiple time
      for(var j=0;j!=c.length;++j){
        b.push(c[j]);
      }
    }
  }
}

var d=document.getElementById('iframe1').contentWindow.document.getElementsByClassName("trunk");
for(i=0;i!=d.length;++i){
  if(d[i].text.match(/.-.(.*)/gi)){
    var e=""
    if(d[i].title == ""){
      e=d[i].text;
    } else {
      e=d[i].title;
    }
    var f=e.split(',');
    for(j=0;j!=f.length;++j){
      for(var k=0;k!=b.length;++k){
        if(f[j][0]==b[k][0] && f[j][2]==b[k][2]){ // just comparison on time, no comparison on others
          d[i].style.color="#ff0000"
        }
      }
    }
  }
}

}

(function() {
    document.getElementById('iframe1').onload=courseConflict;
    document.getElementById('iframe2').onload=courseConflict;
})();
