
var map;
var contador = 0;
var marker;
var rutas;
var lat1;
var lat2;
var lng1;
var lng2;
  var mapas = [];
function initMap() {

    google.maps.event.addListener(map, 'click', function (event) {
        contador++;
        if (contador <= 2) {
            marker = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
            if (contador === 1) {
                lat1 = marker.getPosition().lat().toString();
                lng1 = marker.getPosition().lng().toString();
            } else {
                lat2 = marker.getPosition().lat().toString();
                lng2 = marker.getPosition().lng().toString();
            }
            console.log(marker.getPosition().lat().toString());
            console.log(marker.getPosition().lng().toString());
        }
        document.getElementById("coords").value = marker.getPosition().toString();

        var rutas = [new google.maps.LatLng(lat1, lng1),
            new google.maps.LatLng(lat2, lng2)];
        console.log(rutas);
        console.log(contador);
        if (contador === 2) {
            var lineas = new google.maps.Polyline({
                path: rutas,
                map: map,
                strokeColor: '#000099',
                strokeWeight: 5,
                strokeOpacity: 0.6
            });
        }
    });

}

$( document ).ready(function() {
  mapas.push({id:1,lng_o:'4.182892873752382' , ltd_o : '-74.26601401562499' , lng_d:'4.182892873752382' , ltd_d : '-74.26601401562499' , fecha : '14 Jun 2018' , descripcion : 'Esta es la ruta 1' , usuario : 'Camilo'});
  mapas.push({id:2,lng_o:'4.182892873752382' , ltd_o : '-74.26601401562499' , lng_d:'4.182892873752382' , ltd_d : '-74.26601401562499' , fecha : '14 Jun 2018' , descripcion : 'Esta es la ruta 2' , usuario : 'Camilo'});
  mapas.push({id:3,lng_o:'4.182892873752382' , ltd_o : '-74.26601401562499', lng_d:'4.182892873752382' , ltd_d : '-74.26601401562499' , fecha : '14 Jun 2018' , descripcion : 'Esta es la ruta 3' , usuario : 'Camilo'});
  mapas.push({id:4,lng_o:'4.182892873752382' , ltd_o : '-74.26601401562499' , lng_d:'4.182892873752382' , ltd_d : '-74.26601401562499' , fecha : '14 Jun 2018' , descripcion : 'Esta es la ruta 4' , usuario : 'Camilo'});
  var container = '';
  mapas.map((mapa)=>{
    console.log(mapa);
    container = container + '<br><div class="card col-centrada" style="width: 80%;"><div class="card-body"><div id="map_'+mapa.id+'" class="mapaStyle" style="width: 100%;height: 200px;  overflow: visible"></div>';
    container = container + '<p class="card-text">'+mapa.usuario+' Invito a un evento<br>'+mapa.descripcion+' el día '+mapa.fecha+'</p>';
    container = container + '<button style="float: right;" class="btn btn-primary" onclick="irEvento('+mapa.id+')">Quiero ir</button></div></div>';
  });
  $("#container").append(container);
/*

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: -33, lng: 151},
    disableDefaultUI: true
  });
  */
});
var irEvento = function(id){
  console.log("Asistir a "+id);
}

mapInit = function(){

  mapas.map((mapa)=>{
    var ltg = parseFloat(mapa.lng_d);
    var ltd = parseFloat(mapa.ltd_o);

    //get api uses
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    //waypoints to add
    var waypts = [{ location: { lat: 41.94, lng: 1.56 }, stopover: true }, { location: { lat: 41.99, lng: 1.53 }, stopover: true }, { location: { lat: 41.98, lng: 1.52 }, stopover: true }];
    var coordenada = {
      lat: waypts[0].location.lat,
      lng:waypts[0].location.lng
    };
    console.log("coordenada" , coordenada);
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
    // set the new
    //new Array(waypts[0].location.lat,waypts[0].location.lng)
    directionsService.route({
        origin: { lat: waypts[0].location.lat, lng: waypts[0].location.lng },//db waypoint start
        destination: { lat: waypts[0].location.lat, lng: waypts[0].location.lng },//db waypoint end
        waypoints: waypts,
        travelMode: google.maps.TravelMode.WALKING
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Ha fallat la comunicació amb el mapa a causa de: ' + status);
        }
    });
  });
}
