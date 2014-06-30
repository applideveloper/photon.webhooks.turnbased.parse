var hookName = "GameProperties";

var fail = require('cloud/util.js').fail(hookName);
var ok = require('cloud/util.js').ok(hookName);

var db = require('cloud/db.js');

exports.register = function(app){

	app.post('/' + hookName, function(req, res) {
		var ctx = {ret: {ResultCode: 0, Mesage: ""}, res: res, fail: fail, ok: true};

		console.log(hookName + ": req.query = " + JSON.stringify(req.query));
		console.log(hookName + ": req.body = " + JSON.stringify(req.body));

		if(req.body.GameId == undefined) {
			fail(ctx, 1, "Missing GameId.");
			return;
		}
		if(req.body.State != undefined) {
			console.log(hookName + ": saving game: " + req.body.GameId + ", state: " + req.body.State);
			db.set_game_state(ctx, req.body.GameId, req.body.State, false, ok);
			return;
		}
	});

}
