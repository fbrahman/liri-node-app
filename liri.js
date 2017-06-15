const liri = (function() {

    const keys = require("./keys.js");
    const Twitter = require("twitter");
    const Spotify = require("node-spotify-api");
    const request = require("request");
    const fs = require("fs");

    let cmd = process.argv[2];
    let query = process.argv[3];

    let _logicTree = function(cmd, query) {

        _log("request", cmd, query);

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
            let resultsArray = [];
            let tweetStrHdr = ("Here is the a list of the last 20 tweets from " + userName + "!");

            console.log(tweetStrHdr);
            resultsArray.push(tweetStrHdr);

            for (let i = 0; i < tweetsArr.length; i++) {
                let tweet = tweetsArr[i].text;
                let crDate = tweetsArr[i].created_at;
                let tweetStr = ("On " + crDate + " " + userName + " tweeted: " + tweet); 

                console.log(tweetStr);
                resultsArray.push(tweetStr);
            }

            _log("result", resultsArray);
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
            let resultsArray = [];
            let trkHeader = ("Here is the information for the requested song:");
            resultsArray.push(trkHeader);

            for (let i = 0; i < tracks.length; i++) {
                let artists = tracks[i].artists[0].name;
                let songTitle = tracks[i].name;
                let preview = tracks[i].preview_url || "no preview available";
                let album = tracks[i].album.name;

                let artistStr =("Artist: " + artists);
                let songStr = ("Song Title: " + songTitle);
                let albumStr = ("Album: " + album);
                let previewStr = ("Song preview link: " + preview);

                resultsArray.push(artistStr, songStr, albumStr, previewStr);
            }

            for (let j = 0; j < resultsArray.length; j++){
                console.log(resultsArray[j])
            }

            _log("result", resultsArray);
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
            let actors = movie.Actors;
            let resultsArray = [];

            let movieHdr = ("Here is the information for the requested movie:")
            let titleStr = ("Title: " + title);
            let yearStr = ("Release Year:" + year);
            let plotStr = ("Plot: " + plot);
            let actorStr = ("Actors: " + actors);
            let countryStr = ("Country of Origin: " + country);
            let languageStr = ("Language: " + language);
            let imdbStr = ("IMDB rating: " + imdb);

            resultsArray.push(movieHdr, titleStr, yearStr, plotStr, actorStr, countryStr, languageStr,imdbStr);
            
            for (let j = 0; j < resultsArray.length; j++){
                console.log(resultsArray[j])
            }

            _log("result", resultsArray);
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

            _logicTree(cmd, q);
        })
    }

    let _log = function(type) {
        let log = fs.createWriteStream("log.txt", { "flags": "a" });

        if (type === "request") {
            let cmd = arguments[1];
            let query = arguments[2]||"default option"
            
            log.write("User request: " + cmd + " " + query + "\n");

        } else if (type === "result") {
            let resultsArray = arguments[1];

            for(let i = 0; i < resultsArray.length; i++){
                log.write(resultsArray[i]+"\n");
            };

            log.end("\n")
        }
    }

    _logicTree(cmd, query);

})();
