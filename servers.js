var express=require("express");
var multer  = require('multer');
var multiparty = require('multiparty');
var app=express();
var bodyParser = require('body-parser');
var databaseUrl = "users" // "username:password@example.com/mydb"
var collections = ["users", "albums"]
var db = require("mongojs").connect(databaseUrl, collections);
//app.use(express.bodyParser());
var done=false;
var azure=require('azure-storage');
//app.use(express.urlencoded());
var formidable = require('formidable');
//app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser());
app.use(bodyParser.urlencoded());
var jsonParser = bodyParser.json()



//function seeAlbums(res,username){
//db.albums.find({"read":"newAlbum"})
// 

//arr

//res.send(arr)



//}




	app.post('/login',function(req,res,seeAlbums){

			console.log('6666666666666666666666666666666666666666666666666666666666666');
			var form = new formidable.IncomingForm();
			//form.parse(req, function (err, fields) {
			//	console.log(fields.parameter1);
			//		console.log(fields.parameter2);
			//		});
			var username=req.body.username;
			var password=req.body.password;
			console.log(req.body);
			//console.log(req);
			//var password = req.body.split[1];
			//db.users.insert({'username': username , 'password': password });
			db.users.find({'username': username , 'password': password  }).toArray(function(err,docs){ 
				if (docs.length === 0 ) {
					res.send("fuckOff!!!!!!!!!!!!!!!!"); 
					console.log(docs); 
					console.log(docs.length);
			 	} 
				else { 
					res.send ("you will be soon redirect to right page"); 
					seeAlbums(res,username,true); 
				}  
			} );
			//			db.users.find({},function(err,docs){
			//			console.log(err);
			//			console.log(docs)	});


			});
//db.users.insert({username: 'dsds', password: 'ssss'});


function seeAlbums (res,suername, isOK )
{
	if (isOK)
	{
		
	}
}





app.post('/newUser',function(req,res,next){

	console.log("in new user");
	var username=req.body.username;
        var password=req.body.password;

	db.users.find({'username': username }).toArray(function(err,docs){ 
		if (docs.length === 0 ) {
			res.send("you are added to the system"); 
			db.users.insert({'username': username ,'password': password}); 
			//next(); 
		} 
		else { 
			res.send (" the user name is taken"); 
		}  
	} );


});


app.get('/',function(req,res){
		console.log("in iddddddddddddddddddddddddddddddddddndex");
		//res.sendfile("./uploads/121432026802614.jpg");
		res.sendfile("./index.html");
		});

app.get('/file/:file',function(req,res){
		var file=req.params.file;
		console.log(req.params.file);
		var filePath='./'+file;
		console.log(filePath);

		var fs = require('fs');
		try {
		// Query the entry
		stats = fs.lstatSync('./'+file);

		// Is it a directory?
		if (stats.isFile()) {

		res.sendfile('./'+file);
		}
		else
		{
		res.sendfile("./index.html");}
		}
		catch (e) {
			res.send('err');
		}
		//res.sendfile("./uploads/121432026802614.jpg");
});

app.get('/uploads',function(req,res){
		var myFilename= req.body.filedname;
		//headers['filename'];
		console.log("im here");
		console.log(req.body);
		res.sendfile("./uploads/"+myFilename);
		});


app.post('/api/photo',function(req,res){
		if(done==true){
		console.log(req.files);
		res.end("File uploaded.");
		}
		else{
		res.end("sssssssssssssssss");
		}
		});


app.post('/uploadImage', function (req, res) {
                //    var blobService = azure.createBlobService();
                var blobSvc = azure.createBlobService('imgallery','+ooOpZ195pkhCHARogYMtOyr8u9C0edW7ltUl2DDfhp2TpV8H5HTsjag/we8NVRfa12h53qR0cCPH0JuiJiDdQ==');
                var form = new multiparty.Form();
                console.log("go fuck yourself");
		console.log(req.albumName)
                form.on('part', function(part) {
			
                        if (part.filename) {
                        console.log(part.filename.split('.')[0]);
                        var size = part.byteCount - part.byteOffset;
                        var name = part.filename;
                        try{addImage(req.albumName,part,size,req,res)}
                        catch(err){
                        res.send(err)
                        }
                        } else {
 //                       console.log(part)
                        console.log("something went wrong while adding");
                        console.log(part.filename);
                        }
                        });
                form.parse(req);
                res.send('OK');
});

function addImage(albumName ,part,size,req,res){
                console.log("addimage nigga!")
 blobSvc = azure.createBlobService('imgallery','+ooOpZ195pkhCHARogYMtOyr8u9C0edW7ltUl2DDfhp2TpV8H5HTsjag/we8NVRfa12h53qR0cCPH0JuiJiDdQ==');
        console.log(part.filename)
        console.log(part)
        console.log(size)
        console.log(albumName)
        var albumName2="fuckdick69";
        console.log("hof is a dickfuck")
        blobSvc.createBlockBlobFromStream(albumName2, part.filename, part, size, function(error) {
                                if (error) {
                                console.log("blob insert failed")
                                console.log(error)
                                res.send({ Grrr: error });
                                }
                                else{
                                        res.send("sallright  my nigga")
                                }
                });

                db.albums.update({'name':albumName}, {$push:{'images': file_name}}, {multi:true}, function() {
                console.log('mongo db updated nigga!')
                });

}







/*Run the server.*/
app.listen(8080,function(){
		console.log("Working on port 3000");
		});
