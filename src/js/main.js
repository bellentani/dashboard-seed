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
      if($('.submenu').is(":visible")) {
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
});
