/*****************************************************************************

    app-views.js
    Andy Knoll
    February 2019

    This contains the main view and others for the "Theater-V" app.

    AppViews
        MenuView
        InstrView
        AdminPanel
        CustsPanel
        ReportsPanel
        
*****************************************************************************/

// AppViews "class" - contains all other views
var AppViews = function() {
    // add UI panels for Theater App
    // Admin, Customer, Reports

    this.menuView = new MenuView();

    this.instrView    = new InstrView();
    this.adminPanel   = new AdminPanel();
    this.custsPanel   = new CustsPanel();
    this.reportsPanel = new ReportsPanel();

    this.panels = [];       // the four views
    this.panels.push(this.instrView);
    this.panels.push(this.adminPanel);
    this.panels.push(this.custsPanel);
    this.panels.push(this.reportsPanel);
};

// MenuView "class"
var MenuView = function() {
    this.elem = document.getElementById("main-menu");

    // the controllers add event listeners to these elements
    // not done here in the view
    this.btnInstr   = document.getElementById("menu-button-instr");
    this.btnAdmin   = document.getElementById("menu-button-admin");
    this.btnCusts   = document.getElementById("menu-button-custs");
    this.btnReports = document.getElementById("menu-button-reports");

    this.btnCusts.disabled = true;
    this.btnReports.disabled = true;
};

// PANELS - these will show() and hide()

// InstrView "class"
var InstrView = function() {
    this.elem = document.getElementById("instr-view");
};

// AdminPanel "class"
var AdminPanel = function() {
    this.elem = document.getElementById("admin-panel");

    // define the UI controls on this panel
    this.selScreen = document.getElementById("admin-select-screen");
    this.selCapacity = document.getElementById("admin-select-capacity");
    this.selMovie = document.getElementById("admin-select-movie");
    this.btnAccept = document.getElementById("admin-button-accept");
    this.btnSim = document.getElementById("admin-button-sim");

};

// CustsPanel "class"
var CustsPanel = function() {
    this.elem = document.getElementById("custs-panel");

    // define the UI controls on this panel
    this.selMovie = document.getElementById("custs-select-movie");        // ONLY SHOW AVAILABLE MOVIES!
    this.selTime = document.getElementById("custs-select-time");
    this.paraTicketsRem = document.getElementById("custs-tickets-rem");
    this.inpTickets = document.getElementById("custs-input-tickets");
    this.btnSubmit = document.getElementById("custs-button-submit");
    this.btnCancel = document.getElementById("custs-button-cancel");
    this.btnSim = document.getElementById("custs-button-sim");
    
    this.clear = function() {
        this.selMovie.selectedIndex = 0;
        this.selTime.selectedIndex = 0;
        this.inpTickets.value = 1;
        this.selMovie.focus();
    };

    this.showTicketsRem = function(ticketsRem) {
        this.paraTicketsRem.innerHTML = "Tickets remaining: " + ticketsRem;
    };

};

// ReportsPanel "class"
var ReportsPanel = function(view) {
    this.view = view;
    this.elem = document.getElementById("report-panel");

    // define the UI controls on this panel
    this.divConsole = document.getElementById("report-console");

    this.clearConsole = function() {
        this.divConsole.innerHTML = "";
    };

    this.writeConsole = function(txt) {
        var oldHtml = this.divConsole.innerHTML;
        this.divConsole.innerHTML = oldHtml + txt + "<br/>";
    };
};
