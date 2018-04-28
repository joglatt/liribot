require("dotenv").config();
var keys = require("./keys");
var request = require("request");
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

var fs = require("fs");
//establishes input variables
var input = process.argv[2];
var secondary = process.argv.splice(3).join("+");
// var tertiary = process.argv.splice(4).join("+");
//call to twitter api
function tweets() {
  client.get("statuses/user_timeline", { count: "10" }, function(
    error,
    tweets,
    response
  ) {
    for (i = 0; i < tweets.length; i++) {
      console.log(tweets[i].created_at);
      console.log(tweets[i].text);
    }
  });
}
//call to spotify api
function song() {
  var Spotify = require("node-spotify-api");
  var spotifyApi = new Spotify(keys.spotify);
  if (secondary.length === 0) {
    secondary = "the sign";

  }
  spotifyApi.search(
    { type: "track", query: secondary, limit: 20 },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      // console.log(data.tracks.items[0]);
      //log artist name
      console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
      //log album name
      console.log("Album Name: " + data.tracks.items[0].album.name);
      //log song name
      console.log("Song Name: " + data.tracks.items[0].name);
      //log preview URL
      console.log("Preview URL: " + data.tracks.items[0].preview_url);
    }
  );
}

function movie() {
  if (secondary.length === 0) {
    secondary = "mr+nobody";
  }
  var movieUrl =
    "http://www.omdbapi.com/?t=" + secondary + "&y=&plot=short&apikey=trilogy";
  request(movieUrl, function(error, response, body) {
    console.log(movieUrl);
    // If the request is successful
    if (!error && response.statusCode === 200) {
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release Year: " + JSON.parse(body).Year);
      console.log("IMDB rating: " + JSON.parse(body).imdbRating);
      console.log(
        "Rotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value
      );
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Cast: " + JSON.parse(body).Actors);
    }
  });
}

function file() {
  fs.readFile("file.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    secondary = data;
    song();
  });
}



if (input === "my-tweets") {
  tweets();
} else if (input === "movie-this") {
  movie()
} else if (input === "do-what-it-says") {
  file();
} else if (input === "spotify-this-song") {
  song();
}
song();

