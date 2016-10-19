var fse = require('fs-extra');
var path = require('path');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var route = function route(req, res, next, abe) {
	var key = decodeURIComponent(req.query.k);
	var value = JSON.parse(decodeURIComponent(req.query.v));
	var fileName = req.query.f;
	var jsonPath = path.join(abe.config.root, abe.config.reference.url, fileName + '.json');
	fse.writeJson(jsonPath, value, function () {
		setTimeout(function () {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({'msg': 'done !'}));
		}, 500)
	});
};

exports.default = route
