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
                    } else if (isset($data->funcion) && $data->funcion == "lista_integrante_comunidad") {

                        $response = AmigoLogic::lista_integrante_comunidad($data->id_comunidad, $data->integrante);
                    } else if (isset($data->funcion) && $data->funcion == "mostrar_publicaciones") {
                        $response = AmigoLogic::mostrar_publicaciones($data->id);
                    } else if (isset($data->funcion) && $data->funcion == "verificar_integrante") {
                        $response = AmigoLogic::verificacion_miembro($data->correo, $data->comunidad_id);
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
                    } else if (isset($data->funcion) && $data->funcion == "actualizar_integrante") {

                        $response = AmigoLogic::actualizar_integrante($data->id, $data->correo);
                    } else if (isset($data->funcion) && $data->funcion == "insertar_integrante") {

                        $response = AmigoLogic::insertar_integrante($data->id, $data->correo);
                    } else if (isset($data->funcion) && $data->funcion == "publicar_mensaje") {

                        $response = AmigoLogic::publicar_mensaje($data->id, $data->correo, $data->mensaje);
                    } else if (isset($data->funcion) && $data->funcion == "comentarios") {

                        $response = AmigoLogic::comentarios($data->id_mensaje, $data->comentario, $data->correo);
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
