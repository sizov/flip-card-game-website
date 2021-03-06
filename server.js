var express = require('express');
const app = express();

/************************************************************
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 ************************************************************/

// Serve application file depending on environment
app.get('/flip-card-game-website.js', (req, res) => {
    if (process.env.PRODUCTION) {
        res.sendFile(__dirname + '/dist/flip-card-game-website.js');
    } else {
        res.redirect('//localhost:9090/dist/flip-card-game-website.js');
    }
});

// Serve aggregate stylesheet depending on environment
app.get('/style.css', (req, res) => {
    if (process.env.PRODUCTION) {
        res.sendFile(__dirname + '/dist/style.css');
    } else {
        res.redirect('//localhost:9090/dist/style.css');
    }
});

// Serve index page
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});


/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const config = require('./webpack.local.config');

    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        noInfo: true,
        historyApiFallback: true
    }).listen(9090, 'localhost', (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}


/******************
 *
 * Express server
 *
 *****************/

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Essential React listening at http://%s:%s', host, port);
});


/*****************
 *
 * Vlad's Socket IO setup
 *
 ****************/

var players = [];

// Setup basic express server
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log('IO connection happened');

    socket.emit('playerAssignRequest', {
        playerId: players.length
    });

    socket.on('playerAssignResponse', function (data) {
        console.log('playerAssignResponse');

        if (data.userSelection) {
            socket.emit('playerAssign', {
                playerId: data.playerId
            });

            players.push(data.playerId);
        }
    });

    socket.on('playerMove', function (move) {
        console.log('playerMove');

        //TODO: verify move validity in current game instance

        socket.broadcast.emit('playerMove', move);
    })
});