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
var lectureNoSleep;

function lectureSetEventListeners() {
	var lectCurrentTimecell = document.getElementById("currentTimeCell");
	if (
	document.fullscreenElement || /* Standard syntax */
	document.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
	document.mozFullScreenElement ||/* Firefox syntax */
	document.msFullscreenElement /* IE/Edge syntax */
	) {
		lectCurrentTimecell.removeEventListener("click", lectureRequestFullScreen)
		lectCurrentTimecell.addEventListener("click", lectureExitFullScreen)
	} else {
		lectCurrentTimecell.removeEventListener("click", lectureExitFullScreen)
		lectCurrentTimecell.addEventListener("click", lectureRequestFullScreen)
	}
}

function lectureRequestFullScreen() {
	lectureNoSleep.enable();
	var lectDoc = document.documentElement;
	if (lectDoc.requestFullscreen) {
		lectDoc.requestFullscreen();
	}
	else if (lectDoc.mozRequestFullScreen) { /* Firefox */
		lectDoc.mozRequestFullScreen();
	}
	else if (lectDoc.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		lectDoc.webkitRequestFullscreen();
	} else if (lectDoc.msRequestFullscreen) { /* IE/Edge */
		lectDoc.msRequestFullscreen();
	}
}

function lectureExitFullScreen() {
	lectureNoSleep.disable();
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { /* Firefox */
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { /* IE/Edge */
		document.msExitFullscreen();
	}
}

function init() {
	lectureNoSleep = new NoSleep();
	lectureSetEventListeners();
	document.addEventListener("fullscreenchange", lectureSetEventListeners);
	if (
	document.fullscreenElement || /* Standard syntax */
	document.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
	document.mozFullScreenElement ||/* Firefox syntax */
	document.msFullscreenElement /* IE/Edge syntax */
	) {
		lectureNoSleep.enable();
	} else {
		lectureNoSleep.disable();
	}
	if (typeof(Storage) !== "undefined") {
    var lectStoredPlan = localStorage.getItem("com.fabio.lectureClock.storedPlan");
		if(lectStoredPlan) {
			document.getElementById("lecturePlan").innerHTML = lectStoredPlan;
		}
	} /* Else Sorry! No Web Storage support... */
	renderLectureTime(true);
	setInterval(renderLectureTime, 1000);
}

window.onload = init;

function lectureWindowUnload() {
	lectureNoSleep.disable();
}

window.onunload = lectureWindowUnload;

function renderLectureTime(lectFirstTime = false) {
	var lectClock = new Date();
	document.getElementById("currentTimeCell").innerHTML = lectClock.toLocaleTimeString();
	if(lectFirstTime || (lectClock.getSeconds() == 0)) {
		var lectActivities = document.getElementsByClassName("lectureActivity"); /* Keep as few global vars as possible */
		if(lectActivities.length > 0) {
			/* Do not use the for/in statement because it may work asynchronously. */
			var lectI; /* Used as index of lecture activities */
			var lectHighlighted = false; /* Make sure only one activity was highlighted */
			var lectTimeCell = document.getElementById("lectureTimeCell");
			for(lectI = 0; lectI < lectActivities.length; ++lectI) {
				var lectActivity = lectActivities[lectI];
				if(lectHighlighted) {
					lectActivity.style.color = document.body.style.color;
				}
				else {
					var lectMatch = lectActivity.innerHTML.match(/^(\d\d?):(\d\d?) /);
					if(lectMatch === null) {
						continue; /* Ignore badly formatted line */
					}
					var lectHours = lectMatch[1]; /* Element 0 is the whole match, unnecessary here. */
					var lectMinutes = lectMatch[2];
					if((lectHours >= 0) && (lectHours < 24) && (lectMinutes >= 0) && (lectMinutes < 60)) {
						var lectActClock = new Date(lectClock);
						lectActClock.setHours(lectHours);
						lectActClock.setMinutes(lectMinutes);
						if(lectClock < lectActClock) {
							lectHighlighted = true;
							var lectDifference = new Date(lectActClock - lectClock); /* Anything different from lectClock will produce a wrong time left. */
							var lectTimeLeft = ((lectDifference.getHours() - 19) * 60 + lectDifference.getMinutes()); /* The 19 hour offset is contained in the epoch (7:00PM) */
							lectTimeCell.innerHTML = lectTimeLeft + " Min";
							if(lectI == 0) {
								lectActivity.style.color = "ForestGreen";
								if(lectTimeLeft > 2) {
									lectTimeCell.style.color = "LawnGreen";
								}
								else {
									lectTimeCell.style.color = "red";
								}
							}
							else {
								lectActivity.style.color = document.body.style.color;
								if(lectTimeLeft > 2) {
									lectActivities[lectI - 1].style.color = "Lime";
									lectTimeCell.style.color = document.body.style.color;
								}
								else {
									lectActivities[lectI - 1].style.color = "red";
									lectTimeCell.style.color = "red";
								}
							}
						}
						else {
							if(lectI == lectActivities.length - 1) {
								lectHighlighted = true;
								lectActivity.style.color = "Lime";
								lectTimeCell.innerHTML = "Finished";
								lectTimeCell.style.color = "Lime";
							}
							else {
								lectActivity.style.color = document.body.style.color;
								/* lectTimeCell.style.color = document.body.style.color; Do not use here. */
							}
						}
					}
					else {
						lectActivity.style.color = document.body.style.color;
						continue; /* Ignore badly formatted line */
					}
				}
			}
		}
		if((typeof(Storage) !== "undefined") && (lectClock.getSeconds() == 0)) {
			localStorage.setItem("com.fabio.lectureClock.storedPlan", document.getElementById("lecturePlan").innerHTML);
		} /* Else Sorry! No Web Storage support... */
	}
}
