$(document).ready(function () {
    var account = $("#accountName")[0]
    var header = $("#mainHeader")[0]
    header.innerHTML = header.innerHTML.replace("()", '(</span><span style="color:#55c13a">' + '"' + account.innerHTML + '"' + '</span><span style="color:#f4f6f7;">)</span>');
});