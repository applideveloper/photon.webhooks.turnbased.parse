var hookName = "GameLeave";

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
		if(req.body.UserId == undefined) {
			fail(ctx, 2, "Missing UserId.");
			return;
		}

		if(req.body.IsInactive) {
			if(req.body.ActorNr > 0) {
				db.set_user_game(ctx, req.body.UserId, req.body.GameId, req.body.ActorNr, ok);
				return;
			}
		}
		else {
			db.delete_user_game(ctx, req.body.UserId, req.body.GameId, ok);
			return;
		}
	});
}
