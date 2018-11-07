var buscador;
$(document).ready(function () {
    isSession();
    correo = sessionStorage.getItem(USUARIO_SESSION);
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
    $("#cerrarpaginaprincipal").on("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });
    var parametros_lista = {
        "correo": correo,
        "funcion": "lista_usuarios"
    };
    $.blockUI({message: '<h2><img src="img/busy.gif" /> Procesando...</h2>'});
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
    var parametros = {"usuariologeado": correo, "funcion": "amigosmensaje"};
    var caja;
    $.blockUI({message: '<h2 ><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_USUARIO,
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
            $.each(data.datos, function (i, o) {
                if (o["foto"] === null) {
                    if (o["genero"] === "F") {
                        caja = "<div class='cajaper' data-correo='" + o["correo"] + "'><div class='row' style='padding-top: 14px;'><div class='col-sm-4' style='text-align:center'><img style='width:50px;height:50px;border-radius:25px;' src='img/perfil-mujer.jpg'/></div><div class='col-sm-8' style='text-transform: capitalize;font-size: 20px;cursor:pointer'><label style='cursor:pointer'>" + o["nombre"] + "</label></div></div></div>";
                    } else {
                        caja = "<div class='cajaper' data-correo='" + o["correo"] + "'><div class='row' style='padding-top: 14px;'><div class='col-sm-4' style='text-align:center;'><img style='width:50px;height:50px;border-radius:25px;' src='img/perfil-hombre.jpg'/></div><div class='col-sm-8' style='text-transform: capitalize;font-size: 20px;cursor:pointer'><label style='cursor:pointer'>" + o["nombre"] + "</label></div></div></div>";
                    }
                } else {
                    caja = "<div class='cajaper' style='width:100%;height:80px;cursor:pointer' data-correo='" + o["correo"] + "'><div class='row' style='padding-top: 14px;'><div class='col-sm-4' style='text-align:center'><img style='width:50px;height:50px;border-radius:25px;' src='" + o["foto"] + "'/></div><div class='col-sm-8' style='text-transform: capitalize;font-size: 20px;cursor:pointer'><label style='cursor:pointer'>" + o["nombre"] + "</label></div></div></div>";
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
    $.blockUI({message: '<h2><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        type: 'POST',
        url: URL_USUARIO,
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
            $.each(data.datos, function (i, o) {
                if (o["envia"] === correo) {
                    caja2 = "<div><div class='cajaper item-send-chat'><span>" + o["mensaje"] + "</span></div></div>";
                } else {
                    caja2 = "<div><div class='cajaper item-recevied-chat'><span>" + o["mensaje"] + "</span></div></div>";
                }
                $("#cajamen").append(caja2);
            });
        }
    });
    $("#textarea").val("");
}
