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
			// console.log(data);
			apiSettings = data;
		}
	})
}

function getMovie(movie, callback) {
	//Get MovieDB movies for the search term (movie)
	$.ajax({
		url 	: apiURL+'/3/search/movie',
		data	: {
			api_key : apiKey,
			query 	: encodeURIComponent(movie)
		},
		success : callback
	})
}

function getMovieFromId(id, callback) {
	$.ajax({
		url 	: apiURL+'/3/movie/'+id,
		data	: {
			api_key : apiKey,
			append_to_response : "trailers, genres"
		},
		success : callback
	})
}


function getPopular(page, callback) {
	$.ajax({
		url 	: apiURL+'/3/movie/popular',
		data	: {
			api_key 			: apiKey,
			page 				: page,
			append_to_response	: 'trailers'
		},
		success : callback
	})
}

function createMovieHTML(movie) {
	var html = 	'<li class="movie">'+
					'<img class="poster" src="'+apiSettings.images.base_url+'w154/'+movie.poster_path+'" width="154px" height="231px" onLoad="imageIn(this)">'+
					'<section class="metadata">'+
						'<span class="title">'	+ movie.title + '</span><br>'+
						// '<span class="genres">'	+ movie.title + '</span><br>'+
						'<span class="rating">Rating: <b>'	+ movie.vote_average + '</b></span>'+
					'</section>'+
				'</li>'
	return html;
}

function imageIn(img) {
	$(img).parent().css('opacity', 1);
	$(img).parent().css('marginTop', 0);
}

initialize();
$(document).ready(function(){

	getPopular(1, function(data) {
		data.results.slice(0,20).forEach(function(movie){
				getMovieFromId(movie.id, function(data) {
					// console.log(data);
				});
				if (movie.poster_path)
					$('ul.movies').append(createMovieHTML(movie));
		});
	});

	var lastScrollLeft = 0;
	var locked = false;
	var page = 2;
	$('.wrapper').scroll(function() {
		var percentageScrolled = $('.wrapper').scrollLeft()/$('ul.movies').width() * 100 * page
		if (percentageScrolled > 50 && !locked) {
			locked = true;
			console.log('loading more');
			getPopular(page++, function(data) {
				data.results.slice(0,20).forEach(function(movie){
						getMovieFromId(movie.id, function(data) {
						});
						if (movie.poster_path) {
							$('ul.movies').append(createMovieHTML(movie));
							locked = false;
						}
				});
			});
		}
	});


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