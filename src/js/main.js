$(function() {
	//Exibe o conteúdo específico de cada modal basedo no clique do botão
	$('[data-user]').on('click', function(e) {
		var dataTarget = $(this).data('user');
		console.log(dataTarget);
		if (dataTarget == 'login') {
			$('#modalUserSignup').removeAttr('style');
			$('#modalUserLogin').show();
			$('#modalUserTitle').text('Login no site');
		} else if (dataTarget == 'signup') {
			$('#modalUserLogin').removeAttr('style');
			$('#modalUserSignup').show();
			$('#modalUserTitle').text('Cadastre-se');
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
      if($('.submenu').is(":visible")) {
          $('.submenu').slideUp();
      }
    }
	});
});
