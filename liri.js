// add reuired npm packages

const keys = require("./keys.js")
    // test to make sure kyes are imported
    //console.log(keys.twitterKeys);
const twitterKeys = keys.twitterKeys;
const spotifyKeys = keys.spotifyKeys;
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');
const clear = require('clear');
const CFonts = require('cfonts');
const say = require('say')
const clc = require('cli-color');
process.stdout.write(clc.reset); // reset screen
const googleTTS = require('google-tts-api');
// set default font for cfonts

var font = {
    font: 'block', //define the font face 
    align: 'center', //define text alignment 
    colors: ['green'], //define all colors 
    background: 'Black', //define the background color 
    letterSpacing: 1, //define letter spacing 
    lineHeight: 1, //define the line height 
    space: true, //define if the output text should have empty lines on top and on the bottom 
    maxLength: '0' //define how many character can be on one line 
};


// talk function

function talkNow(message) {
    setTimeout(function() {
        say.speak(message);
    });
}


// twitter
function getMyTweets() {
    var client = new Twitter(twitterKeys);
    var params = {
        screen_name: 'PeterJFullenCPA'
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log(tweets);
        }
    });
} // end of getMyTweets function 

function formatSpotifyResponse(response) {
    var items = response.items;
    items.forEach(function(album) {
    })
} // end of formatSpotifyResponse


// spotify example
function spotifyThis(query, queryS) {
   // console.log(query);
    var spotify = new Spotify(spotifyKeys);

        
      
    spotify.search({
        type: 'track',
        query: query
    }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var tracks = data.tracks;
        var items = tracks.items;
        //console.log("THis is item" + items);
        items.find(function(item) {
            //console.log(item);

            var albumInfos = item.album;

            console.log("Album Name: " + albumInfos.name);


            if (item.name === queryS) {
                //console.log("This are the items" + item.album);
                var artists = item.artists;
                artists.forEach(function(artist) {
                    console.log("Artist: " + artist.name);
                })


                //console.log(item);
                console.log("Song Name: " + item.name);
                console.log("Song Preview: " + item.preview_url + "\n");

            }

        });

        //	console.log("Song Name:" + item.name);
        //	console.log("Preview URL:" + item.preview_url)


    });
}; // end of spotifyThis function 

//spotify.search({ type: 'track', query: 'Somewhere over the rainbow' }, function(err, data,body ) {
//if (err) {
// return console.log('Error occurred: ' + err);
// }

//console.log(body.items); 
//body.forEach(function(data){
//	console.log(data);
//})
//});

function getSpotifyFromTxt() {
  
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        } else {
        	data = data.split(",");        	        	
            console.log(data[1]);
            data = data[1];
            spotifyThis(data);
        }
    })
}; // End of getSpotifyFromTxt function

//   Start of Movie This Function 
function movieThis(query) {
    process.stdout.write(clc.move.to(20, 25));
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
        //console.log(JSON.parse(body));
        var body = JSON.parse(body);
        if (!error && response.statusCode === 200 && body.Response !== "False") {
            talkNow("I found your movie");
            console.log("\nHere are your " + command + " results:\n")
            console.log("Title: " + body.Title);
            talkNow("Title: " + body.Title)
            console.log("Year: " + body.Year);
            var ratings = body.Ratings;
            ratings.forEach(function(rating) {
                if (rating.Source === 'Rotten Tomatoes' || rating.Source === 'Internet Movie Database') {
                    console.log(rating.Source + " " + rating.Value);
                }
            });
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot); // "Year:" + body.Year	);
            console.log("Actors:" + body.Actors + "\n\n")
        } else {
            process.stdout.write(clc.move.to(50, 25));
            console.log(clc.red.bold(body.Error + "\n"));
            process.stdout.write(clc.move.to(50, 27));
            console.log(clc.red("Please make sure to enter a movie\n\n\n\n\n\n"))
        }
        var plot = JSON.stringify(body.plot);
    })
}; // end of movieThis function 

// format arg error messages 
function processMsg(message) {
    process.stdout.write(clc.move.to(40, 25));
    console.log(clc.red(message));
    process.stdout.write(clc.move.to(0, 50));
}


// Main program  
CFonts.say('\t\tWelcome|to|Liri!', font);
talkNow('Welcome to Leeri!');

var args = process.argv;
//console.log(args[2]);
var command = args[2];
var query = "";
var queryS = "";



// Make sure to capture all args
for (var i = 3; i < args.length; i++) {
    if (i > 3 && i < args.length) {
        query = query + "+" + args[i];
        queryS = queryS + " " + args[i];
    } else {
        query += args[i];
        queryS += args[i];
    }
}

//var sQuery = JSON.stringify(query);

switch (command) {
    case "my-tweets":
        getMyTweets();
        break;
    case "spotify-this-song":
        if (query === "") {
            getSpotifyFromTxt();
        } else {
            spotifyThis(query, queryS);
        }
       
        break;
    case "movie-this":
        if (query === "") {
            processMsg("Please make sure to enter a movie as a arg");

        } else {
            movieThis(query);
        }
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    case undefined:
        processMsg("Please make sure to enter a command argument");
        break;
}