/*****************************************************************************

    app-ctrls.js
    Andy Knoll
    February 2019

    This contains the main controller and others for the "Theater-V" app.

    AppCtrls
        MenuCtrl
        AdminCtrl - moved
        CustsCtrl - moved
        ReportsCtrl
        
    The individual controllers are for event handlers for the related
    views or "panels" and other various tasks.

    PLEASE NOTE:   
    
    AdminCtrl and CustsCtrl have been split out into their own files.
    This is to keep file sizes managable when viewing code.

*****************************************************************************/

// AppCtrls "class" - contains all other controllers
var AppCtrls = function(app) {

    // Controller has visibility to Model and View via app
    this.app = app;

    // create the UI controllers passing in app as parent
    this.menuCtrl = new MenuCtrl(app);
    this.adminCtrl = new AdminCtrl(app);
    this.custsCtrl = new CustsCtrl(app);
    this.reportsCtrl = new ReportsCtrl(app);
};


// no InstrCtrl "class" is need - no UI controls are on the Instructions panel

// MenuCtrl "class"
var MenuCtrl = function(app) {
    this.app = app;
    this.view = app.views.menuView;     // specific view

    // a single handler resolves element events to method calls
    // we attach this controller as a property to the HTML elements
    this.onButtonClicks = function(e) {
        var btn = e.target;
        var ctrl = btn.ctrl;
        var views = ctrl.app.views;
        switch (btn) {
            case ctrl.view.btnInstr :
                ctrl.showPanel(views.instrView);
                break;
            case ctrl.view.btnAdmin :
                ctrl.showPanel(views.adminPanel);
                break;
            case ctrl.view.btnCusts :
                ctrl.showPanel(views.custsPanel);
                break;
            case ctrl.view.btnReports :
                ctrl.showPanel(views.reportsPanel);
                break;
        }
    };

    // assign this ctrl and event handlers for UI elements
    this.addHandlers = function() {
        this.view.btnInstr.ctrl = this;
        this.view.btnAdmin.ctrl = this;
        this.view.btnCusts.ctrl = this;
        this.view.btnReports.ctrl = this;

        this.view.btnInstr.addEventListener("click", this.onButtonClicks);
        this.view.btnAdmin.addEventListener("click", this.onButtonClicks);
        this.view.btnCusts.addEventListener("click", this.onButtonClicks);
        this.view.btnReports.addEventListener("click", this.onButtonClicks);
    };

    // class methods

    this.hidePanels = function() { 
        var panels = this.app.views.panels;
        // swap CSS classes
        for (var i = 0; i < panels.length; i++) {
            panels[i].elem.classList.remove("panel-visible");
            panels[i].elem.classList.add("panel-hidden");
        }
    };

    // pass in the panel object to show
    this.showPanel = function(panelObj) { 
        this.hidePanels();

        // always clear customer orders - pass in tickets remaining
        if (panelObj == this.app.views.custsPanel) {
            var custsCtrl = this.app.ctrls.custsCtrl;
            panelObj.clear(custsCtrl.ticketsRemaining());
        }

        // always update the report in real time
        if (panelObj == this.app.views.reportsPanel) {
            var reportsCtrl = this.app.ctrls.reportsCtrl;
            reportsCtrl.showReport();
        }

        // swap CSS classes
        panelObj.elem.classList.remove("panel-hidden");
        panelObj.elem.classList.add("panel-visible");
    };

    // constructor calls
    this.addHandlers();
};


// ReportsCtrl "class"
var ReportsCtrl = function(app) {
    this.app = app;
    this.view  = app.views.reportsPanel;    

    // uses view.writeConsole() in real time
    // could also generate a LONG string and pass to view
    this.showReport = function() {
        //alert("showReport");
        var theater = app.models.theater;
        var screen = null;
        var screening = null;
        var date = new Date();
        var txt = "";
        
        this.view.clearConsole();

        // report heading
        txt = "Theater-V daily report: " + date.toLocaleString();
        this.view.writeConsole(txt);
        this.view.writeConsole("");

        // each Screening Room
        for (var i = 0; i < theater.screens.length; i++) {
            screen = theater.screens[i];
            txt = "<b>" + screen.name + " - " + screen.capacity + " seats</b>";
            this.view.writeConsole(txt);
            txt = "<b>" + screen.movie.name + " (" + screen.movie.year + ")</b>";
            this.view.writeConsole(txt);
            for (var j = 0; j < screen.screenings.length; j++) {
                screening = screen.screenings[j];
                txt = screening.name + " tickets sold: " + screening.ticketsSold;
                this.view.writeConsole(txt);
            }
            s2 = "Total tickets: " + screen.ticketsSold();
            this.view.writeConsole(s2);
            this.view.writeConsole("");
        }
        this.view.writeConsole("");
        txt = "<span class='report-big'>Theater-V daily ticket sales: " + theater.ticketsSold() + "</span>";
        this.view.writeConsole(txt);
        this.view.writeConsole("");
    };
};
