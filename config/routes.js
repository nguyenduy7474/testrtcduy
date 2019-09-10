var home = require('../app/controllers/home');

//you can include all your controllers

module.exports = function (app, passport) {
    app.get('/', home.home);
    app.post('/checkuserwait', home.Checkuserwait);
    app.post('/nhanoffer', home.Nhanoffer);
    app.post('/nhananswer', home.Nhananswer);
}
