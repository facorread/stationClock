/* This file is part of stationClock: Simple clock, countdown, and message board for going through stations in a lab
Copyright (C) 2016-2018 Fabio Correa facorread@gmail.com

https://github.com/facorread/stationClock
https://gitlab.com/facorread/stationClock

stationClock is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

stationClock is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with stationClock.  If not, see <http://www.gnu.org/licenses/>.
*/

var stationNoSleep;

function stationSetEventListeners() {
	var sttnCurrentTimecell = document.getElementById("currentTimeCell");
	if (
	document.fullscreenElement || /* Standard syntax */
	document.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
	document.mozFullScreenElement ||/* Firefox syntax */
	document.msFullscreenElement /* IE/Edge syntax */
	) {
		sttnCurrentTimecell.removeEventListener("click", stationRequestFullScreen)
		sttnCurrentTimecell.addEventListener("click", stationExitFullScreen)
	} else {
		sttnCurrentTimecell.removeEventListener("click", stationExitFullScreen)
		sttnCurrentTimecell.addEventListener("click", stationRequestFullScreen)
	}
}

function stationRequestFullScreen() {
	stationNoSleep.enable();
	var sttnDoc = document.documentElement;
	if (sttnDoc.requestFullscreen) {
		sttnDoc.requestFullscreen();
	}
	else if (sttnDoc.mozRequestFullScreen) { /* Firefox */
		sttnDoc.mozRequestFullScreen();
	}
	else if (sttnDoc.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
		sttnDoc.webkitRequestFullscreen();
	} else if (sttnDoc.msRequestFullscreen) { /* IE/Edge */
		sttnDoc.msRequestFullscreen();
	}
}

function stationExitFullScreen() {
	stationNoSleep.disable();
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
	stationNoSleep = new NoSleep();
	stationSetEventListeners();
	document.addEventListener("fullscreenchange", stationSetEventListeners);
	if (
	document.fullscreenElement || /* Standard syntax */
	document.webkitFullscreenElement || /* Chrome, Safari and Opera syntax */
	document.mozFullScreenElement ||/* Firefox syntax */
	document.msFullscreenElement /* IE/Edge syntax */
	) {
		stationNoSleep.enable();
	} else {
		stationNoSleep.disable();
	}
	renderStationTime(true);
	setInterval(renderStationTime, 1000);
}

window.onload = init;

function stationWindowUnload() {
	stationNoSleep.disable();
}

window.onunload = stationWindowUnload;

function renderStationTime(sttnFirstTime = false) {
	var sttnClock = new Date();
	document.getElementById("currentTimeCell").innerHTML = sttnClock.toLocaleTimeString();
	if(sttnFirstTime || (sttnClock.getSeconds() == 0)) {
		var sttnActivities = document.getElementsByClassName("stationActivity"); /* Keep as few global vars as possible */
		if(sttnActivities.length > 0) {
			/* Do not use the for/in statement because it may work asynchronously. */
			var sttnI; /* Used as index of station activities */
			var sttnHighlighted = false; /* Make sure only one activity was highlighted */
			var sttnTimeCell = document.getElementById("stationTimeCell");
			for(sttnI = 0; sttnI < sttnActivities.length; ++sttnI) {
				var sttnActivity = sttnActivities[sttnI];
				if(sttnHighlighted) {
					sttnActivity.style.color = document.body.style.color;
				}
				else {
					var sttnMatch = sttnActivity.innerHTML.match(/^(\d\d?):(\d\d?) /);
					if(sttnMatch === null) {
						continue; /* Ignore badly formatted line */
					}
					var sttnHours = sttnMatch[1]; /* Element 0 is the whole match, unnecessary here. */
					var sttnMinutes = sttnMatch[2];
					if((sttnHours >= 0) && (sttnHours < 24) && (sttnMinutes >= 0) && (sttnMinutes < 60)) {
						var sttnActClock = new Date(sttnClock);
						sttnActClock.setHours(sttnHours);
						sttnActClock.setMinutes(sttnMinutes);
						if(sttnClock < sttnActClock) {
							sttnHighlighted = true;
							var sttnDifference = new Date(sttnActClock - sttnClock); /* Anything different from sttnClock will produce a wrong time left. */
							var sttnTimeLeft = ((sttnDifference.getHours() - 19) * 60 + sttnDifference.getMinutes()); /* The 19 hour offset is contained in the epoch (7:00PM) */
							sttnTimeCell.innerHTML = sttnTimeLeft + " Min";
							if(sttnI == 0) {
								sttnActivity.style.color = "ForestGreen";
								if(sttnTimeLeft > 2) {
									sttnTimeCell.style.color = "LawnGreen";
								}
								else {
									sttnTimeCell.style.color = "red";
								}
							}
							else {
								sttnActivity.style.color = document.body.style.color;
								if(sttnTimeLeft > 2) {
									sttnActivities[sttnI - 1].style.color = "Lime";
									sttnTimeCell.style.color = document.body.style.color;
								}
								else {
									sttnActivities[sttnI - 1].style.color = "red";
									sttnTimeCell.style.color = "red";
								}
							}
						}
						else {
							if(sttnI == sttnActivities.length - 1) {
								sttnHighlighted = true;
								sttnActivity.style.color = "Lime";
								sttnTimeCell.innerHTML = "Finished";
								sttnTimeCell.style.color = "Lime";
							}
							else {
								sttnActivity.style.color = document.body.style.color;
								/* sttnTimeCell.style.color = document.body.style.color; Do not use here. */
							}
						}
					}
					else {
						sttnActivity.style.color = document.body.style.color;
						continue; /* Ignore badly formatted line */
					}
				}
			}
		}
	}
}
