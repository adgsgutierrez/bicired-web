$(document).ready(function () {

    $("#cancelar").on('click', function () {
        location = 'index.html';
    });

    $("#Registrar").on('click', function () {
        var regex = /[\w-\.]{2,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/;

        if ($("#clave").val() === "" || $("#claveC").val() === "" || $("#genero option:selected").text() === "Seleccione" || $("#correo").val() === "" || $("#nombre").val() === "") {
            swal("Alguno de los Campos Estan Vacios o no ha Seleccionado el Genero");

        } else if ($("#clave").val() !== $("#claveC").val()) {
            swal("La Contrasenia y su Cofirmacion son Diferentes!");
        } else if (!regex.test($('#correo').val().trim())) {
            swal("La direccion e-mail parece incorrecta");
        } else {
            swal("Se ha Registrado Correctamente");
            
        }
    });
});


