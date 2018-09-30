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
/**
 * Metodo inicial de carga de la pagina
 **/
$(document).ready(function () {
    isSession();
    email = sessionStorage.getItem(USUARIO_SESSION);
    $("#cerrarcrearevento").on("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });

});

/**
 * Init los mapas
 **/
var renderMapa = function (latitud, longitud) {
    var container = '';
    container = container + '<br><div class="card col-centrada" style="width: 80%;"><div class="card-body"><div id="map" class="mapaStyle" style="width: 100%;height: 200px;  overflow: visible"></div>';
    container = container + '<p class="card-text">' + email + '</p><p class="card-text" id="parrafo"></p>';
    container = container + '<div class="row"><div class="col-sm-5"><input class="form-control" id="datetimepicker10" readonly/></div>';
    container = container + '<div class="col-sm-5" style="position:relative;top:-32px;margin-left: 60px;"><label>Amigos a Invitar</label><br><select id="amigos" name="amigos" title="Seleccione" multiple></select></div></div>';
    container = container + '<br><button style="float: right;" class="btn btn-primary" onclick="guardar()">Guardar Evento</button><button style="float: left;" class="btn btn-primary" onclick="cancelar()">Cancelar</button></div></div>';
    $("#container").append(container);
    var coordenada = {
        lat: latitud,
        lng: longitud
    };
    $('#datetimepicker10').datetimepicker({
        startDate: new Date(),
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true
    });
    var parametros = {"correo": email, "funcion": "listarmigos"};
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_USUARIO,
        success: function (data) {
            console.log("data", data);
            data = JSON.parse(data);
            if (data.datos.length > 0) {
                $.each(data.datos, function (key, value) {
                    $("#amigos").append('<option value=' + value.id + '>' + value.label + '</option>');
                });
            } else {
                $("#amigos").append('<option value="" disabled> No tienes personas para invitar</option>');
            }
        }, error: function (error) {
            console.error(error);
        }
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
    google.maps.event.addListener(map, 'click', function (event) {
        contador++;
        if (contador === 1) {
            marker1 = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
            lat1 = marker1.getPosition().lat().toString();
            lng1 = marker1.getPosition().lng().toString();
        } else if (contador === 2) {
            marker2 = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
            lat2 = marker2.getPosition().lat().toString();
            lng2 = marker2.getPosition().lng().toString();
            // $("#lt1").val(lat1);
            // $("#ln1").val(lng1);
            // $("#lt2").val(lat2);
            // $("#ln2").val(lng2);
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
/**
 * Metodo para dibujar la linea de ruta del mapa
 **/
function lineaRuta(lat1, lng1, lat2, lng2) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var waypts = [{location: {lat: parseFloat(lat1), lng: parseFloat(lng1)}, stopover: true}, {location: {lat: parseFloat(lat2), lng: parseFloat(lng2)}, stopover: true}];
    console.log(lat1 + " " + lng1 + " " + lat2 + " " + lng2);
    console.log(waypts[0].location.lat + " " + waypts[0].location.lng + " " + waypts[0].location.lat + " " + waypts[0].location.lng);
    directionsDisplay.setMap(map);
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
    $("#parrafo").text("hara un recorrido de " + Math.round(getDistance(pos_1, pos_2)) + " mts");
}
function rad(x) {
    return x * Math.PI / 180;
}
;
/**
 * Metodo para calcular la distancia de los puntos
 **/
function getDistance(p1, p2) {
    var R = 6378137; //radio de la tierra en metros
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}
/**
 * Metodo para guardar el evento
 **/
var guardar = function () {
    if ($("#datetimepicker10").val() === "") {
        swal("Se Detecto un Problema", "No ha Ingresado la Fecha", "error");
    } else if (lt1 === "" || ln1 === "" || lt2 === "" || ln2 === "") {
        swal("Se Detecto un Problema", "No ha Ingresado Correctamente la Ruta", "error");
    } else {
        //lat1, lng1, lat2, lng2
        var parametros = {
            fecha: $("#datetimepicker10").val(),
            lt1: lat1,
            ln1: lng1,
            lt2: lat2,
            ln2: lng2,
            descripcion: $("#parrafo").text(),
            usuario: email
        };
        console.log(parametros);
        $.ajax({
            data: parametros,
            url: URL_PUBLICACION,
            type: 'POST',
            success: function (data) {
                swal({
                    title: "Todo Correcto",
                    text: 'El Evento Fue Creado Con Exito',
                    type: "success"
                },
                        function () {
                            if ($(".selectpicker").val()) {
                                var parametro = {usuario: email,
                                    invitados: $(".selectpicker").val(), idpublicacion: data};
                                $.ajax({
                                    data: parametro,
                                    type: 'POST',
                                    url: URL_PUBLICACION
                                });
                            }
                            window.location.href = 'paginaPrincipal.html';
                        });
            }
        });
        console.log(parametros);
    }
}
/**
 * Metodo para obtener la ubicacion de la persona
 **/
var mapInit = function () {
    $.ajax({
        type: 'GET',
        url: 'https://ipinfo.io/geo',
        success: function (data) {
            console.log(data);
            var ubicacion = data.loc.split(',');
            renderMapa(parseFloat(ubicacion[0]), parseFloat(ubicacion[1]));
        }
    });
}
/**
 * Metodo para cancelar la operacion de crear evento
 **/
function cancelar() {
    location.href = "crearEvento.html";
}
