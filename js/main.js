;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'app_name';
    var ID = 678401;

    
    $.app_name = function (element, options) {


        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {

			required:true

        };


        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance

        //--------------------------------------//
        //       CUSTOM SETTING SETUP
        //--------------------------------------//


        plugin.settings = {}; //initialise empty settings object

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
            element = element;        // reference to the actual DOM element

        //gather individual plugin defaults from the attr tags in the plugin element
        //example attribute: <div data-{plugin name}-opts='{"custom_variable":"value"}' />*
        var meta = $element.data(name + '-opts');


        //--------------------------------------//
        //              CONSTRUCTOR
        //--------------------------------------//

        plugin.init = function () {

            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options, meta);

            console.log("initialised plugin " + name + " -- " + id);



      


        };


        //--------------------------------------//
        //              PUBLIC METHODS
        //--------------------------------------//

        /**
         *  these methods can be called like:
         *  plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
         *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
         *  is the element the plugin is attached to;
         */

        plugin.foo_public_method = function () {

            // code goes here

        };


        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//
        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */

        var private_method = function () {
			
			// code goes here
            

        };



        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//
		
		/**
		*	Add custom methods to selectors
		*	These are called by adding the function to the selectors
		*	eg: $('.element).bind_event(args);
		*/
		
        $.fn.bind_event = function (args) {
            
		
			// code goes here
			
        };

        
   

      


        //-----------------------------------------
        //				INITIALISATION
        //-----------------------------------------

        plugin.init();


    };


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    /**
     *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
     *  element.data('pluginName').settings.propertyName
     *
     */

    $.fn.app_name = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(name)) {
                var plugin = new $.app_name(this, options);
                $(this).data(name, plugin);
            }
        });
    };
})(jQuery, document, window);;;(function ($, doc, win) {
    "use strict";


    //--------------------------------------//
    //              GLOBALS
    //--------------------------------------//

    var name = 'interactive_map_builder';
    var ID = 298858;


    $.interactive_map_builder = function (element, options) {


        //--------------------------------------//
        //       DEFAULT PLUGIN SETTINGS
        //--------------------------------------//

        var defaults = {

            required: true

        };


        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance

        //--------------------------------------//
        //       CUSTOM SETTING SETUP
        //--------------------------------------//


        plugin.settings = {}; //initialise empty settings object

        var $element = $(element),  // reference to the jQuery version of DOM element the plugin is attached to
            element = element;        // reference to the actual DOM element

        //gather individual plugin defaults from the attr tags in the plugin element
        //example attribute: <div data-{plugin name}-opts='{"custom_variable":"value"}' />*
        var meta = $element.data(name + '-opts');


        //--------------------------------------//
        //              CONSTRUCTOR
        //--------------------------------------//

        plugin.init = function () {

            // the plugin's final properties are the merged default and user-provided options (if any)
            plugin.settings = $.extend({}, defaults, options, meta);

            console.log("initialised plugin " + name + " -- " + id);

            load_file('data/xml/new_counties_wales.svg');

        };


        //--------------------------------------//
        //              PUBLIC METHODS
        //--------------------------------------//

        /**
         *  these methods can be called like:
         *  plugin.methodName(arg1, arg2, ... argn) from inside the plugin or
         *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside the plugin, where "element"
         *  is the element the plugin is attached to;
         */

        plugin.foo_public_method = function () {

            // code goes here

        };


        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//
        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */

        var start_app = function () {

            load_csv('data/csv/all_county_data.csv');

            $element.find('path').each(function () {
                //console.log($(this).attr('id'));
                var alpha = 0.5;
                var color = $.Color("rgb(130,0,0," + alpha + ")");

                $(this).attr('style', 'fill:' + color);

            });

        };

        var load_csv = function (url) {

            $.ajax(url)
                .done(function (response) {
                    processData(response)

                })
                .fail(function (xhr) {
                    alert('Error: ' + xhr.responseText);
                });
        };


        var setup_map = function (map_data) {

            for (var a = 0; a < map_data.length; a++) {
                set_county_data(map_data[a]);
            }

            setup_key();

        };

        var setup_key = function () {
            $element.append($('<ul>').attr('id', 'key'));
            repeat(render, 100);

        };

        var repeat = function (fn, times) {
            for (var i = 0; i < times; i++) fn(i);
        };

        function render(i) {
            var item = "<li style='background-color:" + percent_to_RGB(i) + "'></li>";
            $("#key").append(item);
        }

        var set_county_data = function (county_data) {

            var id = county_data[0];
            var value = parseInt(county_data[5]);
            var color = $.Color(percent_to_RGB(100 - parseInt(value)));
            $('#path' + id).attr('style', 'fill:' + color);
        };


        var percent_to_RGB = function (percent) {
            if (percent === 100) {
                percent = 99
            }
            var r, g, b;

            if (percent < 50) {
                // green to yellow
                r = Math.floor(255 * (percent / 50));
                g = 255;

            } else {
                // yellow to red
                r = 255;
                g = Math.floor(255 * ((50 - percent % 50) / 50));
            }
            b = 0;

            return "rgb(" + r + "," + g + "," + b + ")";
        };


        var processData = function (allText) {
            var allTextLines = allText.split(/\r\n|\n/);
            var headers = allTextLines[0].split(',');
            var lines = [];

            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');
                if (data.length == headers.length) {

                    var tarr = [];
                    for (var j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    lines.push(tarr);
                }
            }
            console.log(lines);

            setup_map(lines);

        };

        var load_file = function (url) {

            $.ajax(url)
                .done(function (response) {
                    $element.html($(response).find('svg'));
                    start_app();
                })
                .fail(function (xhr) {
                    alert('Error: ' + xhr.responseText);
                });
        };


        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//

        /**
         *    Add custom methods to selectors
         *    These are called by adding the function to the selectors
         *    eg: $('.element).bind_event(args);
         */

        $.fn.bind_event = function (args) {


            // code goes here

        };


        //-----------------------------------------
        //				INITIALISATION
        //-----------------------------------------

        plugin.init();


    };


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    /**
     *  element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
     *  element.data('pluginName').settings.propertyName
     *
     */

    $.fn.interactive_map_builder = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(name)) {
                var plugin = new $.interactive_map_builder(this, options);
                $(this).data(name, plugin);
            }
        });
    };
})(jQuery, document, window);;/*---------------- PLUGIN -----------------*/

;(function($, doc, win){
    "use strict";

    /*---------------------- GLOBAL VARIABLES ------------------------*/

    var name = 'plugin name';
    var self, $el, opts;

    /*---------------------- INITIALISATION ------------------------*/

    function App(el, opts){

        console.log(name+" activated");

        this.$el = $(el);
        this.$el.data(name, this);

        this.defaults = {

            required:true

        };

        var meta = this.$el.data(name + '-opts');
        this.opts = $.extend(this.defaults,opts, meta);

        this.init();
    }

    App.prototype.init = function() {

        /*---------------------- VARIABLES ------------------------*/

        self = this;
        $el = self.$el;
        opts = self.defaults;


    };

    /*---------------------- BINDING FUNCTIONS ------------------------*/





    /*---------------------- PRIVATE FUNCTIONS ------------------------*/


    //-----------------------------------------
    //				INVOCATION
    //-----------------------------------------

    $.fn.plugin_name = function(opts) {
        return this.each(function() {
            new App(this, opts);
        });
    };

})(jQuery, document, window);




