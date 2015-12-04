// 需要额外安装Redis
// 全局变量
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var port = '8000';
var redis = require('redis');
var client = redis.createClient();

// 获取html,css文件，并且在获取后调用响应函数
function reachFile(response, filePath, contentType, params) {
	fs.readFile(filePath, function(err, html) {
		if (err) throw err;
		givenResponse(response, contentType, html, params);
	});
}
// 响应函数，把获取的文件替换参数并渲染
function givenResponse(response, contentType, data, params) {
	var dataSt = data.toString();
	if (params) {
		for (var key in params) {
			dataSt = dataSt.replace('\{\{'+key+'\}\}', params[key]);	
		}
	}
	response.writeHead(200, {'Content-Type':contentType});
	response.write(dataSt);
	response.end();
}


// 获取URL中的用户名
function parseName(_url) {
	return querystring.parse(url.parse(_url).query).username;
}
// 在redis中查找当前用户数据
function foundUserInRedis(username, response) {
	if (!client.connected) {
		client.on('error', function(err) {
			console.log('Error '+err);
		});
	}
	client.hgetall(username, function(err, obj) {
		isUserExist(response, obj);
	});
}
// 判断当前用户是否已经注册，是的话获取详细信息页，否则获取注册页
function isUserExist(response, params) {
	if (params != "" && params != null) {
		reachFile(response, './information.html', 'text/html', params);
	} else {
		reachFile(response, './register.html', 'text/html');
	}
}


// 验证注册信息是否符合要求
function verifyInformation(response, params) {
	verifyRepeat(response, params);
}
// 验证注册信息是否有重复
function verifyRepeat(response, params) {
	var errMessage = "";
	if (!client.connected) {
		client.on('error', function(err) {
			console.log('Error '+err);
		});
	}
	client.hgetall(params['username'], function(err, obj) {
		var responseyet = 0;
		if (obj) {errMessage += "用户名重复   "};
		error = {'stuNum':"学号重复   ", 'phone':"电话重复   ", 'Email':"邮箱重复   "};
		client.keys('*', function(err, keys) {
			if (keys.length == 0) {
				verifyValidation(response, params, errMessage);
				return;
			}
			for (var key in keys) {
				for (var key1 in params) {
					client.hget(keys[key], key1, function(key1) {
						return function(err, obj) {
							if (obj == params[key1] && key1!='username') {
								errMessage += error[key1];
							}
							if (key == keys.length-1 && key1 == 'Email' && responseyet==0) {
								responseyet = 1;
								verifyValidation(response, params, errMessage);
							}
						}
					}(key1));
				}
			}
		});
	});
}
// 利用正则表达式验证注册信息是否有效
function verifyValidation(response, params, errMessage) {
	if (!params['username'].match(/^[a-zA-Z][a-zA-Z0-9_]{5,17}$/)) {
		if (errMessage != "") errMessage += "&#13;&#10;";
		errMessage += "用户名无效：需6~18位英文字母、数字或下划线，以英文字母开头。&#13;&#10;";
	}
	if (!params['stuNum'].match(/^[1-9][0-9]{7}$/)) {
		errMessage += "学号无效：需8位数字，不能以0开头。&#13;&#10;";
	}
	if (!params['phone'].match(/^[1-9][0-9]{10}$/)) {
		errMessage += "电话无效：需11位数字，不能以0开头。&#13;&#10;";
	}
	if (!params['Email'].match(/^[a-zA-Z_\-]+@(([a-zA-Z_\-])+\.)+[a-zA-Z]{2,4}$/)) {
		errMessage += "邮件名无效。&#13;&#10;"
	}
	finishVerify(response, params, errMessage);
}
// 完成验证后，如果没有错误信息，则转到详细信息页，否则转回注册页
function finishVerify(response, params, errMessage) {
	if (errMessage != "") {
		givenResponsWithErr(response, params, errMessage);
	} else {
		PushToRedis(params);
		reachFile(response, './information.html', 'text/html', params);
	}
}
// 注册成功需要把信息写入Redis
function PushToRedis(info) {
	if (!client.connected) {
		client.on('error', function(err) {
			console.log('Error '+err);
		});
	}
	client.hmset(info['username'], info, function(err) {
	});
}
// 带错误信息的响应函数
function givenResponsWithErr(response, params, errMessage) {
	fs.readFile('./register.html', function(err, html) {
		if (err) throw err;
		htmlSt = html.toString();
		for (var key in params) {
			htmlSt = htmlSt.replace('\"'+key+'\"', '\"'+key+'\" value=\"'+params[key]+'\"');
		}
		htmlSt = htmlSt.replace('\"error\"\>', '\"error\"\>'+errMessage);
		response.writeHead(200, {'Content-Type':'text/html'});
		response.write(htmlSt);
		response.end();
	});
}

// http服务函数，根据url和请求的方法来进行不同的响应处理
http.createServer(function(request, response) {
	var pathname = url.parse(request.url).pathname;
	var ext = path.extname(pathname);
	switch(ext) {
		case '.css':
		case '.js':
			reachFile(response, '.'+request.url, {'.css':'text/css',
							     				  '.js':'application/javascript',
							  					 }[ext]);
			break;
		default:
			var username = parseName(request.url);
			var params = "";
			var postData = "";
			if (request.method == 'POST') {
				request.addListener('data', function(portDataChunk) {
					postData += portDataChunk;
				});
				request.addListener('end', function() {
					params = querystring.parse(postData);
					verifyInformation(response, params);
				});
			} else if (username) {
				foundUserInRedis(username, response);
			} else {
				reachFile(response, './register.html', 'text/html');
			}
	}
}).listen(parseInt(port));
console.log('Server running at http://127.0.0.1:'+port+'/');

