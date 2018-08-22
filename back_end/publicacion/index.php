<?php
require('../head.php');
require('PublicacionDTO.php');

class PublicacionLogic {

	private $usuario;
	private $log;
	private $location = 'logic/publicacion/publicacion.php';

	public function __construct($metodo , $data) {
	  $response = new RespuestaDTO();
		$response->setCodigo(Constante::ERROR_PARAMETROS_CD);
		$response->setMensaje(Constante::ERROR_PARAMETROS_MS);
		$this->usuario = new stdClass();
		$this->log = new Log();
		switch($metodo ){
			case 'GET':
			    if($data){
    				if($data->listar == 'all'){
    					$response = $this->listar($data->correo);
    				}else{
    					$response = new RespuestaDTO();
    					$response->setCodigo(Constante::ERROR_PARAMETROS_CD);
    					$response->setMensaje(Constante::ERROR_PARAMETROS_MS);
    				}
			    }else{
			        $response = new RespuestaDTO();
							$response->setCodigo(Constante::ERROR_PARAMETROS_CD);
							$response->setMensaje(Constante::ERROR_PARAMETROS_MS);
			    }
			break;
			case 'POST':
					if($data){
							$response = $this->consultar_sesion($data->correo , $data->clave , $data->origen);
					}else{
						$response = new RespuestaDTO();
						$response->setCodigo(Constante::ERROR_PARAMETROS_CD);
						$response->setMensaje(Constante::ERROR_PARAMETROS_MS);
					}
			break;
			case 'PUT':
					// echo json_encode($data);
					if($data){
							$response = $this->registar_usuario($data->correo , $data->nombre , $data->genero , $data->clave);
					}else{
						$response = new RespuestaDTO();
						$response->setCodigo(Constante::ERROR_PARAMETROS_CD);
						$response->setMensaje(Constante::ERROR_PARAMETROS_MS);
					}
			break;
		}
		echo json_encode($response);
	}

	private function listar($correo){
		$response = new RespuestaDTO();
		$sql = "SELECT * FROM TBL_PUBLICACION tp WHERE tp.fk_pbl_usr_correo IN (SELECT ta.fk_amg_origen FROM TBL_AMIGOS ta WHERE ta.fk_amg_destino = '".$correo."') OR tp.fk_pbl_usr_correo IN (SELECT ta.fk_amg_destino FROM TBL_AMIGOS ta WHERE ta.fk_amg_origen = '".$correo."')";
		$result = ConexionDB::consultar($sql);
		$publicaciones = array();
		while ($dataResult = $result->fetch_object()){
			$publicacion = new PublicacionDTO();

			array_push($publicaciones , $publicacion);
		}
		$response->setCodigo(Constante::EXITOSO_CODE);
		$response->setMensaje(Constante::EXITOSO_MS);
		$response->setDatos($publicaciones);
		return $response ;
	}


  private function registar_publicacion ($publicacion) {

	}


}

$usuario = new PublicacionLogic($metodo , $data);
