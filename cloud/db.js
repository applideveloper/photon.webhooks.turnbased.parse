// Work with persistent storage
// To handle (successful) storage request completion, pass 'success' function (called asynchronously on success) or use returned Parse.Promise object.
// On failure, methods send error response automatically using crx.fail function.

exports.set_game_state = function (ctx, game_id, game_state, fail_on_exists, success) {
	console.log("set_game_state: game_id: " + game_id + ", state: " + game_state);
	var GameState = Parse.Object.extend("GameState");
	var query = new Parse.Query(GameState);
	query.equalTo("GameId", game_id);
	return query.first({
		success: function(gameState) {
			if(gameState != undefined && fail_on_exists) {
				ctx.fail(ctx, 15, "Game already exists.");
			}
			else {
				if(gameState == undefined) {
					console.log("set_game_state: new object");
					gameState =  new GameState();
				}
				gameState.save({GameId: game_id, State: JSON.stringify(game_state)}, {error: function (gameTurnAgain, error) { ctx.fail(ctx, error.code, error.message);}}).then(
					function() {
						console.log("set_game_state: OK");
						if(success) success(ctx);
					});
			}
		},
        error: function (error) { ctx.fail(ctx, error.code, error.message); }
	})
}

exports.get_game_state = function (ctx, game_id, success) {
	console.log("get_game_state: game_id: " + game_id);
	var GameState = Parse.Object.extend("GameState");
	var query = new Parse.Query(GameState);
	query.equalTo("GameId", game_id);
	return query.first({
		success: function(x) { success(ctx, x == undefined? undefined : JSON.parse(x.get("State"))); },
        error: function (error) { ctx.fail(ctx, error.code, error.message); }
	});
}

exports.delete_game_state = function(ctx, game_id, success) {
	console.log("delete_game_state: game_id: " + game_id);
	var GameState = Parse.Object.extend("GameState");
	var query = new Parse.Query(GameState);
	query.equalTo("GameId", game_id);
	var promises = [];
	// normally should be only one result
	return query.find({success: function(results) {
		for(i in results) {
			var gameState = results[i];
			console.log("deleting " + gameState.id);
			promises.push(gameState.destroy({error: function (error) { ctx.fail(ctx, error.code, error.message);} }));
		}
	}, error: function (error) { ctx.fail(ctx, error.code, error.message);}}
	).then(function(){
		// wait until all deletions complete
		Parse.Promise.when(promises).then(
			function() {
				console.log("delete_game_state: OK");
				if(success) success(ctx);
			});
	});
}

exports.set_user_game = function(ctx, user_id, game_id, actor_nr, success) {
	console.log("set_user_game: user_id: " + user_id + ", game_id: " + game_id + ", actor_nr: " + actor_nr);	
	var UserGame = Parse.Object.extend("UserGame");
	var query = new Parse.Query(UserGame);
	query.equalTo("UserId", user_id);
	query.equalTo("GameId", game_id);
	return query.first({
		success: function(userGame) {
			if(userGame == undefined) {
				userGame =  new UserGame();
				console.log("set_user_game: new object");
			}
			userGame.save({GameId: game_id, UserId: user_id, ActorNr: actor_nr}, {error: function (gameTurnAgain, error) { ctx.fail(ctx, error.code, error.message);} } ).then(
				function() {
					console.log("set_user_game: OK");
					if(success) success(ctx);
				});
		},
        error: function (error) { ctx.fail(ctx, error.code, error.message);}
	});
}

exports.delete_user_game = function(ctx, user_id, game_id, success) {
	console.log("delete_user_game: user_id: " + user_id + ", game_id: " + game_id);
	var UserGame = Parse.Object.extend("UserGame");
	var query = new Parse.Query(UserGame);
	query.equalTo("UserId", user_id);
	query.equalTo("GameId", game_id);
	var promises = [];
	// normally should be only one result
	return query.find({success: function(results) {
		for(i in results) {
			var userGame = results[i];
			console.log("deleting " + userGame.id);
			promises.push(userGame.destroy({error: function (error) { ctx.fail(ctx, error.code, error.message);} }));
		}
	}, error: function (error) { ctx.fail(ctx, error.code, error.message);}}
	).then(function(){
		// wait until all deletions complete
		Parse.Promise.when(promises).then(
			function() {
				console.log("delete_user_game: OK");
				if(success) success(ctx);
			});
	});
}

