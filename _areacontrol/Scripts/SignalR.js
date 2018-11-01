$(function () {
    // Reference the auto-generated proxy for the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call back to display messages.
    //將連線打開
  
    $.connection.hub.start().done(function () {
        chat.server.userConnected($('#Uname').val());//呼叫server
    });
    //讓server呼叫(抓取資料)
    chat.client.getList = function (userList) {
        //內容自由發揮
        var HasObj = $('#nameL');
        if (!HasObj.length) return;
        // Set initial focus to message input box.
        $('#message').focus();

        $("#nameL").html("");

        var li = "";
        $.each(userList, function (index, data) {
            li += "<li id='" + data.id + "'>" +"<i class='fas fa-user'></i>"+ data.id + "</li>";
        });
        $("#nameL").html(li);
    }

    //讓server呼叫(移除離開人員) 
    chat.client.onUserDisconnected = function (id) {
        alert(id + "leave");
        //內容自由發揮
        $('#' + id).remove();
    }
    chat.client.addNewMessageToPage = function (name, message) {
        // Add the message to the page.
        $('#discussion').append('<li><strong>' + htmlEncode(name)
            + '</strong>: ' + htmlEncode(message) + '</li>');
    };
    // Get the user name and store it to prepend to messages.
    //$('#displayname').val(prompt('Enter your name:', ''));
    // Set initial focus to message input box.
    $('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#sendmessage').click(function () {
            // Call the Send method on the hub.
            chat.server.send($('#Uname').val(), $('#message').val());
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });
    });
});
// This optional function html-encodes messages for display in the page.
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}