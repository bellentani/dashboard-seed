$(function() {
    $('[data-user]').on('click', function(e) {
      var dataTarget = $(this).data('user');
      //console.log(dataTarget);
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
});
