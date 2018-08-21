
var map;
var contador = 0;
var marker;
var rutas;
var lat1;
var lat2;
var lng1;
var lng2;
function initMap() {
    var myLatlng = new google.maps.LatLng(4.182892873752382, -74.26601401562499);
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatlng,
        zoom: 7,
        type: "ROADMAP"

    });
    google.maps.event.addListener(map, 'click', function (event) {
        contador++;
        if (contador <= 2) {
            marker = new google.maps.Marker({
                position: event.latLng,
                map: map
            });
            if (contador === 1) {
                lat1 = marker.getPosition().lat().toString();
                lng1 = marker.getPosition().lng().toString();
            } else {
                lat2 = marker.getPosition().lat().toString();
                lng2 = marker.getPosition().lng().toString();
            }
            console.log(marker.getPosition().lat().toString());
            console.log(marker.getPosition().lng().toString());
        }
//        if (contador > 1) {
//        marker = new google.maps.Marker({
//                position: event.latLng,
//                map: map
//            });
//        if (contador > 1) {
//            marker.setPosition(event.latLng);
//            marker = new google.maps.Marker({
//                position: event.latLng,
//                map: map
//            });
//            lat1=marker.getPosition().lat().toString();
//            lng1=marker.getPosition().lng().toString();
//        } else {
//            marker = new google.maps.Marker({
//                position: event.latLng,
//                map: map
//            });
//            lat2=marker.getPosition().lat().toString();
//            lng2=marker.getPosition().lng().toString();
//        }
        document.getElementById("coords").value = marker.getPosition().toString();

        var rutas = [new google.maps.LatLng(lat1, lng1),
            new google.maps.LatLng(lat2, lng2)];
        console.log(rutas);
        console.log(contador);
        if (contador === 2) {
            var lineas = new google.maps.Polyline({
                path: rutas,
                map: map,
                strokeColor: '#000099',
                strokeWeight: 5,
                strokeOpacity: 0.6
            });
        }
    });

}




