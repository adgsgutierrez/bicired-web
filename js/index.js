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
            swal("Mira Bien los Campos", "Alguno de los Campos Esta Vacio o no ha Seleccionado el Genero", "error");
        } else {
            swal({
                title: "Confirmado",
                text: "Se ha Registrado Correctamente",
                type: "success",
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Conformado",
                closeOnConfirm: false
            }, function () {
                window.location.href = 'paginaPrincipal.html';
            });
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
    firebase.auth().languageCode = 'pt';
    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("Result ", result["user"]["email"]);
        var emailgoogle = result["user"]["email"];
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        
        ajaxgoogle(emailgoogle);
        // ...
    }).catch(function (error) {
        console.error("Result ", error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
};

var facebook = function () {
    console.log("Entroooo");
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    firebase.auth().languageCode = 'es_ES';
    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("Result ", result);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function (error) {
        console.error(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
};

function ajaxgoogle(email){
    var G="G";
    var parametros ={emailgoogle:email,constante:G};
    
    console.log(parametros);
    
    $.ajax({
       data: parametros,
       type: 'POST',
       url:'bicired_backend/usuario/'
//        success: function (data) {
//            swal(data);
//        }
       
    });
    
}