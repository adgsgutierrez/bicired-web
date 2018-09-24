<?

class PublicacionLogic{

  public static function listar($correo) {
      $response = new RespuestaDTO();
      $sql = "SELECT * FROM TBL_PUBLICACION tp
            INNER JOIN TBL_USUARIO tu on tp.fk_pbl_usr_correo = tu.pk_usr_correo
            WHERE
            (tp.fk_pbl_usr_correo IN (
                SELECT ta.fk_amg_origen FROM TBL_AMIGOS ta WHERE ta.fk_amg_destino = '$correo' and ta.amg_estado = 'A')
                OR tp.fk_pbl_usr_correo IN (SELECT ta.fk_amg_destino FROM TBL_AMIGOS ta WHERE ta.fk_amg_origen = '$correo' and ta.amg_estado = 'A')
                OR tp.fk_pbl_usr_correo = '$correo' ) AND pbl_estado = 'A' ORDER BY pk_pbl_id DESC";
      $result = ConexionDB::consultar($sql);
      $publicaciones = array();
      while ($dataResult = $result->fetch_object()) {
          $publicacion = new PublicacionDTO();
          $publicacion->pk_pbl_id = $dataResult->pk_pbl_id;
          $publicacion->pbl_fecha = Utils::conventirFecha($dataResult->pbl_fecha);
          $publicacion->number_fecha = $dataResult->pbl_fecha;
          $publicacion->pbl_ltd_origen = $dataResult->pbl_ltd_origen;
          $publicacion->pbl_ltg_origen = $dataResult->pbl_ltg_origen;
          $publicacion->pbl_ltd_destino = $dataResult->pbl_ltd_destino;
          $publicacion->pbl_ltg_destino = $dataResult->pbl_ltg_destino;
          $publicacion->pbl_descripcion = $dataResult->pbl_descripcion;
          $publicacion->fk_pbl_usr_correo = $dataResult->usr_nombre;
          array_push($publicaciones, $publicacion);
      }
      $response->setCodigo(Constante::EXITOSO_CODE);
      $response->setMensaje(Constante::EXITOSO_MS);
      $response->setDatos($publicaciones);
      return $response;
  }

  public static function registar_publicacion($fecha, $lt1, $ln1, $lt2, $ln2, $descripcion, $usuario) {
    $response = new RespuestaDTO();
    $response->setCodigo(Constante::EXITOSO_CODE);
    $response->setMensaje(Constante::EXITOSO_MS);
    $sql = "insert into TBL_PUBLICACION(pbl_fecha,pbl_ltd_origen,pbl_ltg_origen,pbl_ltd_destino,pbl_ltg_destino,pbl_descripcion,pbl_estado,fk_pbl_usr_correo) "
            . "values('" . $fecha . "'," . doubleval($lt1) . "," . doubleval($ln1) . "," . doubleval($lt2) . "," . doubleval($ln2) . ",'" . $descripcion . "','A','" . $usuario . "') ";
    $result = ConexionDB::consultar($sql);
    $id = "";
    if ($result) {
        $sql_2 = "SELECT MAX(pk_pbl_id) as id FROM TBL_PUBLICACION;";
        $result_1 = ConexionDB::consultar($sql_2);
        while ($dataResult = $result_1->fetch_object()) {
            $id = $dataResult->id;
        }
        $response->setDatos($publicaciones);
    }else{
      $response->setCodigo(Constante::ERROR_GENERAL_CODE);
      $response->setMensaje(Constante::ERROR_GENERAL_SMS);
    }
    return $response;
  }

  public static function invitar_amigos($invitados,$usuario,$idpublicacion){
      for ($index = 0; $index < count($invitados); $index++) {
          $sql="INSERT INTO TBL_INVITAR_AMIGOS(fk_pbl_id,usuario_invita,usuario_invitado,invitacion_estado) values (". intval($idpublicacion).",'".$usuario."','".$invitados[$index]."','P')";
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
}
?>
