<?php
/**
 * Esta clase es la encargada de controlar las variables constantes del sistema y mensajes de retorno
 * a la plataforma
 * @author  Aric Gutierrez
 * @date 22 Nov 2017
 * @version 1.0
 **/
class Constante{

  /** Constantes del sistema**/
    const SERVIDOR_DB = '192.168.64.3';
    const PUERTO_DB = '3306' ;
    const BASE_DATOS = 'bicired' ;
    const USUARIO_DB = 'root' ;
    const CLAVE_DB = '' ;

  /** Constantes de control **/
    const EXITOSO_CODE = 200 ;
    const EXITOSO_MS = 'Servicio Satisfactorio';

    const ERROR_PARAMETROS_CD = 205;
    const ERROR_PARAMETROS_MS = "ERROR, NO SE HAN ENCONTRADO PARAMETROS";

    const ERROR_LOGIN_MS = "ERROR DE USUARIO y/O CLAVE";
    const ERROR_LOGIM_CD = 301;

    const ERROR_REGISTRO_MS = "EL USUARIO YA SE ENCUENTRA EN LA BASE DE DATOS";
    const ERROR_REGISTRO_CD = 302;

    const ERROR_NO_DATA_CODE = 303;
    const ERROR_NO_DATA_SMS = "NO SE ENCONTRÓ FOTOGRAFIA";

    const ERROR_NO_SAVE_CODE = 304;
    const ERROR_NO_SAVE_SMS = "NO PUDIMOS GUARDAR LA FOTO, INTENTALO DE NUEVO";

    const ERROR_NO_IMAGEN_SAVE_CODE = 305;
    const ERROR_NO_IMAGEN_SAVE_SMS = "NO PUDIMOS OBTENER LA IMAGEN, INTENTALO DE NUEVO";

    const CREATE_DATABASE = "CREATE DATABASE IF NOT EXISTS `bicired` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
    USE `bicired`;
    CREATE TABLE IF NOT EXISTS `TBL_AMIGOS` (
      `fk_amg_origen` varchar(150) DEFAULT NULL,
      `fk_amg_destino` varchar(150) DEFAULT NULL,
      `amg_fecha` date DEFAULT NULL,
      `amg_estado` enum('A','S') DEFAULT NULL,
      `actu_estado` varchar(5) NOT NULL,
      KEY `fk_amg_origen` (`fk_amg_origen`),
      KEY `fk_amg_destino` (`fk_amg_destino`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    CREATE TABLE IF NOT EXISTS `TBL_FOTOGRAFIAS` (
      `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
      `fecha` datetime NOT NULL,
      `correo` varchar(150) NOT NULL,
      `imagen` varchar(150) NOT NULL,
      `publicacion` int(10) UNSIGNED NOT NULL,
      PRIMARY KEY (`id`),
      KEY `fk_fotografia` (`publicacion`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    CREATE TABLE IF NOT EXISTS `TBL_PUBLICACION` (
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
      KEY `fk_pbl_usr_correo` (`fk_pbl_usr_correo`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    CREATE TABLE IF NOT EXISTS `TBL_USUARIO` (
      `pk_usr_correo` varchar(150) NOT NULL,
      `usr_nombre` text,
      `usr_genero` enum('M','F') DEFAULT NULL,
      `usr_clave` text,
      `usr_login` enum('F','G','B') DEFAULT NULL,
      `usr_foto` text,
      PRIMARY KEY (`pk_usr_correo`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    ALTER TABLE `TBL_AMIGOS`
      ADD CONSTRAINT `TBL_AMIGOS_ibfk_1` FOREIGN KEY (`fk_amg_origen`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`),
      ADD CONSTRAINT `TBL_AMIGOS_ibfk_2` FOREIGN KEY (`fk_amg_destino`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`);
    ALTER TABLE `TBL_FOTOGRAFIAS`
      ADD CONSTRAINT `fk_fotografia` FOREIGN KEY (`publicacion`) REFERENCES `TBL_PUBLICACION` (`pk_pbl_id`);
    ALTER TABLE `TBL_PUBLICACION`
      ADD CONSTRAINT `TBL_PUBLICACION_ibfk_1` FOREIGN KEY (`fk_pbl_usr_correo`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`);
    COMMIT;";
}
?>
