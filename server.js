const express = require('express');
const app = express();

require('./api/startup/dbConnection')();
require('./api/startup/routing')(app);
require('./api/startup/production')(app);

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error: ', err.message)
    process.exit(1);
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`App is connecting in port no: ${port}`));