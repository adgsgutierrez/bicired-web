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
    const SERVIDOR_DB = 'dxexperience';
    const PUERTO_DB = '3306' ;
    const BASE_DATOS = 'dxexperi_bici' ;
    const USUARIO_DB = 'dxexperi_ubici' ;
    const CLAVE_DB = 'Z5vgL2afI6yU' ;

  /** Constantes de control **/
    const EXITOSO_CODE = 200 ;
    const EXITOSO_MS = 'Servicio Satisfactorio';

    const ERROR_GENERAL_CODE = 300;
    const ERROR_GENERAL_SMS = "ERROR GENERAL";

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

    const CREATE_TABLE_TBL_FOTOGRAFIAS =  " CREATE TABLE IF NOT EXISTS `TBL_FOTOGRAFIAS` ( `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, `fecha` datetime NOT NULL, `correo` varchar(150) NOT NULL, `imagen` varchar(150) NOT NULL,
    `publicacion` int(10) UNSIGNED NOT NULL, PRIMARY KEY (`id`), KEY `fk_fotografia` (`publicacion`), FOREIGN KEY (`publicacion`) REFERENCES `TBL_PUBLICACION` (`pk_pbl_id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

    const CREATE_TABLE_TBL_PUBLICACION =  "CREATE TABLE IF NOT EXISTS `TBL_PUBLICACION` ( `pk_pbl_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `pbl_fecha` datetime NOT NULL, `pbl_ltd_origen` double NOT NULL, `pbl_ltg_origen` double NOT NULL, `pbl_ltd_destino` double NOT NULL, `pbl_ltg_destino` double NOT NULL, `pbl_descripcion` text, `pbl_estado` enum('A','S') DEFAULT NULL,
    `fk_pbl_usr_correo` varchar(150) DEFAULT NULL, PRIMARY KEY (`pk_pbl_id`), KEY `fk_pbl_usr_correo` (`fk_pbl_usr_correo`), FOREIGN KEY (`fk_pbl_usr_correo`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

    const CREATE_TABLE_TBL_USUARIO = "CREATE TABLE IF NOT EXISTS `TBL_USUARIO` ( `pk_usr_correo` varchar(150) NOT NULL, `usr_nombre` text,
    `usr_genero` enum('M','F') DEFAULT NULL, `usr_clave` text, `usr_login` enum('F','G','B') DEFAULT NULL, `usr_foto` text,   PRIMARY KEY (`pk_usr_correo`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

    const CREATE_TABLE_TBL_INVITAR_AMIGOS = "CREATE TABLE IF NOT EXISTS TBL_INVITAR_AMIGOS ( `id_invitacion_amigo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, `fk_pbl_id` int(10) UNSIGNED DEFAULT NULL, `usuario_invita` varchar(150) DEFAULT NULL,`usuario_invitado` varchar(150) DEFAULT NULL,
    `invitacion_estado` enum('A','P') DEFAULT NULL, KEY `id_invitacion_amigo` (`id_invitacion_amigo`),KEY `fk_pbl_id` (`fk_pbl_id`), FOREIGN KEY (`fk_pbl_id`) REFERENCES `TBL_PUBLICACION` (`pk_pbl_id`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

    const CREATE_TABLE_TBL_MENSAJES = "CREATE TABLE IF NOT EXISTS TBL_MENSAJES (`fk_amg_envia` varchar(150) DEFAULT NULL,`fk_amg_recibe` varchar(150) DEFAULT NULL,`mensaje` varchar(255) DEFAULT NULL,
    `mensaje_fecha` date DEFAULT NULL, FOREIGN KEY (`fk_amg_envia`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`), FOREIGN KEY (`fk_amg_recibe`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

    const CREATE_TABLE_TBL_AMIGOS = "CREATE TABLE IF NOT EXISTS TBL_AMIGOS (`fk_amg_origen` varchar(150) DEFAULT NULL, `fk_amg_destino` varchar(150) DEFAULT NULL,`amg_fecha` date DEFAULT NULL,`amg_estado` enum('A','S') DEFAULT NULL,`actu_estado` varchar(255) NOT NULL,
    KEY `fk_amg_origen` (`fk_amg_origen`), KEY `fk_amg_destino` (`fk_amg_destino`), FOREIGN KEY (`fk_amg_origen`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`), FOREIGN KEY (`fk_amg_destino`) REFERENCES `TBL_USUARIO` (`pk_usr_correo`) ) ENGINE=InnoDB DEFAULT CHARSET=latin1;";
}
?>
