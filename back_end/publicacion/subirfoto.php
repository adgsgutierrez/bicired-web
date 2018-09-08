<?php
include('../utils/responseService.php');
include('../utils/conexionDB.php');
include('../utils/constante.php');
$response = new RespuestaDTO();

function conventirFecha($input) {
    $data = explode(' ', $input);
    $mesLetra = "";
    $fecha = explode('-', $data[0]);
    switch ($fecha[1]) {
        case '01':
            $mesLetra = "Enero";
            break;
        case '02':
            $mesLetra = "Febrero";
            break;
        case '03':
            $mesLetra = "Marzo";
            break;
        case '04':
            $mesLetra = "Abril";
            break;
        case '05':
            $mesLetra = "Mayo";
            break;
        case '06':
            $mesLetra = "Junio";
            break;
        case '07':
            $mesLetra = "Julio";
            break;
        case '08':
            $mesLetra = "Agosto";
            break;
        case '09':
            $mesLetra = "Septiembre";
            break;
        case '10':
            $mesLetra = "Octubre";
            break;
        case '11':
            $mesLetra = "Noviembre";
            break;
        case '12':
            $mesLetra = "Diciembre";
            break;
    }
    list($horaM, $minuto, $segundo) = explode(':', $data[1]);
    return $fecha[2] . " de " . $mesLetra . " del " . $fecha[0] . " a las " . $horaM . ":" . $minuto;
}


if (isset($_FILES["foto"])){
    $file = $_FILES["foto"];
    $nombre = $file["name"];
    $tipo = $file["type"];
    $ruta_provisional = $file["tmp_name"];
    $size = $file["size"];
    $dimensiones = getimagesize($ruta_provisional);
    $width = $dimensiones[0];
    $height = $dimensiones[1];
    $carpeta = "imagenes/";

    if ($tipo != 'image/jpg' && $tipo != 'image/jpeg' && $tipo != 'image/png' && $tipo != 'image/gif'){
      echo "Error, el archivo no es una imagen";
    }
    else if ($size > 1024*1024){
      echo "Error, el tamaño máximo permitido es un 1MB";
    }else{
        $src = $carpeta.(time() + (7 * 24 * 60 * 60)).".".explode(".", $nombre)[1];
        //print_r($_POST);
        $email = $_POST['email'];
        $publicacion = $_POST['evento'];
        $sql = "INSERT INTO TBL_FOTOGRAFIAS (fecha , correo , imagen , publicacion) VALUES (NOW() ,'".$email."' , '".$src."', '".$publicacion."')";
        //echo $sql;
        if(move_uploaded_file($ruta_provisional, $src)){
          $result = ConexionDB::consultar($sql);
          if($result){
            $sql = "SELECT * FROM TBL_FOTOGRAFIAS tp INNER JOIN TBL_USUARIO tu on tp.correo = tu.pk_usr_correo WHERE publicacion= '".$publicacion."'";
            $result = ConexionDB::consultar($sql);
            $fotos = array();
            while ($dataResult = $result->fetch_object()) {
              $foto = new stdClass();
              $foto->fecha = conventirFecha($dataResult->fecha);
              $foto->imagenes = $dataResult->imagen;
              $foto->usuario = $dataResult->usr_nombre;
              array_push($fotos , $foto);
            }
            $response->setCodigo(Constante::EXITOSO_CODE);
            $response->setMensaje(Constante::EXITOSO_CODE);
            $response->setDatos($fotos);
          }else{
            $response->setCodigo(Constante::ERROR_NO_SAVE_CODE);
            $response->setMensaje(Constante::ERROR_NO_SAVE_SMS);
            $response->setDatos("");
          }
        }else{
          $response->setCodigo(Constante::ERROR_NO_IMAGEN_SAVE_CODE);
          $response->setMensaje(Constante::ERROR_NO_IMAGEN_SAVE_SMS);
          $response->setDatos("");
        }
    }
}else{
  $response->setCodigo(Constante::ERROR_NO_DATA_CODE);
  $response->setMensaje(Constante::ERROR_NO_DATA_SMS);
  $response->setDatos("");
}
echo json_encode($response);
?>
