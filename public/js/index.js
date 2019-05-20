
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

//Revisar Clave de Cierre
  var txtclave= document.getElementById("clave_cierre");
  var clave = document.getElementById("clave").textContent;
  var btnAtender = document.getElementById("atender");
  var btnCerrar = document.getElementById("cerrar");
  txtclave.classList.add('border-danger');

  txtclave.addEventListener("keyup",function(e){
    if(txtclave.value==clave){
      $(btnAtender).prop("disabled",false);
      $(btnCerrar).prop("disabled",false);
      txtclave.classList.remove('border-danger');
      txtclave.classList.add('border-success');
      txtclave.classList.add('alert-success');

      document.getElementById("msg").innerHTML='Correcta';
    }else{
      $(btnAtender).prop("disabled",true);
      $(btnCerrar).prop("disabled",true);
      txtclave.classList.remove('alert-success');
      txtclave.classList.add('border-danger');
      document.getElementById("msg").innerHTML='Incorrecta';

    }

  });


      
 
