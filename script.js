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

function hideAudioSample() {
	document.getElementById("audioSampleDiv").style.display = "none";
	document.getElementById("stationAlarm").removeEventListener("playing", hideAudioSample);
	stationNoSleep.enable();
}

function init() {
	stationNoSleep = new NoSleep();
	renderStationTime(true);
	setInterval(renderStationTime, 1000);
	document.getElementById("stationAlarm").addEventListener("playing", hideAudioSample);
}

window.onload = init;

function stationWindowUnload() {
	stationNoSleep.disable();
}

window.onunload = stationWindowUnload;

function renderStationTime(sttnFirstTime = false) {
	var sttnClock = new Date();
	document.getElementById("currentTimeCell").innerHTML = sttnClock.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	var sttnTimeCell = document.getElementById("stationTimeCell");
	/* Time reference: The stationTimeCell timer must reach zero at 11:30AM = 690 minutes = 41400 seconds since midnight.
	   Time interval: The stationTimeCell timer lasts 7 minutes = 420 seconds */
	var sttnSecondsFromReference = 60 * (sttnClock.getHours() * 60 + sttnClock.getMinutes()) + sttnClock.getSeconds() - 41300;
	var sttnSecondsLeft = 420 - (sttnSecondsFromReference % 420);
	var sttnSecondsLeft60 = (sttnSecondsLeft % 60);
	var sttnTimeCell = document.getElementById("stationTimeCell");
	sttnTimeCell.innerHTML = Math.floor(sttnSecondsLeft / 60) + ((sttnSecondsLeft60 > 9) ? ":" : ":0") + sttnSecondsLeft60;
	//sttnTimeCell.innerHTML = typeof(sttnSecondsToday);
	if(sttnSecondsLeft > 60) {
		sttnTimeCell.style.color = document.body.style.color;
	} else {
		sttnTimeCell.style.color = "red";
		if(sttnSecondsLeft === 5) {
			document.getElementById("stationAlarm").play();
		}
	}
}
