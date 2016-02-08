var http = require('http');
var express = require('express');
var request = require('request');
var mysql = require('mysql');
var port = process.env.PORT;
var app = express();
var server = require("http").createServer(app);
var data = [];
var database = 'paste';
var dbURL = process.env.MYSQL_URI;
var mysql_connection = mysql.createPool(dbURL + database);
var mysql_connection_create = mysql.createPool(dbURL);
var password = process.env.PASSWORD;
var site_name = process.env.SITE_NAME;

createdb(createdb_async);

function createdb_async(data) {
    console.log(data);
}

function createtable_async(data) {
    console.log(data);
}

function createdb(callback){
    mysql_connection_create.getConnection(function(err,connection) {
     mysql_connection_create.query("create database " + database + ";", function(err, rows) {
        if(err) {
            console.log('Error creating database', err);
        }
        connection.release();
        createtable(createtable_async);
        callback('Creating Database.....');
    });
 });
}

function createtable(callback){
    mysql_connection.getConnection(function(err, connection){
        mysql_connection.query("CREATE TABLE paste (id VARCHAR(1000),item VARCHAR(5000));", function(err, rows) {
            if(err) {
                console.log('Error creating table',err);
            }
            callback('Creating Table......');
            connection.release();
        });
    });
}

function createdb_async(data) {
    console.log(data);
}

function createtable_async(data) {
    console.log(data);
}


var defaultHTML = (
    '<html>'
    );



var begin_share_message = ( '<html> <head> <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">'
    + '<script src="//code.jquery.com/jquery-1.10.2.js"></script>'
    + ' <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>'
    + '<link rel="stylesheet" href="/resources/demos/style.css">'
    + '<script>'
    + ' $(function() {'
     + '      $( "#dialog" ).dialog();'
     + '  });'
+ ' </script>'
+ '</head>'
+ '<body>'
+ '<p align=center><a href="/"><img src="/paste/from.png"></a></p>'
+ '<p align=center><a href="https://github.com/rusher81572/paste"><img src="/paste/caring.png"></a></p>'
+ ' <div id="resizable" class="ui-widget-content">'
);

var end_share_mesage = ( '</div></p></body></html>'
    );

app.get('/paste/newpaste', function(req, res){
  var paste_data = req.query['text'];
  var length = 10;
  var id = "";

  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
}

mysql_connection.getConnection(function(err,connection) {
    var safe_paste_data = mysql.escape(paste_data);
    mysql_connection.query("insert into paste (id,item) values('" + id + "'," + safe_paste_data + ");", function(err,rows) {
        if(err) {
            console.log('Error sending paste data', err);
        }
        connection.release();
    });
});

res.end(begin_share_message + '<h3 class="ui-widget-header">Your paste is ready to share!</h3>'+ 'Your paste is available here:<br><br><a href="' + site_name + '/show?id=' + id + '">' + site_name  + '/show?id=' + id + '</a>' + end_share_mesage);
});


app.get('/paste/new', function(req, res){
    var responseString = "";
    res.sendFile(__dirname + '/new.html');
});

app.get('/paste/show', function(req, res){
    var id = req.query['id'];
    data = "";
    mysql_connection.getConnection(function(err,connection) {
        mysql_connection.query('select * from paste where id="' + id + '";', function(err, rows) { 
            if (!err)  {
                data = rows;
                res.end(begin_share_message + '<h3 class="ui-widget-header">Viewing shared post: ' + rows[0].id + '</h3>'+ rows[0].item + end_share_mesage);

            }else {
                data =  "An error has occurred.";
                console.log(err);
            }
            connection.release();
        });
    });
});

app.get('/paste/delete', function(req, res){
    var id = req.query['id'];
    data = "";
    mysql_connection.getConnection(function(err,connection) {
        mysql_connection.query('delete from paste where id="' + id + '";', function(err, rows) { 
            if (!err)  {
                data = rows;
                res.end('<html>Deleted post:'+ id);
            }else {
                data =  "An error has occurred.";
                console.log(err);
            }
            connection.release();
        });
    });
});

app.get('/paste/login', function(req, res){
    var responseString = "";
    res.sendFile(__dirname + '/login.html');
});


app.get('/', function(req, res){
    var responseString = "";
    res.sendFile(__dirname + '/index.html');
});

app.get('/paste/body', function(req, res){
    var data = "";
    var responseString = "";
    res.write('<html><p align=center><img src=/paste/whats.png></p>'
        + '<p align=left>'
        );
    mysql_connection.getConnection(function(err,connection) {
        mysql_connection.query('select * from paste;', function(err, rows) { 
            if (!err)  {
                data = rows;
            }else {
                data =  "An error has occurred.";
                console.log(err);
            }
            connection.release();
            for (var i in data){
                res.write(begin_share_message + '<h3 class="ui-widget-header">Paste ID: <a href="' + site_name + '/delete?id=' + data[i].id + '&Submit=View"><img src="/paste/delete.png" height="10" width="10"></a> <a href="' + site_name + '/show?id=' + data[i].id + '&Submit=View">' + data[i].id + '</a>' + '.</h3>' +  data[i].item + end_share_mesage);
             
           }
           res.end('</html>');
       });
    });

});

app.get('/paste/new.html', function(req, res){
    res.sendFile(__dirname + '/new.html');
});

app.get('/paste/logo.png', function(req, res){
    res.sendFile(__dirname + '/logo.png');
});

app.get('/paste/dare.png', function(req, res){
    res.sendFile(__dirname + '/dare.png');
});


app.get('/paste/whats.png', function(req, res){
    res.sendFile(__dirname + '/whats.png');
});

app.get('/paste/delete.png', function(req, res){
    res.sendFile(__dirname + '/delete.png');
});

app.get('/paste/caring.png', function(req, res){
    res.sendFile(__dirname + '/caring.png');
});

app.get('/paste/from.png', function(req, res){
    res.sendFile(__dirname + '/from.png');
});

server.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
