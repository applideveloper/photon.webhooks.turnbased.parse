var hookName = "GameClose";

var fail = require('cloud/util.js').fail(hookName);
var ok = require('cloud/util.js').ok(hookName);

var db = require('cloud/db.js');
	
exports.register = function(app){

	app.post('/' + hookName, function(req, res) {
		var ctx = {hookName: hookName, ret: {ResultCode: 0, Mesage: ""}, res: res, fail: fail, ok: true};

		console.log(hookName + ": req.query = " + JSON.stringify(req.query));
		console.log(hookName + ": req.body = " + JSON.stringify(req.body));
		
		if(req.body.GameId == undefined) {
			fail(ctx, 1, "Missing GameId.");
			return;
		}

		if(req.body.State == undefined) {
			if(req.body.ActorCount > 0) {
				fail(ctx, 2, "Missing State.");
				return;
			}
			else {
				console.log(hookName + ": all actors left, we delete the game: " + req.body.GameId);
				db.delete_game_state(ctx, req.body.GameId, ok);
				return;
			}
		}
		else {
			db.set_game_and_users(ctx, req.body.GameId, req.body.State, req.body.State.ActorList, ok);
			return;
		}
	});
}

