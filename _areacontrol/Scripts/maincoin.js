runlist = [];
cashlist = [];
function disabled2(id, cash) {
    
    $("#" + id + "text").css("animation-name", "using");
    $("#" + id + "text").css("animation-duration", "3s");
    $("#" + id + "text").css("animation-iteration-count", "infinite");
    $("#" + id + "textbtn").show();
    var bb = "<button class='resbtn' id='" + id + "textbtn'>預約</button>";
    var idarray = [{ ID: "wAtext", button: bb }, { ID: "wBtext", button: bb }, { ID: "wCtext", button: bb }, { ID: "wDtext", button: bb }, { ID: "wEtext", button: bb }, { ID: "wFtext", button: bb }, { ID: "wGtext", button: bb }, { ID: "wHtext", button: bb }];
    //+"<button class='resbtn' id='" + id + "textbtn'>預約</button>"
    //+ "<button class='resbtn' id='" + id + "textbtn'>預約</button>"
    var idx = idarray.map(function (img) { return img.ID; }).indexOf(id+"text");

    runlist.push({ ID: id, btn: "<button  class='resbtn' id='" + idx+ "btn'>預約</button>" });
    var timer = runlist[0].ID;
    timer = setInterval(function () {
        cash=cash-1;
        if (cash> 0) {
            var now = new Date();
            var etime = now.getTime();
            etime += cash * 1000;
            var count = (etime - now) / 1000;
            var min = Math.floor(count / 60);
            var sec = cash - min * 60;
            //cash = cash - 6;
            if (sec < 10) {
                $("#" + id + "text").html("使用中..." + "</br>" + min + ":0" + sec);
            }
            else {
                $("#" + id + "text").html("使用中..." + "</br>" + min + ":" + sec);
            }
            //$("#deb").append(cash)
        }
            
        if (cash < 0) {
            
            var chat = $.connection.myHub;
            runlist.shift();
            $.connection.hub.start().done(function () {
                //呼叫剔除方法
                
                chat.server.ifres(id);
                location.reload();
                //var id = $("#wA").attr('id');
                
            });
            $("#" + id + "text").html("可使用...");
            $("#" + id + "text").css("animation-name", "useable")
            $("#" + id + "text").css("animation-duration", "2s")
            $("#" + id + "text").css("animation-iteration-count", "infinite")
            clearInterval(timer);
        }
            
        
    }, 1000);
   
    }
    
//$("div#reservation").click(
//function () {
//    var idarray = ["wAtext", "wBtext", "wCtext", "wDtext", "wEtext", "wFtext", "wGtext", "wHtext"];
//    for (var i = 0; i < idarray.length ; i++) {
//        var id = idarray[i];
//        var btn="<button>預約</button>"
//        $("#" + id).html(btn);
//        $("#res").show();
//    }
//});

$(function(){
    var chat = $.connection.myHub;

    $.connection.hub.start().done(function () {
        
        $("body").on('click', '.resbtn', function (e) {
            var i = $(this).attr("id");

            chat.server.res(i);
        });

    });

    var chat = $.connection.myHub;
    chat.client.restool = function (id, id2) {
        $("#" + id).text("已預約");
        $("#" + id).prop("disabled",true);
    }
    chat.client.resover = function (id, cash) {
        var time = new Date;
        chat.server.userpayres(id, 1, time);
    }

});

function disabled3(id, cash) {
    
    $("#" + id + "text").css("animation-name", "res");
    $("#" + id + "text").css("animation-duration", "3s");
    $("#" + id + "text").css("animation-iteration-count", "infinite");
    
    
    runlist.push({ ID: id, btn:""});
    var timer = runlist[0].ID;
    timer = setInterval(function () {
        cash = cash - 1;
        if (cash > 0) {
            var now = new Date();
            var etime = now.getTime();
            etime += cash * 1000;
            var count = (etime - now) / 1000;
            var min = Math.floor(count / 60);
            var sec = cash - min * 60;
            //cash = cash - 6;
            if (sec < 10) {
                $("#" + id + "text").html("已預約" + "</br>" + min + ":0" + sec);
            }
            else {
                $("#" + id + "text").html("已預約" + "</br>" + min + ":" + sec);
            }
            //$("#deb").append(cash)
        }

        if (cash < 0) {

            var chat = $.connection.myHub;
            runlist.shift();
            $.connection.hub.start().done(function () {
                //呼叫剔除方法
                chat.server.kick(id);
                location.reload();
                //var id = $("#wA").attr('id');

            });
            $("#" + id + "text").html("可使用...");
            $("#" + id + "text").css("animation-name", "useable")
            $("#" + id + "text") + "text".css("animation-duration", "2s")
            $("#" + id + "text").css("animation-iteration-count", "infinite")
            clearInterval(timer);
        }


    }, 1000);

}

