
$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});





function pagination() {$( "#target" ).keyup(function() {
  alert( "Handler for .keyup() called." );
});
  table = $('.table_id').length;
  ordenes = $('.table_roww')
  pag =  $('.pagination')

  pages = Math.ceil(table / 20); 
  for (let i = 0; i < pages; i++) {
  pag.append(`
  <li class="page-item">
  <a class="page-link" href="#">${i}</a>
  </li>`)
    
  }
  for (let i = 0; i < ordenes.length; i++) {
    if(i < 20){
      ordenes[i].style.display=""
    }else{
      ordenes[i].style.display="none"
    }
    
  }
  
  $( ".page-item" ).click(function(e) {
    e.preventDefault;
    let btnNumber = parseInt(e.target.textContent);

    let top = btnNumber*20;
    let bottom = top - 20;

    console.log(table)
    for (let i = 0; i < ordenes.length; i++) {
      if( i >=bottom && i<top){
        ordenes[i].style.display=''
      }else{
        ordenes[i].style.display='none'
      }
      
    }
  });

}

