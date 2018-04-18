require("dotenv").config();
var keys = require("./keys.js")
var SpotifyClient = require("node-spotify-api")
var TwitterClient = require("twitter")
var request = require("request")
var fs = require("fs")
var spotify = new SpotifyClient(keys.spotify)
var twitter = new TwitterClient(keys.twitter)


function processArgs(command, data){
    switch(command){
        case 'my-tweets':
            getTweets()
            break;
        
        case 'spotify-this-song':
            getSong(data)
            break;

        case 'movie-this':
            getMovie(data)
            break;

        case 'do-what-it-says':
            doIt()
            break;

        default:
            console.log("I don't recognize " + command + " or " + data)
            break;
    }
}


function getTweets(){
    var endpoint = "statuses/user_timeline"
    var params = {
        user_name: "joshparker712",
        count: 20
    }

    twitter.get(endpoint, params, function(error, results){
        if(!error){
            console.log(" __________________________")
            console.log("|                          |")
            console.log("|  Your Twitter Stats:     |")
            console.log("|    Followers: " + results[0].user.followers_count + "          |")
            console.log("|    Friends: " + results[0].user.friends_count + "            |")
            console.log("|    Favorites: " + results[0].user.favourites_count + "          |")
            console.log("|__________________________|")
            console.log("\nRecent Tweets:")
            
           for(var i in results){
                console.log("------------------------------")
                console.log(results[i].created_at)
                console.log(results[i].text)
                console.log("------------------------------\n")
           }
        } else {
            console.log("Sorry, there was an error getting your tweets")
        }
    })
}

function getSong(song){
    if(song === undefined){
        song = "The Sign Ace of Base"
    }
    var params = {
        type: 'track',
        query: song,
        limit: 10
    }

    spotify.search(params, function(error, results){
        if(!error){
          var tracks = results.tracks.items
          console.log("\n------------------------------\n")
            for(var i in tracks){
                var artists = []
                var previewUrl = tracks[i].preview_url

                for(var j in tracks[i].artists){
                    artists.push(" " + tracks[i].artists[j].name)
                }
                if(previewUrl === null || previewUrl === "undefined"){
                    previewUrl = "Currently Unavailable"
                }
                console.log("Song: " + tracks[i].name)
                console.log("Artist(s): " + artists)
                console.log("Album: " + tracks[i].album.name)
                console.log("Preview: " + previewUrl)
                console.log("\n------------------------------\n")
            }
        } else {
            console.log("I'm sorry, there was an error getting that song", error)
        }
    })


}

function getMovie(movie){
    console.log("Ok I'll get more info about", movie)
}

function doIt(){
    console.log("I'm doing it")
}

function main(){
    var command = process.argv[2];
    var requestData = process.argv[3]
    if(process.argv.length > 4){
        for(var i = 4; i < process.argv.length; i++){
            requestData += " "
            requestData += process.argv[i]
        }
    }

    processArgs(command, requestData)
}

main();


