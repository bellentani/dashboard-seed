$(function() {
	//vars gerais
    var respWdt = 768;
    var documentWid = $(document).width();
    var documentHei = $(document).height();
    var wdwWid = $(window).width();
    var wdwHei = $(window).height();

    //Menu Global
    headMainWid = $('.main-header .container').outerWidth();
    headMainHei = $('.main-header').outerHeight();
    headMenuGlobal = $('.header-menu-global').outerHeight();
    headSumHei = headMainHei;
    headerHei = $('.header').outerHeight();

	//Exibe o conteúdo específico de cada modal basedo no clique do botão
	$('[data-user]').on('click', function(e) {
		var dataTarget = $(this).data('user');
		console.log(dataTarget);
		if (dataTarget == 'login') {
			$('#modalUserSignup').removeAttr('style');
			$('#modalUserLogin').show();
			$('#modalUserTitle').text('Login no site');
			$('#modalUser').removeClass('toggled')
		} else if (dataTarget == 'signup') {
			$('#modalUserLogin').removeAttr('style');
			$('#modalUserSignup').show();
			$('#modalUserTitle').text('Cadastre-se');
		}
	});
	$('.toggle-signup').on('click', function(event) {
		$('#modalUser').addClass('toggled');
	});

	$(document).on('hidden.bs.modal', '#modalUser', function (event) {
		if($('#modalUser').hasClass('toggled')) {
			console.log('funfou');
			$('#modalUserLogin').removeAttr('style');
			$('#modalUserSignup').show();
			$('#modalUserTitle').text('Cadastre-se');
			$('#modalUser').modal('show').removeClass('toggled');
		}
	});

	$('.avatar').on({
	  click: function() {
	    $(this).addClass('in').siblings('.resume').addClass('in');
	  }
	});
	$('.resume').on({
	  click: function() {
	    $(this).removeClass('in').siblings('.avatar').removeClass('in');
	  }
	});

	//Abre submenus
	$('.submenu-opener').on('click', function(event) {
		event.preventDefault();
		var submenu = $(this).siblings('.submenu');
		if (!submenu.hasClass('in')) {
			submenu.addClass('in');
			submenu.slideToggle(function() {
				$(this).removeClass('in');
				if ($(this).is(':visible')) {
					$(this).addClass('opened');
				} else {
					$(this).removeClass('opened');
				}
			});
		}
	});

	//Fecha as coisas se clica fora
	$(document).click(function(event) {
    if(!$(event.target).closest('.submenu').length && !$(event.target).is('.submenu, .submenu-opener')) {
      if($('.submenu').is(':visible')) {
          $('.submenu').slideUp();
      }
    }
		if(!$(event.target).closest('.avatar').length && !$(event.target).is('.avatar')) {
      $('.resume').removeClass('in').siblings('.avatar').removeClass('in');
    }
	});

	//
	if (isMobile.phone || isMobile.tablet) {

	} else {
		$(document).on('scroll', function () {
      menuTopFunc();
    });
	}

	//Smooth scroll
	$('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  //senha
  $('#signup_password').pwstrength({
    common: {
      minChar: 8
    },
    rules: {
      activated: {
        wordTwoCharacterClasses: true,
        wordRepetitions: true
      }
    },
    ui: {
      //colorClasses: ['danger', 'danger', 'danger', 'warning', 'warning', 'success'],
      showErrors: true,
      spanError: function (options, key) {
        var text = options.i18n.t(key);
        if (!text) { return ''; }
        return '<span>' + text + '</span>';
      },
      progressBarExtraCssClasses: 'pwstr',
      //showPopover: true,
      //popoverPlacement: 'top',
      useVerdictCssClass: true,
      showVerdictsInsideProgressBar: false,
      showVerdicts: true,
      verdict: ['Fraca', 'Normal', 'Média', 'Forte', 'Muito Forte'],
      // i18n pt-br
      errorMessages: {
          wordLength: 'Sua senha é muito curta',
          wordNotEmail: 'Não use seu e-mail como senha',
          wordSimilarToUsername: 'Sua senha não pode conter o seu nome de usuário',
          wordTwoCharacterClasses: 'Use diferentes classes de caracteres',
          wordRepetitions: 'Muitas repetições ',
          wordSequences: 'Sua senha contém sequências'
      },
      verdicts: ['Fraca', 'Normal', 'Média', 'Forte', 'Muito Forte'],
      // end: i18n pt-br
    }
  });

  //Validator signup
  // testar https://jqueryvalidation.org/category/methods/ > remote method
  $('#modalUserSignup').validate({
    //debug: true,
    onkeyup: false,
    errorPlacement: function(label, element) {
        label.addClass('help-block');
        label.insertAfter(element);
    },
    wrapper: 'div',
    errorElement: 'p',
    validClass: 'has-success',
    errorClass: 'has-error',
    highlight: function(element, errorClass, validClass) {
      $(element).closest('.form-group').addClass('has-error').removeClass('has-success').find('.help-block').removeClass('hidden');
      $(element).closest('.form-group').find('.ajax-checked-ok').hide();
      // $(element).on('keydown, blur', function(event) {
      //   if($(this).closest('.form-group').children('div').length > 0) {
      //     $(this).closest('.form-group').children('div:first').addClass('help-block');
      //   }
      // });
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
      //$(element.form).find("label[for=" + element.id + "]").removeClass(errorClass);
    },
    success: function(label) {
      //label.addClass('eu');
      label.parent().addClass('hidden');
      var element = label.closest('.form-group').find('input');
      if (element.attr('id') == 'signup_email') {
        //console.log('poxa');
        ajaxGo(element);
        label.parent().hide();
      }
      //console.log(element.attr('id'));
    },
    rules: {
      signup_email: {
        required: true,
        email: true
      },
      signup_password: {
        required: true,
        minlength: 5
      },
      confirm_password: {
        required: true,
        minlength: 5,
        equalTo: '#signup_password'
      }
    },
    messages: {
      signup_email: {
        required: 'Por favor, o e-mail é obrigatório.',
        email: 'Adicione um formato válido'
      },
      signup_password: {
        required: 'Escolha um password.',
        minlength: 'Senha muito curta, o tamanho mínimo é de 5 caracteres.'
      },
      confirm_password: {
        required: 'Por favor, confirme a senha.',
        minlength: 'Senha muito curta, o tamanho mínimo é de 5 caracteres',
        equalTo: 'As senhas digitadas não são iguais, digite novamente'
      }
    }
  });

  //Validator signup
  $('#modalUserLogin').validate({
    //debug: true,
    //onkeyup: false,
    errorPlacement: function(label, element) {
        label.addClass('help-block');
        label.insertAfter(element);
    },
    wrapper: 'div',
    errorElement: 'p',
    validClass: 'has-success',
    errorClass: 'has-error',
    highlight: function(element, errorClass, validClass) {
      $(element).closest('.form-group').addClass('has-error').removeClass('has-success');
      // $(element).on('keydown, blur', function(event) {
      //   if($(this).closest('.form-group').children('div').length > 0) {
      //     $(this).closest('.form-group').children('div:first').addClass('help-block');
      //   }
      // });
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    rules: {
      login_email: {
        required: true,
        email: true
      },
      login_password: {
        required: true,
        minlength: 5
      },
      confirm_password: {
        required: true,
        minlength: 5,
        equalTo: '#login_password'
      }
    },
    messages: {
      login_email: {
        required: 'Por favor, o e-mail é obrigatório.',
        email: 'Adicione um formato válido'
      },
      login_password: {
        required: 'Escolha um password.',
        minlength: 'Senha muito curta, o tamanho mínimo é de 5 caracteres.'
      }
    }
  });

  //Validator signup
  $('#resetPassword').validate({
    //debug: true,
    //onkeyup: false,
    errorPlacement: function(label, element) {
        label.addClass('help-block');
        label.insertAfter(element);
    },
    wrapper: 'div',
    errorElement: 'p',
    validClass: 'has-success',
    errorClass: 'has-error',
    highlight: function(element, errorClass, validClass) {
      $(element).closest('.form-group').addClass('has-error').removeClass('has-success');
      // $(element).on('keydown, blur', function(event) {
      //   if($(this).closest('.form-group').children('div').length > 0) {
      //     $(this).closest('.form-group').children('div:first').addClass('help-block');
      //   }
      // });
    },
    unhighlight: function(element, errorClass, validClass) {
      $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    rules: {
      password: {
        required: true,
        minlength: 5
      },
      confirm: {
        required: true,
        equalTo: '#email'
      }
    },
    messages: {
      password: {
        required: 'Escolha um password.',
        minlength: 'Senha muito curta, o tamanho mínimo é de 5 caracteres.',
      },
      confirm: {
        required: 'Confirme o password',
        equalTo: 'As senhas digitadas não são iguais, digite novamente.'
      }
    }
  });

  //ajax onblur
  $('#signup_email_').on('blur', function(e){

    //https://gist.github.com/diorahman/1520485
    //http://stackoverflow.com/questions/34376858/get-user-info-from-mongodb-w-ajax
    //http://stackoverflow.com/questions/20321291/ajax-call-to-from-mongodb-example-for-node-express
    //e.preventDefault();
    //console.log('funcionou o blur');

     /*$.ajax({
        dataType: 'jsonp',
        data: "data=yeah",
        jsonp: 'callback',
        url: 'http://localhost:3000/endpoint?callback=?',
        success: function(data) {
            console.log('success');
            console.log(JSON.stringify(data));
        }
    });*/

    var eleTarg = $(this);
    loadAjaxEle(eleTarg);

		var data = {};
		data.email = $(this).val();
    data.status = '';

		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
          url: 'http://localhost:5000/endpoint',
          success: function(data) {
              console.log('success');
              console.log(JSON.stringify(data));
              console.log(data.email);
              //return data;
              var dataSent = data.status;
              setTimeout(function() {
                dismissAjaxEle(eleTarg, dataSent);
              }, 3000);
          },
          error: function() {
            console.log('error');
          }
      });
		/*$.ajax('http://localhost:3000/endpoint', {
		        type: 'POST',
		        data: JSON.stringify(data),
		        contentType: 'application/json',
		        success: function() { console.log('success');},
		        error  : function() { console.log('error');}
		});*/
  });

});

//
//ajax function
function ajaxGo(eleTarg) {
  var eleTarg = $(eleTarg);
  loadAjaxEle(eleTarg);

  var data = {};
  data.email = $(eleTarg).val();
  data.status = '';

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/endpoint',
        success: function(data) {
            console.log('success');
            console.log(JSON.stringify(data));
            console.log(data.email);
            //return data;
            var dataSent = data.status;
            setTimeout(function() {
              dismissAjaxEle(eleTarg, dataSent);
            }, 3000);
        },
        error: function() {
          console.log('error');
        }
    });
};
