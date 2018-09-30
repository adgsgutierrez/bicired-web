<?php

require('../head.php');
require('PublicacionDTO.php');
require('PublicacionLogic.php');

class IndexPublicacionLogic {

    private $usuario;

    public function __construct($metodo, $data) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
        $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
        $this->usuario = new stdClass();
        switch ($metodo) {
            case 'GET':
                if ($data) {
                    if ($data->listar == 'all') {
                        $response = PublicacionLogic::listar($data->correo);
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
                    if (isset($data->invitados)) {
                        $response = PublicacionLogic::invitar_amigos($data->invitados, $data->usuario, $data->idpublicacion);
                    } else if (isset($data->usuario)) {
                        $response = PublicacionLogic::registar_publicacion($data->fecha, $data->lt1, $data->ln1, $data->lt2, $data->ln2, $data->descripcion, $data->usuario);
                    } else if ($data->funcion == "ver_megusta") {
                        $response = PublicacionLogic::mostrar_megusta($data->id_publicacion, $data->correo);
                    } else if ($data->funcion == "actualizar_megusta") {
                        $response = PublicacionLogic::actualizar_megusta($data->id_publicacion, $data->correo);
                    } else if ($data->funcion == "insertar_megusta") {
                        $response = PublicacionLogic::insertar_megusta($data->id_publicacion, $data->correo);
                    }else {
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
                if ($data) {
                    $response = PublicacionLogic::consultarImagenes($data->publicacion);
                } else {
                    $response = new RespuestaDTO();
                    $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                    $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                }
                break;
        }
        echo json_encode($response);
    }
}

$usuario = new IndexPublicacionLogic($metodo, $data);
?>
