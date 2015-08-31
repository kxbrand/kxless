var fs = require('fs'),
		glob = require("glob"),
		tinylr = require('tiny-lr'),
		less  =  require('less'),
		cwd_dir = process.cwd();

function _less(file){
	var _dfile = file.replace(".less",".css");
	fs.watchFile(file, {
		persistent: true,
		interval: 1000
	},function(curr, prev) {
		fs.readFile(file, function(err, data) {
      if (err) {throw new Error(err);}
      less.render(data.toString(), {}, function(err, result) {
        if (!err) {
          fs.writeFileSync(_dfile, result.css, 'utf8' );
					console.log(file + ' changed, compile ...');
        } else {
					console.log(file + ' error');
        }
      });
  	});
	});
}

//编译LESS文件
function compile(){
	glob(cwd_dir + "/**/*.less",{}, function (er, files) {
		for(var i = 0 ;i<files.length;i++){
			_less(files[i]);
		}
	});
}
//监控文件夹
function watch(){
	var server = new tinylr();
	var port = 35729;
	server.listen(port, function (err) {
	  if (err) throw err;
	  console.log('starting livereload server on ' + port);
	  glob(cwd_dir + "/**/*.{html,htm,less}",{}, function (er, files) {
			for(var i = 0 ;i<files.length;i++){
				var _pathFiles = files[i];
				fs.watchFile(_pathFiles, {
					persistent: true,
					interval: 1000
				},function(curr, prev) {
					server.changed({
			      body: {
			        files: _pathFiles
			      }
			    })
				});
			}
		});
	});
}
exports.compile = compile;
exports.watch = watch;