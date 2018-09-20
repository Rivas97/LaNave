var app = {

  inicio: function() {

    this.iniciaBotones();

    var config = {
        apiKey: "AIzaSyDMHf0OfkaNIdtfFdAwHnJjzfEqbEs-TYk",
        authDomain: "la-nave-31b28.firebaseapp.com",
        databaseURL: "https://la-nave-31b28.firebaseio.com",
        projectId: "la-nave-31b28",
        storageBucket: "la-nave-31b28.appspot.com",
         messagingSenderId: "160630566772"
    };
    firebase.initializeApp(config);


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

    var volver = document.querySelector("#volver");
    volver.addEventListener('click', this.volver, false);

    var back = document.querySelector("#back");
    back.addEventListener('click', this.volver, false);

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
    forgot.addEventListener('click', function(){
      alert("Para recuperar su contraseña, entre en www.pilatesmanzaneque.es");
    },false);

    var sign = document.querySelector("#sign");
    sign.addEventListener('click',function(){
        document.getElementById("login").style.display = "none";
        document.getElementById("signin").style.display = "block";
    }, false);

    var register = document.querySelector("#register");
    register.addEventListener('click', this.register, false);

    var atras = document.querySelector("#atras");
    atras.addEventListener('click',function(){
        document.getElementById("login").style.display = "block";
        document.getElementById("signin").style.display = "none";
    }, false);

    var refresh = document.querySelector("#refresh");
    refresh.addEventListener('click', this.backlogin, false);

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
      // Handle Errors here.
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
        if(i = name){
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
                    horarios: ["","","","",""],
                    email: email
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

  backlogin: function(){
        document.getElementById("login").style.display = "block";
        document.getElementById("signin").style.display = "none";
        document.getElementById("grupo").style.display = "none";
        document.getElementById("horarios").style.display = "none";
        document.getElementById("noVerified").style.display = "none";
        document.getElementById("exit").style.display = "none";
        document.getElementById("tabla").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById('tabla2').style.display ='none';
  },

  horario: function() {
    var user = firebase.auth().currentUser;
    if(!user.emailVerified){
        document.getElementById("login").style.display = "none";
        document.getElementById("signin").style.display = "none";
        document.getElementById("grupo").style.display = "none";
        document.getElementById("horarios").style.display = "none";
        document.getElementById("noVerified").style.display = "block";
        document.getElementById("exit").style.display = "none";
        document.getElementById("tabla").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById('tabla2').style.display ='none';

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
        document.getElementById("dia4").title = app.dia(horarios[4]);


        if(horarios[4] =="" || horarios[4] == undefined) {
            document.getElementById("dia5").style.display = "none";
        } else{
            document.getElementById("dia5").style.display = "block";
         }
        document.getElementById("dia5").innerHTML = app.dia(horarios[4]);
        document.getElementById("dia5").title = app.dia(horarios[4]);



        });


        document.getElementById("login").style.display = "none";
        document.getElementById("signin").style.display = "none";
        document.getElementById("grupo").style.display = "none";
        document.getElementById("horarios").style.display = "block";
        document.getElementById("noVerified").style.display = "none";
        document.getElementById("exit").style.display = "none";
        document.getElementById("tabla").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById("tabla1").style.display = "none";
        document.getElementById('tabla2').style.display ='none';
    }
    /*var peticion = 'http://pilatesmanzaneque.es/login.php?user=' + user +'&password=' + password;


      $.getJSON(peticion,function(data){
          console.log(JSON.stringify(data));

          $(data).each(function(index, data) {
              if (data.usuario){
                document.getElementById("bienvenido").innerHTML = "Hola " +data.nombre + " " + data.apellido;

                if(data.diahora1 =="") {
                  document.getElementById("dia1").style.display = "none";
                } else{
                  document.getElementById("dia1").style.display = "block";
                }
                document.getElementById("dia1").innerHTML = app.dia(data.diahora1);
                document.getElementById("dia1").title = app.link(data.diahora1,user);

                if(data.diahora2 =="") {
                  document.getElementById("dia2").style.display = "none";
                } else{
                  document.getElementById("dia2").style.display = "block";
                }
                document.getElementById("dia2").innerHTML = app.dia(data.diahora2);
                document.getElementById("dia2").title = app.link(data.diahora2,user);


                if(data.diahora3 =="") {
                  document.getElementById("dia3").style.display = "none";
                } else{
                  document.getElementById("dia3").style.display = "block";
                }
                document.getElementById("dia3").innerHTML = app.dia(data.diahora3);
                document.getElementById("dia3").title = app.link(data.diahora3,user);


                if(data.diahora4 =="") {
                  document.getElementById("dia4").style.display = "none";
                } else{
                  document.getElementById("dia4").style.display = "block";
                }
                document.getElementById("dia4").innerHTML = app.dia(data.diahora4);
                document.getElementById("dia4").title = app.link(data.diahora4,user);

                document.getElementById("login").style.display = "none";
                document.getElementById("grupo").style.display = "none";
                document.getElementById("horarios").style.display = "block";
                document.getElementById("exit").style.display = "none";
                document.getElementById("tabla").style.display = "none";
                document.getElementById("tabla1").style.display = "none";
                document.getElementById("tabla1").style.display = "none";
                document.getElementById('tabla2').style.display ='none';

              } else{
                window.localStorage.clear();
                alert("Usuario o contraseña incorrectos");
                document.getElementById("password").value = "";
              }

          });
      });*/
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

  link: function(horario,user) {
    var enlace = "http://pilatesmanzaneque.es/group.php?diahora=" + horario + "&user=" + user;
    return enlace;
  },

  grupo: function(dia){
    var hora = document.getElementById(dia).innerHTML;
    var peticion = document.getElementById(dia).title ;

    $.getJSON(peticion,function(data){
        console.log(JSON.stringify(data));

        $(data).each(function(index,data) {
          document.getElementById("hora").innerHTML = hora;
          document.getElementById("plazas").innerHTML = "Quedan " + data.plazas + " plazas.";
          document.getElementById("mens").innerHTML = data.mens;

          if (data.pert == 1){
            document.getElementById("pert").innerHTML = "Ya pertenece a este grupo";
          } else {
            document.getElementById("pert").innerHTML = "";
          }

          if (data.plazas <= 0 ) {
            document.getElementById("add").style.visibility = "hidden";
          } else {
            document.getElementById("add").style.visibility = "visible";
          }


        });
    });

    document.getElementById("horarios").style.display = "none";
    document.getElementById("grupo").style.display = "block";
    document.getElementById("exit").style.display = "none";
    document.getElementById("tabla").style.display = "none";
    document.getElementById("tabla1").style.display = "none";
    document.getElementById('tabla2').style.display ='none';
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
        document.getElementById("horarios").style.display = "none";
        document.getElementById("exit").style.display = "none";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";  

        alert("Ha cerrado sesión correctamente");
    })
    .catch(function(error){
        alert("Ha ocurrido un error, por favor inténtelo más tarde");
    })


   },

   add: function() {
    var user = window.localStorage.getItem("user");
    var raw = document.getElementById("hora").innerHTML;
    var hour = app.diahora(raw);

    var peticion = "http://pilatesmanzaneque.es/group.php?diahora="+hour+"&user="+user+"&send=add";


       $.getJSON(peticion,function(data){
        console.log(JSON.stringify(data));

        $(data).each(function(index,data) {
          document.getElementById("hora").innerHTML = raw;
          document.getElementById("plazas").innerHTML = "Quedan " + data.plazas + " plazas.";
          document.getElementById("mens").innerHTML = data.mens;

          if (data.pert == 1){
            document.getElementById("pert").innerHTML = "Ya pertenece a este grupo";
          } else {
            document.getElementById("pert").innerHTML = "";
          }


        });
    });
   },

   salir: function() {
    var user = window.localStorage.getItem("user");
    var raw = document.getElementById("hora").innerHTML;
    var hour = app.diahora(raw);

    var peticion = "http://pilatesmanzaneque.es/group.php?diahora="+hour+"&user="+user+"&send=salir";


       $.getJSON(peticion,function(data){
        console.log(JSON.stringify(data));

        $(data).each(function(index,data) {
          document.getElementById("hora").innerHTML = raw;
          document.getElementById("plazas").innerHTML = "Quedan " + data.plazas + " plazas.";
          document.getElementById("mens").innerHTML = data.mens;

          if (data.pert == 1){
            document.getElementById("pert").innerHTML = "Ya pertenece a este grupo";
          } else {
            document.getElementById("pert").innerHTML = "";
          }


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
      } else if(day == "Miércoles") {
        var dia = "X";
      } else if(day == "Jueves"){
        var dia = "J";
      } else {
        var dia = "";
      }

      var answer = dia + "("+ hour + ")";

      return answer;

   },

   tabla: function(hora) {

    /*var user = window.localStorage.getItem("user");
    var peticion = "http://pilatesmanzaneque.es/group.php?diahora=" + hora + "&user=" + user;

    $.getJSON(peticion,function(data){
        console.log(JSON.stringify(data));

        $(data).each(function(index,data) {
          document.getElementById("hora").innerHTML = app.dia(hora);
          document.getElementById("plazas").innerHTML = "Quedan " + data.plazas + " plazas.";
          document.getElementById("mens").innerHTML = data.mens;

          if (data.pert == 1){
            document.getElementById("pert").innerHTML = "Ya pertenece a este grupo";
          } else {
            document.getElementById("pert").innerHTML = "";
          }


          if (data.plazas <= 0 ) {
            document.getElementById("add").style.visibility = "hidden";
          } else {
            document.getElementById("add").style.visibility = "visible";
          }


        });
    });

    document.getElementById("horarios").style.display = "none";
    document.getElementById("grupo").style.display = "block";
    document.getElementById("exit").style.display = "none";
    document.getElementById("tabla").style.display = "none";
    document.getElementById("tabla1").style.display = "none";
    document.getElementById('tabla2').style.display ='none';*/
   },

   ver: function() {
    var user = firebase.auth().currentUser;

    if (user){
        ancho = document.documentElement.clientWidth;

        if (ancho <= 500) {
            document.getElementById("tabla1").style.display = "block";
        }else{
            document.getElementById("tabla").style.display = "block";
        }
        document.getElementById("horarios").style.display = "none";
        document.getElementById("grupo").style.display = "none";
        document.getElementById("exit").style.display = "none";
      } else {
        alert('Debe iniciar sesión para ver los horarios');
      }
   },

   cuenta: function(){
        var user = firebase.auth().currentUser;
        if(!user.emailVerified){
            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "none";
            document.getElementById("noVerified").style.display = "block";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tabla2').style.display ='none';

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
            document.getElementById("dia4").title = app.dia(horarios[4]);


            if(horarios[4] =="" || horarios[4] == undefined) {
                document.getElementById("dia5").style.display = "none";
            } else{
                document.getElementById("dia5").style.display = "block";
             }
            document.getElementById("dia5").innerHTML = app.dia(horarios[4]);
            document.getElementById("dia5").title = app.dia(horarios[4]);



            });


            document.getElementById("login").style.display = "none";
            document.getElementById("signin").style.display = "none";
            document.getElementById("grupo").style.display = "none";
            document.getElementById("horarios").style.display = "block";
            document.getElementById("noVerified").style.display = "none";
            document.getElementById("exit").style.display = "none";
            document.getElementById("tabla").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById("tabla1").style.display = "none";
            document.getElementById('tabla2').style.display ='none';
        }
   },

   out: function() {
        var user = firebase.auth().currentUser;

      if(user){
                document.getElementById("login").style.display = "none";
                document.getElementById("grupo").style.display = "none";
                document.getElementById("horarios").style.display = "none";
                document.getElementById("exit").style.display = "block";
                document.getElementById("tabla").style.display = "none";
                document.getElementById("tabla1").style.display = "none";
                document.getElementById("tabla1").style.display = "none";
                document.getElementById('tabla2').style.display ='none';
      } else {
        alert("No ha iniciado sesión");
      }
   },

   siguiente: function() {
      document.getElementById('tabla1').style.display ='none';
      document.getElementById('tabla2').style.display ='block';
   },

   anterior: function() {
    document.getElementById('tabla1').style.display ='block';
    document.getElementById('tabla2').style.display ='none';
   },

   /*rotacion: function () {
    var ancho = document.documentElement.clientWidth;
    var header = document.getElementById("header").className;

    if (ancho <=500 && header == "header") {
      document.getElementById("header").className = "header-big";
    } else if (ancho <= 500 && header == "header-big")  {
      document.getElementById("header").className= "header";
    }


   }*/

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




/*var app = {
    // Application Constructor
    initialize: function() {
        var config = {
            apiKey: "AIzaSyDMHf0OfkaNIdtfFdAwHnJjzfEqbEs-TYk",
            authDomain: "la-nave-31b28.firebaseapp.com",
            databaseURL: "https://la-nave-31b28.firebaseio.com",
            projectId: "la-nave-31b28",
            storageBucket: "la-nave-31b28.appspot.com",
            messagingSenderId: "160630566772"
         };
        firebase.initializeApp(config);

        this.readData();
    },


    readData: function(){
        firebase.database().ref('horarios/lunes/08:00/plazas').on('value', function(snapshot){
            var plazas = 10 - snapshot.val();
            document.getElementById("plazas").innerHTML =  "Número de plazas: " + plazas;
        });
    },

    add: function(time) {
        var plazas = 0;
        firebase.database().ref('horarios/lunes/' + time +'/plazas').once('value').then(function(snapshot){
            plazas = snapshot.val();

            if(plazas < 10) {
            plazas++;

            firebase.database().ref('horarios/lunes/' + time).update({
                plazas: plazas
            });
            } else {
                alert("Grupo Completo");
            }
        });
    },

    exit: function(time) {
        var plazas = 0;
        firebase.database().ref('horarios/lunes/' + time + '/plazas').once('value').then(function(snapshot){
            plazas = snapshot.val();

            if(plazas > 0) {
            plazas--;

            firebase.database().ref('horarios/lunes/' + time).update({
                plazas: plazas
            });
            } else {
                alert("Grupo Vacío");
            }
        });
    }

};*/
