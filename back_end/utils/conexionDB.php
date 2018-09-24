<?php

/**
 * Esta clase es la encargada de generar las conexiones a la base de datos y cualquier tipo de consulta
 * @author  Aric Gutierrez
 * @date 22 Nov 2017
 * @version 1.0
 * */
class ConexionDB {

    private $link;
    private $log;

    public function initDataBase() {
        $link = new mysqli(Constante::SERVIDOR_DB, Constante::USUARIO_DB, Constante::CLAVE_DB);
        $query = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME=" . Constante::BASE_DATOS;
        $result = $link->query($query);
        if ($result) {
//        if (true ==  false) {
            /** La bases de datos Existe* */
        } else {
            $sql = "create database " . Constante::BASE_DATOS;
            $result = $link->query($sql);
            ConexionDB::createTables();
        }
    }

    public static function consultar($string) {
        //$log = new Log();
        //$log->sql();
        //$log->insert('Consultando el sql [' . $string . ']', 'conexionDB.php');
        // Conectando al servidor de Base de datos
        //echo $string;
        $link = new mysqli(Constante::SERVIDOR_DB, Constante::USUARIO_DB, Constante::CLAVE_DB, Constante::BASE_DATOS);
        $link->set_charset("utf8");
        $result = $link->query($string);
        //copiando los datos para retornarlos
        $datos = $result;
        //returnando el resultado
        return $datos;
    }

    private function createTables() {
        $sql_1 = "CREATE TABLE IF NOT EXISTS TBL_AMIGOS (
      `fk_amg_origen` varchar(150) DEFAULT NULL,
      `fk_amg_destino` varchar(150) DEFAULT NULL,
      `amg_fecha` date DEFAULT NULL,
      `amg_estado` enum('A','S') DEFAULT NULL,
      `actu_estado` varchar(255) NOT NULL,
      KEY `fk_amg_origen` (`fk_amg_origen`),
      KEY `fk_amg_destino` (`fk_amg_destino`),
      FOREIGN KEY (`fk_amg_origen`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`),
      FOREIGN KEY (`fk_amg_destino`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

        $sql_2 = " CREATE TABLE IF NOT EXISTS `TBL_FOTOGRAFIAS` (
      `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
      `fecha` datetime NOT NULL,
      `correo` varchar(150) NOT NULL,
      `imagen` varchar(150) NOT NULL,
      `publicacion` int(10) UNSIGNED NOT NULL,
      PRIMARY KEY (`id`),
      KEY `fk_fotografia` (`publicacion`),
      FOREIGN KEY (`publicacion`) REFERENCES `TBL_PUBLICACION` (`pk_pbl_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

        $sql_3 = "CREATE TABLE IF NOT EXISTS `TBL_PUBLICACION` (
      `pk_pbl_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      `pbl_fecha` datetime NOT NULL,
      `pbl_ltd_origen` double NOT NULL,
      `pbl_ltg_origen` double NOT NULL,
      `pbl_ltd_destino` double NOT NULL,
      `pbl_ltg_destino` double NOT NULL,
      `pbl_descripcion` text,
      `pbl_estado` enum('A','S') DEFAULT NULL,
      `fk_pbl_usr_correo` varchar(150) DEFAULT NULL,
      PRIMARY KEY (`pk_pbl_id`),
      KEY `fk_pbl_usr_correo` (`fk_pbl_usr_correo`),
      FOREIGN KEY (`fk_pbl_usr_correo`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

        $sql_4 = "CREATE TABLE IF NOT EXISTS `TBL_USUARIO` (
      `pk_usr_correo` varchar(150) NOT NULL,
      `usr_nombre` text,
      `usr_genero` enum('M','F') DEFAULT NULL,
      `usr_clave` text,
      `usr_login` enum('F','G','B') DEFAULT NULL,
      `usr_foto` text,
      PRIMARY KEY (`pk_usr_correo`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

        $sql_5 = "CREATE TABLE IF NOT EXISTS TBL_INVITAR_AMIGOS (
      `id_invitacion_amigo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      `fk_pbl_id` int(10) UNSIGNED DEFAULT NULL,
      `usuario_invita` varchar(150) DEFAULT NULL,
      `usuario_invitado` varchar(150) DEFAULT NULL,
      `invitacion_estado` enum('A','P') DEFAULT NULL,
      KEY `id_invitacion_amigo` (`id_invitacion_amigo`),
      KEY `fk_pbl_id` (`fk_pbl_id`),
      FOREIGN KEY (`fk_pbl_id`) REFERENCES `TBL_PUBLICACION` (`pk_pbl_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

        $sql_6 = "CREATE TABLE IF NOT EXISTS TBL_MENSAJES (
      `fk_amg_envia` varchar(150) DEFAULT NULL,
      `fk_amg_recibe` varchar(150) DEFAULT NULL,
      `mensaje` varchar(255) DEFAULT NULL,
      `mensaje_fecha` date DEFAULT NULL,
      FOREIGN KEY (`fk_amg_envia`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`),
      FOREIGN KEY (`fk_amg_recibe`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

        $link = new mysqli(Constante::SERVIDOR_DB, Constante::USUARIO_DB, Constante::CLAVE_DB, Constante::BASE_DATOS);
        $link->set_charset("utf8");
//        echo 'consulta';
        $result = $link->query($sql_4);
        $result = $link->query($sql_1);
        $result = $link->query($sql_3);
        $result = $link->query($sql_2);
        $result = $link->query($sql_5);
        $result = $link->query($sql_6);
    }

}

?>
