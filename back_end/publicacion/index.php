<?php

require('../head.php');
require('PublicacionDTO.php');

class PublicacionLogic {

    private $usuario;
    private $log;
    private $location = 'logic/publicacion/publicacion.php';

    public function __construct($metodo, $data) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
        $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
        $this->usuario = new stdClass();
        $this->log = new Log();
        switch ($metodo) {
            case 'GET':
                if ($data) {
                    if ($data->listar == 'all') {
                        $response = $this->listar($data->correo);
                    } else {
                        $response = new RespuestaDTO();
                        $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                        $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                    }
                } else {
                    $response = new RespuestaDTO();
                    $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                    $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                }
                break;
            case 'POST':
                if ($data) {
                    $response = $this->registar_publicacion($data->fecha, $data->lt1, $data->ln1, $data->lt2, $data->ln2, $data->descripcion, $data->usuario);
                } else {
                    $response = new RespuestaDTO();
                    $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                    $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                }
                break;
            case 'PUT':
                // echo json_encode($data);
                if ($data) {
                    $response = $this->consultarImagenes($data->publicacion);
                } else {
                    $response = new RespuestaDTO();
                    $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                    $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                }
                break;
        }
        echo json_encode($response);
    }

    private function listar($correo) {
        $response = new RespuestaDTO();
        //$sql = "SELECT * FROM TBL_PUBLICACION tp WHERE tp.fk_pbl_usr_correo IN (SELECT ta.fk_amg_origen FROM TBL_AMIGOS ta WHERE ta.fk_amg_destino = '".$correo."') OR tp.fk_pbl_usr_correo IN (SELECT ta.fk_amg_destino FROM TBL_AMIGOS ta WHERE ta.fk_amg_origen = '".$correo."')  OR tp.fk_pbl_usr_correo = '".$correo."'";
        $sql = "SELECT * FROM TBL_PUBLICACION tp
							INNER JOIN TBL_USUARIO tu on tp.fk_pbl_usr_correo = tu.pk_usr_correo
							WHERE
							(tp.fk_pbl_usr_correo IN (
									SELECT ta.fk_amg_origen FROM TBL_AMIGOS ta WHERE ta.fk_amg_destino = '$correo' and ta.amg_estado = 'A')
									OR tp.fk_pbl_usr_correo IN (SELECT ta.fk_amg_destino FROM TBL_AMIGOS ta WHERE ta.fk_amg_origen = '$correo' and ta.amg_estado = 'A')
									OR tp.fk_pbl_usr_correo = '$correo' ) AND pbl_estado = 'A' ORDER BY pk_pbl_id DESC";
                  //echo $sql;
        $result = ConexionDB::consultar($sql);
        $publicaciones = array();
        while ($dataResult = $result->fetch_object()) {
            $publicacion = new PublicacionDTO();
            $publicacion->pk_pbl_id = $dataResult->pk_pbl_id;
            $publicacion->pbl_fecha = $this->conventirFecha($dataResult->pbl_fecha);
            $publicacion->number_fecha = $dataResult->pbl_fecha;
            $publicacion->pbl_ltd_origen = $dataResult->pbl_ltd_origen;
            $publicacion->pbl_ltg_origen = $dataResult->pbl_ltg_origen;
            $publicacion->pbl_ltd_destino = $dataResult->pbl_ltd_destino;
            $publicacion->pbl_ltg_destino = $dataResult->pbl_ltg_destino;
            $publicacion->pbl_descripcion = $dataResult->pbl_descripcion;
            $publicacion->fk_pbl_usr_correo = $dataResult->usr_nombre;
            array_push($publicaciones, $publicacion);
        }
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $response->setDatos($publicaciones);
        return $response;
    }

    private function registar_publicacion($fecha, $lt1, $ln1, $lt2, $ln2, $descripcion, $usuario) {
        $sql = "insert into TBL_PUBLICACION(pbl_fecha,pbl_ltd_origen,pbl_ltg_origen,pbl_ltd_destino,pbl_ltg_destino,pbl_descripcion,pbl_estado,fk_pbl_usr_correo) "
                . "values('" . $fecha . "'," . doubleval($lt1) . "," . doubleval($ln1) . "," . doubleval($lt2) . "," . doubleval($ln2) . ",'" . $descripcion . "','A','" . $usuario . "') ";

        $result = ConexionDB::consultar($sql);

        if($result){
            echo 'El Evento Fue Creado Con Exito';
            exit();
        }
    }

    private function consultarImagenes($publicacion){
      $response = new RespuestaDTO();
      $sql = "SELECT * FROM TBL_FOTOGRAFIAS tp INNER JOIN TBL_USUARIO tu on tp.correo = tu.pk_usr_correo WHERE publicacion= '".$publicacion."'";
      $result = ConexionDB::consultar($sql);
      $fotos = array();
      while ($dataResult = $result->fetch_object()) {
        $foto = new stdClass();
        $foto->fecha = $this->conventirFecha($dataResult->fecha);
        $foto->imagenes = $dataResult->imagen;
        $foto->usuario = $dataResult->usr_nombre;
        array_push($fotos , $foto);
      }
      $response->setCodigo(Constante::EXITOSO_CODE);
      $response->setMensaje(Constante::EXITOSO_CODE);
      $response->setDatos($fotos);
      return $response;
    }

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



}

$usuario = new PublicacionLogic($metodo, $data);
