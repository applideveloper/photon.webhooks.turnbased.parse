var hookName = "GetGameList";

var fail = require('cloud/util.js').fail(hookName);
var ok = require('cloud/util.js').ok(hookName);

var db = require('cloud/db.js');

exports.register = function(app){

	app.post('/' + hookName, function(req, res) {
		var ctx = {hookName: hookName, ret: {ResultCode: 0, Mesage: ""}, res: res, fail: fail, ok: true};

		console.log(hookName + ": req.query = " + JSON.stringify(req.query));
		console.log(hookName + ": req.body = " + JSON.stringify(req.body));
			
		if(req.body.UserId == undefined) {
			fail(ctx, 1, "Missing UserId.");
			return;
		}
		var list = {};
		var UserGame = Parse.Object.extend("UserGame");
		var GameState = Parse.Object.extend("GameState");
		var query = new Parse.Query(UserGame);
		query.equalTo("UserId", req.body.UserId);
		
		// queries should be in ds.js module but placed here for convenience 
		var promises = [];
		query.find({success: function (results) {
			console.log(JSON.stringify(results));
			for(i in results) {
				var user_game = results[i];
				promises.push(db.get_game_state(ctx, user_game.get("GameId"), 
					function(user_game) {return function(ctx, game_state){
						if(game_state == undefined)
							db.delete_user_game(ctx, req.body.UserId, user_game.get("GameId"));
						else {
							list[user_game.get("GameId")] = {
								ActorNr : user_game.get("ActorNr"),
								Properties: game_state.CustomProperties
							};
						}
					}}(user_game)));
			}
		}, 
		error: function (error) { fail(error.code, error.message); }}
		).then(function() {
			// wait until all users games states collected
			Parse.Promise.when(promises).then(
				function() {
					ctx.ret.Data = list;
					ok(ctx);
				});
		});
	});

}
