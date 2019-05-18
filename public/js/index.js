
// A $( document ).ready() block.
$( document ).ready(function() {
      
          $('#myTable').dataTable( {
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
          } );
      

});

$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});


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
      document.getElementById("msg").innerHTML='Correcta';
    }else{
      $(btnAtender).prop("disabled",true);
      $(btnCerrar).prop("disabled",true);
      txtclave.classList.remove('border-success');
      txtclave.classList.add('border-danger');
      document.getElementById("msg").innerHTML='Incorrecta';

    }

  });

