var busqueda;
var perfilini;
$(document).ready(function () {
    isSession();

    perfilini = sessionStorage.getItem(USUARIO_SESSION);

    var parametros_lista = {
        "correo": perfilini,
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

    $("#cerrarperfil").on("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });
    busqueda = sessionStorage.getItem(USUARIO_BUSQUEDA) || '';
    if (busqueda !== "") {
        sessionStorage.setItem(USUARIO_BUSQUEDA, "");
    } else {
        busqueda = sessionStorage.getItem(USUARIO_SESSION);
        $("#añadir").css("display", "none");
    }
    datos_perfil();
    $("#actualizar_perfil").on('click', function () {
        actualizar_perfil();
    });
    amigos_bloqueados();
    amigos();
    if (busqueda !== perfilini) {
        verificacion_amistad();
        $("#editar").css("display", "none");
        $("#amibloqueados").css("display", "none");
        $("#contamigos").css("display", "none");
    } else if (busqueda === perfilini) {
        $("#contamigos").css("visibility", "visible");
        $("#aaaaaa").css("display", "none");
        $("#perfillogea").css("display", "none");
    }
    $("#aaaaaa").on('click', function () {
        swal({
            title: "Desea agregar a " + $("#nombreac").val() + " ?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "Si",
            cancelButtonText: "No"
        },
                function () {
                    agregar_amigo();
                });
    });

    $("#eliminaramigos").on('click', function () {
        swal({
            title: "Desea eliminar a " + $("#nombreac").val() + " ?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "Si",
            cancelButtonText: "No"
        },
                function () {
                    eliminar_amigo();
                });
    });

    $("#bloquearamigos").on('click', function () {
        swal({
            title: "Desea bloquear a " + $("#nombreac").val() + " ?",
            type: "warning",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: "Si",
            cancelButtonText: "No"
        },
                function () {
                    bloquear_amigo();
                });
    });
});
function actualizar_perfil() {
    var parametros = {"correo": $("#correoac").val(), "nombre": $("#nombreac").val(), "genero": $("#generoac").val(), "funcion": "acperfil"};

    $.ajax({
        data: parametros,
        url: URL_USUARIO,
        type: 'PUT',
        success: function (data) {
            if (data) {
                swal({
                    title: "Se actualizo correctamente su perfil",
                    type: "success"
                }, function () {
                    location.href = "perfil.html";
                });
            }
        }
    });
}
function datos_perfil() {
    var parametros = {"correo": busqueda, "funcion": "datos_perfil"};
    $.ajax({
        data: parametros,
        url: URL_USUARIO,
        type: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            if (data.datos.genero !== null) {
                if (data.datos.genero === "F") {
                    $("#generoP").text("Mujer");
                } else {
                    $("#generoP").text("Hombre");
                }
            }
            $("#correoP").text(data.datos.correo);
            $("#nombreP").text(data.datos.nombre);
            if (data.datos.foto === null) {
                if (data.datos.genero === "M") {
                    $("#imagen").attr("src", "img/perfil-hombre.jpg");
                } else {
                    $("#imagen").attr("src", "img/perfil-mujer.jpg");
                }
            } else {
                $("#imagen").attr("src", data.datos.foto);
            }
            $("#correoac").val($("#correoP").text());
            $("#nombreac").val($("#nombreP").text());
            if ($("#generoP").text() !== "") {
                if (data.datos.genero === "F") {
                    $("#generoP").text("Mujer");
                    $("#generoac").val("F");
                } else {
                    $("#generoP").text("Hombre");
                    $("#generoac").val("M");
                }
            }
        }
    });
}
function agregar_amigo() {
    var parametros = {"cologeado": perfilini, "coamigo": busqueda};
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'POST',
        success: function (data) {
            if (data) {
                swal({
                    title: "Usted agrego correctamente a " + $("#nombreac").val(),
                    type: "success"
                }, function () {
                    $("#aaaaaa").css("display", "none");
                    $("#amigos").css("visibility", "visible");
                    $("#opcionesamigo").css("visibility", "visible");
                });

            }

        }
    });

}

function verificacion_amistad() {
    var parametros = {"cologeado": perfilini, "coamigo": busqueda, "funcion": "verificar"};
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'POST',
        success: function (data) {
            data = JSON.parse(data);
            if (data.datos.fk_amg_origen !== null && data.datos.fk_amg_destino !== null) {
                $("#aaaaaa").css("display", "none");
                $("#amigos").css("visibility", "visible");
                $("#opcionesamigo").css("visibility", "visible");
            } else {
            }

        }
    });
}

function eliminar_amigo() {
    var parametros = {"cologeado": perfilini, "coamigo": busqueda, "funcion": "eliminar_amigo"};
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'POST',
        success: function (data) {
            if (data) {
                swal({
                    title: "Usted elimino correctamente a " + $("#nombreac").val(),
                    type: "success"
                }, function () {
                    $("#aaaaaa").css("display", "block");
                    $("#amigos").css("visibility", "hidden");
                    $("#opcionesamigo").css("visibility", "hidden");
                });
            }

        }
    });
}

function bloquear_amigo() {
    var parametros = {"cologeado": perfilini, "coamigo": busqueda, "funcion": "bloquear_amigo"};
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'PUT',
        success: function (data) {
            if (data) {
                swal({
                    title: "Usted bloqueo correctamente a " + $("#nombreac").val(),
                    type: "success"
                }, function () {
                    $("#amigos").css("visibility", "visible");
                    $("#bloqueado").css("visibility", "visible");
                    $("#opcionesamigo").css("visibility", "hidden");
                });
            }

        }
    });
}

function amigos_bloqueados() {
    var parametros = {"cologeado": perfilini, "funcion": "amigos_bloqueados"};
    $.ajax({
        data: parametros,
        url: URL_USUARIO,
        type: 'POST',
        success: function (data) {
            data = JSON.parse(data);
            var table = $("#datatableeliminar").DataTable({
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

            $('#datatableeliminar tbody').on('click', 'button', function () {
                var datos = table.row($(this).parents('tr')).data();
                console.log(datos.correo);
                var parametros = {"cologeado": perfilini, "desperfil": datos.correo, "funcion": "desbloquear"};
                $.ajax({
                    data: parametros,
                    url: URL_AMIGO,
                    type: 'PUT',
                    success: function (data) {
                        if (data) {
                            swal({
                                title: "Usted desbloqueo correctamente a " + datos.nombre,
                                type: "success"
                            }, function () {
                                location.href = "perfil.html";
                            });
                        }
                    }
                });
            });
        }
    });
}

function amigos() {
    var parametros = {"cologeado": perfilini, "funcion": "amigos"};
    $.ajax({
        data: parametros,
        url: URL_USUARIO,
        type: 'POST',
        success: function (data) {
            data = JSON.parse(data);
            $("#datatableamigos").DataTable({
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

        }
    });
}