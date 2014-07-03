var hookName = "GameEvent";

var fail = require('cloud/util.js').fail(hookName);
var ok = require('cloud/util.js').ok(hookName);

exports.register = function(app){

	app.post('/' + hookName, function(req, res) {
		var ctx = {hookName: hookName, ret: {ResultCode: 0, Mesage: ""}, res: res, fail: fail, ok: true};

		console.log(hookName + ": req.query = " + JSON.stringify(req.query));
		console.log(hookName + ": req.body = " + JSON.stringify(req.body));
		
		ok(ctx);
		return;
	});

}
