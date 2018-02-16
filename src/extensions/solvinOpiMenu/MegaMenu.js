window.showmenu=function(id) {
    var left = $('#top' + id).position().left + 12;
    var top = $('#top' + id).position().top + 40;
    left = left + "px";
    top = top + "px";
    document.getElementById('top' + id).style.position = "relative";
    document.getElementById('top' + id + 'menu').style.position = "absolute";
    document.getElementById('top' + id + 'menu').style.left = left;
    document.getElementById('top' + id + 'menu').style.top = top;
    document.getElementById('top' + id + 'menu').style.display = '';
    $('#top' + id).addClass("topmenuselected");
    //document.getElementById('top' + id).className="topmenu topmenuselected";
    $('[id^="top"]').not("#top" + id).removeClass("topmenuselected");    
}
window.hidemenu=function(id) {
    document.getElementById('top' + id + 'menu').style.display = 'none';
    $('[id^="top"]').removeClass("topmenuselected");
    

}
window.fadesubmenu=function(mainid, subid) {
    var element = document.getElementById('submenusectionbody_' + mainid + '_' + subid);
    if (element) {
        if (element.style.maxHeight) {
            element.style.maxHeight = null;
        } else {
            element.style.maxHeight = element.scrollHeight + "px";
        }
    }


}