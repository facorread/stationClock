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
var lectureCurrentTime = new Date(), lectureTimeLeft = 0, lectureTimeCell, lectureCurrentActivity = 0, lectureActivities, lectureTimes = []; /* [] is the best practice, rather than new Array() */

function init() {
	lectureTimeCell = document.getElementById("lectureTimeCell"), lectureCurrentActivity = 0;
	lectureActivities = document.getElementsByClassName("lectureActivity");
	var previousClock = new Date(lectureCurrentTime);
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
			var lectClockI = new Date(lectureCurrentTime);
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
	while((lectureCurrentActivity < lectureTimes.length) && (lectureTimes[lectureCurrentActivity] < lectureCurrentTime)) {
		++lectureCurrentActivity;
	}
	--lectureCurrentActivity;
	if(lectureCurrentActivity <= 0) {
		lectureActivities[0].style.color = "yellow";
		setLectureTimeLeft(lectureTimes[0]);
	}
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
	lectureCurrentTime = new Date();
	document.getElementById("currentTimeCell").innerHTML = lectureCurrentTime.toLocaleTimeString();
	if(lectureCurrentTime.getSeconds() == 0) {
		if(lectureTimeLeft) {
			--lectureTimeLeft;
		}
		renderLectureTimeLeft();
	}
}

function renderLectureTimeLeft() {
	lectureTimeCell.innerHTML = lectureTimeLeft + " Min";
	if(lectureTimeLeft <= 0) {
		if(lectureCurrentActivity >= 0) {
			lectureActivities[lectureCurrentActivity].style.color = "white";
		}
		lectureActivities[++lectureCurrentActivity].style.color = "green";
		lectureTimeCell.style.color = "white";
	}
	else if(lectureTimeLeft <= 2) {
		if(lectureCurrentActivity >= 0) {
			lectureActivities[lectureCurrentActivity].style.color = "red";
		} else {
			lectureActivities[0].style.color = "red";
		}
		lectureTimeCell.style.color = "red";
	}
	if(lectureTimeLeft > 0) { /* Yes, the code checks again. See above. */
		lectureTimeCell.style.color = document.body.style.color;
	}
}

function setLectureTimeLeft(lectureNextTime) {
	var lectDifference = new Date(lectureNextTime - lectureCurrentTime);
	lectureTimeLeft = ((lectDifference.getHours() - 19) * 60 + lectDifference.getMinutes()); /* The 19 hour offset is contained in the epoch (7:00PM) */
}
