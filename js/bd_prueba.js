$(function(){
  //------------------------------------------------------------------
  document.addEventListener("deviceready", onDeviceReady, false);
  //------------------------------------------------------------------
  function onDeviceReady() {
      //para poder ver los logs en tiempo real de la app se escribe
      //en la terminal:
      //adb logcat Cordova:D DroidGap:D CordovaLog:D *:S
      //el adb logcat es el que muestra todos los eventos de la app
      //en tiempo real en la terminal.

      document.addEventListener("menubutton", onMenuKeyDown, false);

        function onMenuKeyDown() {
            $("#p_device").html("Se ha presionado el boton de menu.!");
            console.log("console.log works well");
        }

    //----------------------------------------------------------------
    //creación de la base de datos.-----------------------------------
    //se instala el plugin de cordova sqlite
    //http://plugins.cordova.io/#/package/io.litehelpers.cordova.sqlite
    //-----------------------------------------------------------------
    /*se crea una variable db que crea la base con el nombre.db,
    esta variable va a ser nuestra bd ahora.*/
    var db = window.sqlitePlugin.openDatabase({name: "db_prueba.db"});
    //-----------------------------------------------------------------

    //-----------------------------------------------------------------------------------------------------------------
    /*se hace una trasaccion en la bd, esto lleva un parametro tx que es un objeto con funciones.*/
    db.transaction(function(tx) {
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //crea una tabla llamada "test_table" ahora "nombres"
      tx.executeSql('DROP TABLE IF EXISTS nombres');
      //crea la tabla con los campos y especificaciones, en este caso id y nombre
      tx.executeSql('CREATE TABLE IF NOT EXISTS nombres (id integer primary key, nombre text)');
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      /*inserta valores en la tabla, un insert normal*/
      tx.executeSql("INSERT INTO nombres (nombre) VALUES (?)", ["Angela"], function(tx, res){} );
      tx.executeSql("INSERT INTO nombres (nombre) VALUES (?)", ["Marleny"], function(tx, res){} );

      tx.executeSql("INSERT INTO nombres (nombre) VALUES (?)", ["johan"], function(tx, res) {
        //muestra el id del insert
        //console.log("insertId: " + res.insertId + " -- probably 1");
        //muestra la cantidad de campos que se modificaron
        //console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");

        //#################################################################################
        /*
        //inicia una segunda transaccion de tipo select para mostrar lo que se ha insertado
        db.transaction(function(tx) {
          /*
          tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
            console.log("res.rows.length: " + res.rows.length + " -- should be 1");
            console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
          });/

          tx.executeSql("select * from nombres;", [], function(tx, res) {
            //console.log(res.rows.item(0).nombre);
            for(var i = 0;i <= res.rows.length;i++){
              //console.log(res.rows.item(i).nombre);
              $("#res").append('<li href="#" class="list-group-item">'+res.rows.item(i).nombre+'</li>');
            };
          });

        });//cierra segunda transaccion
        */
        //#################################################################################
      //cierra la primera transaccion e inicia una funcion para notificar algun error
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      }, function(e) {
        console.log("ERROR: " + e.message);
      });
    });//cierra transaccion principal
    //-------------------------------------------------------------------------------------------------------------------

    //#################################################################################
    //inicia una segunda transaccion de tipo select para mostrar lo que se ha insertado
    db.transaction(function(tx) {

      tx.executeSql("select * from nombres;", [], function(tx, res) {
        //console.log(res.rows.item(0).nombre);
        for(var i = 0;i <= res.rows.length;i++){
          //console.log(res.rows.item(i).nombre);
          $("#res").append('<li href="#" class="list-group-item">'+res.rows.item(i).nombre+'</li>');
        };
      });

    });//cierra segunda transaccion
    //#################################################################################

    //=================================================================================
    /*
    funcionalidad para las notificaciones, del plugin
    http://plugins.cordova.io/#/package/com.cordova.plugin.localnotificationplugin
    el objeto de opciones:
    var options = {
        seconds: int,
        ticker: string, //Android only & Optional
        title: string, //Android only & Optional
        icon: string //Android only & Optional
        message: string,
        badge: int
    };
    //no funciona lo del icono...
    */
    localNotification.add(103, {
      seconds: 1,
      title: "App lista!",
      message: "La aplicación ha creado la BD y esta lista para usarse.",
      icon: "../notification.png",
      badge: 1
    });
    //===================================================================================

    //===================================================================================

    //===================================================================================

  }
  //------------------------------------------------------------------
});
