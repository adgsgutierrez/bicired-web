<?php
/**
 * Esta clase es la encargada mapear el objeto de respuesta generico para estandarizar los servicios
 * @author  Aric Gutierrez
 * @date 22 Nov 2017
 * @version 1.0
 **/
class RespuestaDTO implements JsonSerializable{

  private $codigo;
  private $datos;
  private $mensaje;

  public function setCodigo($code){
    $this->codigo = $code;
  }
  public function getCodigo(){
    return $this->codigo;
  }
  public function setMensaje($sms){
    $this->mensaje = $sms;
  }
  public function getMensaje(){
    return $this->mensaje;
  }
  public function setDatos($data){
    $this->datos = $data;
  }
  public function getDatos(){
    return $this->datos;
  }
  public function jsonSerialize() {
    return [
      "codigo" => $this->codigo,
      "mensaje" => $this->mensaje,
      "datos" => $this->datos
    ];
  }
}
?>
