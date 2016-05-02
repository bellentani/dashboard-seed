require('/config/user');

var newUser = new User;

newUser.email = email;
newUser.name = name;
newUser.permission = permission;

newUser.save(function(err) {
  if (err) {
    return handleError(err);
  } else {
    console.log('foi mamae')
  }
});
