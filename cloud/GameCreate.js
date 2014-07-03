var hookName = "GameCreate";

var fail = require('cloud/util.js').fail(hookName);
var ok = require('cloud/util.js').ok(hookName);


var db = require('cloud/db.js');

exports.register = function(app){

	app.post('/' + hookName, function(req, res) {
		var ctx = {hookName: hookName, ret: {ResultCode: 0, Mesage: ""}, res: res, fail: fail, ok: true};

		console.log(hookName + ": req.query = " + JSON.stringify(req.query));
		console.log(hookName + ": req.body = " + JSON.stringify(req.body));
		
		if(req.body.Type == undefined) {
			fail(ctx, 4, "Missing Type.");
			return;
		}
		if(req.body.GameId == undefined) {
			fail(ctx, 1, "Missing GameId.");
			return;
		}
		if(req.body.UserId == undefined) {
			fail(ctx, 2, "Missing UserId.");
			return;
		}
		if(req.body.Type == "Load") {
			db.get_game_state(ctx, req.body.GameId, function(ctx, game_state) {
				if(game_state == undefined) {
					if(req.body.CreateIfNotExists) {
						console.log("GameId not Found, but this is a join with CreateIfNotExists => returning OK.");
						ok(ctx);
						return;
					}
					else {
						fail(ctx, 3, "GameId not Found.");
						return;
					}
				}
				else {
					if(game_state != "") {
						ctx.ret.State = game_state;
					}
					ok(ctx);
					return;
				}
			});
		}			
		else {
			db.set_game_state(ctx, req.body.GameId, "", true, ok);
			return;
		}
	});

}
