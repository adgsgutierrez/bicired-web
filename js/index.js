var config = {
    apiKey: "AIzaSyAkDlGqJE3SPMkrF_ZbbRX4V-e_YoBTmuU",
    authDomain: "bicired-3ca7d.firebaseapp.com",
    databaseURL: "https://bicired-3ca7d.firebaseio.com",
    projectId: "bicired-3ca7d",
    storageBucket: "bicired-3ca7d.appspot.com",
    messagingSenderId: "899099425162"
};
firebase.initializeApp(config);

$(document).ready(function () {
    $("#dialog").dialog({autoOpen: false, title: "Puedes iniciar con tus redes sociales", width: 350, resizable: false});
    $("#Ingresar").on('click', function () {
        console.log("click");
        if ($("#usuario").val() === "" || $("#clave").val() === "") {
            swal("Mira Bien los Campos", "Alguno de los Campos Esta Vacio", "error");
        } else {
            // swal({
            //     title: "Confirmado",
            //     text: "Se ha Registrado Correctamente",
            //     type: "success",
            //     confirmButtonClass: "btn-danger",
            //     confirmButtonText: "Conformado",
            //     closeOnConfirm: false
            // }, function () {
            //
            // });

            consultar_login($("#usuario").val() , $("#clave").val() , 'B');
        }
    });
    $("#botonRedes").on('click', function () {
        $("#dialog").dialog('open');
    });
    $("#registrar").on('click', function () {
        location = 'registro.html';
    });
    $("#btngoogle").on('click', function () {
        google();
    });

});

var google = function () {
    console.log("Entroooo");
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("Result ", result["user"]["email"]);
        var emailgoogle = result["user"]["email"];
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        consultar_login(emailgoogle , '' , 'G');
    }).catch(function (error) {
      /**Mostrar mensaje de error*/
        swal("Tenemos inconvenientes", "Google nos envio un mensaje de error. Por favor reintenta", "error");
    });
};

var facebook = function () {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    firebase.auth().languageCode = 'es_ES';
    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("Result ", result);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        consultar_login(user , '' , 'F');
    }).catch(function (error) {
        swal("Tenemos inconvenientes", "Facebook nos envio un mensaje de error. Por favor reintenta", "error");
    });
};

function consultar_login(email , clave , origen){
    var parametros ={
          "correo":email,
          "origen":origen,
          "clave": clave
        };

    console.log(parametros);

    $.ajax({
       data: parametros,
       type: 'POST',
       url:'http://localhost/bicired_backend/usuario/',
       success: function (data) {
           console.log(data);
           data = JSON.parse(data);
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
