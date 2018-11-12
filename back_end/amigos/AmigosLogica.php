<?

class AmigoLogic {

    public static function anadir_amigo($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO TBL_AMIGOS (fk_amg_origen, fk_amg_destino, amg_fecha, amg_estado,actu_estado) VALUES ('" . $correolog . "', '" . $correoami . "',SYSDATE(), 'A','');";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    public static function verificar($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select fk_amg_origen,fk_amg_destino from TBL_AMIGOS where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "'";
        $usuario = new AmigosDTO();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario->fk_amg_origen = $dataResult->fk_amg_origen;
            $usuario->fk_amg_destino = $dataResult->fk_amg_destino;
        }
        $response->setDatos($usuario);
        return $response;
    }

    public static function eliminar_amigo($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "DELETE from TBL_AMIGOS where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "'";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    public static function bloquear_amigo($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "update TBL_AMIGOS set amg_estado = 'S' , actu_estado = '" . $correolog . "' where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or (fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "')";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    public static function desbloquear_amigo($correolog, $correoami) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "update TBL_AMIGOS set amg_estado = 'A' , actu_estado = '' where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "'";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    public static function crear_comunidad($correolog, $nombre) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO TBL_CREAR_COMUNIDAD (nombre_comunidad, usuario_crea_comunidad) VALUES ('" . $nombre . "', '" . $correolog . "')";
        $id = "";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        } else {
            $sql_2 = "SELECT MAX(id_comunidad) as id FROM TBL_CREAR_COMUNIDAD";
            $result_1 = ConexionDB::consultar($sql_2);
            while ($dataResult = $result_1->fetch_object()) {
                $id = $dataResult->id;
            }
            $sql2 = "INSERT INTO TBL_INTEGRANTE_COMUNIDAD (fk_id_comunidad, integrante,estado_integrante) VALUES ('" . $id . "', '" . $correolog . "', 'A')";
            $result = ConexionDB::consultar($sql2);
        }
        return $response;
    }

    public static function lista_comunidades() {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select * from TBL_CREAR_COMUNIDAD";
        $arreglo_comunidades = array();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario = new stdClass();
            $usuario->id_comunidad = $dataResult->id_comunidad;
            $usuario->nombre_comunidad = $dataResult->nombre_comunidad;
            $usuario->usuario_crea_comunidad = $dataResult->usuario_crea_comunidad;
            array_push($arreglo_comunidades, $usuario);
        }
        $response->setDatos($arreglo_comunidades);
        return $response;
    }

    public static function lista_integrante_comunidad($id, $correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select * from TBL_INTEGRANTE_COMUNIDAD where fk_id_comunidad=" . $id . " and integrante='" . $correo . "' and estado_integrante='A'";
        $arreglo_comunidades = array();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario = new stdClass();
            $usuario->id_comunidad = $dataResult->fk_id_comunidad;
            $usuario->integrante = $dataResult->integrante;
            array_push($arreglo_comunidades, $usuario);
        }
        $response->setDatos($arreglo_comunidades);
        return $response;
    }

    public static function actualizar_integrante($id, $correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "DELETE FROM TBL_INTEGRANTE_COMUNIDAD where fk_id_comunidad=" . $id . " and integrante='" . $correo . "'";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    public static function insertar_integrante($id, $correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO TBL_INTEGRANTE_COMUNIDAD (fk_id_comunidad, integrante,estado_integrante) VALUES ('" . $id . "', '" . $correo . "', 'A')";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    public static function publicar_mensaje($id, $correo, $mensaje, $tipo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO TBL_COMUNIDAD_MENSAJES (fk_id_comunidad,mensaje,integrante,tipo_mensaje) VALUES (" . $id . ",'" . $mensaje . "','" . $correo . "','" . $tipo . "')";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        }
        return $response;
    }

    public static function mostrar_publicaciones($id) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select * from TBL_COMUNIDAD_MENSAJES cm
inner join TBL_USUARIO u on u.pk_usr_correo=cm.integrante where fk_id_comunidad=" . $id . " order by id_comunidad_mensaje desc";
        $arreglo_comunidades = array();
        $arreglo_id_mensaje = array();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario = new stdClass();
            $usuario->fk_id_comunidad = $dataResult->fk_id_comunidad;
            $usuario->id_mensaje = $dataResult->id_comunidad_mensaje;
            $usuario->mensaje = $dataResult->mensaje;
            $usuario->tipo = $dataResult->tipo_mensaje;
            $usuario->usr_nombre = $dataResult->usr_nombre;
            $usuario->usr_genero = $dataResult->usr_genero;
            $usuario->usr_foto = $dataResult->usr_foto;
            $arreglo_id_mensaje["mensaje"][] = $dataResult->id_comunidad_mensaje;
            array_push($arreglo_comunidades, $usuario);
        }
        if (!empty($arreglo_comunidades)) {
            $separado_por_comas = implode(",", $arreglo_id_mensaje["mensaje"]);
            $sql2 = "select * from TBL_COMUNIDAD_COMENTARIOS cm
         inner join TBL_USUARIO u on u.pk_usr_correo=cm.integrante where fk_id_comunidad_mensajes in (" . $separado_por_comas . ") order by id_comunidad_comentarios desc";
            $result2 = ConexionDB::consultar($sql2);
            if ($result2) {
                $arreglo_co = array();
                while ($dataResult2 = $result2->fetch_object()) {
                    $comentarios = new stdClass();
                    $comentarios->id_comentarios = $dataResult2->id_comunidad_comentarios;
                    $comentarios->id_mensajes = $dataResult2->fk_id_comunidad_mensajes;
                    $comentarios->mensaje = $dataResult2->comentario;
                    $comentarios->usr_nombre = $dataResult2->usr_nombre;
                    $comentarios->usr_genero = $dataResult2->usr_genero;
                    $comentarios->usr_foto = $dataResult2->usr_foto;
                    array_push($arreglo_co, $comentarios);
                }
                $response->setDatos(array("mensajes" => $arreglo_comunidades, "comentarios" => $arreglo_co));
            } else {
                $response->setDatos($arreglo_comunidades);
            }
        }
        return $response;
    }

    public static function verificacion_miembro($correo, $id) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "select * from TBL_INTEGRANTE_COMUNIDAD where fk_id_comunidad=" . $id . " and integrante='" . $correo . "'";
        $arreglo_comunidades = array();
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $integrante = new stdClass();
            $integrante->fk_id_comunidad = $dataResult->fk_id_comunidad;
            $integrante->integrante = $dataResult->integrante;
            array_push($arreglo_comunidades, $integrante);
        }
        $response->setDatos($arreglo_comunidades);

        return $response;
    }

    public static function comentarios($id, $mensaje, $correo) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO TBL_COMUNIDAD_COMENTARIOS (fk_id_comunidad_mensajes,comentario,integrante) VALUES (" . $id . ",'" . $mensaje . "','" . $correo . "')";
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
        } else {
            $sql2 = "select * from TBL_COMUNIDAD_COMENTARIOS cm
         inner join TBL_USUARIO u on u.pk_usr_correo=cm.integrante where fk_id_comunidad_mensajes=" . $id . " order by id_comunidad_comentarios desc";
            $result = ConexionDB::consultar($sql2);
            $arreglo_comunidades = array();
            while ($dataResult = $result->fetch_object()) {
                $comentarios = new stdClass();
                $comentarios->id_comentarios = $dataResult->id_comunidad_comentarios;
                $comentarios->mensaje = $dataResult->comentario;
                $comentarios->usr_nombre = $dataResult->usr_nombre;
                $comentarios->usr_genero = $dataResult->usr_genero;
                $comentarios->usr_foto = $dataResult->usr_foto;
                array_push($arreglo_comunidades, $comentarios);
            }
            $response->setDatos($arreglo_comunidades);
        }
        return $response;
    }

}

?>
