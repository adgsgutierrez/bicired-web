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
        //if (true ==  false) {
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
        $link = new mysqli(Constante::SERVIDOR_DB, Constante::USUARIO_DB, Constante::CLAVE_DB, Constante::BASE_DATOS);
        $link->set_charset("utf8");
        $result = $link->query($string);
        //copiando los datos para retornarlos
        $datos = $result;
        //returnando el resultado
        return $datos;
    }

    private static function createTables() {
        $link = new mysqli(Constante::SERVIDOR_DB, Constante::USUARIO_DB, Constante::CLAVE_DB, Constante::BASE_DATOS);
        $link->set_charset("utf8");
        //echo 'consulta';
        $result = $link->query(Constante::CREATE_DATABASE);
    }

}

?>
