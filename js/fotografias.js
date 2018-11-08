var buscador;
$(document).ready(function () {
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
    mapa = getParameterByName('evento');
    session = sessionStorage.getItem('cookie_session');
    $("#email").val(session);
    $("#evento").val(mapa);
    var parametros_lista = {
        "correo": correo,
        "funcion": "lista_usuarios"
    };
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros_lista,
        url: URL_USUARIO,
        type: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            var lista = data.datos;
            $.unblockUI();
            $("#buscar_persona").autocomplete({
                source: lista,
                select: function (event, ui) {
                    buscador = ui.item.id;
                }
            });
        }
    });
    var parametros = {
        "publicacion": mapa
    };
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        type: 'PUT',
        url: URL_PUBLICACION,
        success: function (data) {
            var datos = JSON.parse(data);
            $.unblockUI();
            content = "";
            datos.datos.map((foto) => {
                content = content + '<div class="card" style="    width: 300px;float: left;margin: 20px;">';
                content = content + '<img class="card-img-top" src="back_end/publicacion/' + foto.imagenes + '" alt="Card image" style="width:100%">';
                content = content + '<div class="card-body">';
                content = content + '<p class="card-text">' + foto.usuario + ' la tomo el ' + foto.fecha + '</p>';
                content = content + '</div>';
                content = content + '</div>';
            });
            $("#container").html(content);
        }, error: function (err) {
            /** MOSTRAR ALERTA DE ERROR**/
            $.unblockUI();
            swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
        }
    });

    $("input[name='foto']").on("change", function () {
        var formData = new FormData($("#uploadimage")[0]);
        $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
        $.ajax({
            url: URL_UPLOAD,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (datos) {
                datos = JSON.parse(datos);
                $.unblockUI();
                content = "";
                datos.datos.map((foto) => {
                    content = content + '<div class="card" style="    width: 300px;float: left;margin: 20px;">';
                    content = content + '<img class="card-img-top" src="back_end/publicacion/' + foto.imagenes + '" alt="Card image" style="width:100%">';
                    content = content + '<div class="card-body">';
                    content = content + '<p class="card-text">' + foto.usuario + ' la tomo el ' + foto.fecha + '</p>';
                    content = content + '</div>';
                    content = content + '</div>';
                });
                $("#container").html(content);
            }
        });
    });
});

/**
 * @param String name
 * @return String
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
