var hookName = "GameProperties";

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
		if(req.body.State != undefined) {
			var properties = req.body.Properties;
			if (properties && properties.turn) {
				console.log(hookName + ": ======== Push to #" + properties.turn);
				for(i in req.body.State.ActorList) {
					var a = req.body.State.ActorList[i];
					if (a.ActorNr == properties.turn) {
						console.log(hookName + ": ======== Push to " + a.UserId);
						Parse.Push.send({
							channels: [ "u-" + a.UserId ],
							data: {
								alert: "It's your turn, " + a.UserId + "!"
							}
						}, {
							success: function() {
								console.log(hookName + ": ======== Push to " + a.UserId + " OK");
							},
							error: function(error) {
								console.log(hookName + ": ======== Push to " + a.UserId + " error: " + errstr + " (" + err + ")");
							}
						});			

						break;
					}
                }
			}	

			console.log(hookName + ": saving game: " + req.body.GameId + ", state: " + req.body.State);
			db.set_game_state(ctx, req.body.GameId, req.body.State, false, ok);
			// probably calling db.set_game_and_users(...) is excessive here
			return;
		}
	});

}
