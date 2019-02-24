/*****************************************************************************

    app.js
    Andy Knoll
    February 2019

    This is the main app object for the "Theater-V" app.

    It is what I call a "micro-MVC" app object which only contains
    3 properties for the Models, Views (UI) and Controllers objects.

    Instantiating this object will create all the other objects needed.

*****************************************************************************/

// TheaterApp "class" - the main app object
var TheaterApp = function() {
    this.models = new AppModels();      // no access to other MVC objects
    this.views  = new AppViews();       // no access to other MVC objects
    this.ctrls  = new AppCtrls(this);   // pass in app for MV access
};

// create the app object and we are up and running!
var theaterApp = new TheaterApp();
