const twitter = require("./keys.js");
const spotify = require("spotify");

let command = process.argv[2];

switch(command){
	case("my-tweets"):
		console.log("tweets");
		break;
	case("spotify-this-song"):
		console.log("spotify");
		break;
	case("movie-this"):
		console.log("movie");
		break;
	case("do-what-it-says"):
		console.log("random");
		break;
}

spotify.search({type:"track", query:"dancing in the moonlight"}, function(err, data){
	if (err){
		console.log("error occured: "+ err);
		return;
	}

	console.log(data);
})

