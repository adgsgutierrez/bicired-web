$(document).ready(function () {
   $("#dialog").dialog({autoOpen: false,title:"Puedes iniciar con tus redes sociales",width:350,resizable: false});
   $("#botonRedes").on('click',function(){
       $("#dialog").dialog('open');
   });
   $("#registrar").on('click',function(){
       location = 'registro.html';
   });
});