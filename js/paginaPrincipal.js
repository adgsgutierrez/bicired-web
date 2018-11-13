var mapas = [];
var correo;
var buscador;
var socket;
var contactos = [];
var mensajesArreglo = [];
var chatActivo = '';
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var aceptarEvento = function (id_publicacion) {
    var parametros = {
        "listar": "guardar_novedad",
        "id_publicacion": id_publicacion
    };
    $.ajax({
        data: parametros,
        type: 'GET',
        url: URL_USUARIO,
        success: function (data) {
        }, error: function (err) {
            /** MOSTRAR ALERTA DE ERROR**/
            $.unblockUI();
            swal("Tenemos inconvenientes", "Tus notificaciones deberán esperar un poco", "error");
        }
    })
}

function consultar_notificaciones() {
    $("#badge-icon").hide();
    setInterval(function () {
        var parametros = {
            "listar": "notificacion",
            "correo": correo
        };
        $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
        $.ajax({
            data: parametros,
            type: 'GET',
            url: URL_USUARIO,
            success: function (data) {
                var object = JSON.parse(data);
                $("#menu-notificacion").html("");
                if (object.datos.length > 0) {
                    //Colocar el badge
                    $("#badge-icon").html(object.datos.length);
                    $("#badge-icon").show();
                    //consultar_notificaciones
                    $.unblockUI();
                    $.each(object.datos, function (i, o) {
                        var html = "<div class='row'><div class='col-sm-12'>" + o["mensaje"] + "</div></div><div class='row' style='margin-top: 15px;'><div class='col-sm-6' style='text-align:center;'><button class='btn btn-primary' id='aceptar_" + o["id"] + "'>Aceptar</button></div><div class='col-sm-6' style='text-align:center;'><button class='btn btn-default' id='rechazar_" + o["id"] + "'>Rechazar</button></div></div><hr/>";
                        $("#menu-notificacion").append(html);
                        $("#aceptar_" + o["id"] + "").on('click', function () {
                            actualizarNotificacion(o["id"], o["dato"], 'A', o["envia"]);
                        });
                        $("#rechazar_" + o["id"] + "").on('click', function () {
                            actualizarNotificacion(o["id"], "", 'R', "");
                        });
                    });
                } else {
                    $.unblockUI();
                    $("#menu-notificacion").append("No se encontraron notificaciones");
                    $("#badge-icon").hide();
                }

            }, error: function (err) {
                /** MOSTRAR ALERTA DE ERROR**/
                swal("Tenemos inconvenientes", "Tus notificaciones deberán esperar un poco", "error");
            }
        })
    }, 4000);
}


$(document).ready(function () {
    /** Validacion de sesion **/
    isSession();
    $("#loaded").show();
    $("#unloaded").hide();
    correo = sessionStorage.getItem(USUARIO_SESSION);
    mostrar_comunidades();
    consultar_notificaciones();
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
            var parametros = {"correo": correo, "edadinicio": $("#edadinicio").val(), "edadfin": $("#edadfin").val(), "genero": $("#generoacb option:selected").val(), "funcion": "busqueda_avanzada"};
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
    /** Validacion de session **/
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
    //CHAT
    $("#mensajes").hide();
    $("#contactos").show();
    socket = io(SERVER_CHAT);
    //Usuario Conectado
    var userInput = sessionStorage.getItem(USUARIO_SESSION);
    var nameInput = sessionStorage.getItem('NAME');
    socket.emit('user on', {
        user: nameInput,
        correo: userInput
    });
    //enviarChat
    $('#enviarChat').on('click', function () {
        var mensaje = $('#mensajeEnviar').val();
        if (mensaje != '') {
            socket.emit('chat message', mensaje, sessionStorage.getItem(USUARIO_SESSION), chatActivo);
            $('#mensajeEnviar').val('');
            return false;
        }
    });
    //Recibir Chat
    socket.on('chat message', function (msg) {
        mensajesArreglo = [];
        for (var i = 0; i < msg.length; i++) {
            if (msg[i].from === userInput || msg[i].to === userInput) {
                mensajesArreglo.push(msg[i]);
            }
        }
        leermensajes();
    });
    //Recibir Conectados
    socket.on('user on', function (userOnline) {
        contactos = userOnline;
        console.log(contactos);
        var html = "";
        var userInput = sessionStorage.getItem(USUARIO_SESSION);
        if (contactos.length > 0) {
            var tmp = [];
            for (var j = 0; j < contactos.length; j++) {
                if (contactos[j].correo != userInput) {
                    tmp.push(contactos[j]);
                }
            }
            contactos = tmp;
        }
        if (contactos.length > 0) {
            for (var i = 0; i < contactos.length; i++) {
                html += '<a onclick="enviarMensajes(\'' + contactos[i].correo + '\')" class="list-group-item list-group-item-action">' + contactos[i].user + '</a>';
            }
        } else {
            html = "No hay Usuarios en linea";
        }
        $("#usuariosOnline").html(html);
    });
    /** Validacion de session **/
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
    $("#cerrarpaginaprincipal").on("click", function () {
        var userInput = sessionStorage.getItem(USUARIO_SESSION);
        var nameInput = sessionStorage.getItem('NAME');
        socket.emit('user off', {
            user: nameInput,
            correo: userInput
        });
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
                                ruta: event.pbl_ruta,
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
                        $("#buscar_persona").autocomplete({
                            source: lista,
                            select: function (event, ui) {
                                buscador = ui.item.id;
                            }
                        });
                    }
                });
                var container = '';
                mapas.map((mapa) => {
                    var parametros_mapa = {"correo": correo, "id_publicacion": mapa.id, "funcion": "ver_megusta"};
                    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
                    $.ajax({
                        data: parametros_mapa,
                        type: 'POST',
                        url: URL_PUBLICACION,
                        success: function (data) {
                            data = JSON.parse(data);
                            if (data) {
                                $.unblockUI();
                                if (data.datos["0"]) {
                                    var container = '<div id="actualizar_megusta" class="col-sm-12"><button  style="float: left;" class="btn btn-default" onclick="actualizar_megusta(' + mapa.id + ')"><i class="fa fa-thumbs-o-down"></i> No me gusta</button>';
                                    $("#cajamegusta" + mapa.id + "").append(container);
                                } else {
                                    var container = '<div id="insertar_megusta" class="col-sm-12"><button  style="float: left;" class="btn btn-primary" onclick="insertar_megusta(' + mapa.id + ')"><i class="fa fa-thumbs-o-up"></i> Me gusta</button>';
                                    $("#cajamegusta" + mapa.id + "").append(container);
                                }
                            }
                        }
                    });
                    container = container + '<br><div class="card col-centrada" style="width: 80%;"><div class="card-body"><div id="map_' + mapa.id + '" class="mapaStyle" style="width: 100%;height: 200px;  overflow: visible"></div>';
                    container = container + '<p class="card-text">' + mapa.usuario + ' invitó a un evento el día ' + mapa.fecha + '<br>' + mapa.descripcion + '</p>';
                    container = container + '<div id="cajamegusta' + mapa.id + '" style="float: left;"></div>';
                    var TMPDate = (mapa.number_fecha.split(" ")[0]).split("-");
                    var TMPHour = (mapa.number_fecha.split(" ")[1]).split(":");
                    var fecha = new Date();
                    fecha.setDate(TMPDate[2]);
                    fecha.setMonth((parseInt(TMPDate[1]) - 1));
                    fecha.setFullYear(TMPDate[0]);
                    fecha.setHours(TMPHour[0]);
                    fecha.setMinutes(TMPHour[1]);
                    if (fecha.getTime() > Date.now()) {
                        container = container + '<button style="float: right;" class="btn btn-primary" onclick="irEvento(' + mapa.id + ')">Quiero ir</button></div></div>';
                    } else {
                        container = container + '<button style="float: right;" class="btn btn-primary" onclick="subirFotos(' + mapa.id + ')">Momentos</button></div></div>';
                    }

                });
                $("#container").append(container);
                $("#loaded").hide();
                $("#unloaded").show();
                mapInit();

            }
        }, error: function (err) {
            /** MOSTRAR ALERTA DE ERROR**/
            $.unblockUI();
            swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
        }
    });
    /** Funcion que inicia el hilo de busqueda de las notificaciones **/
    //  consultar_notificaciones();
});
var CrearEvento = function () {
    location.href = "crearEvento.html";
}

var map_recursive = (index) => {
    // var ltg_o = parseFloat(mapas[index].ltd_o);
    // var lng_o = parseFloat(mapas[index].lng_o);
    // var ltg_d = parseFloat(mapas[index].ltd_d);
    // var lng_d = parseFloat(mapas[index].lng_d);
    // //get api uses
    // //var directionsService = new google.maps.DirectionsService;
    // //var directionsDisplay = new google.maps.DirectionsRenderer;
    // //waypoints to add
    // var waypts = [];
    // var waypts = [
    //     {location: {lat: ltg_o, lng: lng_o}, stopover: true},
    //     {location: {lat: ltg_d, lng: lng_d}, stopover: true}];

//Se actualiza para multiples puntos de coordenadas
    // for(){
    //waypts.push({location: {lat: mapas[index].ruta[i].latitud, lng: mapas[index].ruta[i].longitud}, stopover: true});
    //   waypts.push({location: {lat: , }, stopover: true});
    // }
    var coordenada = {
        lat: parseFloat(mapas[0].ruta[0].latitud),
        lng: parseFloat(mapas[0].ruta[0].longitud),
    };
    console.warn(coordenada);
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
    poly = new google.maps.Polyline({
        strokeColor: '#4CAF50',
        strokeOpacity: 1.0,
        strokeWeight: 3
    });
    poly.setMap(map);
    var path = [];

    for (var i = 0; i < mapas[index].ruta.length; i++) {
        path.push({lat: parseFloat(mapas[index].ruta[i].latitud), lng: parseFloat(mapas[index].ruta[i].longitud)});
    }

    var polyline = new google.maps.Polyline({
        path: path,
        map: map
    });
    index = index + 1;
    if (mapas.length > index) {
        map_recursive(index);
    } else {
        $("#loaded").hide();
        $("#unloaded").show();
    }


    // Because path is an MVCArray, we can simply append a new coordinate
    // and it will automatically appear.

    // directionsDisplay.setMap(map);
    // directionsService.route({
    //     origin: {lat: waypts[0].location.lat, lng: waypts[0].location.lng}, //db waypoint start
    //     destination: {lat: waypts[0].location.lat, lng: waypts[0].location.lng}, //db waypoint end
    //     waypoints: waypts,
    //     travelMode: google.maps.TravelMode.WALKING
    // }, function (response, status) {
    //     if (status === google.maps.DirectionsStatus.OK) {
    //
    //         directionsDisplay.setDirections(response);
    //         index = index + 1;
    //         if (mapas.length > index) {
    //             map_recursive(index);
    //         }
    //     } else {
    //         console.log('Ha fallado la comunicación con el mapa a causa de: ' + status);
    //         swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
    //     }
    // });
}

mapInit = function () {
    index = 0;
    if (mapas.length > index) {
        map_recursive(index);
    }
}





function subirFotos(id_publicacion) {
    location.href = "fotografias.html?evento=" + id_publicacion;
}
function actualizar_megusta(id_publicacion) {
    accion_megusta(id_publicacion, "actualizar_megusta");
    $("#cajamegusta" + id_publicacion + "").html("");
    $("#cajamegusta" + id_publicacion + "").append('<div id="insertar_megusta" class="col-sm-12"><button  style="float: left;" class="btn btn-primary" onclick="insertar_megusta(' + id_publicacion + ')"><i class="fa fa-thumbs-o-up"></i> Me gusta</button>');
}
function insertar_megusta(id_publicacion) {
    accion_megusta(id_publicacion, "insertar_megusta");
    $("#cajamegusta" + id_publicacion + "").html("");
    $("#cajamegusta" + id_publicacion + "").append('<div id="actualizar_megusta" class="col-sm-12"><button  style="float: left;" class="btn btn-default" onclick="actualizar_megusta(' + id_publicacion + ')"><i class="fa fa-thumbs-o-down"></i> No me gusta</button>');
}
function accion_megusta(id_publicacion, funcion) {
    var parametros = {"id_publicacion": id_publicacion, "correo": correo, "funcion": funcion};
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_PUBLICACION,
        success: function (data) {
            $.unblockUI();
        }
    });
}

var enviarMensajes = function (correo) {
    chatActivo = correo;
    leermensajes();
    $("#mensajes").show();
    $("#contactos").hide();
}

var openForm = function () {
    document.getElementById("myForm").style.display = "block";
}
var closeForm = function () {
    $("#mensajes").hide();
    $("#contactos").show();
    document.getElementById("myForm").style.display = "none";
}
var volver = function () {
    chatActivo = '';
    $("#mensajes").hide();
    $("#contactos").show();
}

var leermensajes = function () {
    var html = '';
    var userInput = sessionStorage.getItem(USUARIO_SESSION);
    if (chatActivo != '') {
        for (var i = 0; i < mensajesArreglo.length; i++) {
            if (mensajesArreglo[i].from === chatActivo) {
                html += '<div class="container-chat"><p class="recibido-chat"> ' + mensajesArreglo[i].msg + '</p></div>';
                //socket.emit('view message', {from:chatActivo , to: userInput});
            } else if (mensajesArreglo[i].to === chatActivo) {
                html += '<div class="container-chat"><p class="enviado-chat"> ' + mensajesArreglo[i].msg + '</p></div>';
                //socket.emit('view message', {from:userInput , to:chatActivo});
            }
        }
        console.log("Para pintar", html);
        $("#viewMensajes").html(html);
        $("#viewMensajes").animate({scrollTop: $("#viewMensajes")[0].scrollHeight}, 400);
        console.log("Mensajes Actuales ", mensajesArreglo);
    } else {
        console.log("llego un nuevo mensaje");
    }
}

function mostrar_comunidades() {
    var parametros = {"funcion": "lista_comunidades"};
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_AMIGO,
        success: function (data) {
            data = JSON.parse(data);
            $.each(data.datos, function (i, o) {
                var contenedor = '<div id="comunidad_' + o["id_comunidad"] + '" class="card col-centrada" style="width: 90%;margin-top: 10px;height: 130px"><h4 style="cursor:pointer">' + o["nombre_comunidad"] + '</h4><label> Creado por ' + o["usuario_crea_comunidad"] + '</label><div id="botonaccion_' + o["id_comunidad"] + '" style="margin-top:10px;margin-left: 10px;" ></div></div>';
                $("#listacomunidades").append(contenedor);
                if (o["usuario_crea_comunidad"] !== correo) {
                    var parametros = {"integrante": correo, "id_comunidad": o["id_comunidad"], "funcion": "lista_integrante_comunidad"};
                    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
                    $.ajax({
                        data: parametros,
                        type: 'POST',
                        url: URL_AMIGO,
                        success: function (data) {
                            data = JSON.parse(data);
                            $.unblockUI();
                            if (data.datos["0"]) {
                                if (data.datos["0"]["estado"] == "A") {
                                    var contenedor2 = "<button type='button' class='btn btn-default' style='width: 100px;'>Salirme</button>";
                                    $("#botonaccion_" + o["id_comunidad"] + "").append(contenedor2);
                                    $("#botonaccion_" + o["id_comunidad"] + "").on('click', function () {
                                        eliminarNotificacion(o["id_comunidad"], correo, "" + o["usuario_crea_comunidad"] + "");
                                    });
                                } else if (data.datos["0"]["estado"] == "P") {
                                    var contenedor2 = "<button type='button' class='btn btn-default' style='width: 100px;' disabled>Pendiente</button>";
                                    $("#botonaccion_" + o["id_comunidad"] + "").append(contenedor2);
                                }

                            } else {
                                var contenedor2 = "<button type='button' class='btn btn-primary' style='width: 100px;'>Unirme</button>";
                                $("#botonaccion_" + o["id_comunidad"] + "").append(contenedor2);
                                $("#botonaccion_" + o["id_comunidad"] + "").on('click', function () {
                                    crear_notificacion_comunidades(o["id_comunidad"], "" + o["usuario_crea_comunidad"] + "", "" + o["nombre_comunidad"] + "");
                                });
                            }
                        }
                    });
                }
                $("#comunidad_" + o["id_comunidad"] + " h4").on('click', function () {
                    var parametros = {"correo": correo, "comunidad_id": o["id_comunidad"], "funcion": "verificar_integrante"};
                    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
                    $.ajax({
                        data: parametros,
                        type: 'POST',
                        url: URL_AMIGO,
                        success: function (data) {
                            data = JSON.parse(data);
                            $.unblockUI();
                            if (data.datos["0"]) {
                                sessionStorage.setItem(ID_COMUNIDAD, o["id_comunidad"]);
                                sessionStorage.setItem(NOMBRE_COMUNIDAD, o["nombre_comunidad"]);
                                location.href = "comunidad.html";
                            } else {
                                swal({
                                    title: "Usted no se encuentra en esta comunidad",
                                    type: "warning"
                                });

                            }
                        }
                    });

                });
            });
        }
    });
}

function accion_integrante(id_comunidad, correo_ac, funcion) {
    var parametros = {"id": id_comunidad, "correo": correo_ac, "funcion": funcion};
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        type: 'PUT',
        url: URL_AMIGO,
        success: function (data) {
            $.unblockUI();
        }
    });
}
function crear_notificacion_comunidades(id_comunidad, correo_creador, nombre_comunidad) {
    $("#botonaccion_" + id_comunidad + "").html("");
    $("#botonaccion_" + id_comunidad + "").append("<button type='button' class='btn btn-default' style='width: 100px;' disabled>Pendiente</button>");
    var mensaje = correo + ' quiere unirse a la comunidad ' + nombre_comunidad;
    var parametros = {mensaje: mensaje, perfil_envia: correo, perfil_recibe: correo_creador, tipo_notificacion: "comunidad", dato: id_comunidad, "funcion": "notificacion_comunidad"};
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        type: 'PUT',
        url: URL_AMIGO,
        success: function (data) {
            $.unblockUI();
        }
    });
}
function actualizarNotificacion(id, id_comunidad, constante, correo_ac) {
    if (constante == "A") {
        accion_integrante(id_comunidad, correo_ac, "insertar_integrante");
    }
    var parametro = {id: id, constante: constante, funcion: "actualizar_notificacion"};
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametro,
        url: URL_AMIGO,
        type: 'PUT',
        success: function (data) {
            consultar_notificaciones();
            $.unblockUI();
        }
    });

}

function eliminarNotificacion(id, usuario, usuario_co) {
    accion_integrante(id, usuario, "actualizar_integrante");
    $("#botonaccion_" + id + "").html("");
    $("#botonaccion_" + id + "").append("<button type='button' class='btn btn-primary' style='width: 100px;'>Unirme</button>");
    var parametro = {id: id, correo: usuario, usuario_creador: usuario_co, funcion: "eliminar_notificacion"};
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametro,
        url: URL_AMIGO,
        type: 'PUT',
        success: function (data) {
            consultar_notificaciones();
            $.unblockUI();
        }
    });
}
