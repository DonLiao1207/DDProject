$(document).ready(function () {
    $(".jumbotron").fadeOut(50);
    $("#jout").show(1000);
    
});

$("#clear").on("click", function() {
    $(".draw").empty();
    divID = 1;
    UserArea=[];
});

divID = 1;
UserArea=[];

$("#go").on("click", function() {
    
    
	 rowNumber = $("#rowNumber").val();
     colNumber = $("#colNumber").val();
     
    for( var i=0; i<rowNumber; i++ ) {
        
      	var row = document.createElement("div");
        row.className = "row";       
                
        for( var j=0; j<colNumber; j++ ) {
            var col = document.createElement("div");
            
            var colH = $('#widt').val();
            var colW = $('#heig').val();
            var colBt = $('#btdis').val();
            var colRt = $('#rtdis').val();
            
            
            col.className = "col";
            
            col.setAttribute("id",divID);
            
            
            UserArea.push({id:divID,opa:1});
          
            
            divID=divID+1;
            
            $(col).css({
                'width':colH,
                'height':colW,
            });
    
            $(col).css("margin-bottom", colBt+"px");
            $(col).css("margin-right", colRt+"px");
            
            row.appendChild(col);
        }
    
    $(".draw").append(row);
    
//     $('.col').dblclick(function(){
  }  
})



$(document).ready(function(){
  $("#hidej").click(function(){
  $(".jumbotron").fadeOut(500);
  setTimeout('$("#jout").fadeIn(1000)',600);
  
  });
  
});
  



$(document).ready(function(){
    $("#showj").click(function(){
   
    $("#jout").fadeOut("fast");
    $(".jumbotron").fadeIn("slow");
    });
});

$(document).ready(function(){
    open=0;
    
    $(".talkout").click(function(){
    
    if(open==0){
        $("#room").fadeIn("slow");
         open=1;
     }
    else{
        $("#room").hide("slow");
         open=0;
     }  
    })
});


$("body").on('dblclick', '.col', function(event) {
// 	alert($(this).attr('id'));
    tid=$(this).attr('id')-1;
	opac=$(this).css('opacity');
// 	alert($(this).css('opacity'));
    if(opac==1){
        $(this).css('opacity', "0");
        UserArea[tid].opa=0;
        // $('#debug').append($(this).attr('id')+"opacity"+UserArea[tid].opa)
    }
    else {
        $(this).css('opacity', "1");   
        UserArea[tid].opa=1;
        // $('#debug').append($(this).attr('id')+"opacity"+UserArea[tid].opa)
    }
});

$("#Savediv").on("click", function () {
    T = rowNumber * colNumber;
    for (var i = 1; i < T+1; i++) {
        //$('#debug').append("<br/>" + "Div=" + UserArea[i].id + "透明度=" + UserArea[i].opa);
        var data = "";
        //var p = document.createElement("input");
        //p.setAttribute("name", "DivID");
        //$('#Hi').html(p);
        $("#DivNum").val(i);
        $("#DivOpa").val(UserArea[(i-1)].opa);
        $("#DivName").val($('#Aname').val());
        $("#DivPic").val(i);
        var data = $("#Hi").serialize();
        
        $.ajax({
            type: "post",
            data: data,
            url: "/Home/SaveData",
            success: function (result) {
                window.location.replace("/Home/WorkSpace");
            }
        });
    }
    //alert(data);
    //TT = "DivID=1&Opa=1&Pic=0";
    //alert(TT);
    
});

$("#Savediv").on("click", function () {

    var name = $("#Aname").val();
    var row = $("#rowNumber").val();
    var col = $("#colNumber").val();
    var hei = $("#heig").val();
    var wid = $("#widt").val();
    var btd = $("#btdis").val();
    var rtd = $("#rtdis").val();

    if (name == "" || row == "" || col == "") {
        return false;
    }
    //data: { field1 : data1 , field2 : data2 , field3 : data3 },
    $.ajax({
        type: "post",
        data: { Owner: owr, AreaName: name, Row: row, Col: col, Height: hei, Width: wid, BtDis: btd, RtDis: rtd },

        url: "/Home/SaveForm",
        success: function (result) {


            window.location.replace("/Home/WorkSpace");
        }
    });
});
