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
    const SERVIDOR_DB = 'localhost';
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

}
?>
