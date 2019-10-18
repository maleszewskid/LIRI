require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var spot = new Spotify(keys.spotify);
var request = require('request');
var Spotify = require('node-spotify-api');
var queryUrl = "https://rest.bandsintown.com/artists/" + movieName + "/events?app_id=codecademy";
var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
var request = process.argv[2];
var search = process.argv[3];

function switchCase() {

    switch (request) {
        case 'concert-this':
            bandsInTown(search);
            break;
        case 'spotify-this-song':
            spotSong(search);
            break;
        case 'movie-this':
            movieInfo(search);
            break;
        case 'do-what-it-says':
            getRandom();
            break;
        default:
            logIt("Invalid Input");
            break;
    }
};



request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var object = JSON.parse(body);
        for (i = 0; i < object.length; i++) {
            var dTime = object[i].datetime;
            var month = dTime.substring(5, 7);
            var year = dTime.substring(0, 4);
            var day = dTime.substring(8, 10);
            var dateForm = month + "/" + day + "/" + year

            logIt("\n---------------------------------------------------\n");

            logIt("Date: " + dateForm);
            logIt("Name: " + object[i].venue.name);
            logIt("City: " + object[i].venue.city);
            if (object[i].venue.region !== "") {
                logIt("Country: " + object[i].venue.region);
            }
            logIt("Country: " + object[i].venue.country);
            logIt("\n---------------------------------------------------\n");
        }
    }
});
}

function spotSong(search) {
    var searchTrack;
    if (search === undefined) {
        searchTrack = "The Sign ace of base";
    } else {
        searchTrack = search;
    }

    spot.search({
        type: 'track',
        query: searchTrack
    }, function(error, data) {
        if (error) {
            logIt('Error occurred: ' + error);
            return;
        } else {
            logIt("\n---------------------------------------------------\n");
            logIt("Artist: " + data.tracks.items[0].artists[0].name);
            logIt("Song: " + data.tracks.items[0].name);
            logIt("Preview: " + data.tracks.items[3].preview_url);
            logIt("Album: " + data.tracks.items[0].album.name);
            logIt("\n---------------------------------------------------\n");

        }
    });
};

function logIt(dataToLog) {
    console.log(dataToLog);
    fs.appendFile('log.txt', dataToLog + '\n', function(err) {
        if (err) return logIt('Error logging data to file: ' + err);
    });
}

switchCase();

function movieInfo(search) {
    var findMovie;
    if (search === undefined) {
        findMovie = "Mr. Nobody";
    } else {
        findMovie = search;
    };


    request(queryUrl, function(err, res, body) {
        var bodyOf = JSON.parse(body);
        if (!err && res.statusCode === 200) {
            logIt("\n---------------------------------------------------\n");
            logIt("Title: " + bodyOf.Title);
            logIt("Release Year: " + bodyOf.Year);
            logIt("IMDB Rating: " + bodyOf.imdbRating);
            logIt("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value);
            logIt("Country: " + bodyOf.Country);
            logIt("Language: " + bodyOf.Language);
            logIt("Plot: " + bodyOf.Plot);
            logIt("Actors: " + bodyOf.Actors);
            logIt("\n---------------------------------------------------\n");
        }
    });
};

function bandsInTown(search) {
    if (request === 'concert-this') {
        var movieName = "";
        for (var i = 3; i < process.argv.length; i++) {
            movieName += process.argv[i];
        }
        console.log(movieName);
    } else {
        movieName = search;
    }

    function getRandom() {
        fs.readFile('random.txt', "utf8", function(error, data) {
            if (error) {
                return logIt(error);
            }

            var dataArr = data.split(",");

            if (dataArr[0] === "spotify-this-song") {
                var songcheck = dataArr[1].trim().slice(1, -1);
                spotSong(songcheck);
            } else if (dataArr[0] === "concert-this") {
                if (dataArr[1].charAt(1) === "'") {
                    var dLength = dataArr[1].length - 1;
                    var data = dataArr[1].substring(2, dLength);
                    console.log(data);
                    bandsInTown(data);
                } else {
                    var bandName = dataArr[1].trim();
                    console.log(bandName);
                    bandsInTown(bandName);
                }
            } else if (dataArr[0] === "movie-this") {
                var movie_name = dataArr[1].trim().slice(1, -1);
                movieInfo(movie_name);
            }
        });
    };