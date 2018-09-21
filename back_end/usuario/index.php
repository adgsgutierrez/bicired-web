<?php

require('../head.php');
require('UsuarioDTO.php');

class UsuarioLogic {

    private $usuario;
    private $log;
    private $location = 'logic/usuario/usuario.php';

    public function __construct($metodo, $data) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
        $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
        $this->usuario = new stdClass();
        $this->log = new Log();
        switch ($metodo) {
            case 'GET':
                if ($data) {
                    if (isset($data->funcion)) {
                        if ($data->funcion == 'lista_usuarios') {
                            $response = $this->lista_usuarios($data->correo);
                        } else if ($data->funcion == 'datos_perfil') {
                            $response = $this->datos_perfil($data->correo);
                        } else {
                            $response = new RespuestaDTO();
                            $response->setCodigo(Constante::ERROR_PARAMETROS_CD);
                            $response->setMensaje(Constante::ERROR_PARAMETROS_MS);
                        }
                    } else if (isset($data->listar)) {
                        if ($data->listar == 'all') {
                            $response = $this->listar();
                        } else if ($data->listar == 'notificacion') {
                            $response = $this->notificaciones($data->correo);
                        } else if ($data->listar == 'guardar_novedad') {
                            $response = $this->guardar_asistencia($data->id_publicacion);
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
                        $response = $this->consultar_sesion($data->correo, $data->clave, $data->origen, $data->usuario, $data->foto);
                    } else if ($data->funcion == "amigos") {
                        $response = $this->amigos($data->cologeado);
                    } else if ($data->funcion == "amigos_bloqueados") {
                        $response = $this->lista_amigos_bloqueados($data->cologeado);
                    } else if ($data->funcion == "listarmigos") {
                        $response = $this->listaamigos($data->correo);
                    } else if ($data->funcion == 'amigosmensaje') {
                        $response = $this->amigos_mensaje($data->usuariologeado);
                    } else if ($data->funcion === "enviarmensaje") {
                        if ($data->mensaje) {
                            $response = $this->enviar_mensaje($data->envia, $data->recibe, $data->mensaje);
                        }
                        $response = $this->ver_mensaje($data->envia, $data->recibe);
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
                            $response = $this->actualizar_perfil($data->correo, $data->nombre, $data->genero);
                        }
                    } else if (!isset($data->funcion)) {
                        $response = $this->registrar_usuario($data->correo, $data->nombre, $data->genero, $data->clave);
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

    private function listar() {
        $response = new RespuestaDTO();
        $sql = "SELECT * FROM TBL_USUARIO";
        $result = ConexionDB::consultar($sql);
        $usuarios = array();
        while ($dataResult = $result->fetch_object()) {
            $usuario = new UsuarioDTO();
            $usuario->genero = $dataResult->usr_genero;
            $usuario->correo = $dataResult->pk_usr_correo;
            $usuario->nombre = $dataResult->usr_nombre;
            array_push($usuarios, $usuario);
        }
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $response->setDatos($usuarios);
        return $response;
    }

    private function consultar_sesion($correo, $clave, $plataforma, $nombre_usuario, $foto) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        /** Consultando si el usuario existe * */
        $sql = "SELECT * FROM TBL_USUARIO WHERE pk_usr_correo = '" . $correo . "' AND usr_login = '" . $plataforma . "' ";
        if ($plataforma == 'B') {
            $sql .= " AND usr_clave = '" . $clave . "'";
        }
        $exist = false;
        $usuario = new UsuarioDTO();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario->foto = $dataResult->usr_foto;
            $usuario->genero = $dataResult->usr_genero;
            $usuario->correo = $dataResult->pk_usr_correo;
            $usuario->nombre = $dataResult->usr_nombre;
            $exist = true;
        }

        if (!$exist && $plataforma != 'B') {
            /** CREANDO EL USUARIO DESDE REDES SOCIALES * */
            $sql = "INSERT INTO TBL_USUARIO (pk_usr_correo,usr_nombre,usr_login,usr_foto) VALUES ('" . $correo . "','" . $nombre_usuario . "','" . $plataforma . "','" . $foto . "');";
            $usuario->correo = $correo;
            $usuario->foto = $foto;
            $usuario->genero = '';
            $usuario->nombre = $nombre_usuario;
            $result = ConexionDB::consultar($sql);
            if (!$result) {
                $response->setCodigo(Constante::ERROR_REGISTRO_CD);
                $response->setMensaje(Constante::ERROR_REGISTRO_MS);
            }
        }
        $response->setDatos($usuario);
        if (!$exist && $plataforma == 'B') {
            $response->setCodigo(Constante::ERROR_LOGIM_CD);
            $response->setMensaje(Constante::ERROR_LOGIN_MS);
        }

        return $response;
    }

    private function registrar_usuario($correo, $nombre, $genero, $clave) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO TBL_USUARIO (pk_usr_correo, usr_nombre, usr_genero, usr_clave, usr_login) VALUES ('" . $correo . "', '" . $nombre . "', '" . $genero . "', '" . $clave . "', 'B');";
        //echo $sql;
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    private function lista_usuarios($correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "SELECT DISTINCT * FROM TBL_USUARIO WHERE pk_usr_correo NOT IN (select pk_usr_correo from TBL_USUARIO u,TBL_AMIGOS a where u.pk_usr_correo=a.fk_amg_destino  and a.amg_estado='S' and (fk_amg_destino='" . $correo . "' or fk_amg_origen='" . $correo . "')) and pk_usr_correo NOT IN (select pk_usr_correo from TBL_USUARIO u,TBL_AMIGOS a where u.pk_usr_correo=a.fk_amg_origen and a.amg_estado='S' and (fk_amg_destino='" . $correo . "' or fk_amg_origen='" . $correo . "')) and pk_usr_correo <> '" . $correo . "'";
//        echo $sql;
        $result = ConexionDB::consultar($sql);
        //retornar el objeto usuario
        $lista_usuario = array();
        while ($dataResult = $result->fetch_object()) {
            $user = new stdClass();
            $user->label = $dataResult->usr_nombre;
            $user->id = $dataResult->pk_usr_correo;
            array_push($lista_usuario, $user);
        }
        $response->setDatos($lista_usuario);
        return $response;
    }

    private function datos_perfil($correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select * from TBL_USUARIO where pk_usr_correo='" . $correo . "'";
        $usuario = new UsuarioDTO();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario->foto = $dataResult->usr_foto;
            $usuario->genero = $dataResult->usr_genero;
            $usuario->correo = $dataResult->pk_usr_correo;
            $usuario->nombre = $dataResult->usr_nombre;
        }
        $response->setDatos($usuario);
        return $response;
    }

    private function actualizar_perfil($correo, $nombre, $genero) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "update TBL_USUARIO set usr_nombre='" . $nombre . "', usr_genero='" . $genero . "' where pk_usr_correo='" . $correo . "'";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    private function lista_amigos_bloqueados($correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select DISTINCT * from TBL_USUARIO u where pk_usr_correo in (select fk_amg_destino from TBL_AMIGOS where amg_estado = 'S' and fk_amg_origen='" . $correo . "' and actu_estado='" . $correo . "') or pk_usr_correo in (select fk_amg_origen from TBL_AMIGOS where amg_estado = 'S' and fk_amg_destino='" . $correo . "' and actu_estado='" . $correo . "')";
        $usuario = array();
        $header = array();
        $header[] = array("title" => "foto", "data" => "foto");
        $header[] = array("title" => "nombre", "data" => "nombre");
        $header[] = array("title" => "correo", "data" => "correo");
        $header[] = array("title" => "genero", "data" => "genero");
        $header[] = array("title" => "accion", "data" => "accion");
        $usuario_datos = array();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            if ($dataResult->usr_foto === null && $dataResult->usr_genero === "F") {
                $foto = "img/perfil-mujer.jpg";
                $usuario["nombre"] = $dataResult->usr_nombre;
                $usuario["correo"] = $dataResult->pk_usr_correo;
                $genero = "Mujer";
                $usuario["foto"] = '<img id="imagen" style="width:100%" src="' . $foto . '" >';
                $usuario["genero"] = $genero;
                $usuario["accion"] = '<button id="desbloquear" type="button" class="btn btn-primary" data-correo="' . $dataResult->pk_usr_correo . '"><i class="fa fa-unlock"></i> Desbloquear Amigo</button>';
            } else if ($dataResult->usr_foto == null && $dataResult->usr_genero == "M") {
                $foto = "img/perfil-hombre.jpg";
                $usuario["nombre"] = $dataResult->usr_nombre;
                $usuario["correo"] = $dataResult->pk_usr_correo;
                $genero = "Hombre";
                $usuario["foto"] = '<img id="imagen" style="width:100%" src="' . $foto . '" >';
                $usuario["genero"] = $genero;
                $usuario["accion"] = '<button id="desbloquear" type="button" class="btn btn-primary" data-correo="' . $dataResult->pk_usr_correo . '"><i class="fa fa-unlock"></i> Desbloquear Amigo</button>';
            } else {
                $usuario["foto"] = '<img id="imagen" style="width:100%" src="' . $dataResult->usr_foto . '" >';
                $usuario["nombre"] = $dataResult->usr_nombre;
                $usuario["correo"] = $dataResult->pk_usr_correo;
                $usuario["genero"] = $dataResult->usr_genero;
                $usuario["accion"] = '<button id="desbloquear" type="button" class="btn btn-primary" data-correo="' . $dataResult->pk_usr_correo . '"><i class="fa fa-unlock"></i> Desbloquear Amigo</button>';
            }
            $usuario_datos[] = $usuario;
        }



        return array("data" => $usuario_datos, "header" => $header);
    }

    private function amigos($correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select DISTINCT * from TBL_USUARIO u where pk_usr_correo in (select fk_amg_destino from TBL_AMIGOS where amg_estado = 'A' and fk_amg_origen='" . $correo . "') or pk_usr_correo in (select fk_amg_origen from TBL_AMIGOS where amg_estado = 'A' and fk_amg_destino='" . $correo . "')";
        $usuario = array();
        $header = array();
        $header[] = array("title" => "foto", "data" => "foto");
        $header[] = array("title" => "nombre", "data" => "nombre");
        $header[] = array("title" => "correo", "data" => "correo");
        $header[] = array("title" => "genero", "data" => "genero");
        $header[] = array("title" => "accion", "data" => "accion");
        $usuario_datos = array();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            if ($dataResult->usr_foto === null && $dataResult->usr_genero === "F") {
                $foto = "img/perfil-mujer.jpg";
                $usuario["nombre"] = $dataResult->usr_nombre;
                $usuario["correo"] = $dataResult->pk_usr_correo;
                $genero = "Mujer";
                $usuario["foto"] = '<img id="imagen" style="width:100%" src="' . $foto . '" >';
                $usuario["genero"] = $genero;
                $usuario["accion"] = '<button id="btnamigos" type="button" class="btn btn-primary" disabled><i class="fa fa-check"></i> Amigos</button>';
            } else if ($dataResult->usr_foto == null && $dataResult->usr_genero == "M") {
                $foto = "img/perfil-hombre.jpg";
                $usuario["nombre"] = $dataResult->usr_nombre;
                $usuario["correo"] = $dataResult->pk_usr_correo;
                $genero = "Hombre";
                $usuario["foto"] = '<img id="imagen" style="width:100%" src="' . $foto . '" >';
                $usuario["genero"] = $genero;
                $usuario["accion"] = '<button id="btnamigos" type="button" class="btn btn-primary" disabled><i class="fa fa-check"></i> Amigos</button>';
            } else {
                $usuario["foto"] = '<img id="imagen" style="width:100%" src="' . $dataResult->usr_foto . '" >';
                $usuario["nombre"] = $dataResult->usr_nombre;
                $usuario["correo"] = $dataResult->pk_usr_correo;
                $usuario["genero"] = $dataResult->usr_genero;
                $usuario["accion"] = '<button id="btnamigos" type="button" class="btn btn-primary" disabled><i class="fa fa-check"></i> Amigos</button>';
            }
            $usuario_datos[] = $usuario;
        }



        return array("data" => $usuario_datos, "header" => $header);
    }

    private function listaamigos($correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select DISTINCT * from TBL_USUARIO u where pk_usr_correo in (select fk_amg_destino from TBL_AMIGOS where amg_estado = 'A' and fk_amg_origen='" . $correo . "') or pk_usr_correo in (select fk_amg_origen from TBL_AMIGOS where amg_estado = 'A' and fk_amg_destino='" . $correo . "')";
        $result = ConexionDB::consultar($sql);
        //retornar el objeto usuario
        $lista_usuario = array();
        while ($dataResult = $result->fetch_object()) {
            $user = new stdClass();
            $user->label = $dataResult->usr_nombre;
            $user->id = $dataResult->pk_usr_correo;
            array_push($lista_usuario, $user);
        }
        $response->setDatos($lista_usuario);
        return $response;
    }

    private function notificaciones($usuario) {

        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);

        $sql = "SELECT
      tia.id_invitacion_amigo as id,
      tu.usr_nombre as invita ,
      tp.pbl_descripcion as descripcion,
      tp.pbl_fecha as fecha
      FROM TBL_PUBLICACION tp INNER JOIN TBL_INVITAR_AMIGOS tia on tia.fk_pbl_id = tp.pk_pbl_id
      INNER JOIN TBL_USUARIO tu on tu.pk_usr_correo = tia.usuario_invita
      WHERE tp.pbl_fecha > NOW() AND tia.usuario_invitado = '" . $usuario . "' AND tia.invitacion_estado = 'P'";

        $result = ConexionDB::consultar($sql);
        $lista_notificacion = array();
        while ($dataResult = $result->fetch_object()) {
            $notificacion = new stdClass();
            $notificacion->id = $dataResult->id;
            $notificacion->user = $dataResult->invita;
            $notificacion->fecha = $this->conventirFecha($dataResult->fecha);
            $notificacion->descripcion = $dataResult->descripcion;
            array_push($lista_notificacion, $notificacion);
        }
        $response->setDatos($lista_notificacion);
        return $response;
    }

    private function guardar_asistencia($id_publicacion) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);

        $sql = "UPDATE TBL_INVITAR_AMIGOS
        SET invitacion_estado = 'A'
        WHERE id_invitacion_amigo = " . $id_publicacion;

        $result = ConexionDB::consultar($sql);
        $response->setDatos($result);
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

    private function amigos_mensaje($correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select DISTINCT * from TBL_USUARIO u where pk_usr_correo in (select fk_amg_destino from TBL_AMIGOS where amg_estado = 'A' and fk_amg_origen='" . $correo . "') or pk_usr_correo in (select fk_amg_origen from TBL_AMIGOS where amg_estado = 'A' and fk_amg_destino='" . $correo . "')";
        $arreglousuario = array();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario = new UsuarioDTO();
            $usuario->foto = $dataResult->usr_foto;
            $usuario->genero = $dataResult->usr_genero;
            $usuario->correo = $dataResult->pk_usr_correo;
            $usuario->nombre = $dataResult->usr_nombre;
            array_push($arreglousuario, $usuario);
        }
        $response->setDatos($arreglousuario);
        return $response;
    }

    private function enviar_mensaje($envia, $recibe, $mensaje) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO TBL_MENSAJES (fk_amg_envia, fk_amg_recibe, mensaje, mensaje_fecha) VALUES ('" . $envia . "', '" . $recibe . "', '" . $mensaje . "', NOW());";
        //echo $sql;
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    private function ver_mensaje($envia, $recibe) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "SELECT * FROM `tbl_mensajes` WHERE (`fk_amg_envia` = '" . $envia . "' and `fk_amg_recibe` = '" . $recibe . "' ) or (`fk_amg_envia` = '" . $recibe . "' and `fk_amg_recibe` = '" . $envia . "') order by `mensaje_fecha` asc;";
        $arreglomensajes = array();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $mensajes = new stdClass();
            $mensajes->envia = $dataResult->fk_amg_envia;
            $mensajes->recibe = $dataResult->fk_amg_recibe;
            $mensajes->mensaje = $dataResult->mensaje;
            $mensajes->fecha_mensaje = $dataResult->mensaje_fecha;
            array_push($arreglomensajes, $mensajes);
        }
        $response->setDatos($arreglomensajes);
        return $response;
    }

}

$usuario = new UsuarioLogic($metodo, $data);
?>
