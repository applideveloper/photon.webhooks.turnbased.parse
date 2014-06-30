
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

require('cloud/GameClose.js').register(app);
require('cloud/GameCreate.js').register(app);
require('cloud/GameEvent.js').register(app);
require('cloud/GameJoin.js').register(app);
require('cloud/GameLeave.js').register(app);
require('cloud/GameProperties.js').register(app);
require('cloud/GetGameList.js').register(app);

// Attach the Express app to Cloud Code.
app.listen();
