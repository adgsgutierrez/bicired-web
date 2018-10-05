<?php

require('../head.php');
require('AmigosLogica.php');
require('AmigosDTO.php');

class IndexAmigosLogic {

    private $usuario;

    public function __construct($metodo, $data) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
        $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
        $this->usuario = new stdClass();
        switch ($metodo) {
            case 'GET':
                $response = new RespuestaDTO();
                $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                break;
            case 'POST':
                if ($data) {
                    if (isset($data->funcion) && $data->funcion == "eliminar_amigo") {
                        $response = AmigoLogic::eliminar_amigo($data->cologeado, $data->coamigo);
                    } else if (isset($data->funcion) && $data->funcion == "verificar") {
                        $response = AmigoLogic::verificar($data->cologeado, $data->coamigo);
                    } else if (isset($data->funcion) && $data->funcion == "lista_comunidades") {

                        $response = AmigoLogic::lista_comunidades();
                    } else if (!isset($data->funcion)) {
                        $response = AmigoLogic::anadir_amigo($data->cologeado, $data->coamigo);
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
                if ($data) {
                    if ($data->funcion == "desbloquear") {
                        $response = AmigoLogic::desbloquear_amigo($data->cologeado, $data->desperfil);
                    } else if ($data->funcion == "crear_comunidad") {
                        $response = AmigoLogic::crear_comunidad($data->correo, $data->nombre_comunidad);
                    } else if (isset($data->coamigo)) {
                        $response = AmigoLogic::bloquear_amigo($data->cologeado, $data->coamigo);
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
        }
        echo json_encode($response);
    }

}

$usuario = new IndexAmigosLogic($metodo, $data);
?>
