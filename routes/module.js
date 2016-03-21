var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');

//bring in pg module
var pg = require('pg');
var connectionString = '';
if (process.env.DATABASE_URL !== undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
} else {
  connectionString = 'postgres://localhost:5432/task_master';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//when task is added - by default - the new row contains a false tag
//under the completed column of the SQL table
router.post('/', function(req, res) {
  console.log(req.body);
  var addTask = {
    task: req.body.task,
    complete: 'false'
  };

  pg.connect(connectionString, function(err, client, done) {
    client.query("INSERT INTO task_table (task, complete) VALUES ($1, $2)",
      [addTask.task, addTask.complete],
      function (err, result) {
        done();
        if(err) {
          console.log("Error inserting data: ", err);
          res.send(false);
        } else {
          res.send(result);
        }
      });
  });
});

//when delete button is clicked - task is removed from SQL table
router.post('/remove', function(req, res) {
  console.log(req.body);
  var removeTask = {
    id: req.body.id,
  };

  pg.connect(connectionString, function(err, client, done) {
    client.query('DELETE FROM task_table WHERE id = ($1)',
      [removeTask.id],
      function (err, result) {
        done();
        if(err) {
          console.log("Error inserting data: ", err);
          res.send(false);
        } else {
          res.send(result);
        }
      });
  });
});

//when check box is clicked for task - its row will switch to true under
//complete column
router.post('/switch', function(req, res) {
  console.log(req.body);
  var switchStatus = {
    id: req.body.id,
    complete: req.body.complete
  };

  pg.connect(connectionString, function(err, client, done) {
    client.query('UPDATE task_table SET complete = ($1) WHERE id = ($2)',
      [switchStatus.complete, switchStatus.id],
      function (err, result) {
        done();
        if(err) {
          console.log("Error inserting data: ", err);
          res.send(false);
        } else {
          res.send(result);
        }
      });
  });
});

// get data route
router.get('/newtask', function(req, res) {
  var results = [];
  pg.connect(connectionString, function (err, client, done) {
    var query = client.query('SELECT * FROM task_table WHERE complete = false');
    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // close connection
    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});

// get data route
router.get('/completedtask', function(req, res) {
  var results = [];
  pg.connect(connectionString, function (err, client, done) {
    var query = client.query('SELECT * FROM task_table WHERE complete = true');
    // Stream results back one row at a time
    query.on('row', function(row) {
      results.push(row);
    });
    // close connection
    query.on('end', function() {
      client.end();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});

module.exports = router;
