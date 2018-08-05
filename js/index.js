$(document).ready(function () {
   $("#dialog").dialog({autoOpen: false});
   $("#botonRedes").on('click',function(){
       $("#dialog").dialog('open');
   });
   $("#registrar").on('click',function(){
       location = 'registro.html';
   });
});