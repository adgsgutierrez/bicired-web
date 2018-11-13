<?

class PublicacionLogic {

    public static function listar($correo) {
        $response = new RespuestaDTO();
        $sql = "SELECT * FROM TBL_PUBLICACION tp
            INNER JOIN TBL_USUARIO tu on tp.fk_pbl_usr_correo = tu.pk_usr_correo
            WHERE
            (tp.fk_pbl_usr_correo IN (
                SELECT ta.fk_amg_origen FROM TBL_AMIGOS ta WHERE ta.fk_amg_destino = '$correo' and ta.amg_estado = 'A')
                OR tp.fk_pbl_usr_correo IN (SELECT ta.fk_amg_destino FROM TBL_AMIGOS ta WHERE ta.fk_amg_origen = '$correo' and ta.amg_estado = 'A')
                OR tp.fk_pbl_usr_correo = '$correo' ) AND pbl_estado = 'A' ORDER BY pk_pbl_id DESC limit 10";
        $result = ConexionDB::consultar($sql);
        $publicaciones = array();
        while ($dataResult = $result->fetch_object()) {
            $publicacion = new PublicacionDTO();
            $publicacion->pk_pbl_id = $dataResult->pk_pbl_id;
            $publicacion->pbl_fecha = Utils::conventirFecha($dataResult->pbl_fecha);
            $publicacion->number_fecha = $dataResult->pbl_fecha;
            // $publicacion->pbl_ltd_origen = $dataResult->pbl_ltd_origen;
            // $publicacion->pbl_ltg_origen = $dataResult->pbl_ltg_origen;
            // $publicacion->pbl_ltd_destino = $dataResult->pbl_ltd_destino;
            // $publicacion->pbl_ltg_destino = $dataResult->pbl_ltg_destino;
            // $publicacion->pbl_descripcion = $dataResult->pbl_descripcion;
            $sql_1 = "SELECT * FROM TBL_RUTA_PUBLICACION WHERE id_publicacion = '" . $dataResult->pk_pbl_id . "'";
            $ruta = array();
            $result_1 = ConexionDB::consultar($sql_1);
            while ($dataResult_1 = $result_1->fetch_object()) {
                array_push($ruta, array(
                    "latitud" => $dataResult_1->ruta_latitud_origen,
                    "longitud" => $dataResult_1->ruta_longitud_origen
                ));
            }

            if (sizeof($ruta) == 0) {
                array_push($ruta, array(
                    "latitud" => $dataResult->pbl_ltd_origen,
                    "longitud" => $dataResult->pbl_ltg_origen
                ));
                array_push($ruta, array(
                    "latitud" => $dataResult->pbl_ltd_destino,
                    "longitud" => $dataResult->pbl_ltg_destino
                ));
                // $publicacion->pbl_ltd_origen = $dataResult->pbl_ltd_origen;
                // $publicacion->pbl_ltg_origen = $dataResult->pbl_ltg_origen;
                // $publicacion->pbl_ltd_destino = $dataResult->pbl_ltd_destino;
                // $publicacion->pbl_ltg_destino = $dataResult->pbl_ltg_destino;
                // $publicacion->pbl_descripcion = $dataResult->pbl_descripcion;
            }
            $publicacion->pbl_descripcion = $dataResult->pbl_descripcion;
            $publicacion->pbl_ruta = $ruta;
            $publicacion->fk_pbl_usr_correo = $dataResult->usr_nombre;
            array_push($publicaciones, $publicacion);
        }
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $response->setDatos($publicaciones);
        return $response;
    }

    public static function registar_publicacion($fecha, $ubicacion, $descripcion, $usuario) {
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        $sql = "insert into TBL_PUBLICACION(pbl_fecha,pbl_descripcion,pbl_estado,fk_pbl_usr_correo) "
                . "values('" . $fecha . "','" . $descripcion . "','A','" . $usuario . "') ";
        //echo $sql;
        $result = ConexionDB::consultar($sql);
        if ($result) {
            $sql_2 = "select p.pk_pbl_id as id,u.usr_nombre as nombre,p.pbl_fecha as fecha from TBL_PUBLICACION p inner join TBL_USUARIO u on u.pk_usr_correo=p.fk_pbl_usr_correo order by p.pk_pbl_id desc limit 1;";
            $result_1 = ConexionDB::consultar($sql_2);
            $publicaciones = array();
            while ($dataResult = $result_1->fetch_object()) {
                $publicacion = new stdClass();
                $publicacion->id = $dataResult->id;
                $publicacion->nombre = $dataResult->nombre;
                $publicacion->fecha = $dataResult->fecha;
                array_push($publicaciones, $publicacion);
            }
            $sql_3 = "insert into TBL_RUTA_PUBLICACION(ruta_latitud_origen , ruta_longitud_origen , id_publicacion) values ";
            for ($j = 0; $j < sizeof($ubicacion); $j++) {
                $sql_3 = $sql_3 . "(" . $ubicacion[$j]->latitud . " , " . $ubicacion[$j]->longitud . " , " . $publicacion->id . ")";
                if (($j + 1 ) < sizeof($ubicacion)) {
                    $sql_3 = $sql_3 . ',';
                }
            }
            //echo $sql;
            $result_2 = ConexionDB::consultar($sql_3);
            //$response->setDatos($publicaciones);
            if ($result_2) {
                $response->setDatos($publicaciones);
            }
        } else {
            $response->setCodigo(Constante::ERROR_GENERAL_CODE);
            $response->setMensaje(Constante::ERROR_GENERAL_SMS);
        }
        return $response;
    }

    public static function notificar_amigos($invitados, $usuario, $idpublicacion, $mensaje) {
        for ($index = 0; $index < count($invitados); $index++) {
            $sql = "INSERT INTO TBL_NOTIFICACIONES (mensaje,env_notificacion,rec_notificacion,estado_notificacion,tipo_notificacion,id_dato_notificacion) VALUES ('" . $mensaje . "','" . $usuario . "','" . $invitados[$index] . "','P','publicacion'," . intval($idpublicacion) . ")";
            $result = ConexionDB::consultar($sql);
        }
        $response = new RespuestaDTO();
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_MS);
        return $response;
    }

    public static function consultarImagenes($publicacion) {
        $response = new RespuestaDTO();
        $sql = "SELECT * FROM TBL_FOTOGRAFIAS tp INNER JOIN TBL_USUARIO tu on tp.correo = tu.pk_usr_correo WHERE publicacion= '" . $publicacion . "'";
        $result = ConexionDB::consultar($sql);
        $fotos = array();
        while ($dataResult = $result->fetch_object()) {
            $foto = new stdClass();
            $foto->fecha = Utils::conventirFecha($dataResult->fecha);
            $foto->imagenes = $dataResult->imagen;
            $foto->usuario = $dataResult->usr_nombre;
            array_push($fotos, $foto);
        }
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_CODE);
        $response->setDatos($fotos);
        return $response;
    }

    public static function insertar_megusta($id, $correo) {
        $response = new RespuestaDTO();
        $sql = "insert into TBL_MEGUSTA (fk_pbl_id,estado_me_gusta,persona_me_gusta)VALUES (" . $id . ",'A','" . $correo . "')";
        $result = ConexionDB::consultar($sql);
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_CODE);
        return $response;
    }

    public static function actualizar_megusta($id, $correo) {
        $response = new RespuestaDTO();
        $sql = "delete from TBL_MEGUSTA where persona_me_gusta = '" . $correo . "' and fk_pbl_id=" . $id . "";
        $result = ConexionDB::consultar($sql);
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_CODE);
        return $response;
    }

    public static function mostrar_megusta($id, $correo) {
        $response = new RespuestaDTO();
        $sql = "select * from TBL_MEGUSTA where estado_me_gusta = 'A' and persona_me_gusta = '" . $correo . "'  and fk_pbl_id = " . $id . "";
        $result = ConexionDB::consultar($sql);
        $megustas = array();
        while ($dataResult = $result->fetch_object()) {
            $megusta = new stdClass();
            $megusta->fk_pbl_id = $dataResult->fk_pbl_id;
            $megusta->estado_me_gusta = $dataResult->estado_me_gusta;
            $megusta->persona_me_gusta = $dataResult->persona_me_gusta;
            array_push($megustas, $megusta);
        }
        $response->setCodigo(Constante::EXITOSO_CODE);
        $response->setMensaje(Constante::EXITOSO_CODE);
        if ($result) {
            $response->setDatos($megustas);
        } else {
            $response->setDatos($noexiste = array());
        }
        return $response;
    }

}

?>
