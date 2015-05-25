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
                $("#res").append('<li href="#" name="ladrillo" class="list-group-item" data-id_lad="'+res.rows.item(i).id+'">'+res.rows.item(i).id+'-'+res.rows.item(i).nombre+'-'+res.rows.item(i).alt_lad+'-'+res.rows.item(i).anch_lad+'</li>');

                //funcion al tocar un elemento de la lista
                $("[name*='ladrillo']").click(function(){

                    var id_lad = $(this).attr("data-id_lad");
                    console.log("click al ladrillo "+id_lad);

                    //hacer select con el id capturado y cargarlo dentro del form++++++++++++++++++++++++++
                    db.transaction(function(tx){
                      tx.executeSql("select * from ladrillos where id = "+id_lad+";",[],function(tx,res){
                        //---------------------------------------------------------------
                        //carga los valores en el form
                        $("#id_lad").val(res.rows.item(0).id);
                        $("#nombre").val(res.rows.item(0).nombre);
                        $("#alt_lad").val(res.rows.item(0).alt_lad);
                        $("#anch_lad").val(res.rows.item(0).anch_lad);
                        console.log("se ha cargado el ladrillo "+res.rows.item(0).nombre);
                        //----------------------------------------------------------------
                      });
                    });
                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                });

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

      clear_form();
    };

    function elimina_ladrillo(id_lad_delete){
      db.transaction(function(tx) {
        tx.executeSql("DELETE FROM ladrillos WHERE id = "+id_lad_delete,  [] , function(tx, res) {

          }, function(e) {
            console.log("ERROR: " + e.message);
          });
      });

      ver_tabla_ladrillos();
      clear_form();
    };

    function clear_form(){
      $("#form_lads")[0].reset();
    };

    function get_ladrillo(){
      var nombre = $("#nombre").val();
      var alt_lad = $("#alt_lad").val();
      var anch_lad = $("#anch_lad").val();

      var lad_gen = {
        nombre : nombre,
        alto : alt_lad,
        ancho : anch_lad
      };

      return lad_gen;
    };

    crea_tabla_ladrillos();

    ver_tabla_ladrillos();

    //-----------------------------------------------------------------------------------
    $("#btn_inserta").click(function(){

      var ladrillo = get_ladrillo();

      inserta_ladrillos(ladrillo.nombre,ladrillo.alto,ladrillo.ancho);
      //--------------------------------------------------------------
      $("#res").html("");
      ver_tabla_ladrillos();
    });


    $("#btn_eliminar").click(function(){
        var id_lad_delete = $("#id_lad").val();
        console.log(id_lad_delete);
        elimina_ladrillo(id_lad_delete);
    });
    //
    $("#btn_limpiar").click(function(){
      clear_form();
    });

    //===================================================================================

    //===================================================================================

    //===================================================================================

  }
  //------------------------------------------------------------------
});
