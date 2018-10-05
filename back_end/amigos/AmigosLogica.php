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

}

?>
