/**
 * DemoController
 Contains the controller methods for both excercises
 */
var fs =  require('fs');
module.exports = {
	'exsub' : function(req, res, next) {
			res.view();
	},

	'pic' : function(req, res, next) {
		res.view();
	},

	//following action serves the logic for first excecise
	'sub1' : function(req, res, next) {

		//getting input from textarea
		try {
			//callback for readFile
				function loadtodb(data) {
						var message = req.param('message');
						//loading to database
						Demo.create({
							texts : message,
							 fileinp : data
						}, function(err,res) {
								if(err) {
									throw new Error('something wrong with database insertion');
								}
								res.redirect('/demo/exsub');
						});
				}
				//callback of upload function
				function readfromfile(err, uploadedfile) {
							if(err) {
								throw new Error(' something wrong with reading from file ' + err);
							}
							//reading contents of file, parameter data will hold the read value
							fs.readFile(uploadedfile[0].fd, 'utf8', function(err, data){
									if(err) {
										throw new Error(' somethins wrong with reading');
									}
									loadtodb(data);
							});
				}
				//uploading the file to .tmp folder so that we can read the contents.
				var tempath = '../../assets/images/files/';
				req.file('filer').upload({
					dirname : tempath
				}, readfromfile);

		}catch(e) {
			console.log(e);
		}

	},

	//the following action serves for the second excercise.
	'sub2' : function(req, res, next) {
		var temp = '../../assets/images/imgs/'
		//uploading the image
		req.file('imge').upload({
			dirname : temp
		}, function(err, uploadedFile) {
					//storing the image as binary data in mongodb
					var bin = fs.readFileSync(uploadedFile[0].fd);
					Demo2.create({
						texts : req.param('texted'),
						imaged : bin
					}, function(err, result) {
						if(err) console.log(err);
						//getting the file name
						var fname = uploadedFile[0].fd.substring(uploadedFile[0].fd.lastIndexOf('/') + 1)
						var backurl = '';
						var backurl = '/demo/pic'+'?pt='+fname;
						//redirecting with the filename as GET parameter for viewing.
						res.redirect(backurl);
					});
		});


	}
};
