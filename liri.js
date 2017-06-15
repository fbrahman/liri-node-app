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

            let userName = tweetsArr[0].user.name;

            console.log("Here is the a list of the last 20 tweets from " + userName + "!");
            for (let i = 0; i < tweetsArr.length; i++) {
                let tweet = tweetsArr[i].text;
                let crDate = tweetsArr[i].created_at;
               
                console.log("On " + crDate + " " + userName + " tweeted: " + tweet);
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

            console.log("Here is the information for the requested song:")

            for (let i = 0; i < tracks.length; i++) {
                let artists = tracks[i].artists[0].name;
                let songTitle = tracks[i].name;
                let preview = tracks[i].preview_url || "no preview available";
                let album = tracks[i].album.name;

                console.log("Artist: ", artists);
                console.log("Song Title: ", songTitle);
                console.log("Album: ", album);
                console.log("Song preview link: ", preview);
                // console.log(artists, songTitle, preview, album);
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

            console.log("Here is the information for the requested movie:")
            console.log("Title: ", title);
            console.log("Release Year:", year);
            console.log("Plot: ", plot);
            console.log("Actors: ", actors);
            console.log("Country of Origin: ", country);
            console.log("Language: ", language);
            console.log("IMDB rating: ", imdb);
            // console.log(title, year, imdb, country, language, plot, actors);
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
