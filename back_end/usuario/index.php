<?php
require('../head.php');
require('UsuarioDTO.php');

class UsuarioLogic {

	private $usuario;
	private $log;
	private $location = 'logic/usuario/usuario.php';

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
    					$response = $this->listar();
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

	private function listar(){
		$response = new RespuestaDTO();
		$sql = "SELECT * FROM TBL_USUARIO";
		$result = ConexionDB::consultar($sql);
		$usuarios = array();
		while ($dataResult = $result->fetch_object()){
			$usuario = new UsuarioDTO();
			$usuario->genero = $dataResult->usr_genero;
			$usuario->correo = $dataResult->pk_usr_correo;
			$usuario->nombre = $dataResult->usr_nombre;
			array_push($usuarios , $usuario);
		}
		$response->setCodigo(Constante::EXITOSO_CODE);
		$response->setMensaje(Constante::EXITOSO_MS);
		$response->setDatos($usuarios);
		return $response ;
	}

	private function consultar_sesion($correo, $clave , $plataforma){
		$response = new RespuestaDTO();
    $response->setCodigo(Constante::EXITOSO_CODE);
		$response->setMensaje(Constante::EXITOSO_MS);
		/** Consultando si el usuario existe **/
		$sql = "SELECT * FROM TBL_USUARIO WHERE pk_usr_correo = '".$correo."' AND usr_login = '".$plataforma."' ";
		if($plataforma == 'B'){
			$sql .= " AND usr_clave = '".$clave."'";
		}
		$exist = false;
		$usuario = new UsuarioDTO();
		$result = ConexionDB::consultar($sql);
		while ($dataResult = $result->fetch_object()){
			$usuario->foto = $dataResult->usr_foto;
			$usuario->genero = $dataResult->usr_genero;
			$usuario->correo = $dataResult->pk_usr_correo;
			$usuario->nombre = $dataResult->usr_nombre;
			$exist = true;
		}

		if(!$exist && $plataforma != 'B'){
			/** CREANDO EL USUARIO DESDE REDES SOCIALES **/
			$sql = "INSERT INTO TBL_USUARIO (pk_usr_correo,  usr_login) VALUES ('".$correo."', '".$plataforma."');";
			$usuario->correo = $correo;
			$usuario->foto = '';
			$usuario->genero = '';
			$usuario->nombre = '';
			$result = ConexionDB::consultar($sql);
			if(!$result){
				$response->setCodigo(Constante::ERROR_REGISTRO_CD);
				$response->setMensaje(Constante::ERROR_REGISTRO_MS);
			}
		}
		$response->setDatos($usuario);
		if(!$exist && $plataforma == 'B'){
			$response->setCodigo(Constante::ERROR_LOGIM_CD);
			$response->setMensaje(Constante::ERROR_LOGIN_MS);
		}

		return $response ;
	}

  private function registar_usuario ($correo , $nombre  , $genero , $clave ) {
		$response = new RespuestaDTO();
		$response->setCodigo(Constante::EXITOSO_CODE);
		$response->setMensaje(Constante::EXITOSO_MS);
		$sql = "INSERT INTO TBL_USUARIO (pk_usr_correo, usr_nombre, usr_genero, usr_clave, usr_login) VALUES ('".$correo."', '".$nombre."', '".$genero."', '".$clave."', 'B');";
		//echo $sql;
		$result = ConexionDB::consultar($sql);
		if(!$result){
			$response->setCodigo(Constante::ERROR_REGISTRO_CD);
			$response->setMensaje(Constante::ERROR_REGISTRO_MS);
		}
		return $response;
	}


}

$usuario = new UsuarioLogic($metodo , $data);
?>
