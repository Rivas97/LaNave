var app = {

  inicio: function() {

    this.iniciaBotones();
    this.iniciaHeader();

    var config = {
        apiKey: "AIzaSyDMHf0OfkaNIdtfFdAwHnJjzfEqbEs-TYk",
        authDomain: "la-nave-31b28.firebaseapp.com",
        databaseURL: "https://la-nave-31b28.firebaseio.com",
        projectId: "la-nave-31b28",
        storageBucket: "la-nave-31b28.appspot.com",
         messagingSenderId: "160630566772"
    };
    firebase.initializeApp(config);
    this.iniciaObserver();
    this.iniciaAdmin();


    var email = window.localStorage.getItem("email");
    var password = window.localStorage.getItem("password");


    if (email != null){
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(){
            app.horario();
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(errorMessage);
        });
    } else {
      document.getElementById("login").style.display = "block";
    }
  },

  iniciaObserver: function() {
    firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            document.getElementById("cuenta").innerHTML = "Cuenta";
          } else {
            document.getElementById("cuenta").innerHTML = "Inicio";
          }
        });

  },


  iniciaBotones: function(){
    var entrar = document.querySelector('#entrar');
    entrar.addEventListener('click', this.login, false);

    var dia1 = document.querySelector('#dia1');
    dia1.addEventListener('click', function(){app.grupo('dia1');},false);

    var dia2 = document.querySelector('#dia2');
    dia2.addEventListener('click', function(){app.grupo('dia2');},false);

    var dia3 = document.querySelector('#dia3');
    dia3.addEventListener('click', function(){app.grupo('dia3');},false);

    var dia4 = document.querySelector('#dia4');
    dia4.addEventListener('click', function(){app.grupo('dia4');},false);

    var add = document.querySelector("#add");
    add.addEventListener('click', this.add, false);

    var salir = document.querySelector("#salir");
    salir.addEventListener('click', this.salir, false);

    var logout = document.querySelector("#logout");
    logout.addEventListener('click', this.logout, false);

    var ver = document.querySelector("#ver");
    ver.addEventListener('click', this.ver,false);

    var cuenta = document.querySelector("#cuenta");
    cuenta.addEventListener('click', this.cuenta, false);

    var out = document.querySelector("#out");
    out.addEventListener('click', this.out, false);

    var forgot = document.querySelector("#forgot");
    forgot.addEventListener('click', this.forgot,false);

    var sign = document.querySelector("#sign");
    sign.addEventListener('click',function(){
        document.getElementById("login").style.display = "none";
        document.getElementById("signin").style.display = "block";
    }, false);

    var recover = document.querySelector("#recover");
    recover.addEventListener('click', this.recover,false);

    var register = document.querySelector("#register");
    register.addEventListener('click', this.register, false);

    var refresh = document.querySelector("#refresh");
    refresh.addEventListener('click', this.backlogin, false);

  },

  iniciaHeader: function(){
        var ancho = document.documentElement.clientWidth;

        if (ancho <= 500) {
            document.getElementById("small-header").style.display = "block";
            document.getElementById("big-header").style.display="none";
        }else{
            document.getElementById("small-header").style.display = "none";
            document.getElementById("big-header").style.display="block";
        }
  },

  login: function() {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(){
        window.localStorage.setItem("email",email);
        window.localStorage.setItem("password",password);

        app.horario();

      })

    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });

  },

  register: function(){
    var email= document.getElementById("newmail").value;
    var password = document.getElementById("newpass").value;
    var confpassword = document.getElementById("confpass").value;
    var name = document.getElementById("name").value;
    var repeat = false;

    firebase.database().ref('/usuarios').once('value').then(function(snapshot) {
      var users = snapshot.val()
      for (var i in users){
        if(i == name){
            repeat = true;
        }
      }


        if(email == "" || password == "" || confpassword == "" || name == "") {
            alert("Debe rellenar todos los campos");
        } else if (password != confpassword) {
            alert("Las contraseñas no coinciden");
        } else if(repeat) {
            alert("El nombre ya se encuentra en uso por otro usuario");
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(){
                firebase.database().ref('usuarios/' + name ).set({
                    horarios: ["","","",""],
                    email: email,
                    admin: false
                });

                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: name
                })

                app.verificar();
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              alert(errorMessage);
            });

        }

    });

  },

  verificar: function(){
        var user = firebase.auth().currentUser;

        user.sendEmailVerification().then(function() {
            alert("Registro correcto, se ha enviado un email de verificación a su correo");
            app.backlogin();
        }).catch(function(error) {
          alert("Ha ocurrido un fallo, contacte con el administrador");
        });

  },

  forgot: function() {
        document.getElementById("login").style.display = "none";
        document.getElementById("signin").style.display = "none";
        document.getElementById("forgot-password").style.display = "block";
        document.getElementById("grupo").style.display = "none";
        document.getElementById("horarios").style.display = "none";
        document.getElementById("noVerified").style.display = "none";
        document.getElementById("exit").style.display = "none";
        document.getElementById("tabla").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById('tablaAdmin').style.display ='none';
  },

  recover: function(){
    var auth = firebase.auth();
    var emailAddress = document.getElementById("forgot-mail").value;

    auth.sendPasswordResetEmail(emailAddress).then(function() {
        alert("Se ha enviado un email de recuperación de contraseña");
        app.backlogin();
    }).catch(function(error) {
        alert("Ha ocurrido un error, por favor inténtelo de nuevo más tarde");
        app.backlogin();
    });

  },

  backlogin: function(){
        document.getElementById("login").style.display = "block";
        document.getElementById("signin").style.display = "none";
        document.getElementById("forgot-password").style.display = "none";
        document.getElementById("grupo").style.display = "none";
        document.getElementById("horarios").style.display = "none";
        document.getElementById("noVerified").style.display = "none";
        document.getElementById("exit").style.display = "none";
        document.getElementById("tabla").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById('tablaAdmin').style.display ='none';
  },

  horario: function() {
    var user = firebase.auth().currentUser;
    var admin = false;

    firebase.database().ref('/usuarios/' + user.displayName + '/admin' ).once('value').then(function(snapshot){
        if(snapshot.val()){
                admin = true;
        } else{
                admin = false;
        }

        if(!user.emailVerified){
            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("forgot-password").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "none";
            document.getElementById("noVerified").style.display = "block";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='none';

        } else if (admin) {
            app.iniciaAdmin()
            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("forgot-password").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "none";
            document.getElementById("noVerified").style.display = "none";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='block';
        } else{
            document.getElementById("bienvenido").innerHTML="Bienvenid@ " + user.displayName ;

            firebase.database().ref('/usuarios/' + user.displayName + '/horarios').once('value').then(function(snapshot) {
            var horarios = snapshot.val();

            if(horarios[0] =="" || horarios[0] == undefined) {
                document.getElementById("dia1").style.display = "none";
            } else{
                document.getElementById("dia1").style.display = "block";
             }
            document.getElementById("dia1").innerHTML = app.dia(horarios[0]);
            document.getElementById("dia1").title = app.dia(horarios[0]);

            if(horarios[1] =="" || horarios[1] == undefined) {
                document.getElementById("dia2").style.display = "none";
            } else{
                document.getElementById("dia2").style.display = "block";
            }
            document.getElementById("dia2").innerHTML = app.dia(horarios[1]);
            document.getElementById("dia2").title = app.dia(horarios[1]);

            if(horarios[2] =="" || horarios[2] == undefined) {
                document.getElementById("dia3").style.display = "none";
            } else{
                document.getElementById("dia3").style.display = "block";
             }
            document.getElementById("dia3").innerHTML = app.dia(horarios[2]);
            document.getElementById("dia3").title = app.dia(horarios[2]);

            if(horarios[3] =="" || horarios[3] == undefined) {
                document.getElementById("dia4").style.display = "none";
            } else{
                document.getElementById("dia4").style.display = "block";
            }
            document.getElementById("dia4").innerHTML = app.dia(horarios[3]);
            document.getElementById("dia4").title = app.dia(horarios[3]);

            });


            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("forgot-password").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "block";
            document.getElementById("noVerified").style.display = "none";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='none';
        }
    });
    
  },


  dia: function(horario) {
      var day = horario.substring(0,1);
      var hora = horario.substring(2,7);

      if (day == "L") {
        var dia = "Lunes";
      } else if(day == "M") {
        var dia = "Martes";
      } else if(day == "X") {
        var dia = "Miércoles";
      } else if(day == "J"){
        var dia = "Jueves";
      } else if (day == "V"){
        var dia = "Viernes";
      } else{
        var dia = "";
      }

      var answer = dia + " " + hora;

      return answer;
  },



  grupo: function(dia){
    var raw = document.getElementById(dia).innerHTML;
    var hour = app.diahora(raw);
    app.tabla(hour);
  },

  volver: function(){
    var user = window.localStorage.getItem("user");
    var password = window.localStorage.getItem("password");

    app.horario(user,password);
  },

  logout: function(){
    firebase.auth().signOut().then(function(){
        window.localStorage.clear();

            document.getElementById("login").style.display = "block";
            document.getElementById("signin").style.display = "none";
            document.getElementById("forgot-password").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "none";
            document.getElementById("noVerified").style.display = "none";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='none';

        alert("Ha cerrado sesión correctamente");
    })
    .catch(function(error){
        alert("Ha ocurrido un error, por favor inténtelo más tarde");
    })


   },

   add: function() {
    var user = firebase.auth().currentUser;
    var plazas = 0;
    var raw = document.getElementById("hora").innerHTML;
    var hour = app.diahora(raw);
    var dia = app.day(hour);
    var hora = app.hora(hour);
    var horarios;
    var free = false;


        firebase.database().ref('/usuarios/' + user.displayName +'/horarios').once('value').then(function(snapshot){
            horarios = snapshot.val();

            for (var i = 0; i < 4; i++){
                if(horarios[i] == ""){
                    free = true;
                }
            }

            if(free){
                for(var i =0; i < 4; i++){
                    if(horarios[i] == "") {
                        horarios[i] = hour;
                        break;
                    }
                }

                firebase.database().ref('/usuarios/' + user.displayName ).update({
                    horarios: horarios
                 });

                firebase.database().ref('/horarios/'+ dia +'/' + hora + '/plazas').once('value').then(function(snapshot){
                    plazas = snapshot.val();

                    plazas++;
                 firebase.database().ref('/horarios/' + dia + '/' + hora).update({
                        plazas: plazas
                    }); 

                        alert("Ha sido añadido al grupo");

                        app.tabla(hour);  
                });



            }else {
                alert("Ya asiste al número máximo de clases por semana");
            }
        });

   },

   salir: function() {

    var user = firebase.auth().currentUser;
    var plazas = 0;
    var raw = document.getElementById("hora").innerHTML;
    var hour = app.diahora(raw);
    var dia = app.day(hour);
    var hora = app.hora(hour);
    var horarios;


        firebase.database().ref('/usuarios/' + user.displayName +'/horarios').once('value').then(function(snapshot){
            horarios = snapshot.val();
                for(var i =0; i < 4; i++){
                    if(horarios[i] == hour) {
                        horarios[i] = "";
                        break;
                    }
                }

                firebase.database().ref('/usuarios/' + user.displayName ).update({
                    horarios: horarios
                 });

                firebase.database().ref('/horarios/'+ dia +'/' + hora + '/plazas').once('value').then(function(snapshot){
                    plazas = snapshot.val();

                    plazas--;
                 firebase.database().ref('/horarios/' + dia + '/' + hora).update({
                        plazas: plazas
                    }); 

                        alert("Ha sido eliminado al grupo");

                        app.tabla(hour);  
                });

        });
   },


   diahora: function(horario) {
    var n = horario.length;
    var start = n-6;
    var begin = n-5;

    var day = horario.substring(0,start);
    var hour = horario.substring(begin,n);

      if (day == "Lunes") {
        var dia = "L";
      } else if(day == "Martes") {
        var dia = "M";
      } else if(day == "Miercoles") {
        var dia = "X";
      } else if(day == "Jueves"){
        var dia = "J";
      } else if(day == "Viernes") {
        var dia = "V";
      }else {
        var dia = "";
      }

      var answer = dia + "("+ hour + ")";

      return answer;

   },

   day: function(horario){
        var n = horario.length;
        var start = n-7;

        var day = horario.substring(0,start);


        if (day == "L") {
            var dia = "Lunes";
          } else if(day == "M") {
            var dia = "Martes";
          } else if(day == "X") {
            var dia = "Miercoles";
          } else if(day == "J"){
            var dia = "Jueves";
          } else if(day == "V"){
            var dia = "Viernes"
          }else {
            var dia = "";
          }

          return dia;
   },

   hora:function(horario){
        var n = horario.length;

        var begin = n-6;

        var hour = horario.substring(begin,n-1);

        return hour;
   },

   tabla: function(hora) {

    var user = firebase.auth().currentUser;
    var userTime;
    var plazas;
    var dia = this.day(hora);
    var hour = this.hora(hora);
    var pert = false;

    document.getElementById("hora").innerHTML= dia + " " + hour;

    firebase.database().ref('/horarios/' + dia +'/'+ hour +'/plazas').on('value', function(snapshot){
        plazas = 12 - snapshot.val();
        document.getElementById("plazas").innerHTML =  "Quedan " + plazas + " plazas";


        if (plazas <= 0 ) {
            document.getElementById("add").style.visibility = "hidden";
        } else{ 
            document.getElementById("add").style.visibility = "visible";
        }
    });

    firebase.database().ref('/usuarios/' + user.displayName +'/horarios').on('value', function(snapshot){
        for(var i = 0; i < 5; i++){
            if (snapshot.val()[i] == hora){
                pert = true;
            }
        }

        if (pert){
            document.getElementById("pert").innerHTML = "Ya pertenece a este grupo";
            document.getElementById("add").style.visibility = "hidden";
            document.getElementById("salir").style.visibility = "visible";
        } else {
            document.getElementById("pert").innerHTML = "";
            document.getElementById("add").style.visibility = "visible";
            document.getElementById("salir").style.visibility = "hidden"
        }
    });




            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("forgot-password").style.display = "none";
            document.getElementById("grupo").style.display = "block";
            document.getElementById("horarios").style.display = "none";
            document.getElementById("noVerified").style.display = "none";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='none';
   },

   ver: function() {
    var user = firebase.auth().currentUser;
    var admin = false;

    firebase.database().ref('/usuarios/' + user.displayName + '/admin' ).once('value').then(function(snapshot){
        if(snapshot.val()){
                admin = true;
        } else{
                admin = false;
        }

        if (user && user.emailVerified){

            if (admin) {
                app.iniciaAdmin();
                document.getElementById("login").style.display = "none";
                document.getElementById("signin").style.display = "none";
                document.getElementById("forgot-password").style.display = "none";
                document.getElementById("grupo").style.display = "none";
                document.getElementById("horarios").style.display = "none";
                document.getElementById("noVerified").style.display = "none";
                document.getElementById("exit").style.display = "none";
                document.getElementById("tabla").style.display = "none";
                document.getElementById("tabla1").style.display = "none";

                document.getElementById('tablaAdmin').style.display ='block';
            } else {
                ancho = document.documentElement.clientWidth;

                if (ancho <= 500) {
                    document.getElementById("tabla1").style.display = "block";
                }else{
                    document.getElementById("tabla").style.display = "block";
                }
                document.getElementById("horarios").style.display = "none";
                document.getElementById("grupo").style.display = "none";
                document.getElementById("exit").style.display = "none";
            }
        } else if (user && !user.emailVerified){
                document.getElementById("login").style.display = "none";
                document.getElementById("signin").style.display = "none";
                document.getElementById("grupo").style.display = "none";
                document.getElementById("horarios").style.display = "none";
                document.getElementById("noVerified").style.display = "block";
                document.getElementById("exit").style.display = "none";
                document.getElementById("tabla").style.display = "none";
                document.getElementById("tabla1").style.display = "none";
                document.getElementById('tablaAdmin').style.display ='none';
        } else {
            alert('Debe iniciar sesión para ver los horarios');
        }

    });

   
   },

   cuenta: function(){
        var user = firebase.auth().currentUser;
        if(user && !user.emailVerified ){
            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("forgot-password").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "none";
            document.getElementById("noVerified").style.display = "block";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='none';

        } else if (user && user.emailVerified){
            document.getElementById("bienvenido").innerHTML="Bienvenid@ " + user.displayName ;

            firebase.database().ref('/usuarios/' + user.displayName + '/horarios').once('value').then(function(snapshot) {
            var horarios = snapshot.val();

            if(horarios[0] =="" || horarios[0] == undefined) {
                document.getElementById("dia1").style.display = "none";
            } else{
                document.getElementById("dia1").style.display = "block";
             }
            document.getElementById("dia1").innerHTML = app.dia(horarios[0]);
            document.getElementById("dia1").title = app.dia(horarios[0]);

            if(horarios[1] =="" || horarios[1] == undefined) {
                document.getElementById("dia2").style.display = "none";
            } else{
                document.getElementById("dia2").style.display = "block";
            }
            document.getElementById("dia2").innerHTML = app.dia(horarios[1]);
            document.getElementById("dia2").title = app.dia(horarios[1]);

            if(horarios[2] =="" || horarios[2] == undefined) {
                document.getElementById("dia3").style.display = "none";
            } else{
                document.getElementById("dia3").style.display = "block";
             }
            document.getElementById("dia3").innerHTML = app.dia(horarios[2]);
            document.getElementById("dia3").title = app.dia(horarios[2]);

            if(horarios[3] =="" || horarios[3] == undefined) {
                document.getElementById("dia4").style.display = "none";
            } else{
                document.getElementById("dia4").style.display = "block";
             }
            document.getElementById("dia4").innerHTML = app.dia(horarios[3]);
            document.getElementById("dia4").title = app.dia(horarios[3]);

            });


            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("forgot-password").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "block";
            document.getElementById("noVerified").style.display = "none";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='none';
        } else {
            document.getElementById("login").style.display = "block";
            document.getElementById("signin").style.display = "none";
            document.getElementById("forgot-password").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "none";
            document.getElementById("noVerified").style.display = "none";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='none';
        }
   },

   out: function() {
        var user = firebase.auth().currentUser;

      if(user && user.emailVerified){
                document.getElementById("login").style.display = "none";
                document.getElementById("grupo").style.display = "none";
                document.getElementById("horarios").style.display = "none";
                document.getElementById("exit").style.display = "block";
                document.getElementById("tabla").style.display = "none";
                document.getElementById("tabla1").style.display = "none";
                document.getElementById("tabla1").style.display = "none";
                document.getElementById('tablaAdmin').style.display ='none';
      } else if (user && !user.emailVerified){
            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "none";
            document.getElementById("noVerified").style.display = "block";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tablaAdmin').style.display ='none';
      } else {
        alert("No ha iniciado sesión");
      }
   },

   iniciaAdmin: function(){
       
        firebase.database().ref('/horarios/Lunes').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot){
                var hora = childSnapshot.key;
                var plazas = childSnapshot.val().plazas;
                document.getElementById("Lunes"+hora).innerHTML = plazas;

            });
        }); 

        firebase.database().ref('/horarios/Martes').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot){
                var hora = childSnapshot.key;
                var plazas = childSnapshot.val().plazas;
                document.getElementById("Martes"+hora).innerHTML = plazas;

            });
        }); 

        firebase.database().ref('/horarios/Miercoles').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot){
                var hora = childSnapshot.key;
                var plazas = childSnapshot.val().plazas;
                document.getElementById("Miercoles"+hora).innerHTML = plazas;

            });
        }); 

        firebase.database().ref('/horarios/Jueves').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot){
                var hora = childSnapshot.key;
                var plazas = childSnapshot.val().plazas;
                document.getElementById("Jueves"+hora).innerHTML = plazas;

            });
        }); 

        firebase.database().ref('/horarios/Viernes').once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot){
                var hora = childSnapshot.key;
                var plazas = childSnapshot.val().plazas;
                document.getElementById("Viernes"+hora).innerHTML = plazas;

            });
        }); 


   },

};

if ('addEventListener' in document) {
  document.addEventListener("deviceready", function() {
    app.inicio();
  }, false);
};

document.addEventListener("offline", function(){
  alert('Ups, parece que no hay conexión a internet');
}, false);

document.addEventListener("backbutton", function(){
  app.volver();
}, false);

