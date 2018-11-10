var busqueda;
var perfilini;
$(document).ready(function () {
    isSession();
    perfilini = sessionStorage.getItem(USUARIO_SESSION);
    $("#crearcomunidad").on('click', function () {
        $("#cuerpocomunidad").css("display", "block");
        $("#nombre_co").val("");
    });
    $("#crear_co").on('click', function () {
        if ($("#nombre_co").val() === "") {
            swal({
                title: "El campo nombre esta vacio",
                type: "error"
            });
        } else {
            var parametros = {"correo": perfilini, "nombre_comunidad": $("#nombre_co").val(), "funcion": "crear_comunidad"};
            $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
            $.ajax({
                data: parametros,
                type: 'PUT',
                url: URL_AMIGO,
                success: function (data) {
                    $.unblockUI();
                    miscomunidades();
                }
            });
        }
        $("#cuerpocomunidad").css("display", "none");
        $("#nombre_co").val("");
    });
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
            var parametros = {"correo": perfilini, "edadinicio": $("#edadinicio").val(), "edadfin": $("#edadfin").val(), "genero": $("#generoacb option:selected").val(), "funcion": "busqueda_avanzada"};
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
    var parametros_lista = {
        "correo": perfilini,
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
    busqueda = sessionStorage.getItem(USUARIO_BUSQUEDA) || '';
    if (busqueda !== "") {
        sessionStorage.setItem(USUARIO_BUSQUEDA, "");
    } else {
        busqueda = sessionStorage.getItem(USUARIO_SESSION);
        $("#a�adir").css("display", "none");
    }
    datos_perfil();
    amigos_bloqueados();
    amigos();
    $("#actualizar_perfil").on('click', function () {
        actualizar_perfil();
    });
    if (busqueda !== perfilini) {
        verificacion_amistad();
        $("#editar").css("display", "none");
        $("#amibloqueados").css("display", "none");
        $("#contamigos").css("display", "none");
        $("#cajamiscomunidades").css("display", "none");
    } else if (busqueda === perfilini) {
        $("#contamigos").css("visibility", "visible");
        $("#cajamiscomunidades").css("visibility", "visible");
        $("#aaaaaa").css("display", "none");
        $("#perfillogea").css("display", "none");
    }
    $("#miscomunidades").on("click", function () {
        miscomunidades();
    });
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
    var parametros = {"correo": $("#correoac").val(), "nombre": $("#nombreac").val(), "genero": $("#generoac").val(), "edad": $("#edadac").val(), "funcion": "acperfil"};
    if ($("#correoac").val() === "" || $("#nombreac").val() === "" || $("#generoac").val() === "" || $("#edadac").val() === "") {
        swal({
            title: "Hay un campo vac�o",
            type: "error"
        });
    } else {
        $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
        $.ajax({
            data: parametros,
            url: URL_USUARIO,
            type: 'PUT',
            success: function (data) {
                if (data) {
                    $.unblockUI();
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
}
function datos_perfil() {
    var parametros = {"correo": busqueda, "funcion": "datos_perfil"};
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        url: URL_USUARIO,
        type: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
            if (data.datos.genero !== null) {
                if (data.datos.genero === "F") {
                    $("#generoP").text("Mujer");
                } else {
                    $("#generoP").text("Hombre");
                }
            }
            $("#correoP").text(data.datos.correo);
            $("#nombreP").text(data.datos.nombre);
            if (data.datos.edad) {
                $("#edadP").text(data.datos.edad + " Años");
            }
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
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'POST',
        success: function (data) {
            if (data) {
                $.unblockUI();
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
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'POST',
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
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
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'POST',
        success: function (data) {
            if (data) {
                $.unblockUI();
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
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        url: URL_AMIGO,
        type: 'PUT',
        success: function (data) {
            if (data) {
                $.unblockUI();
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
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        url: URL_USUARIO,
        type: 'POST',
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
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
                var parametros = {"cologeado": perfilini, "desperfil": datos.correo, "funcion": "desbloquear"};
                $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
                $.ajax({
                    data: parametros,
                    url: URL_AMIGO,
                    type: 'PUT',
                    success: function (data) {
                        if (data) {
                            $.unblockUI();
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
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        url: URL_USUARIO,
        type: 'POST',
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
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

function miscomunidades() {
    var tabla = '';
    var parametros = {"correo": perfilini, "funcion": "traer_comunidades_correo"};
    $.blockUI({message: '<h2"><img src="img/busy.gif" /> Procesando...</h2>'});
    $.ajax({
        data: parametros,
        type: 'GET',
        url: URL_USUARIO,
        success: function (data) {
            data = JSON.parse(data);
            $.unblockUI();
            var tabla = $("#datatablecomunidad").DataTable({
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
            $('#datatablecomunidad tbody').on('click', 'tr', function () {
                sessionStorage.setItem(ID_COMUNIDAD, $(this).children('td').children("div").data("idmiscomunidades"));
                sessionStorage.setItem(NOMBRE_COMUNIDAD, $(this).children('td').children("div").text());
                location.href = "comunidad.html";
            });
        }
    });
}