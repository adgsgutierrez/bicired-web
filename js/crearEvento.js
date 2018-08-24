var map;
var contador = 0;
var rutas;
var lat1;
var lat2;
var lng1;
var lng2;
var mapas = [];
var email;
$(document).ready(function () {
    isSession();
//  
    email = sessionStorage.getItem(USUARIO_SESSION);
    console.log(email);


});


mapInit = function () {

    var myLatlng = new google.maps.LatLng(4.18, -74.26);

    var container = '';
    mapas.push({id: 1, lng_o: parseFloat(myLatlng.lng().toString()), ltd_o: parseFloat(myLatlng.lat().toString()), lng_d: parseFloat('4.182892873752382'), ltd_d: parseFloat('-74.26601401562499'), descripcion: 'Esta es la ruta 1', usuario: email});
//    
    mapas.map((mapa) => {
        console.log(mapa);
        container = container + '<br><div class="card col-centrada" style="width: 80%;"><div class="card-body"><div id="map" class="mapaStyle" style="width: 100%;height: 200px;  overflow: visible"></div>';
        container = container + '<p class="card-text">' + mapa.usuario + ' desea crear un evento<br>' + mapa.descripcion + '</p>';
        container = container + '<div class="row"><div class="col-sm-5"><input class="form-control" id="fecha_evento"/></div></div>';
        container = container + '<button style="float: right;" class="btn btn-primary" onclick="irEvento(' + mapa.id + ')">Quiero ir</button></div></div>';
        $("#container").append(container);
        console.log(mapa.ltd_o);
        console.log(mapa.lng_o);
        var coordenada = {
            lat: mapa.ltd_o,
            lng: mapa.lng_o
        };
        console.log(coordenada);
        $("#fecha_evento").datepicker({
            minDate: '0d',
            changeMonth: true,
            changeYear: true
        });
        map = new google.maps.Map(document.getElementById('map'), {
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
    });
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
                lineaRuta(lat1, lng1, lat2, lng2);

            }
            marker.setMap(null);
        }


    });


};

function lineaRuta(lat1, lng1, lat2, lng2) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var waypts = [{location: {lat: parseFloat(lat1), lng: parseFloat(lng1)}, stopover: true}, {location: {lat: parseFloat(lat2), lng: parseFloat(lng2)}, stopover: true}];
    console.log(lat1 + " " + lng1 + " " + lat2 + " " + lng2);
    console.log(waypts[0].location.lat + " " + waypts[0].location.lng + " " + waypts[0].location.lat + " " + waypts[0].location.lng);
    directionsDisplay.setMap(map);
    // set the new
    //new Array(waypts[0].location.lat,waypts[0].location.lng)
    directionsService.route({
        origin: {lat: waypts[0].location.lat, lng: waypts[0].location.lng}, //db waypoint start
        destination: {lat: waypts[0].location.lat, lng: waypts[0].location.lng}, //db waypoint end
        waypoints: waypts,
        travelMode: google.maps.TravelMode.WALKING
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);

        } else {
            window.alert('Ha fallat la comunicació amb el mapa a causa de: ' + status);
        }
    });
}

