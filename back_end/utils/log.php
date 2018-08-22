<?php
/**
 * Esta clase es la encargada de crear los archivos log del sistema los cuales generaran la traza del sistema
 * @author  Aric Gutierrez
 * @date 22 Nov 2017
 * @version 1.0
 **/
class Log{

	public function __construct(){
			// $this->path     =  "log/";
			// $this->filename = "log_".date("Y_m_d");
			// $this->date     = date("Y-m-d");
			// $this->ip       = ($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 0;
		}
		public function sql(){
			// $this->path     =  "log/";
			// $this->filename =  "logSQL_".date("Y_m_d");
			// $this->date     = date("Y-m-d");
			// $this->ip       = ($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 0;
		}
		public function insert($text, $desde){
			// $desde = ($desde) ? $desde : ' Log ';
			// $log    = date("Y-m-d H:i:s") . " [Solicitado desde] " . $this->ip . " [".$desde."] " . $text . PHP_EOL;
			// $nameFile = $this->path . $this->filename . $date . ".log";
			// $fp = fopen($nameFile,"a+");
			// fputs($fp,$log);
			// fclose($fp);
			// echo $result;
			// return $result;
		}
}
?>
