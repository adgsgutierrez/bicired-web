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
        $sql_1 = "create TABLE TBL_USUARIO( pk_usr_correo varchar(150) primary key, usr_nombre text, usr_genero ENUM('M','F'), usr_clave text, usr_login ENUM('F','G','B'), usr_foto text )";
        $sql_2 = "create TABLE TBL_PUBLICACION( pk_pbl_id int PRIMARY KEY AUTO_INCREMENT, pbl_fecha datetime not null, pbl_ltd_origen double not null, pbl_ltg_origen double not null, pbl_ltd_destino double not null, pbl_ltg_destino double not null, pbl_descripcion text, pbl_estado ENUM('A', 'S'), fk_pbl_usr_correo varchar(150), FOREIGN KEY (fk_pbl_usr_correo) references TBL_USUARIO (pk_usr_correo) )";
        $sql_3 = "create TABLE TBL_AMIGOS ( fk_amg_origen varchar(150), fk_amg_destino varchar(150), amg_fecha date, amg_estado varchar(100), actu_estado varchar(150), FOREIGN KEY (fk_amg_origen) references TBL_USUARIO (pk_usr_correo), FOREIGN KEY (fk_amg_destino) references TBL_USUARIO (pk_usr_correo) )";

        $link = new mysqli(Constante::SERVIDOR_DB, Constante::USUARIO_DB, Constante::CLAVE_DB, Constante::BASE_DATOS);
        $link->set_charset("utf8");
        $result = $link->query($sql_1);
        $result = $link->query($sql_2);
        $result = $link->query($sql_3);
    }

}

?>
