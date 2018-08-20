/* This file is part of lectureClock: Simple clock and outline for classroom activities
Copyright (C) 2016-2018 Fabio Correa fabio5@osu.edu

https://github.com/facorread/lectureClock
https://gitlab.com/facorread/lectureClock

lectureClock is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

lectureClock is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with lectureClock.  If not, see <http://www.gnu.org/licenses/>.
*/

// The exam time can be set by clicking it.
var lectureEndTime = "13:35", lectureTimeLeft = 75, lectureTimeEnabled = true, lectureCurrentActivity = 1, lectureActivityTimeArray = []; /* [] is the best practice, rather than new Array() */

function init() {
    renderTime();
		var lectClock = new Date();
		var previousClock = new Date(lectClock);
		previousClock.setHours(0);
		previousClock.setMinutes(0);
		for(var lectActivity = document.getElementById("lectureActivity1");
		    lectActivity;
				lectActivity = document.getElementById("lectureActivity" + (++lectureCurrentActivity)))
		{
			var lectMatch = lectActivity.innerHTML.match(/^(\d\d?):(\d\d?) /);
			var lectHours = lectMatch[1]; /* The first element is the whole match, unnecessary here. */
			var lectMinutes = lectMatch[2];
			if((lectHours >= 0) && (lectHours < 24) && (lectMinutes >= 0) && (lectMinutes < 60)) {
				var lectClockI = new Date(lectClock);
				lectClockI.setHours(lectHours);
				lectClockI.setMinutes(lectMinutes);
				if(lectClockI > previousClock) {
					lectureActivityTimeArray.push(lectClockI);
					previousClock = lectClockI;
				} else {
					alert("Please make sure activity times are strictly ordered and not taking place at midnight. Who teaches at midnight?\nPrevious activity: " + previousClock + "\nNew activity: " + lectClockI)
					break;
				}
			} else
				alert("Incorrect time: " + lectActivity.innerHTML);
		}
/*		var lectI, alertMsg = "lectureActivityTimeArray:";
		for(lectI = 0; lectI < lectureActivityTimeArray.length; ++lectI) {
			alertMsg = alertMsg + "\n" + lectI + ": " + lectureActivityTimeArray[lectI];
		}
		alert(alertMsg); */
		setLectureTimeArr([lectHours, lectMinutes]);
    renderLectureTimeLeft();
    setInterval(renderTime, 1000);
}

function lectureFullScreen() {
    /* Request to see this app in fullscreen. */
		var lectureDoc = document.documentElement;
    if (lectureDoc.requestFullscreen) {
      lectureDoc.requestFullscreen();
    } else if (lectureDoc.mozRequestFullScreen) { /* Firefox */
      lectureDoc.mozRequestFullScreen();
    } else if (lectureDoc.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      lectureDoc.webkitRequestFullscreen();
    } else if (lectureDoc.msRequestFullscreen) { /* IE/Edge */
      lectureDoc.msRequestFullscreen();
    }
}

function renderTime() {
    var lectCurrentTime = new Date();
		
    document.getElementById("currentTimeCell").innerHTML = lectCurrentTime.toLocaleTimeString();
    if(lectureTimeEnabled && (lectCurrentTime.getSeconds() == 0)) {
        --lectureTimeLeft;
        renderLectureTimeLeft();
    }
}

function renderLectureTimeLeft() {
    var lectureTimeCell = document.getElementById("lectureTimeCell");
    // The following should not be optimized because this function is invoked by setLectureTime() at any time.
    if(lectureTimeEnabled) {
        lectureTimeCell.innerHTML = "Time left: " + lectureTimeLeft + " Min";
        if(lectureTimeLeft <= 10) {
           lectureTimeCell.style.color = "red";
        } else {
            lectureTimeCell.style.color = document.body.style.color;
        }
    } else {
        lectureTimeCell.innerHTML = "Click here for timer";
        lectureTimeCell.style.color = document.body.style.color;
    }
}

window.onload = init;

function setLectureTimeArr(timeArray) { /* Example for 1:35PM: setLectureTimeArr(["13", "35"]); */
		var lectEndHour = timeArray[0];
		var lectEndMinute = timeArray[1];
		if((lectEndHour >= 0) && (lectEndHour < 24) && (lectEndMinute >= 0) && (lectEndMinute < 60)) {
			var lectNow = new Date();
			var lectEnd = new Date();
			lectEnd.setHours(lectEndHour);
			lectEnd.setMinutes(lectEndMinute);
			lectureTimeEnabled = (lectEnd > lectNow);
			if(lectureTimeEnabled) {
				var lectDifference = new Date(lectEnd - lectNow);
				lectureTimeLeft = ((lectDifference.getHours() - 19) * 60 + lectDifference.getMinutes()); /* The 19 hour offset is contained in the epoch (7:00PM) */
			}
		}
}

function setLectureTime() {
    var enteredText = prompt("Enter the ending time in 24-hour HH:MM format\n(0 to hide):", lectureEndTime);
		var enteredMatch = enteredText.match(/^(\d\d?):(\d\d?)$/);
    if(enteredMatch) {
			enteredMatch.shift(); /* The first element is the whole match, unnecessary here. */
			setLectureTimeArr(enteredMatch);
    } else {
        lectureTimeEnabled = false;
    }
    renderTime();
    renderLectureTimeLeft();
}
