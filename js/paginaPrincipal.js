var mapas = [];
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$( document ).ready(function() {
  /** Validacion de sesion **/
  isSession();
  $("#loaded").show();
  $("#unloaded").hide();
  var correo = sessionStorage.getItem(USUARIO_SESSION);
  /** Validacion de session **/
  var parametros ={
      "listar":"all",
      "correo":correo
    };
  $.ajax({
     data: parametros,
     type: 'GET',
     url:URL_PUBLICACION,
     success: function (data) {
         data = JSON.parse(data);
         if(data.codigo != 200){
             swal("Tenemos inconvenientes", data.mensaje, "error");
         }else{
           data.datos.map((event)=>{
             mapas.push(
               {
                 id:event.pk_pbl_id,
                 lng_o: event.pbl_ltg_origen ,
                 ltd_o : event.pbl_ltd_origen ,
                 lng_d: event.pbl_ltg_destino ,
                 ltd_d : event.pbl_ltd_destino ,
                 fecha : event.pbl_fecha ,
                 descripcion : event.pbl_descripcion ,
                 usuario : capitalizeFirstLetter(event.fk_pbl_usr_correo)
               });
           });
           var container = '';
           mapas.map((mapa)=>{
             container = container + '<br><div class="card col-centrada" style="width: 80%;"><div class="card-body"><div id="map_'+mapa.id+'" class="mapaStyle" style="width: 100%;height: 200px;  overflow: visible"></div>';
             container = container + '<p class="card-text">'+mapa.usuario+' invitó a un evento el día '+mapa.fecha+'<br>'+mapa.descripcion+'</p>';
             container = container + '<button style="float: right;" class="btn btn-primary" onclick="irEvento('+mapa.id+')">Quiero ir</button></div></div>';
           });
           $("#container").append(container);
           mapInit();
           $("#loaded").hide();
           $("#unloaded").show();
         }
     },error :function(err){
        /** MOSTRAR ALERTA DE ERROR**/
        console.log(err);
        swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
     }
  });
});
var CrearEvento = function(){
  location.href ="crearEvento.html";
}

mapInit = function(){
  mapas.map((mapa)=>{
    var ltg_o = parseFloat(mapa.ltd_o);
    var lng_o = parseFloat(mapa.lng_o);
    var ltg_d = parseFloat(mapa.ltd_d);
    var lng_d = parseFloat(mapa.lng_d);
    //get api uses
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    //waypoints to add
    var waypts = [
      { location: { lat: ltg_o, lng: lng_o }, stopover: true },
      { location: { lat: ltg_d, lng: lng_d }, stopover: true }];
    var coordenada = {
      lat: waypts[0].location.lat,
      lng:waypts[0].location.lng
    };
    map = new google.maps.Map(document.getElementById('map_'+mapa.id), {
        center: coordenada,
        zoom: 14,
        type: "ROADMAP",
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        rotateControl: false,
        fullscreenControl: false
    });
    directionsDisplay.setMap(map);
    directionsService.route({
        origin: { lat: waypts[0].location.lat, lng: waypts[0].location.lng },//db waypoint start
        destination: { lat: waypts[0].location.lat, lng: waypts[0].location.lng },//db waypoint end
        waypoints: waypts,
        travelMode: google.maps.TravelMode.WALKING
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            console.log('Ha fallado la comunicación con el mapa a causa de: ' + status);
            swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
        }
    });
  });
}
