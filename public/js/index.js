$(document).ready(function(){
    $(".submenu > a").click(function(e) {
      e.preventDefault();
      var $li = $(this).parent("li");
      var $ul = $(this).next("ul");
  
      if($li.hasClass("open")) {
        $ul.slideUp(350);
        $li.removeClass("open");
      } else {
        $(".nav > li > ul").slideUp(350);
        $(".nav > li").removeClass("open");
        $ul.slideDown(350);
        $li.addClass("open");
      }
    });
    
  });

  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

function getDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  return today;
}
 