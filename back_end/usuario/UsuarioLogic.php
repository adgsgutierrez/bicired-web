<?

class UsuarioLogic{

      public static function listar() {
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

      public static function consultar_sesion($correo, $clave, $plataforma, $nombre_usuario, $foto) {
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

      public static function registrar_usuario($correo, $nombre, $genero, $clave) {
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

      public static function lista_usuarios($correo) {
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

      public static function datos_perfil($correo) {
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

      public static function actualizar_perfil($correo, $nombre, $genero) {
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

      public static function lista_amigos_bloqueados($correo) {
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

      public static function amigos($correo) {
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

      public static function listaamigos($correo) {
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

      public static function notificaciones($usuario) {

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
              $notificacion->fecha = Utils::conventirFecha($dataResult->fecha);
              $notificacion->descripcion = $dataResult->descripcion;
              array_push($lista_notificacion, $notificacion);
          }
          $response->setDatos($lista_notificacion);
          return $response;
      }

      public static function guardar_asistencia($id_publicacion) {
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

      public static function amigos_mensaje($correo) {
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

      public static function enviar_mensaje($envia, $recibe, $mensaje) {
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

      public static function ver_mensaje($envia, $recibe) {
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
?>
