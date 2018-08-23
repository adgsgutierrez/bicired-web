var isSession = function(){
    var email = sessionStorage.getItem(USUARIO_SESSION) || '';
console.log('Usuario '+email);
    if(email != ''){
      console.log('Session activa');
    }
    else{
      window.location.href = 'index.html';
    }
}
