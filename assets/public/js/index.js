var apiURL = 'http://api.themoviedb.org',
	apiKey = '47325ef45a2a765c5fe4a132ed6a4e9a',
	apiSettings = {};

var socket = io.connect('/');

function click(handler, callback) {
	$('body').on('click', $(handler), callback);
}

function initialize() {

	//Get MovieDB configurations
	$.ajax({
		url 	: apiURL+'/3/configuration',
		data	: {
			api_key : apiKey
		},
		success : function(data) {
			console.log(data);
			apiSettings = data;
		}
	})
}

function getMovie(movie, callback) {
	//Get MovieDB configurations
	$.ajax({
		url 	: apiURL+'/3/search/movie',
		data	: {
			api_key : apiKey,
			query 	: encodeURIComponent(movie)
		},
		success : callback
	})
}

function createMovieHTML(movie) {
	var html = 	'<li class="movie">'+
				'<img src="'+apiSettings.images.base_url+'w500/'+movie.poster_path+'">'+
				'<h1>'+ movie.title + '</h1>'
	return html;
}

$(document).ready(function(){

	initialize();

	//Establish a socket conenction with the server for future stuff
	socket.get = function (channel, data, callback) {
		socket.emit(channel, data);
		socket.on(channel+'Success', callback);
	}
	socket.get('test', {}, function(data) {
		console.log('test successful, here\'s the data : ', data);
	})

	click("#movie", function(){
		console.log(apiSettings);
		console.log('Searching for: ', $('#movie').val());

		getMovie($('#movie').val(), function(data){
			// console.log("MOVIE: ", data);
			data.results.forEach( function(movie){
				if (movie.popularity>0.5) {
					console.log(movie);
					$('ul.movies').append(createMovieHTML(movie));
				}
			});
		});

	})
});