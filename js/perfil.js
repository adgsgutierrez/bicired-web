$(document).ready(function () {
    isSession();
    $("#cerrarperfil").on("click", function () {
        sessionStorage.clear();
        location.href = "index.html";
    });
    var busqueda = sessionStorage.getItem(USUARIO_BUSQUEDA) || '';
    if (busqueda !== "") {
        sessionStorage.setItem(USUARIO_BUSQUEDA, "");
    } else {
        busqueda = sessionStorage.getItem(USUARIO_SESSION);
    }
    console.log("El usuario a buscar es " + busqueda);
    var parametros = {"correo": busqueda, "funcion": "datos_perfil"}
    $.ajax({
        data: parametros,
        url: URL_USUARIO,
        type: 'GET',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data.datos.correo);
            $("#correoP").text(data.datos.correo);
            $("#nombreP").text(data.datos.nombre);
            if(data.datos.foto === null){
                if(data.datos.genero === "M"){
                    $("#imagen").attr("src","img/perfil-hombre.jpg");
                }else{
                    $("#imagen").attr("src","img/perfil-mujer.jpg");
                }
            }else{
                $("#imagen").attr("src",data.datos.foto);
            }
        }
    });
});


