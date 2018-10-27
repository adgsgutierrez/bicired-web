<?php

require('../head.php');
require('UsuarioDTO.php');
require('UsuarioLogic.php');

class IndexUsuarioLogic {

    private $usuario;

    public function __construct($metodo, $data) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
        $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
        $this->usuario = new stdClass();
        switch ($metodo) {
            case 'GET':
                if ($data) {
                    if (isset($data->funcion)) {
                        if ($data->funcion == 'lista_usuarios') {
                            $response = UsuarioLogic::lista_usuarios($data->correo);
                        } else if ($data->funcion == 'datos_perfil') {
                            $response = UsuarioLogic::datos_perfil($data->correo);
                        } else if ($data->funcion == 'traer_comunidades_correo') {
                            $response = UsuarioLogic::lista_comunidad($data->correo);
                        } else {
                            $response = new RespuestaDTO();
                            $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                            $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                        }
                    } else if (isset($data->listar)) {
                        if ($data->listar == 'all') {
                            $response = $this->listar();
                        } else if ($data->listar == 'notificacion') {
                            $response = UsuarioLogic::notificaciones($data->correo);
                        } else if ($data->listar == 'guardar_novedad') {
                            $response = UsuarioLogic::guardar_asistencia($data->id_publicacion);
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
                } else {
                    $response = new RespuestaDTO();
                    $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                    $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                }
                break;
            case 'POST':
                if ($data) {
                    if (!isset($data->funcion)) {
                        $response = UsuarioLogic::consultar_sesion($data->correo, $data->clave, $data->origen, $data->usuario, $data->foto);
                    } else if ($data->funcion == "amigos") {
                        $response = UsuarioLogic::amigos($data->cologeado);
                    } else if ($data->funcion == "amigos_bloqueados") {
                        $response = UsuarioLogic::lista_amigos_bloqueados($data->cologeado);
                    } else if ($data->funcion == "listarmigos") {
                        $response = UsuarioLogic::listaamigos($data->correo);
                    } else if ($data->funcion == 'amigosmensaje') {
                        $response = UsuarioLogic::amigos_mensaje($data->usuariologeado);
                    } else if ($data->funcion === "enviarmensaje") {
                        if ($data->mensaje) {
                            $response = UsuarioLogic::enviar_mensaje($data->envia, $data->recibe, $data->mensaje);
                        }
                        $response = UsuarioLogic::ver_mensaje($data->envia, $data->recibe);
                    } else if ($data->funcion == "busqueda_avanzada") {
                        $response = UsuarioLogic::busqueda_avanzada($data->correo, $data->edadinicio, $data->edadfin, $data->genero);
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
                    if (isset($data->funcion)) {
                        if ($data->funcion === "acperfil") {
                            $response = UsuarioLogic::actualizar_perfil($data->correo, $data->nombre, $data->genero, $data->edad);
                        }
                    } else if (!isset($data->funcion)) {
                        $response = UsuarioLogic::registrar_usuario($data->correo, $data->nombre, $data->genero, $data->clave);
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

$usuario = new IndexUsuarioLogic($metodo, $data);
?>
