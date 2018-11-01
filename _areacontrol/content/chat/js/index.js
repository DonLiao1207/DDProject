//$("#sentm").click(function () {
//    $("#chatlist").append("<li class='chatli'><div class='talkboxme'>" + "hiyoooosssssoo" + "</div></li><div style='clear: both'></div>");
//});
PmUser = "";
$("body").on('click', '.nameli', function (e) {
    //li="<li></li>";
    //$("#chatlist").html("");
    $('.nameli').css("color", "gray")
    $(this).css("color", "#c0cf47");
    PmUser = $(this).text();
});
//$.connection.hub.start().done(function () {
//    $("body").on('click', '.nameli', function (e) {

//        $('.nameli').css("color", "gray")
//        $(this).css("color", "#c0cf47");
//        PmUser = $(this).text();
//        chat.server.msglist(PmUser);
//    });
//});

//}


$(function () {
    var chat = $.connection.chatHub;
    
    $.connection.hub.start().done(function () {
        chat.server.userConnected(sename);
    });
    chat.client.getList = function (userList) {
        //內容自由發揮
        var HasObj = $('#nameL');
        if (!HasObj.length) return;
        // Set initial focus to message input box.
        $('#message').focus();

        $("#nameL").html("");
        var acc = $("#access").val();
        var Name = $("#Uname").val();
        var li = "";
        $.each(userList, function (index, data) {
            if (acc == 2 &&  data.id!=Name) {
                li += "<li id='namelid" + data.id + "'" + " class='nameli'>" + "<i class='fas fa-user'>&nbsp</i><strong>" + data.id + "</strong></li>";
            }
            
        });
        $("#nameL").html(li);
    }

    //讓server呼叫(移除離開人員) 
    chat.client.onUserDisconnected = function (id) {
        
        $('#namelid' + id).remove();
    }
    chat.client.addNewMessageToPage = function (name, message, to) {
        // Add the message to the page.
        var acc = $("#access").val();
        var Name = $("#Uname").val();
        to=$.trim(to);
        //alert(name + "," + to + "," + Name)
        if (acc == 2 && Name != name && to == "") {
            $('#chatlist').append("<i class='fas fa-user'>&nbsp</i>"+name+":"+"<li class='chatli'><div class='talkbox'>" + htmlEncode(message) + "</div></li><div style='clear: both'></div>");
        }
        else if (Name == to && Name != name) {
            var ser="客服人員"
            $('#chatlist').append("<i class='fas fa-user'>&nbsp</i>" + name + ":" + "<li class='chatli'><div class='talkbox'>" + htmlEncode(message) + "</div></li><div style='clear: both'></div>");
        }

        
    };
    
    $('#message').focus();
    
    $.connection.hub.start().done(function () {
        $('#message').bind("enterKey", function (e) {
            
            chat.server.send($('#Uname').val(), $('#message').val(),PmUser);
            $('#chatlist').append("<li class='chatli'><div class='talkboxme'>" + $('#message').val() + "</div></li><div style='clear: both'></div>");
            $('#message').val('').focus();
        });
        $('#message').keydown(function (e) {
            if (e.keyCode == 13) {
                $(this).trigger("enterKey");
            }
        });
    });
    $.connection.hub.start().done(function () {
        $('#sentm').click(function () {
            // Call the Send method on the hub.
            $('#chatlist').append("<li class='chatli'><div class='talkboxme'>" + $('#message').val() + "</div></li><div style='clear: both'></div>");
            chat.server.send($('#Uname').val(), $('#message').val(),PmUser);
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });
    });
    
    $.connection.hub.start().done(function () {
        $('#debug').click(function () {
            
            chat.server.msglist(sename, PmUser);
        });
    })
    chat.client.listmsg = function (name, s, p) {
       
        var li = "";
        var ind = 0;
        $.each(s, function (i, data) {
            li+=data.Name+":"+data.msg+"<br/>"
        });
        $.each(p, function (i, data) {
            li += data.Name + ":" + data.msg + "<br/>"
        });
        $("#deb").html(li);
    };

});
// This optional function html-encodes messages for display in the page.
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}



$(document).ready(function () {
    $('.chat').hide();
});

(function () {

	$('#live-chat header').on('click', function() {
        
		$('.chat').slideToggle(300, 'swing');
		$('.chat-message-counter').fadeToggle(300, 'swing');

	});

	$('.chat-close').on('click', function(e) {

		e.preventDefault();
		$('#live-chat').fadeOut(300);

	});

}) ();