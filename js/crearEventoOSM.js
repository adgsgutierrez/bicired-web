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
var buscador;
var mensajesPuntosMapa = [
  {
    info : "Este es tu punto de partida.",
    market : "img/start.png",
    point : 15
  },
  {
    info : "Este es tu punto de finalización de tu ruta.",
    market : "img/end.png",
    point : 3
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
            $.ajax({
                data: parametros,
                type: 'POST',
                url: URL_USUARIO,
                success: function (data) {
                    data = JSON.parse(data);
                    if (data) {
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
    $.ajax({
        data: parametros_lista,
        url: URL_USUARIO,
        type: 'GET',
        success: function (data) {
            data = JSON.parse(data);
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
      if(contador < 2){
          if(contador == 0){
            lat1 = e.latlng.lat;
            lng1 = e.latlng.lng ;
          }else{
            lat2 = e.latlng.lat;
            lng2 = e.latlng.lng ;
          }
          var targetPoint = L.latLng( e.latlng.lat , e.latlng.lng );
          console.log("Punto que va a colocar" , targetPoint);
          var personalize = L.icon({
              iconUrl: mensajesPuntosMapa[contador].market,
              iconSize:     [30, 30], // size of the icon
              iconAnchor:   [mensajesPuntosMapa[contador].point, 30], // point of the icon which will correspond to marker's location
              popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
          });
         L.marker(targetPoint , {icon:personalize, draggable : false }).addTo( map );
         contador = contador + 1;

         if(contador == 2){
           var x = document.getElementById("snackbar");
           x.className = "show";
           getRoute(
             lat1,
             lng1,
             lat2,
             lng2,
             function(latlngs){
               x.className = x.className.replace("show", "");
               var polyline = L.polyline(latlngs, {color: '#4CAF50', weight: 4 , opacity : .8}).addTo(map);
               // zoom the map to the polyline
               map.fitBounds(polyline.getBounds());
               $("#instrucciones").show();
             }
           );
         }
      }else{
      cancelar();
      }
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

/***
consulta del calculo de ruta
**/
getRoute = (latitud_a , longitud_a , latitud_b , longitud_b , callback)=>{
  var url = SERVER_DIRECTIONS;
  url =  url.replace('lat1',latitud_a);
  url =  url.replace('lat2',latitud_b);
  url =  url.replace('lon1',longitud_a);
  url =  url.replace('lon2',longitud_b);
  $.ajax({
      type: 'GET',
      url: url,
      success: function (data) {
          console.log(data);
          var pintarInstrucciones = "";
          var html = '<table class="table"><thead><tr><th>Mts</th><th>Descripcion</th></tr></thead><tbody>';
          var instrucciones = data.paths[0].instructions;
          for(var i = 0 ; i < instrucciones.length ; i ++){
            html = html + '<tr><td style="text-align:right">'+instrucciones[i].distance+' mts</td><td>'+instrucciones[i].text+'</td></tr>';
          }
          html = html + '</tbody></table>';
          $("#instrucciones").html(html);
          var points = [];
          var dats = data.paths[0].points.coordinates;
          for(var j = 0 ; j < dats.length ; j++){
            points.push([dats[j][1] , dats[j][0]]);
          }
          callback(points);
      }
  });
}
