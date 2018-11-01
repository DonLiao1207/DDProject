$(function () {
    // Reference the auto-generated proxy for the hub.
    var chat = $.connection.myHub;
    // Create a function that the hub can call back to display messages.
    //將連線打開
    $.connection.hub.start().done(function () {
    //呼叫機器狀態
        $(document).ready(function(){
            var time = new Date;
            var idarray = ["wA", "wB", "wC", "wD", "wE", "wF", "wG", "wH"];
            for (var i = 0; i < idarray.length ; i++) {
                var id = idarray[i];
                chat.server.checktime(id, time);
            }
            //var id = $("#wA").attr('id');
            //chat.server.checktime(id, time);
        })
    });

    $.connection.hub.start().done(function () {
        //呼叫機器預約狀態
        $(document).ready(function () {
            var time = new Date;
            var idarray = ["wA", "wB", "wC", "wD", "wE", "wF", "wG", "wH"];
            for (var i = 0; i < idarray.length ; i++) {
                var id = idarray[i];
                chat.server.checkres(id);
            }
            //var id = $("#wA").attr('id');
            //chat.server.checktime(id, time);
        })
    });

    $.connection.hub.start().done(function () {
        //呼叫機器預約狀態
        $(document).ready(function () {
            var time = new Date;
            var idarray = ["wA", "wB", "wC", "wD", "wE", "wF", "wG", "wH"];
            for (var i = 0; i < idarray.length ; i++) {
                var id = idarray[i];
                chat.server.checkresaf(id,time);
            }
            //var id = $("#wA").attr('id');
            //chat.server.checktime(id, time);
        })
    });
    //讀取剩餘時間
    chat.client.render = function (id, time) {
        
        disabled2(id, time);
    };
    //
    //chat.client.getList = function (id,cash) {
    //    disabled(id,cash);
    //}
    chat.client.call = function (id) {
        var time = new Date;
        
        chat.server.userpay(id,1,time);
    }

    chat.client.getList2 = function (id, cash,c) {
        
        disabled2(id, cash, c);
    }


    chat.client.getList3 = function (id, cash) {
        disabled3(id, cash);
    }

})
