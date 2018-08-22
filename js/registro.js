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
            ajaxregistro($("#nombre").val(), $("#correo").val(), $("#genero option:selected").val(), $("#clave").val(), $("#claveC").val());
        }
    });
});

function ajaxregistro(nombre, correo, genero, clave, claveConfirmada) {
    // var parametros = {nombre: nombre, correo: correo, genero: genero, clave: clave, claveConfirmada: claveConfirmada};
    var parametros = {
        "correo":correo,
        "nombre": nombre ,
        "genero":genero ,
        "clave": claveConfirmada
      };
    $.ajax({
        data: parametros,
        type: 'PUT',
        url: URL_USUARIO,
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            if(data.codigo != 200){
                swal("Tenemos inconvenientes", data.mensaje, "error");
            }else{
              window.location.href = 'paginaPrincipal.html';
            }
        },error :function(err){
           /** MOSTRAR ALERTA DE ERROR**/
           console.log(err);
           swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
        }
    });
}
;
