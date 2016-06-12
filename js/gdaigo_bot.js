/*
 * gdaigoBot
 * Copyright 2016 gdaigo82@gmail.com.
 * Licensed under the MIT license
 */

var gDaiBotStatus = {
    idle : "idle",
    browse : "browse",
    array : "array",
    ev_print : "ev_print",
    printed : "printed",
    error : "error",
}

var gDaiBotSchenario = {
  "idle_img"  : "img/puronama_normal.png",
  "idle_text" : "ここではJSONを解析します。<br>「Browse」をクリックしてファイルを選んでね。",

  "browse_img"  : "img/puronama_browse.png",
  "browse_text" : "JSONファイルを開きまーす！",

  "array_img"  : "img/puronama_array.png",
  "array_text" : "えーと配列の処理だよね。。",

  "printed_img"  : "img/puronama_complete.png",
  "printed_text" : "作業完了！  下を見てね。<br>更新とか別の解析するなら「Browse」です。<br>「HOME」はトップに戻ります。",

  "error_img" : "img/puronama_error.png",
  "error_text" : "<br>ってJavaScript様からダメ出しだー。<br>「Browse」で再度選べるよ。"
}

gDaiBot = function(img, text) {
  this.img = img;
  this.text = text;
  this.status = gDaiBotStatus.idle;
  this.message = "";
};

gDaiBot.prototype.setMessage = function(message) {
  this.message = message;
}

gDaiBot.prototype.setState = function(status) {
  this.status = status;
  if (this.status  === gDaiBotStatus.ev_print)
  {
    setTimeout( function(object) {
        object.setState(gDaiBotStatus.printed);
    }, 1000, this ); // msec
    return;
  }
  var imgId = status + "_img";
  var textId = status + "_text";
  var text = gDaiBotSchenario[textId];
  if (this.status  === gDaiBotStatus.error) {
    text = "<span class=\"text-danger\">「" + this.message + "」</span>" + text;
  }
  document.getElementById(this.img).src = gDaiBotSchenario[imgId];
  document.getElementById(this.text).innerHTML = text;
};
