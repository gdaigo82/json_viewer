/*
 * 本システムは、kimihiro_n様の「The Fastest JSON visualizer」の以下ライセンス
 *  Copyright © 2013 pistatium Distributed under the MIT License.
 * を利用して 実現しました。kimihiro_n様に深く感謝します。
 * 当然の事ではありますが、本システムの不具合はgdaigo82の責任です。
 * が、MITライセンスに従い、gdaigo82もソフトウェアの使用またはその他の扱いによって生じる
 * 一切の請求、損害、その他の義務について何らの責任も負わないものとします。
 */

$(function(){
    var jsonEditBot = new gDaiBot("botImg", "botText");
    var latestFile = 0;
    var latestFileName = "";

    var main = function(){
        jsonEditBot.setState(gDaiBotStatus.idle);
    }

    $("#browse_btn").click(function(){
        $("#inputFile").val("");
        $('input[id=inputFile]').click();
    });

    var trimPadding = function(jsonp){
        var match = null;
        var json_obj = '';
        var json_array = '';

        //外側が{}の時
        match = jsonp.match(/\{[\s\S]*\}/);
        if(match){
            var json_obj = match.toString();
        }

        //外側が[]の時
        match = jsonp.match(/\[[\s\S]*\]/);
        if(match){
            var json_array = match.toString()
        }

        if (json_array.length > json_obj.length) {
            return json_array;
        }
        return json_obj;
    }

    var parseJSON = function(json){
        try{
            var obj = JSON.parse(json);
        } catch(e){
            jsonEditBot.setMessage(e.message);
            jsonEditBot.setState(gDaiBotStatus.error);
        }
        return obj;
    }

    var replaceEscapeCode = function(ch) {
        if(typeof ch !== 'string')return ch;
        ch = ch.replace(/&/g,"&amp;") ;
        ch = ch.replace(/"/g,"&quot;") ;
        ch = ch.replace(/'/g,"&#039;") ;
        ch = ch.replace(/</g,"&lt;") ;
        ch = ch.replace(/>/g,"&gt;") ;
        return ch ;
    }

    var setListner = function(){
        $(".key").click(function(){
            jsonEditBot.setState(gDaiBotStatus.array);
            setTimeout( function(object) {
                $(object).next(".array").next(".indent").toggle("fast");
                jsonEditBot.setState(gDaiBotStatus.ev_print);
            }, 200, this ); // msec
        });
        $(".array").click(function(){
            $(this).next(".indent").toggle("fast");
        });
        $('.place').click(function(){
            //alert(this.innerText);
        });
    }

    var makeMainTags = function(obj, nest){
        if (obj == null) {
            return "<span class='val no_val'>(null)</span>"
                + "<span class='place'>"
                + nest
                + "</span>"
                + "<br>";
        } else if (typeof obj == 'object') {
            var tmp ="<span class='array'>(array)<br></span><div class='indent'>"
            for(o in obj){
                tmp += "<span class='key'>"
                    + o
                    + "</span>:"
                    + makeMainTags(obj[o], nest + "['" + o + "']");
                }
                return tmp + "</div>";
        } else {
            return "<span class='val'>"
                + replaceEscapeCode(obj)
                + "</span>"
                + '<input class="place" size=100 value="data'
                + nest
                + '" onclick="this.select();" />'
                + "<br>";
        }
    }

    var makeHtml = function(obj){
        return "<span class='key'>ROOT</span>" + makeMainTags(obj, "");
    }

    var printText = function(text){
        var paddingObject = trimPadding(text);
        var parseObject = parseJSON(paddingObject);
        var html = makeHtml(parseObject);
        if (html){
            $("#result").hide();
            if (jsonEditBot.status !== gDaiBotStatus.error) {
                $("#result").html(html);
                $("#result").show("fast");
                setListner();
            }
        }
    }

    var readJsonAndParse = function(reader){
        reader.readAsText(latestFile);
        reader.onload = function(readerEvent){
            $('#fileNameText').val(latestFileName);
            var text = reader.result;
            printText(text);
            if (jsonEditBot.status !== gDaiBotStatus.error) {
                jsonEditBot.setState(gDaiBotStatus.ev_print);
            }
        }
    }

    var selectFileEvent = function(inputEvent)
    {
        var files =  inputEvent.target.files;
        var reader = new FileReader();
        latestFile = files[0];
        readJsonAndParse(reader);
    }

    $('input[id=inputFile]').change(function(inputEvent) {
        latestFileName = $(this).val().replace("C:\\fakepath\\", "");
        var timeout_id = setTimeout(selectFileEvent , 1000, inputEvent); // msec
        $('#fileNameText').val(latestFileName);
        $("#result").hide();
        jsonEditBot.setState(gDaiBotStatus.browse);
    });

    main();
});
