var canvas = document.getElementById("myCanvas");
var context = canvas.getContext('2d');
var video = document.getElementById("player");
var mask = document.getElementById("mask")
var virus = document.getElementById("virus");
var close = document.getElementsByClassName("closebtn");
let poseNet;
let poses = [];
let pose;

//setup of canvas and video
function setup() {
    getVideo();
    paintToCanvas();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', getPoses);
}

//initiates video capture
function getVideo() {
    //returns a promise
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();

        })
        .catch(err => {
            console.error("The video encountered an error", err);
        });
}

//adds video to canvas
function paintToCanvas() {

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, 800, 600);
    drawMask();
    addVirus();
    washYourHands();

    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    window.requestAnimationFrame(paintToCanvas);
}


//callback function to see if the posenet model is loaded
function modelLoaded() {
    console.log('Posenet ready!!');
}

//Get all the poses
function getPoses(results) {
    poses = results;
    console.log(results);
}

//draw nose on given pose nose x and y values
// function drawNose() {
//     if (poses.length > 0) {
//         for (i = 0; i < poses.length; i++) {
//             let poseNose = poses[i].pose.nose;
//             context.beginPath();
//             context.arc(poseNose.x, poseNose.y, 10, 0, 2 * Math.PI);
//             context.fillStyle = "blue";
//             context.fill();
//             // console.log("Nose was drawn")
//         }
//     }
// }


function addVirus() {
    if (poses.length > 0) {
        for (i = 0; i < poses.length; i++) {
            let poseNose = poses[i].pose.nose;
            context.drawImage(virus, poseNose.x + 110, 10, 40, 40);
            context.drawImage(virus, poseNose.x + 200, 40, 60, 60);
            context.drawImage(virus, poseNose.x - 200, 100, 30, 30);
            context.drawImage(virus, poseNose.x - 250, 200, 40, 40);
            context.drawImage(virus, poseNose.x + 300, 250, 60, 60);
            context.drawImage(virus, poseNose.x - 250, 400, 60, 60);

        }
    }
}

function drawMask() {
    if (poses.length > 0) {
        for (i = 0; i < poses.length; i++) {
            let poseNose = poses[i].pose.nose;
            let poseRightEar = poses[i].pose.rightEar;
            let poseLeftEar = poses[i].pose.leftEar;
            maskSize = (poseLeftEar.x - poseRightEar.x);
            context.drawImage(mask, poseRightEar.x - 15, poseNose.y - 35, maskSize * 1.2, maskSize);
        }
    }
}


function washYourHands() {
    if (poses.length > 0) {
        for (i = 0; i < poses.length; i++) {
            let poseLWrist = poses[i].pose.leftWrist;
            let poseRWrist = poses[i].pose.rightWrist;

            if ((poseLWrist.confidence > 0.02) && (poseLWrist.y > 250) && (poseLWrist.y <254)) {
                alert("Wash your hands!")

            }

        }

    }
}

    setup();