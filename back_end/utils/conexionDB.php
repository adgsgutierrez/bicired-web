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

    public static function initDataBase() {
        $query = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME=" . Constante::BASE_DATOS;
        $result =ConexionDB::consultar($query);
        if ($result) {
            /** La bases de datos Existe* */
        } else {
            $sql = "create database " . Constante::BASE_DATOS;
            $result = ConexionDB::consultar($sql);
            if($result){
                $result = ConexionDB::consultar(Constantes::CREATE_TABLE_TBL_USUARIO);
                if($result){
                    $result = ConexionDB::consultar(Constantes::CREATE_TABLE_TBL_PUBLICACION);
                    if($result){
                        $result = ConexionDB::consultar(Constantes::CREATE_TABLE_TBL_FOTOGRAFIAS);
                        if($result){
                            $result = ConexionDB::consultar(Constantes::CREATE_TABLE_TBL_INVITAR_AMIGOS);
                            if($result){
                                $result = ConexionDB::consultar(Constantes::CREATE_TABLE_TBL_MENSAJES);
                                if($result){
                                    $result = ConexionDB::consultar(Constantes::CREATE_TABLE_TBL_AMIGOS);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public static function consultar($string) {
        // Conectando al servidor de Base de datos
        $link = new mysqli(Constante::SERVIDOR_DB, Constante::USUARIO_DB, Constante::CLAVE_DB, Constante::BASE_DATOS);
        $link->set_charset("utf8");
        $result = $link->query($string);
        //copiando los datos para retornarlos
        $datos = $result;
        //returnando el resultado
        return $datos;
    }
}

?>
