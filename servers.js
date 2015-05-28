var app = require('express')(),
   swig = require('swig');
var express=require("express");
var multer  = require('multer');
var multiparty = require('multiparty');
var app=express();
var bodyParser = require('body-parser');
var databaseUrl = "gallery";
var databaseUrl2="albums";
var azure=require('azure-storage');

var blobSvc = azure.createBlobService('imgallery','+ooOpZ195pkhCHARogYMtOyr8u9C0edW7ltUl2DDfhp2TpV8H5HTsjag/we8NVRfa12h53qR0cCPH0JuiJiDdQ==');

var collections = ["users", "albums"]
var db = require("mongojs").connect(databaseUrl, collections);
var db2= require("mongojs").connect(databaseUrl2, collections);  
var done=false;
var formidable = require('formidable');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser());
app.use(bodyParser.urlencoded());
var jsonParser = bodyParser.json();
var session = require('cookie-session');
var cookieParser = require('cookie-parser');
app.use(cookieParser('my secret here'));
var AuthPages = [ "tamplate.html" ];
var swig = require('swig');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
var crypto = require('crypto');






app.get('/:username/albums',function (req, res) {
		var albumsRead=[]
		var noRead=true;
		var albumsWrite=[];
		var username=req.params.username;
		db.albums.find({'read': username }).toArray(function(err,docs){

			if (docs.length === 0 ) {
			docs=['this user has no fucking albums!']
			res.render('albums', {albums:docs ,title:"no albums!",username:username});
			}
			else{
			for (i=0;i<docs.length;i++)
			{
			x=docs[i];
			albumsRead.push(x['name']);
			noRead=false;
			}
			db.albums.find({'write': username }).toArray(function(err,docs){

				if (noRead && docs.length === 0 ) {
				docs=['this user has no fucking albums!']
				res.render('albums', {albums:docs ,title:"no albums!",username:username});
				}
				else{
				for (i=0;i<docs.length;i++)
				{
				x=docs[i];
				albumsWrite.push(x['name']);
				}


				res.render('albums', { pagename:'i wanna go gome',albumsRead:albumsRead,albumsWrite:albumsWrite,title:"album lists",username:username});
				}
				});
			}
		});

});


app.post('/login',function(req,res,seeAlbums){

		var minute =100* 1000;
		var form = new formidable.IncomingForm();
		var username=req.body.username;
		var password=req.body.password;
		db.users.find({'username': username , 'password': password  }).toArray(function(err,docs){ 
			if (docs.length === 0 ) {
			res.send("fuckOff!!!!!!!!!!!!!!!!"); 
			} 
			else {
			res.cookie('username', username, { maxAge: minute });
			res.redirect(username+"/albums"); 
			}  
			} );


});












app.post('/newUser',function(req,res,next){
		var minute= 100  *1000;
		var username=req.body.username;
		var password=req.body.password;
		db.users.find({'username': username }).toArray(function(err,docs){ 
			if (docs.length === 0 ) {
			res.cookie('username', username, { maxAge: minute });
			db.users.insert({'username': username ,'password': password});
			if(req.body.ContentType==='application/json'){
				res.send('username added!');
				}
			else{res.redirect(username+"/albums");}
			} 
			else { 
			res.send (" the user name is taken"); 
			}  
			} );


		});


function hello(path, req,res){
	res.sendfile("./index.html");
};

app.get('/file/:file',function(req,res){
		var file=req.params.file;
		var filePath='./'+file;
		var isValid=false;
		var userArray;
		db.users.find({},{ password: 0, _id: 0}).toArray(function (err, docs){
			if (err){console.log (err);}
			for (var i=0; i<docs.length; i++){

			if (docs[i]['username'] === req.cookies.username ){
			isValid=true;
			}
			}
			var fs = require('fs');
			try {
			stats = fs.lstatSync('./'+file);
			if (stats.isFile()) {
				var auth = (AuthPages.indexOf(file) > -1);
				if ( (file === "login.html" || file=== "new_user.html") && isValid  ){
					res.redirect("/"+req.cookies.username+"/albums");

				}
				else if (  (auth && req.cookies.username) ){
					res.sendfile('./'+file);
				}
				else if ( !auth  ){

					res.sendfile("./"+file);
				}
				else{
						res.sendfile("./login.html")
				}
			}
			else{
				res.sendfile("./index.html");}
			}
			catch (e) {
				res.send('err');
			}	

		} );


});



app.post('/:album/addUserRead/:newUser', function (req, res) {
		
		var username=req.params.newUser;
		db.albums.find({"name":req.params.album,"write":req.cookies.username },function(err,docs){
		if(docs.length!==0){
		db.albums.update({'name':req.params.album },{$push:{read:username } },function(err,docs){console.log(err);res.send("user updated!")} );
		}
		else{
		res.send("you cant do that mate")
		}
		});
});





app.post('/:album/addUserWrite/:newUser', function (req, res) {
		

		var username=req.params.newUser;
                db.albums.find({"name":req.params.album,"write":req.cookies.username },function(err,docs){

                if(docs.length!==0){
                db.albums.update({'name':req.params.album },{$push:{read:username } },function(err,docs){console.log(err)} );
                 db.albums.update({'name':req.params.album },{$push:{write:username } },function(err,docs){console.log(err); res.send("user updated!")} );

		}
                else{
			res.send("you cant bloody do that!")
                }
                });
});




app.post('/albums/:album/:user/upload', function (req, res) {
		//    var blobService = azure.createBlobService();
		var blobSvc = azure.createBlobService('imgallery','+ooOpZ195pkhCHARogYMtOyr8u9C0edW7ltUl2DDfhp2TpV8H5HTsjag/we8NVRfa12h53qR0cCPH0JuiJiDdQ==');  
		var form = new multiparty.Form();
		var curl= req.cookie;
		var user=req.params.user;
		var album= req.params.album;
	//	db.albums.find({},function(err,docs){console.log(docs);console.log(err)});
		db.albums.find({'name':album,'write':user},function(err,docs){
			if(docs.length!==0){
			if(req.body.ContentType==='application/json'){
                                res.send('picture added!');

                                }
			else{
			form.on('part', function(part) {
				if (part.filename) {
				var size = part.byteCount - part.byteOffset;
				var name = part.filename;
				try{
				addImage(req.params.album,part,size,req,res)}
			
				catch(err){
			console.log(err)
			res.send("bad gateway")
				}
				} else {

				console.log("something went wrong while adding");
				}
				});
			form.parse(req);
			res.redirect("/"+req.params.album+"/images");
			}}
			else{res.send('docs is empty')}
		});
});

function addImage(albumName ,part,size,req,res){
		blobSvc = azure.createBlobService('imgallery','+ooOpZ195pkhCHARogYMtOyr8u9C0edW7ltUl2DDfhp2TpV8H5HTsjag/we8NVRfa12h53qR0cCPH0JuiJiDdQ=='); 
	console.log(part.filename)
		blobSvc.createBlockBlobFromStream(albumName, part.filename, part, size, function(error,result,resp) {
				if (error) {
				console.log(error);
				console.log(result);
				console.log(resp)
				res.send({ Grrr: error });  
				}
				else{
				res.send("sallright  my nigga")
				}
				});
}






app.post('/createNewAlbum/:username/:albumName',function(req,res){
		
		var username=req.params.username;
		var newContainer=req.params.albumName;
		console.log(newContainer);
		blobSvc.createContainerIfNotExists(newContainer,{publicAccessLevel : 'container'} ,function(error, result, response){
			if(!error){
			db.albums.insert({"name" : newContainer, "read" : [ username], "write" : [  username ], "images" : [ ] });
			if(req.body.ContentType==='application/json'){
                                res.send('album added!');

                                }
                        else{
			res.redirect("/"+username+"/albums");
			}}
			else{
			console.log(error);
			res.send("an error occured!")
			}
			});

		});














app.get('/', function(req, res){
		res.redirect('file/index.html');
		});










app.get('/:album/images', function (req, res) {

		var username=req.cookies.username;
		db.albums.find({"name":req.params.album,"read":username },function(err,docs){
			if (docs.length!==0){
			var imagesVar=[];
			var username=req.cookies.username;
			var containerName=req.params.album;
			blobSvc.listBlobsSegmented(containerName, null, function(error, result, response){
				if(!error){
				var arr=result.entries;
				console.log(result.entries);
				for (i=0;i<arr.length;i++)
				{
				x=arr[i];
				imagesVar.push(x['name']);
				}	


				res.render('images', { pagename:'i wanna go gome',images:imagesVar ,album_name:req.params.album,title:"Images",user_name:username});

				}

				else{
				}
				});


			}
			else{
				res.send("no through road!")
			}
			});


		});































		/*Run the server.*/
		app.listen(8080,function(){
		console.log("listening on port 8080")	
		});
