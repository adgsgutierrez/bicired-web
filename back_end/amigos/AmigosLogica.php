<?

class AmigoLogic{


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
          $sql = "update TBL_AMIGOS set amg_estado = 'S' , actu_estado = '".$correolog."' where fk_amg_origen = '" . $correolog . "' and fk_amg_destino = '" . $correoami . "' or (fk_amg_origen = '" . $correoami . "' and fk_amg_destino = '" . $correolog . "')";
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
}

?>
