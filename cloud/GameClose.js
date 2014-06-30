var hookName = "GameClose";

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
			var promises = [];
			for(i in req.body.State.ActorList) {
				var a = req.body.State.ActorList[i];
				console.log(hookName + ": saving user game: userid: " + a.UserId + ", gameid: " + req.body.GameId + ", actornr: " + a.ActorNr);
				promises.push(db.set_user_game(ctx, a.UserId, req.body.GameId, a.ActorNr));
			}
			console.log(hookName + ": saving game: " + req.body.GameId + ", state: " + req.body.State);
			promises.push(db.set_game_state(ctx, req.body.GameId, req.body.State));
			// wait until game and all users refs saved
			Parse.Promise.when(promises).then(function() { ok(ctx); } );
			return;
		}
	});
}

