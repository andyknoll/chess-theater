/*****************************************************************************

    app-models.js
    Andy Knoll
    February 2019

    This contains the main model and others for the "Theater-V" app.

    AppModels
        Theater
        ScreeningRoom(s)
        ScreeningTime(s)
        Movie(s)

    These objects could all be initialized from a JSON file if desired.

*****************************************************************************/

// AppModels "class" - contains all other models
var AppModels = function() {
    this.theater = new Theater();       // the Master model
};


// Theater "class"
var Theater = function() {

    this.screens = [];      // the five screening rooms
    this.movies = [];       // available movies

    // init the Screen objects
    this.initScreens = function() {
        //alert("initScreens");
        this.screens.push(new ScreeningRoom("Hans Theater A", this));
        this.screens.push(new ScreeningRoom("Murray Theater B", this));
        this.screens.push(new ScreeningRoom("Joey Theater C", this));
        this.screens.push(new ScreeningRoom("Stuart Theater D", this));
        this.screens.push(new ScreeningRoom("Christine Theater E", this));
    };

    // init the Movie objects - will be assigned to Screens
    // based on USA Today and personal rankings  :-)
    // more Movies than ScreeningRooms by design - flexible!
    this.initMovieList = function() {
        //alert("initMovieList");
        this.movies.push(new Movie("The Godfather", 1972));
        this.movies.push(new Movie("The Great Escape", 1963));
        this.movies.push(new Movie("Pulp Fiction", 1994));
        this.movies.push(new Movie("Schindler’s List", 1993));
        this.movies.push(new Movie("The Dark Knight", 2008));
        this.movies.push(new Movie("Goodfellas", 1990));
        this.movies.push(new Movie("Star Wars", 1977));
        this.movies.push(new Movie("Casablanca", 1942));
        this.movies.push(new Movie("Citizen Kane", 1941));
        this.movies.push(new Movie("Psycho", 1960));
    };

    // temporarily assign until changed in console
    this.assignMovies = function() {
        //alert("assignMovies");
        this.screens[0].movie = this.movies[0];
        this.screens[1].movie = this.movies[1];
        this.screens[2].movie = this.movies[2];
        this.screens[3].movie = this.movies[3];
        this.screens[4].movie = this.movies[4];
    };

    this.initScreens();
    this.initMovieList();
    this.assignMovies();

    // class methods

    // this is similar to a calculated property
    // adds ticketsSold from all the ScreeningRooms
    this.ticketsSold = function() {
        var total = 0;
        for (var i = 0; i < this.screens.length; i++) {
            total += this.screens[i].ticketsSold();
        }
        return total;
    };

    // fill objects with random sales - delegate to ScreeningRooms
    this.simulateDay = function() {
        for (var i = 0; i < this.screens.length; i++) {
            this.screens[i].simulateDay();
        }
    };
};


// ScreeningRoom "class"
var ScreeningRoom = function(name, theater) {
    // these get assigned daily in the Admin panel
    this.name = name;
    this.theater = theater; // parent
    this.movie = null;
    this.capacity = 100;    // each ScreeningTime - can be changed

    // create the ScreeningTime objects - pass this ScreeningRoom
    this.screenings = [];
    this.screenings.push(new ScreeningTime("2:00 PM", this));
    this.screenings.push(new ScreeningTime("4:00 PM", this));
    this.screenings.push(new ScreeningTime("6:00 PM", this));
    this.screenings.push(new ScreeningTime("8:00 PM", this));

    // adds ticketsSold from all the ScreeningTimes
    this.ticketsSold = function() {
        var total = 0;
        for (var i = 0; i < this.screenings.length; i++) {
            total += this.screenings[i].ticketsSold;
        }
        return total;
    };

    // fill objects with random sales - delegate to ScreeningTimes
    this.simulateDay = function() {
        for (var i = 0; i < this.screenings.length; i++) {
            this.screenings[i].simulateDay();
        }
    };
};


// ScreeningTime "class"
var ScreeningTime = function(name, screen) {
    this.name = name;
    this.screen = screen;       // for max capacity - may be reassigned
    this.ticketsSold = 0;

    this.ticketsRemaining = function() {
        return this.screen.capacity - this.ticketsSold;
    };

    // fill times with random sales - do not exceed capacity
    this.simulateDay = function() {
        var rndSales = Math.random() * this.screen.capacity;
        this.ticketsSold = Math.floor(rndSales);
    };
};


// Movie "class"
var Movie = function(name, year) {
    this.name = name;
    this.year = year;
};
