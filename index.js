var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.get('/generic', function (request, response) {
    response.render('pages/generic');
});

app.get('/elements', function (request, response) {
    response.render('pages/elements');
});


// ML - new app.get for emotionalstatesurvey with function to connect to postgres
app.get('/emotionalstatesurvey', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        if (typeof request.param('esname') != 'undefined') {
            client.query('INSERT INTO es_table (esname, usernumber, essurveynumber, esdescription, esepisode, date) VALUES($1, $2, $3, $4, $5, $6)', [request.param('esname'), request.param('usernumber'), request.param('essurveynumber'), request.param('esdescription'), request.param('esepisode'), new Date()], function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                }
                else {
                    client.query('SELECT * FROM es_table', function (err, result) {
                        done();
                        if (err) {
                            console.error(err);
                            response.send("Error " + err);
                        } else {
                            response.render('pages/emotionalstatesurvey', {results: result.rows});
                        }
                    });
                }
            });
        } else {
            client.query('SELECT * FROM es_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/emotionalstatesurvey', {results: result.rows});
                }
            });
        }
    });
});
// ML - end of new app.get -- inserted on 7/1/2017

//Wendy Hartman app.get for adjustmentresponsesurvey with function to connect to postgres
app.get('/adjustmentresponsesurvey', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        if (typeof request.param('arname') != 'undefined') {
            // DR - Modified table and column mapping (Start)
            // ML/WH - changes made to the query line, change idnumber to usernumber (13JUL17)
            client.query('INSERT INTO adresp_table (arname, usernumber, arsurveynum, ardescription, argmquestion, armsquestion, arfrquestion, arbquestion ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [request.param('arname'), request.param('usernumber'), request.param('arsurveynum'), request.param('ardescription'), request.param('one'), request.param('two'), request.param('three'), request.param('four')], function (err, result) {
                // DR - Modified table and column mapping (Start)
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                }
                else {
                    client.query('SELECT * FROM adresp_table', function (err, result) {
                        done();
                        if (err) {
                            console.error(err);
                            response.send("Error " + err);
                        } else {
                            response.render('pages/adjustmentresponsesurvey', {results: result.rows});
                        }
                    });
                }
            });
        } else {
            client.query('SELECT * FROM adresp_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/adjustmentresponsesurvey', {results: result.rows});
                }
            });
        }
    });
});
// Wendy Hartman - end of new app.get

app.get('/faq', function (request, response) {
    response.render('pages/faq');
});

app.get('/surveyreports', function (request, response) {
    response.render('pages/surveyreports');
});

app.get('/adminLoginPage', function (request, response) {
    response.render('pages/adminLoginPage');
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

var pg = require('pg');

app.get('/dblogic', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        if (typeof request.param('id') != 'undefined') {
            client.query('INSERT INTO test_table(id, name) VALUES($1, $2)', [request.param('id'), request.param('name')], function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                }
                else {
                    client.query('SELECT * FROM test_table', function (err, result) {
                        done();
                        if (err) {
                            console.error(err);
                            response.send("Error " + err);
                        } else {
                            response.render('pages/dblogic', {results: result.rows});
                        }
                    });
                }
            });
        } else {
            client.query('SELECT * FROM test_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/dblogic', {results: result.rows});
                }
            });
        }
    });
});

app.get('/episodesurvey', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
        if (typeof request.param('title') != 'undefined') {
            // DR - Fixed mapping of table columns (Start)
            // client.query('INSERT INTO eps_table(title, location, city, country, date, user, one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)', [request.param('title'), request.param('location'), request.param('city'), request.param('country'), request.param('date'), request.param('date'), request.param('user'), request.param('one'), request.param('two'), request.param('three'), request.param('four'), request.param('five'), request.param('six'), request.param('seven'), request.param('eight'), request.param('nine'), request.param('ten'), request.param('eleven'), request.param('twelve'), request.param('thirteen'), request.param('fourteen'), request.param('fifteen'), request.param('sixteen')], function (err, result){
            client.query('INSERT INTO eps_table(eptitle, eplocation, epcity, epcountry, epdate, usernumber, epq1, epq2, epq3, epq4, epq5, epq6, epq7, epq8, epq9, epq10, epq11, epq12, epq13, epq14, epq15, epq16, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)', [request.param('title'), request.param('location'), request.param('city'), request.param('country'), request.param('date'), request.param('usernumber'), request.param('one'), request.param('two'), request.param('three'), request.param('four'), request.param('five'), request.param('six'), request.param('seven'), request.param('eight'), request.param('nine'), request.param('ten'), request.param('eleven'), request.param('twelve'), request.param('thirteen'), request.param('fourteen'), request.param('fifteen'), request.param('sixteen'), new Date()], function (err, result) {
                // DR - Fixed mapping of table columns (End)
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                }
                else {
                    client.query('SELECT * FROM eps_table', function (err, result) {
                        done();
                        if (err) {
                            console.error(err);
                            response.send("Error " + err);
                        } else {
                            response.render('pages/episodesurvey', {results: result.rows});
                        }
                    });
                }
            });
        } else {
            client.query('SELECT * FROM eps_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/episodesurvey', {results: result.rows});
                }
            });
        }
    });
});
app.get('/instructorSearch', function (request, response) {
    //There are five different retrieval forms, so use if statements to determine which was executed
    //and then call the correct searchResultsTemplate based rendering.
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {

        if (typeof request.param('exe1') != 'undefined') {
            //Call the render page searchResultsInstr1 to do query and output the results for emotional survey.
            client.query('SELECT * FROM es_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/searchResultsInstr1', {results: result.rows});
                }
            });
        } else if (typeof request.param('exe2') != 'undefined') {
            //Call the render page searchResultsInstr2 to do query and output the results for episode survey.
            client.query('SELECT * FROM eps_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/searchResultsInstr2', {results: result.rows});
                }
            });
        } else if (typeof request.param('exe3') != 'undefined') {
            //Execute All surveys all respondents for a date range
            response.render('pages/instructorSearch');
        } else if (typeof request.param('exe4') != 'undefined') {
            //Execute Retrieve all userIDs using searchResultsInstr4
            client.query('SELECT * FROM user_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/searchResultsInstr4', {results: result.rows});
                }
            });
        } else if (typeof request.param('exe5') != 'undefined') {
            //Execute Retrieve all adjustment responses using searchResultsInstr5
            client.query('SELECT * FROM adresp_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/searchResultsInstr5', {results: result.rows});
                }
            });
        } else if (typeof request.param('exe6') != 'undefined') {
            //Determine which survey type was requested, then initiate the appropriate query.

            if (request.query.six == 'Episode Surveys') {
                client.query('SELECT * FROM eps_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        response.send("Error " + err);
                    } else {
                        if (typeof result.rows[0] != 'undefined'){
                            //If we got results then render the results page which is 62
                            response.render('pages/searchResultsInstr62', {results: result.rows});
                        } else {
                            //If we don't get results then just render the original search page
                            response.render('pages/instructorSearch');
                        }
                    }
                });
            } else if (request.query.six == 'Emotional State') {
                //execute the query with usernumber on emotional state survey table & render
                client.query('SELECT * FROM es_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        response.send("Error " + err);
                    } else {
                        if (typeof result.rows[0] != 'undefined'){
                            //If we got results then render the results page which is 62
                            response.render('pages/searchResultsInstr61', {results: result.rows});
                        } else {
                            //If we don't get results then just render the original search page
                            response.render('pages/instructorSearch');
                        }
                    }
                });
            } else if (request.query.six == 'Adjustment Response') {
                //execute the query usernumber:Adjustment response table and render
                client.query('SELECT * FROM adresp_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        response.send("Error " + err);
                    } else {
                        if (typeof result.rows[0] != 'undefined'){
                            //If we got results then render the results page which is 62
                            response.render('pages/searchResultsInstr6', {results: result.rows});
                        } else {
                            //If we don't get results then just render the original search page
                            response.render('pages/instructorSearch');
                        }
                    }
                });
            }
        } else {
            //Just render the page as no query has been initiated.
            response.render('pages/instructorSearch');
        }
    });
});


//TODO: Enable post operation for database updates/inserts
    var bodyParser = require('body-parser');
    app.use(bodyParser.json()); //support json encoded bodies
    app.use(bodyParser.urlencoded({extended: true})); //support encoded bodies

//TODO: Change route to /surveyreports
    app.post('/surveyreportslogin', function (request, response) {
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            client.query('SELECT userrole FROM userauth_table WHERE username=$1 AND userpassword=$2', [request.body.username, request.body.password], function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    if (typeof result.rows[0] != 'undefined') {
                        if (result.rows[0].userrole == 'student') {
                            // response.send('Student');
                            response.render('pages/drespondentsearch');
                        } else if (result.rows[0].userrole == 'faculty') {
                            // response.send('Faculty');
                            response.render('pages/instructorSearch');
                        } else {
                            // response.send('No Match');
                            response.render('pages/surveyreports');
                        }
                    } else {
                        // response.send('Undefined');
                        response.render('pages/surveyreports');
                    }
                }
            });
        });
    });

//TODO: Add query logic
    app.get('/drespondentsearch', function(request, response) {
        pg.connect(process.env.DATABASE_URL, function(err, client, done) {
            if (typeof request.param('exe6') != 'undefined') {
                console.log('Submit action page load');
                if (request.query.six == 'Episode Surveys') {
                    console.log('Episode Surveys selected...');
                    client.query('SELECT * FROM eps_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                        done();
                        if (err) {
                            console.error(err);
                            response.send("Error " + err);
                        } else {
                            if (typeof result.rows[0] != 'undefined') {
                                // response.render('pages/drespondentresultsepisode');
                                response.render('pages/drespondentresultsepisode', {results: result.rows});
                            } else {
                                response.render('pages/drespondentsearch');
                            }
                        }
                    });
                } else if (request.query.six == 'Emotional State') {
                    console.log('Emotional State selected...');
                    client.query('SELECT * FROM es_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                        done();
                        if (err) {
                            console.error(err);
                            response.send("Error " + err);
                        } else {
                            if (typeof result.rows[0] != 'undefined') {
                                // response.render('pages/drespondentresultsepisode');
                                response.render('pages/drespondentresultsemotional', {results: result.rows});
                            } else {
                                response.render('pages/drespondentsearch');
                            }
                        }
                    });
                } else if (request.query.six == 'Adjustment Response') {
                    console.log('Adjustment Response selected...');
                    client.query('SELECT * FROM adresp_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                        done();
                        if (err) {
                            console.error(err);
                            response.send("Error " + err);
                        } else {
                            if (typeof result.rows[0] != 'undefined') {
                                // response.render('pages/drespondentresultsepisode');
                                response.render('pages/drespondentresultsadjustment', {results: result.rows});
                            } else {
                                response.render('pages/drespondentsearch');
                            }
                        }
                    });
                }
                // response.render('pages/drespondentsearch');
            } else {
                console.log('Initial page load');
                response.render('pages/drespondentsearch');
            }
        });
    });

// Down here is where I am putting the searchResultsTemplate.  You will need to add your own searchResultsX with
// the individual render logic tailored to the column names for that specific query.

// The template below was only for development and a placeholder
//Making a change to re-start.
    app.get('/searchResultsTemplate', function (request, response) {
        response.render('pages/searchResultsTemplate');
    });

    app.get('/searchResultsInstr1', function (request, response) {
        response.render('pages/searchResultsInstr1', {results: result.rows});
    });

    app.get('/searchResultsInstr2', function (request, response) {
        response.render('pages/searchResultsInstr2', {results: result.rows});
    });


    app.get('/searchResultsInstr4', function (request, response) {
        response.render('pages/searchResultsInstr4', {results: result.rows});
    });


    app.get('/searchResultsInstr5', function (request, response) {
        response.render('pages/searchResultsInstr5', {results: result.rows});
    });

    app.get('/searchResultsInstr62', function(request, response) {
        response.render('pages/searchResultsInstr62', {results: result.rows});
    });

    app.get('/searchResultsInstr61', function(request, response) {
       response.render('pages/searchResultsInstr61', {results: result.rows});
    });

    app.get('/searchResultsInstr6', function(request, response) {
       response.render('pages/searchResultsInstr6', {results: result.rows});
    });

//app.get('/rstest', function(request,response) {
//    response.render('pages/rstest');
//});


// this code was added by Wendy and Mike to use rstest as a proof of concept page
// if we get this working, then once Wendy has her HTML ready, we can use this as code reference
    app.get('/rstest', function (request, response) {
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {


            if (typeof request.param('usernumber') != 'undefined') {
                client.query('SELECT * FROM es_table WHERE usernumber=$1', function (err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        response.send("Error" + err);
                    } else {
                        response.render('pages/searchResultsRS1', {results: result.rows});
                    }
                })
            }
        })
    });

//this is here to support the search results page for rstest
    app.get('/searchResultsRS1', function (request, response) {
        response.render('pages/searchResultsRS1', {results: result.rows});
    });

// Mike - 21 Jul 17 - adding this in for the respondentSearch page
    app.get('/respondentSearch', function (request, response) {
        response.render('pages/respondentSearch');
    });

//This is here to allow the Admin to authenticate and is called from the adminLoginPage.ejs
//JH - 9-26-2017
app.post('/administrativeTasksLogin', function (request, response) {
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {

        //Here I'm going to set this up as select auth from adminauth_table and need auth column in table
        client.query('SELECT auth FROM adminauth_table WHERE adminname=$1 AND password=$2', [request.body.adminname, request.body.password], function (err, result) {
            done();
            if (err) {
                console.error(err);
                response.send("Error " + err);
            } else {

                //To Do - If there is not an error in query, then we end up here if the admin exists.
                //The response.render should be to administratives.ejs if successful, and back to login
                //if the
                if (typeof result.rows[0] != 'undefined') {
                    if (result.rows[0].auth == 'authorized') {
                        response.render('pages/administratives');

                    } else {                                      //This block is if they are not authorized, or no match
                        // response.send('No Match');
                        response.render('pages/adminLoginPage');
                    }
                } else {
                    // response.send('Undefined');
                    response.render('pages/adminLoginPage');
                }
            }
        });
    });
});

//This next block is used when the admin has successfully logged-in via administrativeTasksLogin
//and now can see the page with forms for various admin tasks.
app.get('/administratives', function (request, response) {
    response.render('pages/administratives');
});

//This next block used instructorSearch as an example and is called from administratives.ejs once
//the administrator has logged in.  This script determines what administrative task was requested
//and renders the correct administrativeActionX.ejs page as the output.  Created Oct. 9, 2017 JH

app.get('/administrativeRequest', function (request, response) {
    //There are five different administrative tasks identified so far, so use if statements to determine which was executed
    //and then call the correct administrativeActionX.ejs based rendering.
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {

        if (typeof request.param('exe1') != 'undefined') {
            //Call the render page administrativeAction1 to do query and output the UserIDs.
            /*client.query('SELECT * FROM es_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/searchResultsInstr1', {results: result.rows});
                }
            });  */
            client.query('SELECT * FROM user_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/administrativeAction1', {results: result.rows});    //Use searchResultsInstr4 as template
                }
            });
        } else if (typeof request.param('exe2') != 'undefined') {
            //Call the render page searchResultsInstr2 to do query and output the results for episode survey.
            client.query('SELECT * FROM eps_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/searchResultsInstr2', {results: result.rows});
                }
            });
        } else if (typeof request.param('exe3') != 'undefined') {
            //Execute All surveys all respondents for a date range
            response.render('pages/instructorSearch');
        } else if (typeof request.param('exe4') != 'undefined') {
            //Execute Retrieve all userIDs using searchResultsInstr4
            client.query('SELECT * FROM user_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/searchResultsInstr4', {results: result.rows});
                }
            });
        } else if (typeof request.param('exe5') != 'undefined') {
            //Execute Retrieve all adjustment responses using searchResultsInstr5
            client.query('SELECT * FROM adresp_table', function (err, result) {
                done();
                if (err) {
                    console.error(err);
                    response.send("Error " + err);
                } else {
                    response.render('pages/searchResultsInstr5', {results: result.rows});
                }
            });
        } else if (typeof request.param('exe6') != 'undefined') {
            //Determine which survey type was requested, then initiate the appropriate query.

            if (request.query.six == 'Episode Surveys') {
                client.query('SELECT * FROM eps_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        response.send("Error " + err);
                    } else {
                        if (typeof result.rows[0] != 'undefined'){
                            //If we got results then render the results page which is 62
                            response.render('pages/searchResultsInstr62', {results: result.rows});
                        } else {
                            //If we don't get results then just render the original search page
                            response.render('pages/instructorSearch');
                        }
                    }
                });
            } else if (request.query.six == 'Emotional State') {
                //execute the query with usernumber on emotional state survey table & render
                client.query('SELECT * FROM es_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        response.send("Error " + err);
                    } else {
                        if (typeof result.rows[0] != 'undefined'){
                            //If we got results then render the results page which is 62
                            response.render('pages/searchResultsInstr61', {results: result.rows});
                        } else {
                            //If we don't get results then just render the original search page
                            response.render('pages/instructorSearch');
                        }
                    }
                });
            } else if (request.query.six == 'Adjustment Response') {
                //execute the query usernumber:Adjustment response table and render
                client.query('SELECT * FROM adresp_table WHERE usernumber=$1', [request.param('usernumber')], function (err, result) {
                    done();
                    if (err) {
                        console.error(err);
                        response.send("Error " + err);
                    } else {
                        if (typeof result.rows[0] != 'undefined'){
                            //If we got results then render the results page which is 62
                            response.render('pages/searchResultsInstr6', {results: result.rows});
                        } else {
                            //If we don't get results then just render the original search page
                            response.render('pages/instructorSearch');
                        }
                    }
                });
            }
        } else {
            //Just render the page as no query has been initiated.
            response.render('pages/instructorSearch');
        }
    });
});

//The next block contains all of the administrativeActionX pages

app.get('/administrativeAction1', function (request, response) {
    response.render('pages/administrativeAction1', {results: result.rows});
});