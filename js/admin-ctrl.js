/*****************************************************************************

    admin-ctrl.js
    Andy Knoll
    February 2019

    This contains the Admin controller in its own file.

    This is a large controller due to the Admin UI interactions.

*****************************************************************************/

// AdminCtrl "class"
var AdminCtrl = function(app) {
    this.app = app;
    this.view = app.views.adminPanel;     // specific view

    // translate element events to controller method calls
    this.onSelChanges = function(e) {
        var sel = e.target;
        var ctrl = sel.ctrl;
        switch (sel) {
            case ctrl.view.selScreen :
                ctrl.selectScreen();
                break;
            case ctrl.view.selCapacity :
                ctrl.selectCapacity();
                break;
            case ctrl.view.selMovie :
                ctrl.selectMovie();
                break;
        }
    };

    // translate element events to controller method calls
    this.onButtonClicks = function(e) {
        var btn = e.target;
        var ctrl = btn.ctrl;
        switch (btn) {
            case ctrl.view.btnAccept :
                ctrl.acceptSettings();
                break;
            case ctrl.view.btnSim :
                ctrl.simulateDay();
                break;
        }
    };

    // assign this ctrl and event handlers for UI elements
    this.addHandlers = function() {
        var view = this.view;

        view.selScreen.ctrl = this;
        view.selCapacity.ctrl = this;
        view.selMovie.ctrl = this;
        view.btnAccept.ctrl = this;
        view.btnSim.ctrl = this;

        view.selScreen.addEventListener("change", this.onSelChanges);
        view.selCapacity.addEventListener("change", this.onSelChanges);
        view.selMovie.addEventListener("change", this.onSelChanges);
        view.btnAccept.addEventListener("click", this.onButtonClicks);
        view.btnSim.addEventListener("click", this.onButtonClicks);
    };

    // class methods

    this.populateDropdowns = function() {
        //alert("AdminCtrl.populateDropdowns");
        var theater = this.app.models.theater;
        var screens = theater.screens;
        var movies = theater.movies;
        var selScreen = this.view.selScreen;
        var selCapacity = this.view.selCapacity;
        var selMovie = this.view.selMovie;

        // fill the rooms list
        for (var i = 0; i < screens.length; i++) {
            var screen = screens[i];
            var roomName = screen.name;
            selScreen.options[i] = new Option(roomName, roomName);
        }

        // fill the capacity list
        selCapacity.options[0] = new Option("60", "60");
        selCapacity.options[1] = new Option("80", "80");
        selCapacity.options[2] = new Option("100", "100");
        selCapacity.options[3] = new Option("120", "120");
        selCapacity.options[4] = new Option("140", "140");

        // fill the movies list
        for (var i = 0; i < movies.length; i++) {
            var movieName = movies[i].name;
            selMovie.options[i] = new Option(movieName, movieName);
        }
    };


    // called by the <select> elements
    // read from and write to the underlying object structure

    this.selectScreen = function() {
        var selScreen = this.view.selScreen;
        var selCapacity = this.view.selCapacity;
        var selMovie = this.view.selMovie;
        var theater = this.app.models.theater;
        var currScreen = theater.screens[selScreen.selectedIndex];
        // read the values from ScreeningRoom object
        selCapacity.value = currScreen.capacity;
        selMovie.value = currScreen.movie.name;
    };

    this.selectCapacity = function() {
        var selScreen = this.view.selScreen;
        var selCapacity = this.view.selCapacity;
        var theater = this.app.models.theater;
        var currScreen = theater.screens[selScreen.selectedIndex];
        // write the value to ScreeningRoom object
        currScreen.capacity = selCapacity.value;
    };

    this.selectMovie = function() {
        var selScreen = this.view.selScreen;
        var selMovie = this.view.selMovie;
        var theater = this.app.models.theater;
        var currScreen = theater.screens[selScreen.selectedIndex];
        var currMovie = theater.movies[selMovie.selectedIndex];
        // write the value to ScreeningRoom object
        currScreen.movie = currMovie;
    };


    // called after clicking Accept button
    // write all values from dropdowns to object structure
    // update the UI as appropriate
    this.acceptSettings = function() {
        //alert("acceptSettings");
        var btnAccept = this.view.btnAccept;
        var btnSim = this.view.btnSim;
        var btnCusts = this.app.views.menuView.btnCusts;
        var btnReports = this.app.views.menuView.btnReports;

        // disable the Accept button
        btnAccept.classList.add("button-disabled");
        btnAccept.disabled = true;
        this.view.selCapacity.disabled = true;
        this.view.selMovie.disabled = true;

        // enable the sim and menu buttons
        btnSim.disabled = false;
        btnSim.classList.remove("button-disabled");
        btnCusts.disabled = false;
        btnCusts.classList.remove("button-disabled");
        btnReports.disabled = false;
        btnReports.classList.remove("button-disabled");

        // populate Customers (Order Tickets) dropdowns
        // only show the available movies being shown today!
        this.app.ctrls.custsCtrl.populateDropdowns();
    };

    // called after clicking Simulate button
    this.simulateDay = function() {
        var theater = this.app.models.theater;
        var menuCtrl = this.app.ctrls.menuCtrl;
        var reportsPanel = this.app.views.reportsPanel;

        // fill with random sales numbers and show report
        theater.simulateDay();
        menuCtrl.showPanel(reportsPanel);
    };


    // constructor calls
    this.addHandlers();
    this.populateDropdowns();
    this.selectScreen();  
};
