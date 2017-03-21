var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express()

app.use(cors())
app.use(bodyParser.json());

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'sampleDB',
	port: 3307
});

connection.connect(function(error){
	if(!!error){
		console.log(error);
	} else {
		console.log('Connected')
	}
})

// app.use(express.static(__dirname + "/public"));

app.get('/', function(req, resp){
	connection.query("Select userSections.ID, userSections.userID, userSections.status, userSections.correct, userSections.incorrect, userSections.blank, userSections.completed, sections.sectionType, userSections.valid from userSections Inner Join sections on userSections.sectionId = sections.ID", function(error, rows, fields){
		if(!!error){
			console.log('Error in query')
		}else {
			resp.json(rows);
		}
	});
})

app.post('/', function(req, resp){
	console.log(req.body.id)
	var beginingDate = new Date("August 31, 2016");
	var endDate = new Date("October 1, 2016");
	connection.query("Select userSections.ID, userSections.userID, userSections.status, userSections.correct, userSections.incorrect, userSections.blank, userSections.completed, sections.sectionType, userSections.valid from userSections Inner Join sections on userSections.sectionId = sections.ID where userSections.ID = "+req.body.id+"", function(error, rows, fields){
		var totalQuestions = rows[0].correct + rows[0].incorrect + rows[0].blank;
		console.log(rows[0].blank/totalQuestions);
		if(!!error){
			console.log('Error in query')
		}else {
			// 
			if(rows[0].sectionType === 'essay' || rows[0].userID === 1 || (beginingDate < rows[0].completed && endDate > rows[0].completed) || (rows[0].blank/totalQuestions) > .337)
			{
				connection.query("Update userSections set valid = 2 where userSections.ID="+req.body.id+"", function(error, rows, fields){
				if(!!error){
					console.log('Error in query')
				}else {
					resp.json({"error": false});
				}
				})
			} else 
			if (rows[0].status === 2 || rows[0].status === 5 )
			{
				connection.query("Update userSections set valid = 0 where userSections.ID="+req.body.id+"", function(error, rows, fields){
				if(!!error){
					console.log('Error in query')
				}else {
					resp.json({"error": false});

				}
				})
			}else 
			{
				connection.query("Update userSections set valid = 1 where userSections.ID="+req.body.id+"", function(error, rows, fields){
				if(!!error){
					console.log('Error in query')
				}else {
					console.log('Update')
					resp.json({"error": false});

				}
				})
			}
			
		}
	});
})

app.listen(1337);
