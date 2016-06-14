//Menu superior fixo
function menuTopFunc () {
    if ($(window).scrollTop() > headSumHei) {
        $('.main-header').addClass('menu-fixed');
        $('main').addClass('menu-fixed-body');

        //Checa se a posiÃ§Ã£o do menu Ã© negativa
        if ($('.main-header.menu-fixed').css('top') == '-80px') {
            $('.main-header.menu-fixed').animate({
                top: 0
            }, 500);
        }
        /*if ($('.main-header').length > 0) {
            $('main').addClass('menu-fixed-body');
        }*/
        //Posiciona o menu no local correto
        if ($('.main-header').hasClass('menu-fixed')) {
            $('.main-header-menu-global').removeClass('active-menu');
            $('.main-header.menu-fixed .main-menu').removeClass('in');
        }
    }
    //Adiciona o menu quando nÃ£o Ã© rolagem. Refazer animaÃ§Ã£o
    else {
        $('.main-header.menu-fixed').removeAttr('style').removeClass('menu-fixed').find('.main-menu').removeClass('in');
        $('main').removeClass('menu-fixed-body');
        $('.main-header .icon-menu').fadeOut('slow').removeClass('in');
    }
    $('.menu-global').find('.dropdown-menu').removeAttr('style');
    $('.search-top input').blur();
    //console.log($(window).scrollTop());
};

function loadAjaxEle(eleTarg) {
  $(eleTarg).parent().children('.ajax-form-loader').find('.ajax-checking:hidden').fadeIn();
  $(eleTarg).siblings('.ajax-form-loader').find('.ajax-checked-ok:visible').fadeOut();
}
function dismissAjaxEle(eleTarg, dataSent) {
  console.log('some');
  if (dataSent == 'email livre') {
    $(eleTarg).parent().children('.ajax-form-loader').find('.ajax-checking:visible').fadeOut();
    $(eleTarg).parent().children('.ajax-form-loader').find('.ajax-checked-ok.bg-success').fadeIn();
    $(eleTarg).closest('form').find('input[type="submit"]').removeAttr('disabled')
  } else if (dataSent == 'email existe') {
    $(eleTarg).parent().children('.ajax-form-loader').find('.ajax-checking:visible').fadeOut();
    $(eleTarg).parent().children('.ajax-form-loader').find('.ajax-checked-ok.bg-danger').fadeIn();
    $(eleTarg).closest('form').find('input[type="submit"]').attr('disabled')
  }
}
