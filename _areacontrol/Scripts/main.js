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








//function內的字
//listien





// $(col).width(colH);
            // $(col).height(colW);
            // $(col).marginBottom(colBt);
            // $(col).marginRight(colRt);

// $('.col').remove();
    // $('.col').remove(this);
    // $(this).remove();
    


    // $(".col").mouseenter(function(){
    //     $("#debug").append("滑鼠進")
    // })
    // $('.col').mouseleave(function(){
    //     $("#debug").append("滑鼠出")
    // })