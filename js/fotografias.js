$(document).ready(function () {
    correo = sessionStorage.getItem(USUARIO_SESSION);
    mapa = getParameterByName('evento');
    session = sessionStorage.getItem('cookie_session');
    $("#email").val(session);
    $("#evento").val(mapa);
    var parametros_lista = {
        "correo": correo,
        "funcion": "lista_usuarios"
    };
    $.ajax({
        data: parametros_lista,
        url: URL_USUARIO,
        type: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            var lista = data.datos;
            console.log();
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
    $.ajax({
        data: parametros,
        type: 'PUT',
        url: URL_PUBLICACION,
        success: function (data) {
            var datos = JSON.parse(data);
            console.log(datos);
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
            console.log(err);
            swal("Tenemos inconvenientes", "Uno de nuestros ingenieros esta ajustando todo dale un poco de tiempo, lamentamos las molestias", "error");
        }
    });

    $("input[name='foto']").on("change", function () {
        var formData = new FormData($("#uploadimage")[0]);
        $.ajax({
            url: URL_UPLOAD,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: function (datos) {
                datos = JSON.parse(datos);
                console.log(datos);
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
