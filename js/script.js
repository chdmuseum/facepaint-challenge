// https://www.pexels.com/video/scenic-view-of-landscape-2360941/
// https://www.pexels.com/video/a-hill-of-waste-materials-3186590/

// https://www.pexels.com/video/a-diver-diving-under-the-sea-water-3993112/

// https://www.pexels.com/video/clown-fish-hiding-on-sea-anemone-4029955/
// https://www.pexels.com/video/baby-elephants-playing-in-the-mud-3196505/
// https://mixkit.co/free-stock-video/elephant-drinking-water-with-its-trunk-3659/
// https://www.pexels.com/video/heavy-equipment-in-a-junk-yard-2430838/
// (function() {
var carousel = document.querySelector('.carousel');
var entries = [{
	artist: 'https://www.instagram.com/ankitmehrasb',
	entry: 'assets/entries/ankit.png'
}, {
	artist: 'https://www.instagram.com/tanishijain_art',
	entry: 'assets/entries/tanishi.png'
}, {
	artist: 'https://www.instagram.com/anishathampy',
	entry: 'assets/entries/anisha.mov'
},{
	artist: 'https://www.instagram.com/anishathampy',
	entry: 'assets/entries/anisha.m4v'
}, {
	artist: 'https://www.instagram.com/enchaussettes',
	entry: 'assets/entries/enchaussettes.png'
}, {
	artist: 'Abhinanda Lahiri',
	entry: 'assets/entries/avhinanda1.png'
},{
	artist: 'Abhinanda Lahiri',
	entry: 'assets/entries/avhinanda2.png'
},{
	artist: 'https://www.instagram.com/samarthishere',
	entry: 'assets/entries/giraffe.jpg'
},{
	artist: 'https://www.instagram.com/samarthishere',
	entry: 'assets/entries/pangolin.png'
}];

var videoFormats = ['mov', 'm4v', 'mp4'];
var imageFormats = ['png', 'jpg'];
var assets = [];

for (var i = 0; i < entries.length; i++) {
	var obj = entries[i];
	var el;
	if (videoFormats.indexOf(obj.entry.split('.')[1]) > -1) {
    el = document.createElement('video');
    el.setAttribute('playsinline', true);
    el.setAttribute('loop', true);
    el.setAttribute('muted', true);
    el.setAttribute('autoplay', true);
    el.setAttribute('preload', 'auto');
    assets.push(new Promise(res => {
      el.onloadeddata = res;
    }));
	} else {
    el = document.createElement('img');
    assets.push(new Promise(res => {
      el.onload = res;
    }));
	}
	el.src = obj.entry;
	el.classList.add('media');
  el.dataset.artist = obj.artist;
  
	carousel.appendChild(el);
}

var flkty = new Flickity(carousel, {
  hash: true,
  dragThreshold: 1,
  selectedAttraction: 0.2,
  friction: 0.8,
	wrapAround: true
});
flkty.on('change', function (index) {
  var url = entries[index].entry;
  var isVideo = videoFormats.indexOf(url.split('.')[1]) > -1;
  faceCanvas.updateTexture(url, isVideo);
  if(entries[index].artist.startsWith('http')) {
    artist.style.pointerEvents = 'all';
    artist.href = entries[index].artist;
    artistLabel.textContent = entries[index].artist.split('.com/')[1];
  } else {
    artist.style.pointerEvents = 'none';
    artistLabel.textContent = entries[index].artist;
  }
});

const toggleBtn = document.querySelector('#visibilityToggle');
const toggleBtnLabel = document.querySelector('#visibilityToggle > span');

function toggleWebcamVisibility(e) {
	toggleBtn.classList.toggle('on');
	webcam.classList.toggle('visible');
	if (toggleBtn.classList.contains('on')) {
		toggleBtnLabel.textContent = 'Webcam visible';
	} else {
		toggleBtnLabel.textContent = 'Webcam hidden';
	}
}
toggleBtn.addEventListener('click', toggleWebcamVisibility);
const webcam = document.querySelector('#webcam');
let model, faceCanvas, w, h;
const loaderMsg = document.querySelector('#loaderMsg');

var artist = document.querySelector('#artist');
var artistLabel = document.querySelector('#artist > span');

async function renderPredictions(t) {
	requestAnimationFrame(renderPredictions);
	loaderMsg.textContent = 'Search face';
	const predictions = await model.estimateFaces(webcam);

	if (predictions.length > 0) {
		// var positionBufferData = TRIANGULATION.reduce((acc, val) => acc.concat(predictions[0].scaledMesh[val]), []);
		const positionBufferData = predictions[0].scaledMesh.reduce((acc, pos) => acc.concat(pos), []);
		if (!faceCanvas) {
			const props = {
				id: 'faceCanvas',
				// https://www.freepik.com/free-vector/colorful-background-holi-festival_1051050.htm
				textureFilePath: entries[0].entry,
				w,
				h
			}
			faceCanvas = new FacePaint(props);
			document.querySelector('#loader').style.display = 'none';
			return;
		}
		faceCanvas.render(positionBufferData);
	}
}
async function main() {
	try {
		loaderMsg.textContent = 'Load webcam';
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false
		});
		webcam.srcObject = stream;
		await new Promise(function (res) {
			webcam.onloadedmetadata = function () {
				w = webcam.videoWidth;
				h = webcam.videoHeight;
				res();
			}
		});

		webcam.height = h;
		webcam.width = w;
		webcam.setAttribute('autoplay', true);
		webcam.setAttribute('muted', true);
		webcam.setAttribute('playsinline', true);
		webcam.play();
		loaderMsg.textContent = 'Load model';
		// Load the MediaPipe facemesh model.
		model = await facemesh.load({
			maxContinuousChecks: 5,
			detectionConfidence: 0.9,
			maxFaces: 1,
			iouThreshold: 0.3,
			scoreThreshold: 0.75
    });
    loaderMsg.textContent = 'Load media';
    await Promise.all(assets);
		renderPredictions();
	} catch (e) {
		alert(e);
		console.error(e);
	}
}
main();
// })();
