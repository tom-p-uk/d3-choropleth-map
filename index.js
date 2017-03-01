const express = require('express');

const app = express();

const routes = require('./routes/routes');

app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

routes(app);

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => console.log('Listening on', app.get('port')));
