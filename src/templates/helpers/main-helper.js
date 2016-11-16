module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('capitals', function (str)  {
    return str.toUpperCase();
  });
};
