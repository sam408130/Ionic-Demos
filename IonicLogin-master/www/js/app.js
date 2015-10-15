angular.module('ionicApp', ['ionic'])
//Rotas de Templates
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('signin', {
      url: "/sign-in",
      templateUrl: "sign-in.html",
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
      url: "/forgot-password",
      templateUrl: "forgot-password.html",
		controller: 'RedefinirCtrl'
    })
  .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "home.html"
        }
      }
    })
    .state('tabs.cadastrar', {
      url: "/cadastrar",
      views: {
        'home-tab': {
          templateUrl: "cadastrar.html"
        }
      }
    }) 
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "about.html"
        }
      }
    })
    //Define que qualquer url inexistente irá para o login;
   $urlRouterProvider.otherwise("/sign-in");
})
//Iniciando os controllers

//Controller do Login
.controller('SignInCtrl', function($scope, $state) {
	//Application ID PARSE na primeira linha;
  //JAVASCRIPT ID PARSE na segunda linha;
	Parse.initialize("",
                "");
    window.addEventListener("load",initApp);
	function initApp(){
		document.getElementById("logar").addEventListener("click", login);
	}
	function login(){
        user = document.getElementById('usuario').value;
        senha = document.getElementById('senha').value;
        Parse.User.logIn(user, senha, {
          success: function(user) {
               $state.go('tabs.home');
          },
          error: function(user, error) {
            confirm('Email ou Senha incorretos, por favor tente novamente!');
          }
        });
    }
})
//Controller do Cadastro
.controller('CadastroCtrl', function($scope, $state) {
	//Application ID PARSE na primeira linha;
  //JAVASCRIPT ID PARSE na segunda linha;
	Parse.initialize("",
                "");

	window.addEventListener("load",initApp);

	function initApp(){
		document.getElementById("cadastroMorador").addEventListener("submit",salvarNaNuvem);
	}

	function salvarNaNuvem(evento){
		var nomeMorador = document.getElementById('nomeMorador');
		var telefone = document.getElementById('telefone');
		var dataNascimento = document.getElementById('dataNascimento');
		var email = document.getElementById('email');
		var username = document.getElementById('username');
		var condominio = document.getElementById('condominio');
		var apartamento = document.getElementById('apartamento');
		var password = document.getElementById('password');
		
		evento.preventDefault();

		var user = new Parse.User();

		var moradorForm = {};
		
		moradorForm.condominio = condominio.value;
		moradorForm.apartamento = apartamento.value;
		moradorForm.nome = nomeMorador.value;
		moradorForm.telefone = telefone.value;
		moradorForm.nascimento = dataNascimento.value;
		moradorForm.email = email.value;
		moradorForm.username = username.value;
		moradorForm.password = password.value;

		user.save(moradorForm,{
			success:function(user){
				confirm('Morador Cadastrado com Sucesso!');
			}, 
			error: function(user, error){
				confirm('ERRO!');
			}
		});
	}
})
//Controler Redefinir a senha
.controller('RedefinirCtrl', function($scope, $state) {
//Application ID PARSE na primeira linha;
  //JAVASCRIPT ID PARSE na segunda linha;
Parse.initialize("",
                "");
    window.addEventListener("load",initApp);
	function initApp(){
		document.getElementById("reset").addEventListener("click", reset);
	}
	function reset(){
        email = document.getElementById('email').value;
        Parse.User.requestPasswordReset(email, {
          success: function() {
            confirm('Foi enviado um email para: '+email+'/n Verifique seu email e redifina a senha!');
          },
          error: function(error) {
            confirm('Aconteceu algum erro, entre em contato com o desenvolvedor!');
          }
        });
    }
})