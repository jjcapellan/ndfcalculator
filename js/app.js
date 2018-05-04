/**
* @fileoverview Application to calculate exposure times with neutral density filters.
*
* @author Juan José Capellán
* @version 1.0
*/

window.onload = function () {
    exposureApp.initialize();
};

// Global variable to store the setInterval function used in exposureApp.activateCounter()
var exposureInterval;

// Global variable to use as namespace
var exposureApp = {

    /**
     * Initialize arrays, variables and html elements 
     */
    initialize: function () {

        // Indicates the row in speedArray for the actual mode. Possible values: 0,2,4 
        this.stopsMode = 0;

        this.modesArray = [
            [
                'Full stops', 'Half stops', '1/3 stops'
            ],
            [
                0, 2, 4
            ]
        ];


        // Column in modesArray
        this.modeIndex = 0;

        // Label of mode
        this.lb_mode = document.getElementById('lbmode');
        this.lb_mode.innerHTML = this.modesArray[0][this.modeIndex];

        // Actual remaining time of the counter in seconds
        this.remainingTime = 0;

        // Shutter speed in seconds 
        this.resultInSeconds = 0;

        // True when sound is played first time. (workarround for user gesture limitation)
        this.soundIsInitialized=false;


        // Array with possible shutter speeds in text and number format (rows 0&1 full stops
        // rows 2&3 1/2 stops, rows 4&5 1/3 stops)
        this.speedArray = [
            [
                '<sup>1</sup>/<sub>8000</sub>',
                '<sup>1</sup>/<sub>4000</sub>',
                '<sup>1</sup>/<sub>2000</sub>',
                '<sup>1</sup>/<sub>1000</sub>',
                '<sup>1</sup>/<sub>500</sub>',
                '<sup>1</sup>/<sub>250</sub>',
                '<sup>1</sup>/<sub>125</sub>',
                '<sup>1</sup>/<sub>60</sub>',
                '<sup>1</sup>/<sub>30</sub>',
                '<sup>1</sup>/<sub>15</sub>',
                '<sup>1</sup>/<sub>8</sub>',
                '<sup>1</sup>/<sub>4</sub>',
                '0"5',
                '1"',
                '2"',
                '4"',
                '8"',
                '15"',
                '30"',
                '1min',
                '2min',
                '4min',
                '8min',
                '15min',
                '30min',
                '1h',
                '2h',
                '4h',
                '8h'
            ],
            [
                1 / 8000, 1 / 4000, 1 / 2000, 1 / 1000, 1 / 500, 1 / 250, 1 / 125, 1 / 60, 1 / 30, 1 / 15, 1 / 8, 1 / 4,
                1 / 2, 1, 2, 4, 8, 15, 30, 60, 120, 240, 480, 900, 1800, 3600, 7200, 14400, 28800
            ],
            [
                '<sup>1</sup>/<sub>8000</sub>',
                '<sup>1</sup>/<sub>6000</sub>',
                '<sup>1</sup>/<sub>4000</sub>',
                '<sup>1</sup>/<sub>3000</sub>',
                '<sup>1</sup>/<sub>2000</sub>',
                '<sup>1</sup>/<sub>1500</sub>',
                '<sup>1</sup>/<sub>1000</sub>',
                '<sup>1</sup>/<sub>750</sub>',
                '<sup>1</sup>/<sub>500</sub>',
                '<sup>1</sup>/<sub>350</sub>',
                '<sup>1</sup>/<sub>250</sub>',
                '<sup>1</sup>/<sub>180</sub>',
                '<sup>1</sup>/<sub>125</sub>',
                '<sup>1</sup>/<sub>90</sub>',
                '<sup>1</sup>/<sub>60</sub>',
                '<sup>1</sup>/<sub>45</sub>',
                '<sup>1</sup>/<sub>30</sub>',
                '<sup>1</sup>/<sub>20</sub>',
                '<sup>1</sup>/<sub>15</sub>',
                '<sup>1</sup>/<sub>10</sub>',
                '<sup>1</sup>/<sub>8</sub>',
                '<sup>1</sup>/<sub>6</sub>',
                '<sup>1</sup>/<sub>4</sub>',
                '0"3',
                '0"5',
                '0"7',
                '1"',
                '1"5',
                '2"',
                '3"',
                '4"',
                '6"',
                '8"',
                '10"',
                '15"',
                '20"',
                '30"',
                '45"',
                '1min',
                '1min 30sec',
                '2min',
                '3min',
                '4min',
                '6min',
                '8min',
                '11min 30sec',
                '15min',
                '22min 30sec',
                '30min',
                '45min',
                '1h',
                '1h 30min',
                '2h',
                '3h',
                '4h',
                '6h',
                '8h'
            ],
            [
                1 / 8000, 1 / 6000, 1 / 4000, 1 / 3000, 1 / 2000, 1 / 1500, 1 / 1000, 1 / 750, 1 / 500,
                1 / 350, 1 / 250, 1 / 180, 1 / 125, 1 / 90, 1 / 60, 1 / 45, 1 / 30, 1 / 20, 1 / 15, 1 / 10, 1 / 8,
                1 / 6, 1 / 4, 0.3, 0.5, 0.7, 1, 1.5, 2, 3, 4, 6, 8, 10, 15, 20, 30, 45, 60, 90, 120,
                180, 240, 360, 480, 690, 900, 1350, 1800, 2700, 3600, 5400, 7200, 10800,
                14400, 21600, 28800
            ],
            [
                '<sup>1</sup>/<sub>8000</sub>',
                '<sup>1</sup>/<sub>6400</sub>',
                '<sup>1</sup>/<sub>5000</sub>',
                '<sup>1</sup>/<sub>4000</sub>',
                '<sup>1</sup>/<sub>3200</sub>',
                '<sup>1</sup>/<sub>2500</sub>',
                '<sup>1</sup>/<sub>2000</sub>',
                '<sup>1</sup>/<sub>1600</sub>',
                '<sup>1</sup>/<sub>1250</sub>',
                '<sup>1</sup>/<sub>1000</sub>',
                '<sup>1</sup>/<sub>800</sub>',
                '<sup>1</sup>/<sub>640</sub>',
                '<sup>1</sup>/<sub>500</sub>',
                '<sup>1</sup>/<sub>400</sub>',
                '<sup>1</sup>/<sub>320</sub>',
                '<sup>1</sup>/<sub>250</sub>',
                '<sup>1</sup>/<sub>200</sub>',
                '<sup>1</sup>/<sub>160</sub>',
                '<sup>1</sup>/<sub>125</sub>',
                '<sup>1</sup>/<sub>100</sub>',
                '<sup>1</sup>/<sub>80</sub>',
                '<sup>1</sup>/<sub>60</sub>',
                '<sup>1</sup>/<sub>50</sub>',
                '<sup>1</sup>/<sub>40</sub>',
                '<sup>1</sup>/<sub>30</sub>',
                '<sup>1</sup>/<sub>25</sub>',
                '<sup>1</sup>/<sub>20</sub>',
                '<sup>1</sup>/<sub>15</sub>',
                '<sup>1</sup>/<sub>13</sub>',
                '<sup>1</sup>/<sub>10</sub>',
                '<sup>1</sup>/<sub>8</sub>',
                '<sup>1</sup>/<sub>6</sub>',
                '<sup>1</sup>/<sub>5</sub>',
                '<sup>1</sup>/<sub>4</sub>',
                '0"3',
                '0"4',
                '0"5',
                '0"6',
                '0"8',
                '1"',
                '1"3',
                '1"6',
                '2"',
                '2"5',
                '3"2',
                '4"',
                '5"',
                '6"',
                '8"',
                '10"',
                '13"',
                '15"',
                '20"',
                '25"',
                '30"',
                '40"',
                '50"',
                '1min',
                '1min 20sec',
                '1min 40sec',
                '2min',
                '2min 40sec',
                '3min 20sec',
                '4min',
                '5min 20sec',
                '6min 40sec',
                '8min',
                '10min 20sec',
                '12min 40sec',
                '15min',
                '20min',
                '25min',
                '30min',
                '40min',
                '50min',
                '1h',
                '1h 20min',
                '1h 40min',
                '2h',
                '2h 40min',
                '3h 20min',
                '4h',
                '5h 20min',
                '6h 40min',
                '8h'
            ],
            [
                1 / 8000, 1 / 6400, 1 / 5000, 1 / 4000, 1 / 3200, 1 / 2500, 1 / 2000, 1 / 1600,
                1 / 1250, 1 / 1000, 1 / 800, 1 / 640, 1 / 500, 1 / 400, 1 / 320, 1 / 250, 1 / 200,
                1 / 160, 1 / 125, 1 / 100, 1 / 80, 1 / 60, 1 / 50, 1 / 40, 1 / 30, 1 / 25, 1 / 20, 1 / 15,
                1 / 13, 1 / 10, 1 / 8, 1 / 6, 1 / 5, 1 / 4, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.3, 1.6,
                2, 2.5, 3.2, 4, 5, 6, 8, 10, 13, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120,
                160, 200, 240, 320, 400, 480, 620, 760, 900, 1200, 1500, 1800, 2400,
                3000, 3600, 4800, 6000, 7200, 9600, 12000, 14400, 19200, 24000, 28800
            ]

        ];

        //HTML <p> element that show actual shutter speed
        this.lb_speed = document.getElementById('lbspeed');

        // Actual index of speedArray
        this.speedIndex = 5;

        // Max index of speedArray
        this.maxIndexSpeed = 18;

        //Show initial speed
        this.lb_speed.innerHTML = this.speedArray[0][this.speedIndex];

        //Filters array with optical densities values in second row
        this.filterArray = [
            [
                'ND2 0.3 1-stop',
                'ND4 0.6 2-stop',
                'ND8 0.9 3-stop',
                'ND16 1.2 4-stop',
                'ND32 1.5 5-stop',
                'ND64 1.8 6-stop',
                'ND128 2.1 7-stop',
                'ND256 2.4 8-stop',
                'ND400 2.6 8.6-stop',
                'ND512 2.7 9-stop',
                'ND1024 3.0 10-stop'
            ],
            [
                0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.6, 2.7, 3.0
            ]
        ];

        //HTML <p> element that show actual selected filter
        this.lb_filter = document.getElementById('lbfilter');

        // Actual index of filterArray
        this.filterIndex = 5;

        // Max index of filterArray
        this.maxIndexFilter = 10;

        // Show initial filter
        this.lb_filter.innerHTML = this.filterArray[0][this.filterIndex];

        // Other HTML elements
        this.div_result = document.getElementById('ExposureTime'); //<div> that contains the result
        this.p_result = document.getElementById('p_result'); // <p> with the result
        this.div_speedSelector = document.getElementById('speedSelector');
        this.div_filterSelector = document.getElementById('filterSelector');
        this.div_speedMode = document.getElementById('speedMode');
        this.snd_countend=document.getElementById('snd_countend');

        //Adding events to selectors
        this.div_speedSelector.addEventListener('touchstart', this.onDownSpeed.bind(this), false);
        this.div_speedSelector.addEventListener('mousedown', this.onDownSpeed.bind(this), false);
        this.div_speedSelector.addEventListener('touchend', this.onUp.bind(this), false);
        this.div_speedSelector.addEventListener('mouseup', this.onUp.bind(this), false);
        this.div_speedSelector.addEventListener('touchmove', this.onMove.bind(this), false);
        this.div_filterSelector.addEventListener('touchstart', this.onDownFilter.bind(this), false);
        this.div_filterSelector.addEventListener('mousedown', this.onDownFilter.bind(this), false);
        this.div_filterSelector.addEventListener('touchend', this.onUp.bind(this), false);
        this.div_filterSelector.addEventListener('mouseup', this.onUp.bind(this), false);
        this.div_filterSelector.addEventListener('touchmove', this.onMove.bind(this), false);
        this.div_speedMode.addEventListener('touchstart', this.onDownMode.bind(this), false);
        this.div_speedMode.addEventListener('mousedown', this.onDownMode.bind(this), false);
        this.div_speedMode.addEventListener('touchend', this.onUp.bind(this), false);
        this.div_speedMode.addEventListener('mouseup', this.onUp.bind(this), false);
        this.div_speedMode.addEventListener('touchmove', this.onMove.bind(this), false);
        // On android touchend and pointerdown isn't detected as user gesture
        this.div_result.addEventListener('mousedown', this.activateCounter.bind(this), false);

        //Variables to control swipe gesture
        this.swipeXstart = 0;
        this.swipeXend = 0;
        this.swipMode = 'speed';

        //Variable to control counter activation
        this.counterIsactive = false;

        //Initial result
        this.printResult();

    },

    /**
     * Executed by html element div_speedSelector on touchstart event
     * 
     * @param {event} evt
     */
    onDownSpeed: function (evt) {
        this.swipMode='speed';
        if (evt.type == 'touchstart') {
            this.swipeXstart = evt.touches[0].clientX;
        } else {
            this.swipeXstart = evt.clientX;
        };
    },

    /**
     * Executed by html element div_filterSelector on touchstart event
     * 
     * @param {event} evt 
     */
    onDownFilter: function (evt) {
        this.swipMode = 'filter';
        if (evt.type == 'touchstart') {
            this.swipeXstart = evt.touches[0].clientX;
        } else {
            this.swipeXstart = evt.clientX;
        };
    },

    /**
     * Executed by html element div_speedMode on touchstart event
     * 
     * @param {event} evt 
     */
    onDownMode: function (evt) {
        this.swipMode = 'mode';
        if (evt.type == 'touchstart') {
            this.swipeXstart = evt.touches[0].clientX;
        } else {
            this.swipeXstart = evt.clientX;
        };
    },

    /**
     * Executed by div_speedSelector, div_filterSelector and div_speedMode on touchend event
     * 
     * @param {event} evt 
     */
    onUp: function (evt) {

        if (evt.type == 'touchend') {
            this.swipeXend = evt.changedTouches[0].clientX;
        } else {
            this.swipeXend = evt.clientX;
        }

        if (Math.abs(this.swipeXstart - this.swipeXend) > 40) {

            if (this.swipMode == 'speed') {
                if (this.swipeXstart > this.swipeXend) {
                    this.btSpeedUp();
                } else {
                    this.btSpeedDown();
                }
            } else if (this.swipMode == 'filter') {
                if (this.swipeXstart > this.swipeXend) {
                    this.btFilterUp();
                } else {
                    this.btFilterDown();
                }
            } else if (this.swipMode == 'mode') {
                if (this.swipeXstart > this.swipeXend) {
                    this.modeIndex++;
                    if (this.modeIndex > 2) {
                        this.modeIndex = 2;
                    };
                    this.resetMode(this.modesArray[1][this.modeIndex]);

                } else {
                    this.modeIndex--;
                    if (this.modeIndex < 0) {
                        this.modeIndex = 0;
                    };
                    this.resetMode(this.modesArray[1][this.modeIndex]);
                }
            }
        }
    },

    /**
     * Increase the index of speedArray and show its value in the html element lb_speed 
     */
    btSpeedUp: function () {
        var t = this;
        this.speedIndex++;
        if (this.speedIndex > this.maxIndexSpeed) {
            this.speedIndex = this.maxIndexSpeed;
        };
        this.lb_speed.innerHTML = this.speedArray[this.stopsMode][this.speedIndex];

        this.lb_speed.style.fontSize = '1.3em';
        setTimeout(function () {
            t.lb_speed.style.fontSize = '1em';
        }, 200);

        this.printResult();
    },

    /**
     * Decrease the index of speedArray and show its value in the html element lb_speed
     * 
     */
    btSpeedDown: function () {
        var t = this;
        this.speedIndex--;
        if (this.speedIndex < 0) {
            this.speedIndex = 0;
        };
        this.lb_speed.innerHTML = this.speedArray[this.stopsMode][this.speedIndex];

        this.lb_speed.style.fontSize = '1.3em';
        setTimeout(function () {
            t.lb_speed.style.fontSize = '1em';
        }, 200);

        this.printResult();
    },

    /**
     * Increase the index of filterArray and show its value in the html element lb_filter 
     */
    btFilterUp: function () {
        var t = this;
        this.filterIndex++;
        if (this.filterIndex > this.maxIndexFilter) {
            this.filterIndex = this.maxIndexFilter;
        };
        this.lb_filter.innerHTML = this.filterArray[0][this.filterIndex];

        this.lb_filter.style.fontSize = '1.1em';
        setTimeout(function () {
            t.lb_filter.style.fontSize = '1em';
        }, 200);

        this.printResult();
    },

    /**
     * Decrease the index of filterArray and show its value in the html element lb_filter 
     */
    btFilterDown: function () {
        var t = this;
        this.filterIndex--;
        if (this.filterIndex < 0) {
            this.filterIndex = 0;
        };
        this.lb_filter.innerHTML = this.filterArray[0][this.filterIndex];

        this.lb_filter.style.fontSize = '1.1em';
        setTimeout(function () {
            t.lb_filter.style.fontSize = '1em';
        }, 200);

        this.printResult();
    },

    /**
     * Executed on touchmove event by some html elements. Prevents default behaviors during a swipe. 
     * 
     * @param {event} evt 
     */
    onMove: function (evt) {
        evt.preventDefault();
    },

    /**
     * Shows the shutter speed in html element p_result after calculating it.
     * 
     */
    printResult: function () {
        var t = this;

        /**
         * Calculates the shutter speed with filter
         * 
         * @returns {number} shutter speed in seconds
         */
        function resultCalc() {
            var initialTime = t.speedArray[t.stopsMode + 1][t.speedIndex];
            var opticalDensity = t.filterArray[1][t.filterIndex];
            return initialTime * Math.pow(10, opticalDensity);
        };


        /**
         * Looks for the closest number in speedArray to the value initially calculated.
         * 
         * @param {number} num shutter speed in seconds
         * @returns {string} closest value in speedArray to calculated value in text format
         */
        function nearestValue(num) {
            var dif = 28800;
            var step = 1;
            var counter = 0;
            var index = 12;

            if (num >= 28800) {
                t.resultInSeconds = 28800;
                return '8h';
            };

            while (counter < 2000) {

                var actualDif = Math.abs(t.speedArray[t.stopsMode + 1][index] - num);

                if (actualDif < dif) {
                    dif = actualDif;
                    index += step;
                }

                if (actualDif > dif) {
                    if (step > 0) {
                        dif = actualDif;
                        step *= -1;
                        index += step;
                    } else {
                        t.resultInSeconds = t.speedArray[t.stopsMode + 1][index + step * (-1)];
                        return t.speedArray[t.stopsMode][index + step * (-1)];
                    }
                }
                counter++;
            }
            console.log('Error: exit from infinite loop');
        };

        // Show the result
        this.p_result.innerHTML = nearestValue(resultCalc());
        this.div_result.style.background = 'radial-gradient( #eea5a2, #3f3658)';
        setTimeout(function () {
            t.div_result.style.background = 'radial-gradient( #9b2f2f, #3f3658)';
        }, 200);

    },

    /**
     * Executed on mode changes. Reinitializes some variables for the actual mode.
     * 
     * @param {number} num indicates the row in speedArray for the actual mode.
     */
    resetMode: function (num) {
        switch (num) {
            case 0:
                this.lb_mode.innerHTML = this.modesArray[0][0];
                this.stopsMode = 0;
                this.speedIndex = 5;
                this.maxIndexSpeed = 18;
                this.lb_speed.innerHTML = this.speedArray[this.stopsMode][this.speedIndex];
                this.printResult();
                break;

            case 2:
                this.lb_mode.innerHTML = this.modesArray[0][1];
                this.stopsMode = 2;
                this.speedIndex = 10;
                this.maxIndexSpeed = 36;
                this.lb_speed.innerHTML = this.speedArray[this.stopsMode][this.speedIndex];
                this.printResult();
                break;

            case 4:
                this.lb_mode.innerHTML = this.modesArray[0][2];
                this.stopsMode = 4;
                this.speedIndex = 15;
                this.maxIndexSpeed = 54;
                this.lb_speed.innerHTML = this.speedArray[this.stopsMode][this.speedIndex];
                this.printResult();
                break;

            default:
                break;
        }
    },

    /**
     * Converts the number of seconds to the format "hh:mm:ss"
     * 
     * @param {number} seconds 
     * @returns {string} string with format "hh:mm:ss"
     */
    secondsTohms: function (seconds) {
        var hours, mins, secs;

        hours = parseInt(seconds / 3600);
        mins = parseInt((seconds % 3600) / 60);
        secs = seconds % 60;

        hours = hours < 10 ? '0' + hours : hours;
        mins = mins < 10 ? '0' + mins : mins;
        secs = secs < 10 ? '0' + secs : secs;

        return hours + ':' + mins + ':' + secs;
    },

    /**
     * Activate a countdown. Executed by event mousedown on div_result HTML element.
     * 
     */
    activateCounter: function () {
        var t = this;

        // Enable future sounds without user gestures limitation
        if(!this.soundIsInitialized){
            this.snd_countend.volume='0';
            this.snd_countend.play();
            this.soundIsInitialized=true;
        }

        if (this.resultInSeconds > 2) {
            if (!this.counterIsactive) {
                this.counterIsactive = true;
                // Counter initial value
                this.remainingTime = this.resultInSeconds;
                // First iteraction
                this.p_result.innerHTML = this.secondsTohms(this.remainingTime);
                this.remainingTime--;
                exposureInterval = setInterval(function () {
                    t.p_result.innerHTML = t.secondsTohms(t.remainingTime);
                    t.remainingTime--;
                    if (t.remainingTime < 0) {  
                        t.snd_countend.volume='1';
                        t.snd_countend.play();                      
                        clearInterval(exposureInterval);
                    }
                }, 1000);
            } else {
                // Counter cancel
                if (exposureInterval != undefined) {
                    clearInterval(exposureInterval);
                };
                this.counterIsactive = false;

                this.printResult();

            }
        }
    }


}