// ==UserScript==
// @name         TsinghuaCourseConflictMarker
// @namespace    https://github.com/ZenithalHourlyRate
// @homepageURL  https://github.com/ZenithalHourlyRate/thuservices
// @version      1.4
// @description  Tsinghua Course Time Confliction Marker
// @author       Zenithal
// @match        http://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=selectKc*
// @match        http://zhjwxkyw.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=selectKc*
// @match        https://webvpn.tsinghua.edu.cn/http/*/xkBks.vxkBksXkbBs.do?m=selectKc*
// @grant        none
// ==/UserScript==


function courseConflict(){

var a=document.getElementById('iframe2').contentWindow.document.getElementsByClassName("trunk");// get the iframe of selected courses
var b=[];
for(var i=0;i!=a.length;++i){
  if(a[i].textContent.match(/.-.(.*)/gi)){ // get the span with time information
    var m=a[i].parentElement.previousElementSibling.previousElementSibling.textContent; // course name
    m=m.replace(/\s/g,'');
    if(a[i].title == ""){ // some text is abbrevated
      var c1=a[i].textContent.split(","); // some has multiple time
      for(var j1=0;j1!=c1.length;++j1){
        b.push([c1[j1],m]);
      }
    }else{
      var c2=a[i].title.split(","); // some has multiple time
      for(var j2=0;j2!=c2.length;++j2){
        b.push([c2[j2],m]);
      }
    }
  }
}

var d=document.getElementById('iframe1').contentWindow.document.getElementsByClassName("trunk");
for(i=0;i!=d.length;++i){
  if(d[i].textContent.match(/.-.(.*)/gi)){
    var e=""
    if(d[i].title == ""){
      e=d[i].textContent;
    } else {
      e=d[i].title;
    }
    var f=e.split(',');
    for(var j=0;j!=f.length;++j){
      for(var k=0;k!=b.length;++k){
        if(f[j][0]==b[k][0][0] && f[j][2]==b[k][0][2]){ // just comparison on time, no comparison on others
          d[i].style.color="#ff0000";
          d[i].title+=b[k][1];
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
