$(function(){
  //------------------------------------------------------------------
  document.addEventListener("deviceready", onDeviceReady, false);
  //------------------------------------------------------------------
  function onDeviceReady() {

    var db = window.sqlitePlugin.openDatabase({name: "db_prueba.db"});
    //-----------------------------------------------------------------

    function crea_tabla_ladrillos(){
      //-----------------------------------------------------------------------------------------------------------------
      /*se hace una trasaccion en la bd, esto lleva un parametro tx que es un objeto con funciones.*/
      db.transaction(function(tx) {
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //crea una tabla llamada "test_table" ahora "nombres"
        //tx.executeSql('DROP TABLE IF EXISTS ladrillos');
        //crea la tabla con los campos y especificaciones, en este caso id y nombre
        tx.executeSql('CREATE TABLE IF NOT EXISTS ladrillos (id integer primary key, nombre text,alt_lad double,anch_lad double)');
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        /*inserta valores en la tabla, un insert normal
        tx.executeSql("INSERT INTO ladrillos (nombre,alt_lad,anch_lad) VALUES (?,?,?)", ["lad1",4.55,2.23], function(tx, res) {
        }, function(e) {
          console.log("ERROR: " + e.message);
        });*/
      });//cierra transaccion principal
      //-------------------------------------------------------------------------------------------------------------------
    };

    function ver_tabla_ladrillos(){
      //#################################################################################
      //inicia una segunda transaccion de tipo select para mostrar lo que se ha insertado
      db.transaction(function(tx) {

        tx.executeSql("select * from ladrillos;", [], function(tx, res) {
          //console.log(res.rows.item(0).nombre);

          //validar si existen campos, si no los hay mostrar mensaje de que no hay nada
          if(res.rows.length > 0){
              $("#res").html("");
              for(var i = 0;i <= res.rows.length;i++){
                //console.log(res.rows.item(i).nombre);
                $("#res").append('<li href="#" class="list-group-item">'+res.rows.item(i).nombre+'-'+res.rows.item(i).alt_lad+'-'+res.rows.item(i).anch_lad+'</li>');
              };
          }else{
              $("#res").append('<li href="#" class="list-group-item">En el momento no hay ladrillos creados.</li>');
          };

        });

      });//cierra segunda transaccion
      //#################################################################################
    };

    function inserta_ladrillos(nombre,alt_lad,anch_lad){
      db.transaction(function(tx) {
        tx.executeSql("INSERT INTO ladrillos (nombre,alt_lad,anch_lad) VALUES (?,?,?)", [nombre,alt_lad,anch_lad], function(tx, res) {
          }, function(e) {
            console.log("ERROR: " + e.message);
          });
      });
    };

    crea_tabla_ladrillos();

    ver_tabla_ladrillos();

    $("#btn_inserta").click(function(){

      var nombre = $("#nombre").val();
      var alt_lad = $("#alt_lad").val();
      var anch_lad = $("#anch_lad").val();

      inserta_ladrillos(nombre,alt_lad,anch_lad);
      $("#res").html("");
      ver_tabla_ladrillos();
    });

    //===================================================================================

    //===================================================================================

    //===================================================================================

  }
  //------------------------------------------------------------------
});
