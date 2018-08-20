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
var lectureClock = new Date(), lectureTimeLeft = 0, lectureCurrentActivity = 0, lectureActivities, lectureTimes = []; /* [] is the best practice, rather than new Array() */

function init() {
	lectureActivities = document.getElementsByClassName("lectureActivity"); /* Keep as few global vars as possible */
	if(lectureActivities.length == 0) {
		alert("No activities, no lecture.");
	}
	var previousClock = new Date(lectureClock);
	previousClock.setHours(0);
	previousClock.setMinutes(0);
	/* Do not use the for/in statement because it may work asynchronously. */
	var lectI;
	for(lectI = 0; lectI < lectureActivities.length; ++lectI) {
		var lectActivity = lectureActivities[lectI];
		var lectMatch = lectActivity.innerHTML.match(/^(\d\d?):(\d\d?) /);
		var lectHours = lectMatch[1]; /* The first element is the whole match, unnecessary here. */
		var lectMinutes = lectMatch[2];
		if((lectHours >= 0) && (lectHours < 24) && (lectMinutes >= 0) && (lectMinutes < 60)) {
			var lectClockI = new Date(lectureClock);
			lectClockI.setHours(lectHours);
			lectClockI.setMinutes(lectMinutes);
			if(lectClockI > previousClock) {
				lectureTimes.push(lectClockI);
				previousClock = lectClockI;
			}
			else {
				alert("Please make sure activity times are strictly ordered and not taking place at midnight. Who teaches at midnight?\nPrevious activity: " + lectureActivities[lectI - 1].innerHTML + "\nCurrent activity: " +  lectureActivities[lectI].innerHTML)
				break;
			}
		}
		else {
			alert("Incorrect time: " + lectActivity.innerHTML);
		}
	}
/*	var lectI, alertMsg = "lectureTimes:";
	for(lectI = 0; lectI < lectureTimes.length; ++lectI) {
		alertMsg = alertMsg + "\n" + lectI + ": " + lectureTimes[lectI];
	}
	alert(alertMsg); */
	while((lectureCurrentActivity < lectureTimes.length) && (lectureTimes[lectureCurrentActivity] < lectureClock)) {
		++lectureCurrentActivity;
	}
	--lectureCurrentActivity;
	var lectTimeCell = document.getElementById("lectureTimeCell");
	if(lectureCurrentActivity < 0) {
		lectureActivities[0].style.color = "ForestGreen";
		lectTimeCell.style.color = "LawnGreen";
	}
	else {
		lectureActivities[lectureCurrentActivity].style.color = "Lime";
	}
	if(lectureCurrentActivity == lectureActivities.length - 1) {
		lectTimeCell.innerHTML = "Finished";
		lectTimeCell.style.color = "Lime";
	}
	setLectureTimeLeft();
	renderLectureTime();
	renderLectureTimeLeft();
	setInterval(renderLectureTime, 1000);
}

window.onload = init;

function lectureFullScreen() {
	/* Request to see this app in fullscreen. */
	var lectureDoc = document.documentElement;
	if (lectureDoc.requestFullscreen) {
		lectureDoc.requestFullscreen();
	}
	else if (lectureDoc.mozRequestFullScreen) { /* Firefox */
		lectureDoc.mozRequestFullScreen();
	}
	else if (lectureDoc.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		lectureDoc.webkitRequestFullscreen();
	} else if (lectureDoc.msRequestFullscreen) { /* IE/Edge */
		lectureDoc.msRequestFullscreen();
	}
}

function renderLectureTime() {
	lectureClock = new Date();
	document.getElementById("currentTimeCell").innerHTML = lectureClock.toLocaleTimeString();
	if(lectureClock.getSeconds() == 0) {
		if(lectureTimeLeft && (lectureCurrentActivity < lectureActivities.length - 1)) {
			--lectureTimeLeft;
		}
		renderLectureTimeLeft();
	}
}

function renderLectureTimeLeft() {
	var lectTimeCell = document.getElementById("lectureTimeCell")
	if(lectureCurrentActivity < lectureActivities.length - 1) {
		if(lectureTimeLeft <= 0) {
			if(lectureCurrentActivity >= 0) {
				lectureActivities[lectureCurrentActivity].style.color = document.body.style.color;
			}
			++lectureCurrentActivity;
			lectureActivities[lectureCurrentActivity].style.color = "Lime";
			if(lectureCurrentActivity == lectureActivities.length - 1) {
				lectTimeCell.innerHTML = "Finished";
				lectTimeCell.style.color = "Lime";
			}
			else {
				lectTimeCell.style.color = document.body.style.color;
			}
			setLectureTimeLeft();
		}
		else if(lectureTimeLeft <= 2) {
			if(lectureCurrentActivity >= 0) {
				lectureActivities[lectureCurrentActivity].style.color = "red";
			} else {
				lectureActivities[0].style.color = "red";
			}
			lectTimeCell.style.color = "red";
		}
		if((lectureCurrentActivity >= 0) && (lectureCurrentActivity < lectureActivities.length - 1) && (lectureTimeLeft > 2)) { /* Yes, the code checks again. See above. */
			lectTimeCell.style.color = document.body.style.color;
		}
	}
	if(lectureCurrentActivity < lectureActivities.length - 1) { /* Yes, the code checks again. See above. */
		lectTimeCell.innerHTML = lectureTimeLeft + " Min";
	}
}

function setLectureTimeLeft() {
	if(lectureCurrentActivity < lectureActivities.length - 1) {
		var lectDifference = new Date(lectureTimes[lectureCurrentActivity + 1] - lectureClock);
		lectureTimeLeft = ((lectDifference.getHours() - 19) * 60 + lectDifference.getMinutes()); /* The 19 hour offset is contained in the epoch (7:00PM) */
	}
	else {
		lectureTimeLeft = 100;
	}
}
