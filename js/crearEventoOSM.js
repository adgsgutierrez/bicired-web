var map;
var contador = 0;
var rutas;
var lat1;
var lat2;
var lng1;
var lng2;
var mapas = [];
var ubi = [];
var ruta = [];
var email;
var marker1;
var marker2;
var bool = false;
var buscador;
var mensajesPuntosMapa = [
    {
        info: "Este es tu punto de partida.",
        market: "img/start.png",
        point: 15
    },
    {
        info: "Este es tu punto de finalización de tu ruta.",
        market: "img/end.png",
        point: 3
    }

];
/**
 * Metodo inicial de carga de la pagina
 **/
$(document).ready(function () {
    isSession();

    mapInit();

    email = sessionStorage.getItem(USUARIO_SESSION);
    $("#buscar_perfil_filtro").on('click', function () {
        if ($("#edadinicio").val() === "" && $("#edadfin").val() === "" && $("#generoacb option:selected").val() === "0") {
            swal({
                title: "Debe hacer la busqueda por el rango de edades o por genero",
                type: "error"
            });
        } else if (($("#edadinicio").val() === "" && $("#edadfin").val() !== "") || ($("#edadinicio").val() !== "" && $("#edadfin").val() === "")) {
            swal({
                title: "Debe ingresar el rango completo de edades",
                type: "error"
            });
        } else {
            var parametros = {"correo": email, "edadinicio": $("#edadinicio").val(), "edadfin": $("#edadfin").val(), "genero": $("#generoacb option:selected").val(), "funcion": "busqueda_avanzada"};
            $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
            $.ajax({
                data: parametros,
                type: 'POST',
                url: URL_USUARIO,
                success: function (data) {
                    data = JSON.parse(data);
                    if (data) {
                        $.unblockUI();
                        var table = $("#datatableavanzado").DataTable({
                            "language": {
                                "sProcessing": "Procesando...",
                                "sLengthMenu": "Mostrar _MENU_ registros",
                                "sZeroRecords": "No se encontraron resultados",
                                "sEmptyTable": "Ningun dato disponible en esta tabla",
                                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                                "sInfoPostFix": "",
                                "sSearch": "Buscar:",
                                "sUrl": "",
                                "sInfoThousands": ",",
                                "sLoadingRecords": "Cargando...",
                                "oPaginate": {
                                    "sFirst": "Primero",
                                    "sLast": "Ultimo",
                                    "sNext": "Siguiente",
                                    "sPrevious": "Anterior"
                                },
                                "oAria": {
                                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                                }
                            },
                            destroy: true,
                            data: data.data,
                            columns: data.header
                        });
                        $('#datatableavanzado tbody').on('click', 'tr', function () {
                            sessionStorage.setItem(USUARIO_BUSQUEDA, $(this).find("td").eq(2).html());
                            location.href = "perfil.html";

                        });
                    }
                }
            });

        }
    });
    $("#buscar_perfil").on('click', function () {
        if (buscador !== undefined) {
            sessionStorage.setItem(USUARIO_BUSQUEDA, buscador);
            location.href = "perfil.html";
        } else if (buscador === undefined && $("#buscar_persona").val() !== "") {
            swal({
                title: "Esta persona no existe ",
                type: "error"
            });
        } else {
            swal({
                title: "El campo esta vacio ",
                type: "error"
            });
        }

    });
    $("#cerrarcrearevento").on("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });
    var parametros_lista = {
        "correo": email,
        "funcion": "lista_usuarios"
    };
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros_lista,
        url: URL_USUARIO,
        type: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
            var lista = data.datos;
            $("#buscar_persona").autocomplete({
                source: lista,
                select: function (event, ui) {
                    buscador = ui.item.id;
                }
            });
        }
    });

});

/**
 * Init los mapas
 **/
var renderMapa = function (latitud, longitud) {
    // Where you want to render the map.
    var element = document.getElementById('mapaOSM');
    // Height has to be set. You can do this in CSS too.
    element.style = 'height:400px;';
    // Create Leaflet map on map element.
    var map = L.map(element);
    // Add OSM tile leayer to the Leaflet map.
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    // Target's GPS coordinates.
    var target = L.latLng(latitud, longitud);
    map.setView(target, 14);
    L.marker(target).addTo(map);

    var popup = L.popup();

    function onMapClick(e) {
        console.log("click to map ", e);
        ubi.push({latitud: e.latlng.lat, longitud: e.latlng.lng});
        //  if (ubi.length > 1) {
        // if (contador == 0) {
        //     lat1 = e.latlng.lat;
        //     lng1 = e.latlng.lng;
        // } else {
        //     lat2 = e.latlng.lat;
        //     lng2 = e.latlng.lng;
        // }
        var targetPoint = L.latLng(e.latlng.lat, e.latlng.lng);
        console.log("Punto que va a colocar", targetPoint);
        ind = 1;
        if (contador < 1) {
            ind = contador;
        }
        var personalize = L.icon({
            iconUrl: mensajesPuntosMapa[ind].market,
            iconSize: [30, 30], // size of the icon
            iconAnchor: [mensajesPuntosMapa[ind].point, 30], // point of the icon which will correspond to marker's location
            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        L.marker(targetPoint, {icon: personalize, draggable: false}).addTo(map);
        contador = contador + 1;

        if (contador > 1) {
            var x = document.getElementById("snackbar");
            x.className = "show";
            console.log(ubi);
            getRoute(
                    // lat1,
                    // lng1,
                    // lat2,
                    // lng2,
                    ubi,
                    function (latlngs) {
                        //  L.clearLayers();
                        x.className = x.className.replace("show", "");
                        var polyline = L.polyline(latlngs, {color: '#4CAF50', weight: 4, opacity: .8}).addTo(map);
                        // zoom the map to the polyline
                        map.fitBounds(polyline.getBounds());
                        $("#instrucciones").show();
                    }
            );
        }
        // } else {
        //     cancelar();
        // }
    }

    map.on('click', onMapClick);
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
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_USUARIO,
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
            if (data.datos.length > 0) {
                $.each(data.datos, function (key, value) {
                    $("#amigos").append('<option value=' + value.id + '>' + value.label + '</option>');
                });
            } else {
                $("#amigos").append('<option value="" disabled> No tienes personas para invitar</option>');
            }
            $("#amigos").selectpicker({nonSelectedText: 'Seleccione', buttonWidth: '200px', enableCaseInsensitiveFiltering: true,
                buttonClass: 'btn btn-primary', maxHeight: 300});
        }, error: function (error) {
            $.unblockUI();
        }
    });
};

/**
 * Metodo para guardar el evento
 **/
var guardar = function () {
    if ($("#datetimepicker10").val() === "") {
        swal("Se Detecto un Problema", "No ha Ingresado la Fecha", "error");
    } else if (lat1 === "" || lng1 === "" || lat2 === "" || lng2 === "") {
        swal("Se Detecto un Problema", "No ha Ingresado Correctamente la Ruta", "error");
    } else {
        //lat1, lng1, lat2, lng2
        var parametros = {
            fecha: $("#datetimepicker10").val(),
            ubicacion: ruta,
            descripcion: "Queremos realizar esta bella Ruta",
            usuario: email,
            funcion: "guardar_publicacion"
        };
        console.log(parametros);
        $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
        $.ajax({
            data: parametros,
            url: URL_PUBLICACION,
            type: 'POST',
            dataType: "json",
            success: function (data) {
                $.unblockUI();
                swal({
                    title: "Todo Correcto",
                    text: 'El Evento Fue Creado Con Exito',
                    type: "success"
                },
                        function () {
                            var datos_resultado = data["datos"]["0"];

                            var meses = [
                                "Enero", "Febrero", "Marzo",
                                "Abril", "Mayo", "Junio", "Julio",
                                "Agosto", "Septiembre", "Octubre",
                                "Noviembre", "Diciembre"
                            ];
                            var fecha = datos_resultado["fecha"].split(' ')[0];
                            var fecha2 = fecha.split('-');
                            var nueva_fecha = "el dia " + fecha2[2] + " de " + meses[fecha2[1] - 1] + " del " + fecha2[0];
                            var hora = datos_resultado["fecha"].split(' ')[1];
                            var mensaje = datos_resultado["nombre"] + " te ha invitado a un evento " + nueva_fecha + " a la hora " + hora;
                            if ($("#amigos").val()) {
                                var parametro = {usuario: email,
                                    invitados: $("#amigos").val(), idpublicacion: data.datos["id"], mensaje: mensaje};

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

/***
 consulta del calculo de ruta
 **/
getRoute = (ubicaciones, callback) => {
    var url = SERVER_DIRECTIONS;
    //lat1%2Clon1&point=lat2%2Clon2
    for (var j = 0; j < ubicaciones.length; j++) {
        url = url + ubicaciones[j].latitud + '%2C' + ubicaciones[j].longitud;
        if ((j + 1) < ubicaciones.length) {
            url = url + '&point=';
        }
    }
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            $.unblockUI();
            var pintarInstrucciones = "";
            var html = '<table class="table"><thead><tr><th>Mts</th><th>Descripcion</th></tr></thead><tbody>';
            var instrucciones = data.paths[0].instructions;
            for (var i = 0; i < instrucciones.length; i++) {
                html = html + '<tr><td style="text-align:right">' + instrucciones[i].distance + ' mts</td><td>' + instrucciones[i].text + '</td></tr>';
            }
            html = html + '</tbody></table>';
            $("#instrucciones").html(html);
            var points = [];
            var dats = data.paths[0].points.coordinates;
            for (var j = 0; j < dats.length; j++) {
                ruta.push({latitud: dats[j][1], longitud: dats[j][0]});
                points.push([dats[j][1], dats[j][0]]);
            }
            callback(points);
        }
    });
}
