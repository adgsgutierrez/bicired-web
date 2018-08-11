$(document).ready(function () {

    $("#cancelar").on('click', function () {
        location = 'index.html';
    });

    $("#Registrar").on('click', function () {
        var regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;

        if ($("#clave").val() === "" || $("#claveC").val() === "" || $("#genero option:selected").text() === "Seleccione" || $("#correo").val() === "" || $("#nombre").val() === "") {
            swal("Mira Bien los Campos", "Alguno de los Campos Esta Vacio o no ha Seleccionado el Genero", "error");

        } else if ($("#clave").val() !== $("#claveC").val()) {
            swal("Algo Esta Mal", "La Contrasenia y su Cofirmacion son Diferentes", "error");
            console.log("Password" + " " + $("#clave").val());
            console.log("Confirmacion Password" + " " + $("#claveC").val());
        } else if (!regex.test($('#correo').val().trim())) {
            swal("Algo Esta Mal", "La direccion e-mail parece incorrecta", "error");
        } else {

            swal({
                title: "Confirmado",
                text: "Se ha Registrado Correctamente",
                type: "success",
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Conformado",
                closeOnConfirm: false
            }, function () {
                ajaxregistro($("#nombre").val(), $("#correo").val(), $("#genero option:selected").text(), $("#clave").val(), $("#claveC").val());
                window.location.href = 'index.html';
            });
        }
    });
});

function ajaxregistro(nombre, correo, genero, clave, claveConfirmada) {
    var parametros = {nombre: nombre, correo: correo, genero: genero, clave: clave, claveConfirmada: claveConfirmada};
    $.ajax({
        data: parametros,
        type: 'POST',
        url: 'bicired_backend/usuario/'
//        success: function (data) {
//            swal(data);
//        }
    });
}
;
