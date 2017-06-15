const liri = (function() {

    const keys = require("./keys.js");
    const Twitter = require("twitter");
    const Spotify = require("node-spotify-api");
    const request = require("request");
    const fs = require("fs");

    let cmd = process.argv[2];
    let query = process.argv[3];

    let logicTree = function(cmd, query) {
        switch (cmd) {
            case ("my-tweets"):
                _twitter(query);
                break;
            case ("spotify-this-song"):
                _spotify(query);
                break;
            case ("movie-this"):
                _movie(query);
                break;
            case ("do-what-it-says"):
                _rand(query);
                break;
        }

    };


    let _twitter = function(query) {

        let twitter = new Twitter(keys.twitterKeys);

        twitter.get("https://api.twitter.com/1.1/statuses/home_timeline.json", function(err, tweetsArr, response) {
            if (err) throw err;

            for (let i = 0; i < tweetsArr.length; i++) {
                console.log(i, tweetsArr[i].text)
            }
        })
    }


    let _spotify = function(query) {

        let spotify = new Spotify(keys.spotifyKeys);

        query = query ? query : "The Sign";

        spotify.search({ type: 'track', query: '"' + query + '"', limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            let tracks = data.tracks.items;

            for (let i = 0; i < tracks.length; i++) {
                let artists = tracks[i].artists[0].name;
                let songTitle = tracks[i].name;
                let preview = tracks[i].preview_url;
                let album = tracks[i].album.name;

                console.log(artists, songTitle, preview, album);
            }

        });
    };

    let _movie = function(query) {

        query = query ? query : "Mr. Nobody";

        request("http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=40e9cece", function(err, res, body) {
            if (err) {
                return console.log('Error occurred: ' + res.statusCode);
            }

            let movie = JSON.parse(body);
            let title = movie.Title;
            let year = movie.Year;
            let imdb = movie.imdbRating;
            let country = movie.Country;
            let language = movie.Language;
            let plot = movie.Plot;
            let actors = movie.Actors

            console.log(title, year, imdb, country, language, plot, actors);
        })
    }

    let _rand = function(query) {
        fs.readFile("random.txt", function(err, data) {

            if (err) {
                return console.error(err);
            }

            let text = data.toString();
            let comma = text.indexOf(',');
            let cmd = text.slice(0, comma);
            let q = text.slice(comma + 1, text.length);

            logicTree(cmd, q);
        })
    }

    // console.log(keys.twitterKeys)

    logicTree(cmd, query);
})();
