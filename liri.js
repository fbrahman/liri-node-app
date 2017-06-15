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
                console.log("tweets");
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

    let spotify = new Spotify({
        id: "35203e78173846e6978ed40ac28de587",
        secret: "54cd0ad8674a4998a227d78cb21e01fa"
    });

    let _spotify = function(query){

    	query = query?query:"The Sign";

    	spotify.search({ type: 'track', query: '"'+query+'"', limit: 1 }, function(err, data) {
    	    if (err) {
    	        return console.log('Error occurred: ' + err);
    	    }

    	    let tracks = data.tracks.items;

    	    for (var i = 0; i < tracks.length ; i++) {
    	    	let artists = tracks[i].artists[0].name;
    	    	let songTitle = tracks[i].name;
    	    	let preview = tracks[i].preview_url;
    	    	let album = tracks[i].album.name;

    	    	console.log(artists, songTitle, preview, album);
    	    }

    	});
    };

    let _movie = function (query){
    	
    	query = query?query:"Mr. Nobody";

    	request("http://www.omdbapi.com/?t="+ query +"&y=&plot=short&apikey=40e9cece", function (err, res, body){	
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

     let _rand = function (query){
     	fs.readFile("random.txt", function(err, data){

     		if(err){
     			return console.error(err);
     		}

     		let text = data.toString();
     		let comma = text.indexOf(',');
     		let cmd = text.slice(0, comma);
     		let q = text.slice(comma+1, text.length);

     		logicTree(cmd,q);
     	})
     }

     console.log(keys)

    logicTree(cmd,query);
})();


