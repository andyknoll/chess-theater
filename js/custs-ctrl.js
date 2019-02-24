/*****************************************************************************

    custs-ctrl.js
    Andy Knoll
    February 2019

    This contains the Customers (Order Tickets) controller in its own file.

    This is a large controller due to the Customers UI interactions.

*****************************************************************************/

// CustsCtrl "class"
var CustsCtrl = function(app) {
    this.app = app;
    this.view = app.views.custsPanel;     // specific view

    this.ticketsRemaining = function() {
        // must use Screen and ShowTime
        return 11;
    };

    this.onSelChanges = function(e) {
        var sel = e.target;
        var ctrl = sel.ctrl;
        switch (sel) {
            case ctrl.view.selMovie :
                ctrl.selectMovie();
                break;
            case ctrl.view.selTime :
                ctrl.selectTime();
                break;
        }
    };

    this.onButtonClicks = function(e) {
        var btn = e.target;
        var ctrl = btn.ctrl;
        switch (btn) {
            case ctrl.view.btnSubmit :
                ctrl.submitOrder();
                break;
            case ctrl.view.btnCancel :
                ctrl.cancelOrder();
                break;
            case ctrl.view.btnSim :
                ctrl.simulateOrder();
                break;
        }
    };

    // assign this ctrl and event handlers for UI elements
    this.addHandlers = function() {
        this.view.selMovie.ctrl = this;
        this.view.selTime.ctrl = this;
        this.view.btnSubmit.ctrl = this;        // sort of cheating!
        this.view.btnCancel.ctrl = this;
        this.view.btnSim.ctrl = this;

        this.view.selMovie.addEventListener("change", this.onSelChanges);
        this.view.selTime.addEventListener("change", this.onSelChanges);
        this.view.btnSubmit.addEventListener("click", this.onButtonClicks);
        this.view.btnCancel.addEventListener("click", this.onButtonClicks);
        this.view.btnSim.addEventListener("click", this.onButtonClicks);
    };

    // class methods

    this.populateDropdowns = function() {
        //alert("CustsCtrl.populateDropdowns");
        var theater = this.app.models.theater;
        var screens = theater.screens;
        var screenTimes = screens[0].screenings;
        var selMovie = this.view.selMovie;
        var selTime = this.view.selTime;
        var letters = ["A", "B", "C", "D", "E"];

        // fill the Movies dropdown list
        // only show available movies from Admin console
        for (var i = 0; i < screens.length; i++) {
            var screen = screens[i];
            var movieName = screen.movie.name;
            var txt = letters[i] + " - " + movieName;
            selMovie.options[i] = new Option(txt, txt);
        }


        // fill the Screen Times dropdown list
        // all screen rooms use the same times
        for (var i = 0; i < screenTimes.length; i++) {
            var screenTime = screenTimes[i].name;
            selTime.options[i] = new Option(screenTime, screenTime);
        }

        this.selectMovie();     // choose first
    };

    // select first show time and update remaining seats UI
    this.selectMovie = function() {
        this.view.selTime.selectedIndex = 0;
        this.selectTime();
    };

    this.selectTime = function() {
        // alert("CustsCtrl.selectTime");
        // update remaining seats from objects
        var selMovie = this.view.selMovie;
        var selTime = this.view.selTime;
        var theater = this.app.models.theater;
        var currScreen = theater.screens[selMovie.selectedIndex];
        var currSlot = currScreen.screenings[selTime.selectedIndex];
        this.view.showTicketsRem(currSlot.ticketsRemaining());
    };

    this.submitOrder = function() {
        //alert("CustsCtrl.submitOrder");
        var selMovie = this.view.selMovie;
        var selTime = this.view.selTime;
        var theater = this.app.models.theater;
        var currScreen = theater.screens[selMovie.selectedIndex];
        var currSlot = currScreen.screenings[selTime.selectedIndex];
        var movieName = currScreen.movie.name;
        var rem = currSlot.ticketsRemaining();
        var amt = this.view.inpTickets.value;       // already cleaned
        var msg = "";

        if (!this.validateInput(amt)) {
            this.view.inpTickets.value = 1;         // reset input box to 1
            return;
        }

        if (this.view.inpTickets.value < 1) {
            this.view.inpTickets.value = 1;         // reset input box to 1
            return;
        };

        if (amt > rem) {
            msg = "We're sorry - ";
            if (rem >= 2) msg += "only " + rem + " tickets are remaining for that time slot."
            if (rem == 1) msg += "there is only one ticket remaining for that time slot."
            if (rem == 0) msg += "there are no more tickets remaining for that time slot."
            alert(msg);
            this.view.inpTickets.value = 1;         // reset input box to 1
            return;
        }

        // process the order - which means update the underlying object
        currSlot.ticketsSold += parseInt(amt);

        // show conf message in area
        alert("Thank you for your order of " + amt + " tickets.\nEnjoy your movie " + movieName + ".\n\n");
        this.view.clear();
        this.selectMovie();     // choose first
    };


    // check for valid numeric input
    this.validateInput = function(amt) {
        amt = parseInt(amt);
        if (isNaN(amt)) return false;
        return true;
    };

    // check for order not greater than available
    this.orderAmountOK = function() {
        var currScreen = theater.screens[selMovie.selectedIndex];
        var currSlot = currScreen.screenings[selTime.selectedIndex];
        var rem = currSlot.ticketsRemaining();
        var amt = this.view.inpTickets.value;       // already cleaned
        if (amt > rem) return false;
        return true;
    };

    this.cancelOrder = function() {
        this.view.clear();
        this.selectMovie();     // choose first
    };

    this.simulateOrder = function() {
        var selMovie = this.view.selMovie;
        var selTime = this.view.selTime;
        var theater = this.app.models.theater;
        var rndTickets = 0;
        var remTickets = 0;
        var currScreen = null;
        var currSlot = null;

        var rndMovieIdx = Math.floor(Math.random() * selMovie.options.length);
        var rndTimeIdx  = Math.floor(Math.random() * selTime.options.length);

        // update the movie and time boxes
        selMovie.selectedIndex = rndMovieIdx;
        selTime.selectedIndex = rndTimeIdx;
        currScreen = theater.screens[selMovie.selectedIndex];
        currSlot = currScreen.screenings[selTime.selectedIndex];
        remTickets = currSlot.ticketsRemaining();
        if (remTickets == 0) return;

        // finally update the input box and object
        rndTickets = Math.floor(Math.random() * remTickets) + 1;
        this.view.inpTickets.value = rndTickets;
        currSlot.ticketsSold += rndTickets;
        this.view.showTicketsRem(currSlot.ticketsRemaining());
    };

    // constructor calls
    this.addHandlers();
    // this.populateDropdowns();    // only after Accept button is clicked
};