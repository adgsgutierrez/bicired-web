var map;
var contador = 0;
var rutas;
var lat1;
var lat2;
var lng1;
var lng2;
var mapas = [];
var email;
var marker1;
var marker2;
var bool = false;
$(document).ready(function () {
    isSession();
//  
    email = sessionStorage.getItem(USUARIO_SESSION);
    $("#cerrarcrearevento").on("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });
});


mapInit = function () {

    var myLatlng = new google.maps.LatLng(4.18, -74.26);


    var container = '';
    mapas.push({id: 1, lng_o: parseFloat(myLatlng.lng().toString()), ltd_o: parseFloat(myLatlng.lat().toString()), lng_d: parseFloat('4.182892873752382'), ltd_d: parseFloat('-74.26601401562499'), descripcion: 'Esta es la ruta 1', usuario: email});
//    
    mapas.map((mapa) => {

        container = container + '<br><div class="card col-centrada" style="width: 80%;"><div class="card-body"><div id="map" class="mapaStyle" style="width: 100%;height: 200px;  overflow: visible"></div>';
        container = container + '<p class="card-text">' + mapa.usuario + '</p><p class="card-text" id="parrafo"></p>';
        container = container + '<div class="col-sm-5"><input class="form-control" id="datetimepicker10" readonly/></div>';
        container = container + '<br><button style="float: right;" class="btn btn-primary" onclick="guardar()">Guardar Evento</button><button style="float: left;" class="btn btn-primary" onclick="cancelar()">Cancelar</button></div></div>';
        $("#container").append(container);
        var coordenada = {
            lat: mapa.ltd_o,
            lng: mapa.lng_o
        };
        $(function () {
            $('#datetimepicker10').datetimepicker({
                startDate: new Date(),
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true
            });
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

        if (contador === 1) {
            marker1 = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
            lat1 = marker1.getPosition().lat().toString();
            lng1 = marker1.getPosition().lng().toString();
//               
        } else if (contador === 2) {
            marker2 = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
            lat2 = marker2.getPosition().lat().toString();
            lng2 = marker2.getPosition().lng().toString();
            $("#lt1").val(lat1);
            $("#ln1").val(lng1);
            $("#lt2").val(lat2);
            $("#ln2").val(lng2);
            lineaRuta(lat1, lng1, lat2, lng2);
            bool = true;
            console.log(bool);
        }
        if (bool === true) {
            marker1.setMap(null);
            marker2.setMap(null);
        }
//        
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
    var pos_1 = new google.maps.LatLng(lat1, lng1);
    var pos_2 = new google.maps.LatLng(lat2, lng2);

    console.log(Math.round(getDistance(pos_1, pos_2)));
    console.log(getDistance(pos_1, pos_2));
    $("#parrafo").text("hara un recorrido de " + Math.round(getDistance(pos_1, pos_2)) + " mts");

}
function rad(x) {
    return x * Math.PI / 180;
}
;

function getDistance(p1, p2) {
    //	http://es.wikipedia.org/wiki/F{1f0778fe2e852b61c79949ce7b4bb677680b76fea251b03768a071033ace27eb}C3{1f0778fe2e852b61c79949ce7b4bb677680b76fea251b03768a071033ace27eb}B3rmula_del_Haversine
    var R = 6378137; //radio de la tierra en metros
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
;

function guardar() {
    if ($("#datetimepicker10").val() === "") {
        swal("Se Detecto un Problema", "No ha Ingresado la Fecha", "error");
    } else if ($("#lt1").val() === "" || $("#ln1").val() === "" || $("#lt2").val() === "" || $("#ln2").val() === "") {
        swal("Se Detecto un Problema", "No ha Ingresado Correctamente la Ruta", "error");
    } else {
        var parametros = {
            fecha: $("#datetimepicker10").val(),
            lt1: $("#lt1").val(),
            ln1: $("#ln1").val(),
            lt2: $("#lt2").val(),
            ln2: $("#ln2").val(),
            descripcion: $("#parrafo").text(),
            usuario: email
        };
        $.ajax({
            data: parametros,
            url: 'back_end/publicacion/index.php',
            type: 'POST',
            success: function (data) {
                swal({
                    title: "Todo Correcto",
                    text: data,
                    type: "success"
                },
                        function () {
                            window.location.href = 'paginaPrincipal.html';
                        });
            }
        });
        console.log(parametros);
    }
}
function cancelar() {
    location.href = "crearEvento.html";
}

