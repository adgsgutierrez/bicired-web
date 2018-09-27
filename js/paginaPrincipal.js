var mapas = [];
var correo;
var buscador ;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var aceptarEvento = function(id_publicacion){
  console.log("id_publicacion" , id_publicacion);
  var parametros = {
      "listar": "guardar_novedad",
      "id_publicacion": id_publicacion
  };
  $.ajax({
      data: parametros,
      type: 'GET',
      url: URL_USUARIO,
      success: function (data) {
        console.log(data);

      }, error: function (err) {
          /** MOSTRAR ALERTA DE ERROR**/
          console.log(err);
          swal("Tenemos inconvenientes", "Tus notificaciones deberán esperar un poco", "error");
      }
    })
}

var consultar_notificaciones = function (){
  $("#badge-icon").hide();
  setInterval(function(){
    var parametros = {
        "listar": "notificacion",
        "correo": correo
    };
    $.ajax({
        data: parametros,
        type: 'GET',
        url: URL_USUARIO,
        success: function (data) {
          console.log(data);
          var object = JSON.parse(data);
          if(object.datos.length > 0){
            //Colocar el badge
            $("#badge-icon").html(object.datos.length);
            $("#badge-icon").show();
            //consultar_notificaciones
            var html = "";
            object.datos.map(function(badge){
              html = html + "<li onclick='aceptarEvento("+badge.id+")'>"+badge.user+" te ha invitado a un evento el dia "+badge.fecha+"<button type='button' class='btn btn-primary'>Ir</button></li><hr/>";
            });
            $("#menu-notificacion").html(html);
          }else{
            $("#badge-icon").hide();
          }

        }, error: function (err) {
            /** MOSTRAR ALERTA DE ERROR**/
            console.log(err);
            swal("Tenemos inconvenientes", "Tus notificaciones deberán esperar un poco", "error");
        }
      })
  }, 3000);
}


$(document).ready(function () {
    /** Validacion de sesion **/
    isSession();
    $("#loaded").show();
    $("#unloaded").hide();
    correo = sessionStorage.getItem(USUARIO_SESSION);
    /** Validacion de session **/
    $("#buscar_perfil").on('click',function(){
        if(buscador !== undefined){
           sessionStorage.setItem(USUARIO_BUSQUEDA , buscador);
        location.href = "perfil.html";
        }else if(buscador === undefined && $("#buscar_persona").val() !== ""){
            swal({
                title:"Esta persona no existe ",
                type:"error"
            });
        }else{
            swal({
                title:"El campo esta vacio ",
                type:"error"
            });
        }

    });

    $("#cerrarpaginaprincipal").on("click",function(){
        sessionStorage.clear();
        location.href = "index.html";
    });
    var parametros = {
        "listar": "all",
        "correo": correo
    };
    $.ajax({
        data: parametros,
        type: 'GET',
        url: URL_PUBLICACION,
        success: function (data) {
            data = JSON.parse(data);
            if (data.codigo != 200) {
                swal("Tenemos inconvenientes", data.mensaje, "error");
            } else {
                data.datos.map((event) => {
                    mapas.push(
                            {
                                id: event.pk_pbl_id,
                                lng_o: event.pbl_ltg_origen,
                                ltd_o: event.pbl_ltd_origen,
                                lng_d: event.pbl_ltg_destino,
                                ltd_d: event.pbl_ltd_destino,
                                fecha: event.pbl_fecha,
                                number_fecha: event.number_fecha,
                                descripcion: event.pbl_descripcion,
                                usuario: capitalizeFirstLetter(event.fk_pbl_usr_correo)
                            });
                });
                var parametros_lista = {
                    "correo": correo,
                    "funcion": "lista_usuarios"
                };
                $.ajax({
                    data: parametros_lista,
                    url: URL_USUARIO,
                    type: 'GET',
                    success: function (data) {
                        data = JSON.parse(data);
                        var lista = data.datos;
                        console.log();
                        $("#buscar_persona").autocomplete({
                            source: lista,
                            select : function(event , ui){
                                buscador = ui.item.id;
                            }
                        });
                    }
                });
                var container = '';
                mapas.map((mapa) => {
                    container = container + '<br><div class="card col-centrada" style="width: 80%;"><div class="card-body"><div id="map_' + mapa.id + '" class="mapaStyle" style="width: 100%;height: 200px;  overflow: visible"></div>';
                    container = container + '<p class="card-text">' + mapa.usuario + ' invitó a un evento el día ' + mapa.fecha + '<br>' + mapa.descripcion + '</p>';
console.log("Mapa ", mapa);
                    var TMPDate = (mapa.number_fecha.split(" ")[0]).split("-");
                    var TMPHour = (mapa.number_fecha.split(" ")[1]).split(":");
                    var fecha = new Date();
                    fecha.setDate(TMPDate[2]);
                    fecha.setMonth((parseInt(TMPDate[1]) - 1 ));
                    fecha.setFullYear(TMPDate[0]);
                    fecha.setHours(TMPHour[0]);
                    fecha.setMinutes(TMPHour[1]);
                    console.log("fecha.getTime() > Date.now()" , fecha , new Date);
                    if(fecha.getTime() > Date.now()){
                        container = container + '<button style="float: right;" class="btn btn-primary" onclick="irEvento(' + mapa.id + ')">Quiero ir</button></div></div>';
                    }else{
                        container = container + '<button style="float: right;" class="btn btn-primary" onclick="subirFotos(' + mapa.id + ')">Momentos</button></div></div>';
                    }

                });
                $("#container").append(container);
                mapInit();
                $("#loaded").hide();
                $("#unloaded").show();
            }
        }, error: function (err) {
            /** MOSTRAR ALERTA DE ERROR**/
            console.log(err);
            swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
        }
    });

    /** Funcion que inicia el hilo de busqueda de las notificaciones **/
    consultar_notificaciones();
});
var CrearEvento = function () {
    location.href = "crearEvento.html";
}

var map_recursive = (index)=>{
  var ltg_o = parseFloat(mapas[index].ltd_o);
  var lng_o = parseFloat(mapas[index].lng_o);
  var ltg_d = parseFloat(mapas[index].ltd_d);
  var lng_d = parseFloat(mapas[index].lng_d);
  //get api uses
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  //waypoints to add
  var waypts = [
      {location: {lat: ltg_o, lng: lng_o}, stopover: true},
      {location: {lat: ltg_d, lng: lng_d}, stopover: true}];
  var coordenada = {
      lat: waypts[0].location.lat,
      lng: waypts[0].location.lng
  };
  map = new google.maps.Map(document.getElementById('map_' + mapas[index].id), {
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
      origin: {lat: waypts[0].location.lat, lng: waypts[0].location.lng}, //db waypoint start
      destination: {lat: waypts[0].location.lat, lng: waypts[0].location.lng}, //db waypoint end
      waypoints: waypts,
      travelMode: google.maps.TravelMode.WALKING
  }, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          index = index + 1;
          if(mapas.length > index){
              map_recursive(index);
          }
      } else {
          console.log('Ha fallado la comunicación con el mapa a causa de: ' + status);
          swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
      }
  });
}

mapInit = function () {
  index = 0;
  if(mapas.length > index){
      map_recursive(index);
  }
}





function subirFotos(id_publicacion){
  location.href = "fotografias.html?evento="+id_publicacion;
}
