exports.fail = function(hookName) {
	return function fail(ctx, err, errstr) {
		var s = "hook " + hookName + " error: " + errstr + " (" + err + ")";
		console.error(s);
		ctx.ret.RsultCode = err
		ctx.ret.Message = s;
		ctx.res.json(ctx.ret);
		ctx.ok = false;
	}
}
exports.ok = function(hookName) {
	return function(ctx) {
		console.log("ok: " + JSON.stringify(ctx.ret));
		ctx.res.json(ctx.ret);
	}
}