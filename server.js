var http = require("http");
var url = require("url");
var fs = require("fs");
var querystring = require('querystring');
var path = require("path");
var graph = require("graphql");

//实例化Graph查询库
var schema = new graph.GraphQLSchema({
	query: new graph.GraphQLObjectType({
		name: 'RootQueryType',
		fields: {
			hello: {
				type: graph.GraphQLString,
				resolve: function(){
					return "world"
				}
			}
		}
	})
});


//服务器
var server = http.createServer(function(req,res){
	var _parse = url.parse(req.url);
	var _pathname = _parse.pathname;

	if(_pathname == '/graph'){
		var postData = '';

		req.on("data",function(chunk){//累加post数据
			postData += chunk;		
		})

		req.on("end",function(){//request读取完时
			res.writeHead( 200 , { 'Content-Type' : 'application/json;charset=utf-8'});
			var params = querystring.parse(postData);
			var query = params.query || "";

			graph.graphql(schema, query).then(function(result){//graph查询
				res.write(JSON.stringify(result));
				res.end();
			});

		})
		
	}else if(_pathname == '/jquery.js'){//jquery

		res.writeHead( 200 , { 'Content-Type' : 'text/javascript'});
		var _file = fs.readFileSync(path.join(__dirname, _pathname));
		res.write(_file,"binary");
		res.end();

	}else{//页面
		
		res.writeHead( 200 , { 'Content-Type' : 'text/html;charset=utf-8' });
		var _file = fs.readFileSync("index.html",'utf-8');
		res.write(_file);
		res.end();
	}

})


console.log("server is running at http://localhost:8088")

server.listen(8088);