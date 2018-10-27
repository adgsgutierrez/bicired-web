var cod_comunidad;
var correo;
$(document).ready(function () {
    cod_comunidad = sessionStorage.getItem(ID_COMUNIDAD);
    mostrar_publicaciones(cod_comunidad);
    correo = sessionStorage.getItem(USUARIO_SESSION);
    $("#nombre_comunidad").text(sessionStorage.getItem(NOMBRE_COMUNIDAD));
    $("#publicar").on('click', function () {
        if ($("#campopublicar").val() == "") {
            swal({
                title: "No tiene nada para publicar",
                type: "error"
            });
        } else {

            var parametros = {"id": cod_comunidad, "correo": correo, "mensaje": $("#campopublicar").val(), "funcion": "publicar_mensaje"};
            $.ajax({
                data: parametros,
                type: 'PUT',
                url: URL_AMIGO,
                success: function (data) {
                    if (data) {
                        $("#container").html("");
                    }
                    mostrar_publicaciones(cod_comunidad);
                }
            });
        }
    });
    $("#cerrarpaginaprincipal").on("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });
});

function mostrar_publicaciones(id) {
    var parametros = {"id": id, "funcion": "mostrar_publicaciones"};
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_AMIGO,
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $.each(data.datos.mensajes, function (i, o) {
                console.log(o);
                if (o["usr_foto"]) {
                    var container = "<div  class='card col-centrada' style='width: 70%;height: 170px;margin-top:10px;'><div class='card-body'><div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='" + o["usr_foto"] + "' style='width:50px;height:50px'/></div><div class='col-sm-5'><h2>" + o["usr_nombre"] + "</h2></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div><div class='row'><div id='comentarios_" + o["id_mensaje"] + "' style='margin:auto;'><i class='fa fa-comment-o'> Comentar</i></div></div></div></div>";
                    container += "<div  id='cajacomentarios_" + o["id_mensaje"] + "' class='card col-centrada' style='width: 70%;height: 260px;display:none'><div class='card-body'><div class='row'><div class='col-sm-9' ><input id='comentarios_mensajes_" + o["id_mensaje"] + "' class='form-control' /></div><div class='col-sm-3' style='text-align:center;'><button id='clickComentar_" + o["id_mensaje"] + "' class='btn btn-primary' ><i class='fa fa-comment-o'></i> Comentar</button></div></div><div class='row'><div id='cuerpoco_" + o["id_mensaje"] + "' style='margin-top:10px;height: 190px;width:100%;overflow-y: scroll;overflow-x: hidden;'></div></div></div>";
                    $("#container").append(container);
                } else {
                    if (o["genero"] == "F") {
                        var container = "<div  class='card col-centrada' style='width: 70%;height: 170px;margin-top:10px;'><div class='card-body'><div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='img/perfil-mujer.jpg' style='width:50px;height:50px'/></div><div class='col-sm-5'><h2>" + o["usr_nombre"] + "</h2></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div><div class='row'><div id='comentarios_" + o["id_mensaje"] + "' style='margin:auto;'><i class='fa fa-comment-o'> Comentar</i></div></div></div></div>";
                        container += "<div  id='cajacomentarios_" + o["id_mensaje"] + "' class='card col-centrada' style='width: 70%;height: 260px;display:none'><div class='card-body'><div class='row'><div class='col-sm-9' ><input id='comentarios_mensajes_" + o["id_mensaje"] + "' class='form-control'/></div><div class='col-sm-3' style='text-align:center;'><button id='clickComentar_" + o["id_mensaje"] + "' class='btn btn-primary'><i class='fa fa-comment-o'></i> Comentar</button></div></div><div class='row'><div id='cuerpoco_" + o["id_mensaje"] + "' style='margin-top:10px;height: 190px;width:100%;overflow-y: scroll;overflow-x: hidden;'></div></div></div>";
                        $("#container").append(container);
                    } else {
                        var container = "<div  class='card col-centrada' style='width: 70%;height: 170px;margin-top:10px;'><div class='card-body'><div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='img/perfil-hombre.jpg' style='width:50px;height:50px'/></div><div class='col-sm-5'><h2>" + o["usr_nombre"] + "</h2></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div><div class='row'><div id='comentarios_" + o["id_mensaje"] + "' style='margin:auto;'><i class='fa fa-comment-o'> Comentar</i></div></div></div></div>";
                        container += "<div  id='cajacomentarios_" + o["id_mensaje"] + "' class='card col-centrada' style='width: 70%;height: 260px;display:none'><div class='card-body'><div class='row'><div class='col-sm-9' ><input id='comentarios_mensajes_" + o["id_mensaje"] + "' class='form-control'/></div><div class='col-sm-3' style='text-align:center;' ><button id='clickComentar_" + o["id_mensaje"] + "' class='btn btn-primary' ><i class='fa fa-comment-o'></i> Comentar</button></div></div><div class='row'><div id='cuerpoco_" + o["id_mensaje"] + "' style='margin-top:10px;height: 190px;width:100%;overflow-y: scroll;overflow-x: hidden;'></div></div></div>";

                        $("#container").append(container);
                    }
                }
                $("#clickComentar_" + o["id_mensaje"] + "").on('click', function () {
                    insertar_comentario(o["id_mensaje"], $("#comentarios_mensajes_" + o["id_mensaje"] + "").val());
                });
                $("#comentarios_" + o["id_mensaje"] + "").on('click', function () {

                    if ($("#cajacomentarios_" + o["id_mensaje"] + "").css("display") === "block") {
                        $("#cajacomentarios_" + o["id_mensaje"] + "").css("display", "none");
                    } else {
                        $("#cajacomentarios_" + o["id_mensaje"] + "").css("display", "block");
                    }
                });
            });
            $.each(data.datos.comentarios, function (ind, o) {
                console.log(o);
                console.log(ind);
                if (o["usr_foto"]) {
                    var conteiner = "<div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='" + o["usr_foto"] + "' style='width:50px;height:50px'/></div><div class='col-sm-5'><h3>" + o["usr_nombre"] + "</h3></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div>";
                    $("#cuerpoco_" + o["id_mensajes"] + "").append(conteiner);
                } else {
                    if (o["genero"] == "F") {
                        var conteiner = "<div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='img/perfil-mujer.jpg' style='width:50px;height:50px'/></div><div class='col-sm-5'><h3>" + o["usr_nombre"] + "</h3></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div>";
                        $("#cuerpoco_" + o["id_mensajes"] + "").append(conteiner);
                    } else {
                        var conteiner = "<div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='img/perfil-hombre.jpg' style='width:50px;height:50px'/></div><div class='col-sm-5'><h3>" + o["usr_nombre"] + "</h3></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div>";
                        $("#cuerpoco_" + o["id_mensajes"] + "").append(conteiner);
                    }
                }
            });


        }
    });
    $("#campopublicar").val("");
}

function insertar_comentario(id_mensaje, comentarios) {
    var parametros = {"id_mensaje": id_mensaje, "comentario": comentarios, "correo": correo, "funcion": "comentarios"};
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'PUT',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $.each(data.datos, function (inde, o) {
                if (o["usr_foto"]) {
                    var conteiner = "<div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='" + o["usr_foto"] + "' style='width:50px;height:50px'/></div><div class='col-sm-5'><h3>" + o["usr_nombre"] + "</h3></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div>";
                    $("#cuerpoco_" + id_mensaje + "").append(conteiner);
                } else {
                    if (o["genero"] == "F") {
                        var conteiner = "<div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='img/perfil-mujer.jpg' style='width:50px;height:50px'/></div><div class='col-sm-5'><h3>" + o["usr_nombre"] + "</h3></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div>";
                        $("#cuerpoco_" + id_mensaje + "").append(conteiner);
                    } else {
                        var conteiner = "<div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='img/perfil-hombre.jpg' style='width:50px;height:50px'/></div><div class='col-sm-5'><h3>" + o["usr_nombre"] + "</h3></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div>";
                        $("#cuerpoco_" + id_mensaje + "").append(conteiner);
                    }
                }

            });
        }
    });
    $("#comentarios_mensajes_" + id_mensaje + "").val("");
}


