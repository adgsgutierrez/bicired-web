$(document).ready(function () {
    isSession();
    correo = sessionStorage.getItem(USUARIO_SESSION);
    $("#cerrarmensajes").on("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });
    var parametros = {"usuariologeado": correo, "funcion": "amigosmensaje"};
    var caja;
    var caja2;
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_USUARIO,
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            $.each(data.datos, function (i, o) {
                if (o["foto"] === null) {
                    if (o["genero"] === "F") {
                        caja = "<div class='cajaper' class='item-send-chat' data-correo='" + o["correo"] + "'><div class='row' style='padding-top: 14px;'><div class='col-sm-4' style='text-align:center'><img style='width:50px;height:50px;border-radius:25px;' src='img/perfil-mujer.jpg'/></div><div class='col-sm-8' style='text-transform: capitalize;font-size: 20px;cursor:pointer'><label style='cursor:pointer'>" + o["nombre"] + "</label></div></div></div>";
                    } else {
                        caja = "<div class='cajaper' style='width:100%;height:80px;border-bottom: 2px solid darkgray;cursor:pointer' data-correo='" + o["correo"] + "'><div class='row' style='padding-top: 14px;'><div class='col-sm-4' style='text-align:center;'><img style='width:50px;height:50px;border-radius:25px;' src='img/perfil-hombre.jpg'/></div><div class='col-sm-8' style='text-transform: capitalize;font-size: 20px;cursor:pointer'><label style='cursor:pointer'>" + o["nombre"] + "</label></div></div></div>";
                    }
                } else {
                    caja = "<div class='cajaper' style='width:100%;height:80px;border-bottom: 2px solid darkgray;cursor:pointer' data-correo='" + o["correo"] + "'><div class='row' style='padding-top: 14px;'><div class='col-sm-4' style='text-align:center'><img style='width:50px;height:50px;border-radius:25px;' src='" + o["foto"] + "'/></div><div class='col-sm-8' style='text-transform: capitalize;font-size: 20px;cursor:pointer'><label style='cursor:pointer'>" + o["nombre"] + "</label></div></div></div>";
                }

                $("#cajaamigos").data("correo", o["correo"]);
                $("#cajaamigos").append(caja);
            });
        }
    });
    $("#cajaamigos").on('click', '.cajaper', function () {
        $("#cajaperfilami").html("");
        $("#cajamen").html("");
        $("#cajaperfilami").data("correoper", $(this).data("correo"));
        $("#cajaperfilami").append($(this).html());
        listamensajes()
        $("#mensajes").css("visibility", "visible");
    });

    $("#enviar_mensaje").on("click", function () {
        $("#cajamen").html("");
        if ($("#textarea").val() === "") {
            swal({
                title: "No a ingresado ningun mensaje",
                type: "error"
            });
        } else {
            listamensajes()
        }
    });

});
function listamensajes() {
    var parametros = {"envia": correo, "recibe": $("#cajaperfilami").data("correoper"), "funcion": "enviarmensaje", "mensaje": $("#textarea").val()};
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_USUARIO,
        success: function (data) {
            data = JSON.parse(data);
            $.each(data.datos, function (i, o) {
                if (o["envia"] === correo) {
                    caja2 = "<div><div class='cajaper item-send-chat'><label>" + o["mensaje"] + "</label></div></div>";
                } else {
                    caja2 = "<div><div class='cajaper item-recevied-chat'><label>" + o["mensaje"] + "</label></div></div>";
                }
                $("#cajamen").append(caja2);
            });
        }
    });
    $("#textarea").val("");
}
