
// A $( document ).ready() block.
$( document ).ready(function() {
      
          $('#myTable').dataTable( {
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
          } );

// Ocultar boton de atenter si ya esta atendida
          if($('#status_cerrar2').text()=='atendida'){
          $('#atender').hide()
          }

});

$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});


//Revisar Clave de Cierre para asignar texto y classes de bootstrap
  var txtclave= document.getElementById("clave_cierre");
  var clave = document.getElementById("clave_cerrar2").textContent;
  var btnAtender = document.getElementById("atender");
  var btnCerrar = document.getElementById("cerrar");
  var lblclave= document.getElementById('lbl_clave_cerrar2')
  var msg=document.getElementById("msg");
  txtclave.classList.add('border-danger');
  lblclave.classList.add('text-danger');
  msg.classList.add('text-danger');

  txtclave.addEventListener("keyup",function(e){
    if(txtclave.value==clave){
      lblclave.classList.remove('text-danger');
      msg.classList.remove('text-danger');
      $(btnAtender).prop("disabled",false);
      $(btnCerrar).prop("disabled",false);
      txtclave.classList.remove('border-danger');
      txtclave.classList.add('border-success');
      txtclave.classList.add('alert-success');
      lblclave.classList.add('text-success');
      msg.classList.add('text-success');

      msg.innerHTML='Correcta';
    }else{
      lblclave.classList.remove('text-success');
      msg.classList.remove('text-success');
      $(btnAtender).prop("disabled",true);
      $(btnCerrar).prop("disabled",true);
      txtclave.classList.remove('alert-success');
      txtclave.classList.add('border-danger');
      msg.innerHTML='Incorrecta';
      lblclave.classList.remove('text-success');
      msg.classList.remove('text-success');
      lblclave.classList.add('text-danger');
      msg.classList.add('text-danger');

    }

  });

  m= document.getElementById('maquina');
  m.addEventListener("change",function(e){
console.log("fsdfsdfdsf")
  });
  



