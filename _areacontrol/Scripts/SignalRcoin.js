$(function () {
    // Reference the auto-generated proxy for the hub.
    var chat = $.connection.myHub;
    // Create a function that the hub can call back to display messages.
    //將連線打開
    
    $.connection.hub.start().done(function () {
        $('#wA').click(function () {
            var time = new Date;
            var id = $("#wA").attr('id');
            
        chat.server.userpay(id,$('#valueA').val(),time);//呼叫server
        })
    });

    $.connection.hub.start().done(function () {
        $("#mySelect").change(function () {
            var time = new Date;
            var id = $(this).children(":selected").attr("id");
            var x = document.getElementById("mySelect").value;
            chat.server.userpay(id, 1, time);
        });
    });
    
    //chat.client.getList = function (cash,time) {
    //    alert(cash+","+time)
    //}
})

