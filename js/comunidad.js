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
    console.log(parametros);
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_AMIGO,
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $.each(data.datos, function (i, o) {
                if (o["usr_foto"]) {
                    var container = "<div  class='card col-centrada' style='width: 70%;height: 170px;margin-top:10px;'><div class='card-body'><div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='" + o["usr_foto"] + "' style='width:50px;height:50px'/></div><div class='col-sm-5'><h2>" + o["usr_nombre"] + "</h2></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div></div></div>";
                    $("#container").append(container);
                } else {
                    if (o["genero"] == "F") {
                        var container = "<div  class='card col-centrada' style='width: 70%;height: 170px;margin-top:10px;'><div class='card-body'><div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='img/perfil-mujer.jpg' style='width:50px;height:50px'/></div><div class='col-sm-5'><h2>" + o["usr_nombre"] + "</h2></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div></div></div>";
                        $("#container").append(container);
                    } else {
                        var container = "<div  class='card col-centrada' style='width: 70%;height: 170px;margin-top:10px;'><div class='card-body'><div class='row'><div class='col-sm-2' style='text-align:center'><img id='imagen' src='img/perfil-hombre.jpg' style='width:50px;height:50px'/></div><div class='col-sm-5'><h2>" + o["usr_nombre"] + "</h2></div></div><div class='row' style='margin-top:10px;'><div class='col-sm-12' align='justify' ><p style='font-size:18px;'>" + o["mensaje"] + "</p></div></div></div></div>";
                        $("#container").append(container);
                    }
                    console.log("no listo");
                }

            });

        }
    });
    $("#campopublicar").val("");
}


