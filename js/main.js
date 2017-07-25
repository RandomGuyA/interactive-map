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

            dropdown: true,
            title: "Percentage of welsh speakers per county in Wales",
            DIRECTORY: "",
            key_container: $('#interactive-map'),
            add_labels: false,
            nav_type: 'slider'   // 'silder':'dropdown':'none'

        };

        //--------------------------------------//
        //       PLUGIN PRIVATE VARIABLES
        //--------------------------------------//

        var plugin = this; //use plugin instead of "this"
        var id = ID;  //set unique ID for plugin instance
        var config;

        var files_loaded = 0;
        var file_count = 4;

        var year_data = [];
        var county_data = [];
        var county_to_year = [];

        var map_data = [];
        var data = [];

        var current_year;
        var $map;
        var $interface;
        var year_list = [1951, 1961, 1971, 1981, 1991, 2001, 2011];

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
            config = plugin.settings;
            console.log("initialised plugin " + name + " -- " + id);

            setup_divs();
            load_file(config.DIRECTORY + 'data/xml/welsh_counties.svg');
            load_csv(config.DIRECTORY + 'data/csv/year_data.csv');
            load_csv(config.DIRECTORY + 'data/csv/county.csv');
            load_csv(config.DIRECTORY + 'data/csv/county_to_year.csv');
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
        plugin.update_map = function (year) {
            set_year(iterate_and_compare(map_data, {year: get_census_year(year)}));
            render_map(current_year);
            setup_labels(current_year);
            setup_key();

        };


        //--------------------------------------//
        //              PRIVATE METHODS
        //--------------------------------------//

        /**
         *  these methods can be called only from inside the plugin like:
         *  methodName(arg1, arg2, ... argn)
         */
        var setup_map = function () {

            $map.append(
                $('<div>').attr('id', 'label-wrapper').append(
                    $('<ul>').attr('id', 'path-labels')
                )
            );
            setup_data();
            add_map_nav();
            set_year(map_data[0]);
            render_map(current_year);
            setup_labels(current_year);
            setup_key();
            label_adjustment(current_year);
        };

        var setup_divs = function () {

            $element.append(
                $('<div>').attr('id', 'interface'),
                $('<div>').attr('id', 'map')
            );
            $map = $('#map');

        };

        var set_year = function (year) {
            current_year = year;
        };

        var get_census_year = function (year) {
            return ((Math.floor(year / 10) * 10) + 1);
        };

        var get_year_by_id = function (id) {

            var year;

            for (var a = 0; a < map_data.length; a++) {
                if (id == map_data[a].id) {
                    year = map_data[a];
                }
            }
            return year;
        };

        var render_map = function (year) {

            console.log('render map: ' + year.year);
            hide_layers();
            $map.find('#layer' + year.layer_id).show();

            $('path').click_county();

            $('.path-label').hide();
            iterate_and_call(setup_county, year.locations);

        };

        var hide_layers = function () {
            $map.find('#layer1').hide();
            $map.find('#layer2').hide();
        };

        var add_map_nav = function () {

            switch (config.nav_type) {
                case 'dropdown':
                    add_dropdown();
                    break;
                case 'slider':
                    add_slider();
                    break;
                default:
                    break;
            }
        };

        var add_slider = function () {
            $map.prepend(slider());
            $('#' + 'slider-' + id).slider_event_handler();
        };

        var add_dropdown = function () {
            if (plugin.settings.dropdown) {
                $map.append(dropdown());
                $('#' + 'dropdown-' + id).dropdown_event_handler();
            }
        };

        var dropdown = function () {
            return $('<select>').attr('id', 'dropdown-' + id).addClass('dropdown').append(
                $.map(map_data, function (value, index) {
                    return $('<option>').attr('value', value.id).text(value.year)
                })
            );
        };

        var slider = function () {


            return $('<div>').addClass('panel rounded').append(
                $('<div>').addClass('slider-wrapper').append(
                    $('<input>').attr({
                        id: 'slider-' + id,
                        type: 'range',
                        min: 1951,
                        max: 2011,
                        step: 10
                    }).addClass('slider')
                )
            )
        };

        var setup_labels = function (year) {
            $('#path-labels').empty();
            iterate_and_call(add_county_label, year.locations);
        };

        var add_county_label = function (county) {

            if (plugin.settings.add_labels) {
                $('#path-labels').append(
                    $('<li>')
                        .addClass('path-label circle')
                        .attr({id: 'label' + county.id, title: county.welsh})
                        .text(Math.round(county.value) + "%")
                        .css(set_css_location(county))
                );
            }
        };

        var setup_title = function () {

            var title = plugin.settings.title;

            $map.prepend(
                $('<h1>').addClass('title').text(title)
            )
        };

        var setup_data = function () {

            year_data = data[0];
            county_data = data[1];
            county_to_year = data[2];

            for (var a = 0; a < year_data.length; a++) {

                var year = Year(year_data[a]);

                var locations = [];

                for (var b = 0; b < county_to_year.length; b++) {

                    var county = county_to_year[b];

                    if (year.id == county[3]) {
                        locations.push(County(county));
                    }
                }
                year.locations = locations;
                map_data.push(year);
            }
            //console.log(map_data);
        };

        var get_county_by_id_from_county_data = function (id) {

            var county;

            for (var a = 0; a < county_data.length; a++) {
                var temp_county = county_data[a];
                if (id == temp_county[0]) {
                    county = temp_county;
                    break;
                }
            }
            return county;
        };

        var get_id_from_string = function (string) {
            var arr = string.split('-');
            return parseInt(arr[arr.length - 1]);
        };

        var setup_key = function () {

            $interface = $('#interface');

            $('#interface').empty();
            var counties = current_year.locations;
            $('#interface').append(
                $('<div>').addClass('interface-wrapper').append(
                    $('<div>').addClass('interface-header').append(
                        $('<h4>').text(current_year.year + " Census")
                    ),
                    $('<ul>').append(
                        $('<li>').addClass('top-label active').text("Sir").append(
                            $('<div>').addClass('left square').append(
                                $('<div>').addClass('circle').text("%")
                            ),
                            $('<div>').addClass('right square').append(
                                $('<div>').addClass('circle').text())
                        ),
                        $.map(counties, function (value, index) {
                            return $('<li>').addClass('side-label').attr('id', "side-label-" + value.id).text(value.welsh).append(
                                $('<div>').addClass('left square').append(
                                    $('<div>').addClass('circle').text(Math.round(value.value))
                                ),
                                $('<div>').addClass('right square').append(
                                    $('<div>').addClass('circle').text()
                                )
                            )
                        })
                    )
                )
            );
            plugin.settings.key_container.prepend($interface);
            $('.side-label').click_county_label();
        };

        function render(i) {
            var item = "<li style='background-color:" + percent_to_RGB(i) + "'></li>";
            $("#key").append(item);
        }

        var setup_county = function (county) {

            var id = county.path_id;
            var value = (parseInt(county.value) / 2 * 0.01) + 0.5;
            var color = $.Color(135, 0, 0, value);
            $('#path' + id).css({fill: color});

            if (plugin.settings.add_labels) {
                update_label_location(county);
            }
        };

        var update_label_location = function (county) {

            var $label = $map.find('#' + 'label' + county.id);
            if ($label.length > 0) {
                $label.css(set_css_location(county));
            }
        };

        var set_css_location = function (county) {

            var $path = $('#path' + county.path_id);
            var top_adjust = -20;
            var label_radius = 15;
            var dimensions = document.querySelector('#' + $path.attr('id')).getBoundingClientRect();

            var location = $path.position();
            var width = dimensions.width;
            var height = dimensions.height;

            var offset_top = county.top / 100 * height;
            var offset_left = county.left / 100 * width;

            var top = offset_top + location.top - label_radius + top_adjust;
            var left = offset_left + location.left - label_radius;

            if (county.id == 1) {
                /*
                 console.log("name " + county.welsh);
                 console.log("location.top: " + location.top);
                 console.log("location.left: " + location.left);
                 console.log("width: " + width);
                 console.log("height: " + height);
                 console.log("offset.top: " + offset_top);
                 console.log("offset.left: " + offset_left);
                 console.log("top " + top);
                 console.log("left " + left);
                 */
            }


            return {
                top: top,
                left: left
            }
        };


        //--------------------------------------//
        //      HELPER FUNCTIONS
        //--------------------------------------//

        var iterate_and_call = function (fn, array) {
            for (var i = 0; i < array.length; i++) fn(array[i]);
        };

        var iterate_and_compare = function (array, object) {
            for (var i = 0; i < array.length; i++) {
                var item = compare(object, array[i]);
                if (item != undefined) {
                    return item;
                }
            }
        };

        var compare = function (object, item) {
            var var_name = Object.keys(object)[0];
            return (object[var_name] == item[var_name]) ? item : null;
        };

        var get_county_by_id = function (id) {
            return iterate_and_compare(current_year.locations, {id: id});
        };

        var get_id_from_path_id = function (path_id) {
            path_id = parseInt(path_id.replace('path', ''));
            return iterate_and_compare(current_year.locations, {path_id: path_id});

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
            var array = [];

            for (var i = 1; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');
                if (data.length == headers.length) {

                    var tarr = [];
                    for (var j = 0; j < headers.length; j++) {
                        tarr.push(data[j]);
                    }
                    array.push(tarr);
                }
            }
            files_loaded++;
            return array;
        };

        var load_csv = function (url) {
            $.ajax(url)
                .done(function (response) {
                    data.push(processData(response));
                    //console.log("content loaded");
                })
                .fail(function (xhr) {
                        alert('Error: ' + xhr.responseText);
                    }
                );
        };

        var load_file = function (url) {

            $.ajax(url)
                .done(function (response) {
                    $map.html($(response).find('svg'));
                    //console.log("content loaded");
                    files_loaded++;
                })
                .fail(function (xhr) {
                    alert('Error: ' + xhr.responseText);
                });
        };

        var ajax_event_listener = setInterval(
            function () {

                if (files_loaded >= file_count) {
                    //console.log('all loaded');
                    setup_map();
                    clear_interval();
                }
            }, 100
        );

        var label_adjustment = function (year) {
            iterate_and_call(update_label_location, year.locations);
        };

        var clear_interval = function () {
            clearInterval(ajax_event_listener);
        };

        //--------------------------------------//
        //    CUSTOM BINDING EVENTS
        //--------------------------------------//

        /**
         *    Add custom methods to selectors
         *    These are called by adding the function to the selectors
         *    eg: $('.element).bind_event(args);
         */
        $.fn.dropdown_event_handler = function (args) {

            $(this).on('change', function () {
                var id = parseInt($(this).find(':selected').attr('value'));
                set_year(get_year_by_id(id));
                render_map(current_year);
                setup_labels(current_year);
                setup_key();
            });
        };

        $.fn.slider_event_handler = function () {

            var $slider = $(this);

            $slider.on('change', function () {
                plugin.update_map(parseInt($(this).val()));
            });
        };

        $(window).on('resize', function () {
            setup_labels(current_year);
        });

        $.fn.click_county = function () {

            $(this).on('mouseover', function () {

                var path_id = $(this).attr('id');
                var label = get_id_from_path_id(path_id);
                $('.side-label').removeClass('active');
                if (label != undefined) {
                    $('#side-label-' + label.id).addClass('active');
                }
            });
            $(this).on('mouseout', function () {

                $('.side-label').removeClass('active');

            });
        };

        $.fn.click_county_label = function () {

            $(this).on('mouseover', function () {

                $('path').removeClass('active');
                var label = $(this);

                var id = get_id_from_string(label.attr('id'));
                var county = get_county_by_id(id);

                $('#path' + county.path_id).addClass('active');


            });
            $(this).on('mouseout', function () {

                $('path').removeClass('active');

            });
        };


        //-----------------------------------------
        //				OBJECTS
        //-----------------------------------------

        var Year = function (year) {
            return {
                id: year[0],
                year: year[1],
                layer_id: year[2]
            }
        };

        var County = function (loc) {

            var county = get_county_by_id_from_county_data(loc[2]);

            return {
                id: county[0],
                path_id: county[1],
                english: county[2],
                welsh: county[3],
                value: loc[1],
                top: parseInt(county[4]),
                left: parseInt(county[5])
            }
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




