<?

class Utils {

  public static function conventirFecha($input) {
      $data = explode(' ', $input);
      $mesLetra = "";
      $fecha = explode('-', $data[0]);
      switch ($fecha[1]) {
          case '01':
              $mesLetra = "Enero";
              break;
          case '02':
              $mesLetra = "Febrero";
              break;
          case '03':
              $mesLetra = "Marzo";
              break;
          case '04':
              $mesLetra = "Abril";
              break;
          case '05':
              $mesLetra = "Mayo";
              break;
          case '06':
              $mesLetra = "Junio";
              break;
          case '07':
              $mesLetra = "Julio";
              break;
          case '08':
              $mesLetra = "Agosto";
              break;
          case '09':
              $mesLetra = "Septiembre";
              break;
          case '10':
              $mesLetra = "Octubre";
              break;
          case '11':
              $mesLetra = "Noviembre";
              break;
          case '12':
              $mesLetra = "Diciembre";
              break;
      }
      list($horaM, $minuto, $segundo) = explode(':', $data[1]);
      return $fecha[2] . " de " . $mesLetra . " del " . $fecha[0] . " a las " . $horaM . ":" . $minuto;
  }
}
?>
