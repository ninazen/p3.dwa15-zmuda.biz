/* 
    Document   : tiktok.js
    Author     : Nina Zmuda
    Class      : CSCE-15 Project 3
    Description: Javascripts for tiktok program
*/

// Disable return key from imitating a button press
function stopRKey(evt) {
	var evt  = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type=="button")) { return false; }
}
document.onkeypress = stopRKey;

// Padding function
function pad(number, length) {
	var str = '' + number;
	while (str.length < length) {str = '0' + str;}
	return str;
}

// Countdown reset
function countdownReset() {
	var newCount = parseInt($('input[name=startTime]').val())*100;
	if(newCount > 0) {countdownCurrent = newCount;}
	countdownTimer.stop().once();
}

var countdownTimer = "";
var clickSound = new Audio('sounds/done.wav');

function swapToBreakTimer() {

	// Reset the countdown
	if (countdownTimer != "") {
		countdownTimer.stop();
		countdownTimer = "";
	}

	// Hide the welcome message
	$('#welcome-timer').hide();

	// Hide the start timer and button
	$('#pom-timer').hide();
	$('#start-timer').hide();
	$('#start-block').hide();

	// Change the button text and show timer and buttons
	$('#break').prop('value','Take a Break');
	$('#java-timer').show();
	$('#break-timer').hide();
	$('#break-block').show();
	$('#min-slider').show();	
}

function swapToStartTimer() {

	// Reset the countdown
	if (countdownTimer != "") {
		countdownTimer.stop();
		countdownTimer = "";
	}

	// Hide the welcome message
	$('#welcome-timer').hide();

	// Hide the break timer and buttons
	$('#java-timer').hide();
	$('#break-timer').hide();
	$('#break-block').hide();
	$('#min-slider').hide();			

	// Show the start timer and buttons
	$('#start').prop('value','Start a Pom');
	$('#pom-timer').show();
	$('#start-timer').hide();
	$('#start-block').show();}

// Prepare timers
$(document).ready(function() {

	// Hide error messages
	$('#pomo-error').hide();

	// Hide the start timer and info page
	$('#pom-timer').hide();
	$('#infoPage').hide(); 
	$('#breakInfoPage').hide(); 
	$('#pomInfoPage').hide(); 

	// Hide the break timer and button
	$('#java-timer').hide();
	$('#break-block').hide();
	$('#min-slider').hide();

	/*-- Timer Slider - main function to initialize the slider --*/

    $(function() {
        $( "#min-slider" ).slider({
            orientation: "horizontal",

            // NOTE: For testing purposes we've reduced these values
            // from 5-10-15-20-25-30 minute breaks to 1-2-3-4-5 minutes
            min: 1,   // 5,
            max: 5,   // 30,
            step: 1,  // 5,
            value: 1, // 5,
            slide: function( event, ui ) {
                $( "#min-count" ).val( ui.value );
                var timeval = pad($('#min-count').val(),1);
				$('#break-timer').html(timeval);
            }
        });
        
        $( "#min-count" ).val( $( "#min-slider" ).slider( "value" ) );      
    });
	
	/*-- Start a Pomodoro - main function to start up the timer --*/
	
	$('#start').click(function() {

		// Default to a fixed 25 minutes for all pomodoros - this is set in index.html
		// NOTE: For testing purposes, we've temporarily changed this to 3 minutes

		// Create the timer
		if (countdownTimer == "") {
			// Subtract one second off to avoid the initial flash
			var countdownCurrent = (($('#pom-count').val() * 6000)) - 1;

			countdownTimer = $.timer(function() {
				var hour = parseInt (countdownCurrent/360000);
				var min = parseInt(countdownCurrent/6000)-(hour*60);
				var sec = parseInt(countdownCurrent/100)-(hour*3600)-(min*60);

				$('#start-timer').html(pad(min,2)+":"+pad(sec,2));

				// Timer completed, sound an alert and move to next step
				if(countdownCurrent == 0) {
					clickSound.play();
					countdownTimer.stop();
					alert('ALL DONE!');
					swapToBreakTimer();

				// Else keep counting down
				} else {
					countdownCurrent-=7;
					if(countdownCurrent < 0) {countdownCurrent=0;}
				}
			}, 70, true);

			// Prep the timer

			// Hide the welcome message
			$('#welcome-timer').hide();

			// Hide the break button
			$('#break-timer').hide();

			// Change the button text to Quit
			$('#start').prop('value','Quit');
			$('#pom-timer').show();
			$('#start-timer').show();
			$('#start-block').show();			
		} 

		// Stop the timer if period expires or user cancels
		// Reset the buttons to show Take a Break next
		else {

			// If user wants to quit early, confirm it
			if (confirm("Do you really want to QUIT this pomodoro?") ) {

				// If confirmed, end the timer
				swapToStartTimer();			}
		}
	});
	
	/*-- Take a Break - main function to start up the timer --*/

	$('#break').click(function() {

		// Default to 5 minutes if no time is chosen
		// NOTE: For testing purposes we've changed this to 1 minute
		if ($('#break-timer').html()=="") {
			$('#min-count').val("1");
		}	
		
		// Start the timer
		if (countdownTimer == "") {
			// Subtract one second off to avoid the initial flash
			var countdownCurrent = (($('#min-count').val() * 6000))-1;

			countdownTimer = $.timer(function() {
				var hour = parseInt (countdownCurrent/360000);
				var min = parseInt(countdownCurrent/6000)-(hour*60);
				var sec = parseInt(countdownCurrent/100)-(hour*3600)-(min*60);

				$('#break-timer').html(pad(min,2)+":"+pad(sec,2));

				// Timer completed, sound an alert and move to next step
				if(countdownCurrent == 0) {
					clickSound.play();
					countdownTimer.stop();
					alert('ALL DONE!');
					swapToStartTimer();

				// Else keep counting down
				} else {
					countdownCurrent-=7;
					if(countdownCurrent < 0) {countdownCurrent=0;}
				}
			}, 70, true);

			// Hide the start timer and button
			$('#pom-timer').hide();
			$('#start-timer').hide();
			$('#start-block').hide();

			// Change the button text to Quit
			$('#break').prop('value','Quit');
			$('#break-block').show();
			$('#java-timer').show();
			$('#break-timer').show();
			$('#min-slider').hide();			
		} 

		// Stop the timer if period expires or user cancels
		// Reset the buttons to show Start a Pomodoro next
		else {

			// If user wants to quit early, confirm it
			if (confirm("Did you finish your break early?") ) {

				// If confirmed, end the timer
				swapToBreakTimer();
			}
		}
	});

	/*-- Global Navigation Links --*/

	// Go to the Start a Pom Page on double click
	$("#pomLink").dblclick(function() { 
		$('#pomInfoPage').hide(); 
		swapToStartTimer();; 
	} );

	// Toggle display of the Pom info
	$("#pomLink").click(function() { 
		$('#pomInfoPage').toggle(); 
	} );

	// Close the Pom info
	$("#pomInfoPage").click(function() { 
		$('#pomInfoPage').hide(); 
	} );

	// No action for double click on General info
	$("#infoLink").dblclick(function() { 
		// Do nothing for now
	} );

	// Toggle display of the General info
	$("#infoLink").click(function() { 
		$('#infoPage').toggle(); 
	} );

	// Close the General info
	$("#infoPage").click(function() { 
		$('#infoPage').hide(); 
	} );

	// Jump to the Take a Break page on double click
	$("#breakLink").dblclick(function() { 
		swapToBreakTimer(); 
	} );

	// Toggle display of the Break info
	$("#breakLink").click(function() { 
		$('#breakInfoPage').toggle(); 
	} );

	// Close the Break info
	$("#breakInfoPage").click(function() { 
		$('#breakInfoPage').hide(); 
	} );

	// Jump to the Start a Pom page
	$("#logo").click(function() { 
		swapToStartTimer(); 
	} );

});