<?php
/**
 * Este es el archivo de caberera de cada servicio
 * @author  Aric Gutierrez
 * @date 22 Nov 2017
 * @version 1.0
 **/
	header("Access-Control-Allow-Origin: *");

    include('utils/log.php');
	include('utils/responseService.php');
	include('utils/conexionDB.php');
	include('utils/constante.php');

	ConexionDB::initDataBase();

	$metodo = $_SERVER['REQUEST_METHOD'];
	if (isset($_SERVER['HTTP_ORIGIN'])) {
	  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	  header('Access-Control-Allow-Credentials: true');
	  header('Access-Control-Max-Age: 86400');
	}
	if ( $metodo == 'OPTIONS') {
	  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
		  header("Access-Control-Allow-Methods: GET, POST, OPTIONS , PATCH, PUT");
	  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		  header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']} , PATCH , PUT");
	  exit(0);
	}

    if($metodo == 'GET'){
        $postdata_1 = json_encode($_GET);
    }else if($metodo == 'POST'){
	    // $postdata_1 = file_get_contents("php://input");
			$postdata_1 = json_encode($_POST);
    }else if($metodo == 'PUT'){
			// $postdata_1 = json_encode($_PUT);
	     parse_str(file_get_contents("php://input"),$postdata_1);
			 $postdata_1 = json_encode($postdata_1);
    }else{
        $postdata_1= new stdClass();
        $postdata_1->error = true;
        $postdata_1 = json_encode($postdata_1);
    }
	$data = json_decode($postdata_1);
?>
