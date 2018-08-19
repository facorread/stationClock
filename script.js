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
var lectureTimeLeft = 75, lectureTimeEnabled = false;

function init() {
    renderTime();
    renderLectureTimeLeft();
    resizeLecture();
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
    var d = new Date();
    document.getElementById("currentTimeCell").innerHTML = d.toLocaleTimeString();
    if(lectureTimeEnabled && (d.getSeconds() == 0)) {
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

function setLectureTime() {
    var enteredText = prompt("Enter the new time left in minutes\n(0 to hide):", lectureTimeLeft);
    if(enteredText.match(/^\d+$/)) {
        lectureTimeEnabled = (enteredText > 0);
        lectureTimeLeft = enteredText;
    } else {
        lectureTimeEnabled = false;
    }
    renderTime();
    renderLectureTimeLeft();
}

function resizeLecture() {
    document.getElementById("LectureMessages").style.height = (window.innerHeight * 0.8) + "px";
}
