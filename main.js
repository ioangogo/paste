var http = require('http');
var express = require('express');
var request = require('request');
var mysql = require('mysql');
var port = process.env.PORT;
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());
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

function sampledata_async(data) {
    console.log(data);
}


//This is for demo purposes only so there will be at least 1 blog post when deployed
function sampledata(callback){
  var subject = 'Welcome to the Paste Blogging Framework';
  var paste_data = 'This application provides a simple blogging interface for people to play with.';
  var length = 10;
  var id = "";

  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
}

mysql_connection.getConnection(function(err,connection) {
    var safe_paste_data = mysql.escape(paste_data);
    var safe_subject_data = mysql.escape(subject);
    mysql_connection.query("insert into paste (id,item,subject) values('" + id + "'," + safe_paste_data + "," + safe_subject_data + ");", function(err,rows) {
        if(err) {
            console.log('Error sending paste data', err);
        }
        connection.release();
    });
});

}
// End sample blog post

function createdb(callback){
    mysql_connection_create.getConnection(function(err,connection) {
     mysql_connection_create.query("create database " + database + ";", function(err, rows) {
        if(err) {
            console.log('Error creating database', err);
        }
        connection.release();
        createtable(createtable_async);
        sampledata();
        callback('Creating Database.....');
    });
 });
}

function createtable(callback){
    mysql_connection.getConnection(function(err, connection){
        mysql_connection.query("CREATE TABLE paste (num INT NOT NULL AUTO_INCREMENT PRIMARY KEY,id VARCHAR(1000),subject VARCHAR(1000),item VARCHAR(5000));", function(err, rows) {
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


var mini_begin_share_message = ( '<html> <head> <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/cupertino/jquery-ui.css">'
    + '<script src="//code.jquery.com/jquery-1.10.2.js"></script>'
    + ' <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>'
    + '<link rel="stylesheet" href="/resources/demos/style.css">'
    + '<script>'
    + ' $(function() {'
    + '      $( "#dialog" ).dialog();'
    + '  });'
    + ' </script>'
    + '</head>'
    + '<body background="/paste/background.png">'
    + ' <div id="resizable" class="ui-widget-content">'
    );

var begin_share_message = ( '<html> <head> <link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/cupertino/jquery-ui.css">'
    + '<script src="//code.jquery.com/jquery-1.10.2.js"></script>'
    + ' <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>'
    + '<link rel="stylesheet" href="/resources/demos/style.css">'
    + '<script>'
    + ' $(function() {'
    + '      $( "#dialog" ).dialog();'
    + '  });'
    + ' </script>'
    + '</head>'
    + '<body background="/paste/background.png">'
    + '<p align=center><a href="/"><img src="/paste/logo.png"></a></p>'
//+ '<p align=center><a href="https://github.com/rusher81572/paste"><img src="/paste/caring.png"></a></p>'
+ ' <div id="resizable" class="ui-widget-content">'
);

var end_share_mesage = ( '</div></p></body></html>'
    );

app.get('/paste/submitedit', function(req, res){
  var paste_data = req.query['text'];
  var id = req.query['id'];

  mysql_connection.getConnection(function(err,connection) {
    var safe_paste_data = mysql.escape(paste_data);
    mysql_connection.query("update paste set item=" + safe_paste_data + " where id='" + id + "';", function(err,rows) {
        if(err) {
            console.log('Error sending paste data', err);
        }
        connection.release();
    });
});

  res.end(mini_begin_share_message + '<h3 class="ui-widget-header">Your blog post is ready to share!</h3>'+ 'Your blog has been edited:<br><br><a href="' + site_name + '/show?id=' + id + '">' + site_name  + '/show?id=' + id + '</a>' + end_share_mesage);
});

app.post('/paste/search', function(req, res){
    var what = '%' + req.body.what + '%';
    var safe_search = mysql.escape(what);
    var responseString = "";
    res.write('<html><p align=center><img src=/paste/whats.png></p>'
        + '<p align=left>'
        );
    
    mysql_connection.getConnection(function(err,connection) {
        mysql_connection.query("select * from paste where item like " + safe_search +  ";", function(err, rows) { 
            if (!err)  {
                data = rows;
            }else {
                data =  "An error has occurred.";
                console.log(err);
            }
            connection.release();
            
            for (var i in data){
                res.write(mini_begin_share_message + '<h3 class="ui-widget-header">Post: <a href="' + site_name + '/show?id=' + data[i].id + '&Submit=View">' + data[i].id + '</a><a href="' + site_name + '/delete?id=' + data[i].id + '&Submit=View"><img src="/paste/delete.png" height="10" width="10"></a> <a href="' + site_name + '/edit?id=' + data[i].id + '&Submit=View"><img src="/paste/edit.png" height="10" width="10"></a></h3>' +  data[i].item + end_share_mesage);
            }
            res.end('</html>');
        });
    });

});

app.post('/paste/newpaste', function(req, res){
  var paste_data = req.body.text;
  var subject = req.body.subject;
  var length = 10;
  var id = "";

  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
}

mysql_connection.getConnection(function(err,connection) {
    var safe_paste_data = mysql.escape(paste_data);
    var safe_subject_data = mysql.escape(subject);
    mysql_connection.query("insert into paste (id,item,subject) values('" + id + "'," + safe_paste_data + "," + safe_subject_data + ");", function(err,rows) {
        if(err) {
            console.log('Error sending paste data', err);
        }
        connection.release();
    });
});

res.end(mini_begin_share_message + '<h3 class="ui-widget-header">Your blog post is ready to share!</h3>'+ 'Location to the blog post:<br><br><a href="' + site_name + '/show?id=' + id + '">' + site_name  + '/show?id=' + id + '</a>' + end_share_mesage);
});


app.get('/paste/new', function(req, res){
    var responseString = "";
    res.sendFile(__dirname + '/new.html');
});



app.get('/paste/edit', function(req, res){
    var id = req.query['id'];
    data = "";
    mysql_connection.getConnection(function(err,connection) {
        mysql_connection.query('select * from paste where id="' + id + '";', function(err, rows) { 
            if (!err)  {
                data = rows;
                if(data.length > 0) {
                    res.end(mini_begin_share_message + '<h3 class="ui-widget-header"> Edit Blog Post: ' + rows[0].subject
                        + '<form action="/paste/submitedit" id="usrform">'
                        + '<p align=center>'
                        + '<input type="hidden" name="id" value="' + rows[0].id + '">'
                        + '<textarea rows="20" cols="100" name="text" form="usrform">' + rows[0].item + '</textarea>'
                        + '<p align=center>'
                        + '<input type="submit"></form>'
                        + end_share_mesage);
                } else {
                 res.end(begin_share_message + '<h3 class="ui-widget-header">Error, paste does not exist!</h3>'+  end_share_mesage);
             }
         }else {
            data =  "An error has occurred.";
            console.log(err);
        }
        connection.release();
    });
    });
});


app.get('/paste/show', function(req, res){
    var id = req.query['id'];
    data = "";
    mysql_connection.getConnection(function(err,connection) {
        mysql_connection.query('select * from paste where id="' + id + '";', function(err, rows) { 
            if (!err)  {
                data = rows;
                if(data.length > 0) {
                    res.end(begin_share_message + '<h3 class="ui-widget-header"><a href="' + site_name + '/show?id=' + rows[0].id + '&Submit=View">' + rows[0].subject + '</a></h3>' +  rows[0].item + end_share_mesage);
                } else {
                 res.end(begin_share_message + '<h3 class="ui-widget-header">Error, blog post does not exist!</h3>'+  end_share_mesage);
             }
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
                res.end(mini_begin_share_message + '<h3 class="ui-widget-header">Deleted blog post:' + id + '</h3>'+  end_share_mesage);
            }else {
                data =  "An error has occurred.";
                console.log(err);
            }
            connection.release();
        });
    });
});

app.get('/paste/login', function(req, res){
    res.end('<html><body background="/paste/background.png"><title>Blog Admin Console!</title><head>'
        + '<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/cupertino/jquery-ui.css">'
        + '<script src="//code.jquery.com/jquery-1.10.2.js"></script>'
        + '<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>'
        + '<script> $(function() { $( "#start" ).dialog();});'
        + 'function login(){window.location = "/paste/auth" }'
        + '</script></head><body>'
        + '<div id="start" title="Blog Admin Console"><p align=left>Enter password to continue<br>'
        + '<form method="get" action="/paste/auth"><input type="text" name="password">'
        + '<input type="submit" onclick="login()"><br> </form></p> </body> </html>');
});

app.get('/', function(req, res){
    var responseString = "";
    res.sendFile(__dirname + '/index.html');
});

app.get('/paste/auth', function(req, res){
   var get_password = req.query['password'];
   if(get_password == password) {
    res.end('<html><title>Paste Admin Console!</title><head><p align=center><a href="/"><img src="/paste/logo.png"></a></p>'
        + '</head><body background="/paste/background.png"><p align=center>'
        + '<html><p align=center>'
        + ' <table style="width:10%"><tr></form></td>'
        + '</td><td><form action="/paste/admin" target="iframe_a">'
        + '<input type="hidden" name="password" value="' + password + '">'
        + '<input type="image" src="/paste/home.png" value="Home"/>'
        + '</form></td>'
      //  + '</td><td><form action="/paste/searchadmin" target="iframe_a">'
      //  + '<input type="hidden" name="password" value="' + password + '">'
       // + '<input type="image" src="/paste/search.png" value="Search"/>'
       // + '</form></td>'
        + '<td><form action="/paste/new" target="iframe_a">'
        + '<input type="image" src="/paste/newpost.png" value="Home"/>'
        + '</form></td>'
        + '</table>'
        + '<IFRAME SRC="/paste/admin?password=' + password + '" name="iframe_a" WIDTH=1200 HEIGHT=1000></html>');
} else {
   res.end(mini_begin_share_message + '<h3 class="ui-widget-header">Invalid Password!</h3>' + end_share_mesage);
}
});

app.get('/paste/admin', function(req, res){
    var data = "";
    var responseString = "";
    var get_password = req.query['password'];
    if(get_password == password) {
      res.write('<html><body background="/paste/background.png">');
      mysql_connection.getConnection(function(err,connection) {
        mysql_connection.query('select * from paste order by num desc;', function(err, rows) { 
            if (!err)  {
                data = rows;
            }else {
                data =  "An error has occurred.";
                console.log(err);
            }
            connection.release();
            for (var i in data){
                res.write(mini_begin_share_message + '<h3 class="ui-widget-header">' + data[i].subject + '<a href="' + site_name + '/delete?id=' + data[i].id + '&Submit=View"><img src="/paste/delete.png" height="10" width="10"></a> <a href="' + site_name + '/edit?id=' + data[i].id + '&Submit=View"><img src="/paste/edit.png" height="10" width="10"></a></h3>' +  data[i].item + end_share_mesage);
            }
            res.end('</html>');
        });
    });
  } else {
   res.end(mini_begin_share_message + '<h3 class="ui-widget-header">Invalid Password!</h3>' + end_share_mesage);
}
});


app.get('/paste/body', function(req, res){
    var data = "";
    var responseString = "";

    res.write('<html><body background="/paste/background.png"><p align=center><img src=/paste/whats.png></p>'
        + '<p align=left>'
        );
    mysql_connection.getConnection(function(err,connection) {
        mysql_connection.query('select * from paste order by num desc limit 10;', function(err, rows) { 
            if (!err)  {
                data = rows;
            }else {
                data =  "An error has occurred.";
                console.log(err);
            }
            connection.release();
            
            for (var i in data){
                res.write(mini_begin_share_message + '<h3 class="ui-widget-header"><a href="' + site_name + '/show?id=' + data[i].id + '&Submit=View">' + data[i].subject + '</a></h3>' +  data[i].item + end_share_mesage);
            }
            res.end('</html>');
        });
    });

});


app.get('/paste/new.html', function(req, res){
    res.sendFile(__dirname + '/new.html');
});

app.get('/paste/search', function(req, res){
    res.sendFile(__dirname + '/search.html');
});

app.get('/paste/logo.png', function(req, res){
    res.sendFile(__dirname + '/logo.png');
});

app.get('/paste/whats.png', function(req, res){
    res.sendFile(__dirname + '/whats.png');
});

app.get('/paste/delete.png', function(req, res){
    res.sendFile(__dirname + '/delete.png');
});

app.get('/paste/edit.png', function(req, res){
    res.sendFile(__dirname + '/edit.png');
});

app.get('/paste/home.png', function(req, res){
    res.sendFile(__dirname + '/home.png');
});

app.get('/paste/search.png', function(req, res){
    res.sendFile(__dirname + '/search.png');
});
app.get('/paste/home.png', function(req, res){
    res.sendFile(__dirname + '/home.png');
});
app.get('/paste/newpost.png', function(req, res){
    res.sendFile(__dirname + '/newpost.png');
});

app.get('/paste/login.png', function(req, res){
    res.sendFile(__dirname + '/login.png');
});

server.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
