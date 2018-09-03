<?php

require('../head.php');
require('AmigosDTO.php');

class AmigosLogic {

    private $usuario;
    private $log;
    private $location = 'logic/amigos/amigos.php';

    public function __construct($metodo, $data) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
        $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
        $this->usuario = new stdClass();
        $this->log = new Log();
        switch ($metodo) {
            case 'GET':
                if ($data) {
                    
                } else {
                    $response = new RespuestaDTO();
                    $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                    $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                }
                break;
            case 'POST':
                if ($data) {
                    if ($data->funcion == "eliminar_amigo") {
                        $response = $this->eliminar_amigo($data->cologeado, $data->coamigo);
                    } else if ($data->funcion == "verificar") {
                        $response = $this->verificar($data->cologeado, $data->coamigo);
                    } else if (!isset($data->funcion)) {
                        $response = $this->añadir_amigo($data->cologeado, $data->coamigo);
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
            case 'PUT':
                // echo json_encode($data);
                if ($data) {
                    if($data->funcion == "desbloquear"){
                        $response = $this->desbloquear_amigo($data->cologeado, $data->desperfil);
                    }else if(isset($data->coamigo)){
                        $response = $this->bloquear_amigo($data->cologeado, $data->coamigo);
                    }else{
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
        }
        echo json_encode($response);
    }

    private function añadir_amigo($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO tbl_amigos (fk_amg_origen, fk_amg_destino, amg_fecha, amg_estado,actu_estado) VALUES ('" . $correolog . "', '" . $correoami . "',SYSDATE(), 'A','');";
        //echo $sql;
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    private function verificar($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select fk_amg_origen,fk_amg_destino from tbl_amigos where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "'";
        $usuario = new AmigosDTO();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario->fk_amg_origen = $dataResult->fk_amg_origen;
            $usuario->fk_amg_destino = $dataResult->fk_amg_destino;
        }
        $response->setDatos($usuario);
        return $response;
    }

    private function eliminar_amigo($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "DELETE from tbl_amigos where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "'";
        //echo $sql;
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    private function bloquear_amigo($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "update tbl_amigos set amg_estado = 'S' , actu_estado = '".$correolog."' where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or (fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "')";
        //echo $sql;
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }
private function desbloquear_amigo($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "update tbl_amigos set amg_estado = 'A' , actu_estado = '' where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "'";
        //echo $sql;
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

}

$usuario = new AmigosLogic($metodo, $data);
?>