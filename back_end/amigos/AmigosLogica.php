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
        $result = ConexionDB::consultar($sql);
        if (!$result) {
            $response->setCodigo(Constante::ERROR_REGISTRO_CD);
            $response->setMensaje(Constante::ERROR_REGISTRO_MS);
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

    public static function publicar_mensaje($id, $correo, $mensaje) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "INSERT INTO TBL_COMUNIDAD_MENSAJES (fk_id_comunidad,mensaje,integrante) VALUES (" . $id . ",'" . $mensaje . "','" . $correo . "')";
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
        $result = ConexionDB::consultar($sql);
        while ($dataResult = $result->fetch_object()) {
            $usuario = new stdClass();
            $usuario->fk_id_comunidad = $dataResult->fk_id_comunidad;
            $usuario->mensaje = $dataResult->mensaje;
            $usuario->usr_nombre = $dataResult->usr_nombre;
            $usuario->usr_genero = $dataResult->usr_genero;
            $usuario->usr_foto = $dataResult->usr_foto;
            array_push($arreglo_comunidades, $usuario);
        }
        $response->setDatos($arreglo_comunidades);
        return $response;
    }

}

?>
