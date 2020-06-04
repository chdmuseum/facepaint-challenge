(function() {
var carousel = document.querySelector('.carousel');
var entries = [{
  handle: 'ankitmehrasb',
	url: 'https://www.instagram.com/ankitmehrasb',
	entry: './assets/entries/ankit.png'
}, {
  handle: 'tanishijain_art',
	url: 'https://www.instagram.com/tanishijain_art',
	entry: './assets/entries/tanishi.png'
}, {
  handle: 'anishathampy',
	url: 'https://www.instagram.com/anishathampy',
	entry: './assets/entries/anisha.mov'
},{
  handle: 'anishathampy',
	url: 'https://www.instagram.com/anishathampy',
	entry: './assets/entries/anisha.m4v'
}, {
  handle: 'enchaussettes',
	url: 'https://www.instagram.com/enchaussettes',
	entry: './assets/entries/enchaussettes.png'
}, {
	handle: 'abhinanda_lahiri',
	entry: './assets/entries/avhinanda1.png'
},{
	handle: 'abhinanda_lahiri',
	entry: './assets/entries/avhinanda2.png'
},{
  handle: 'samarthishere',
	url: 'https://www.instagram.com/samarthishere',
	entry: './assets/entries/giraffe.jpg'
},{
  handle: 'samarthishere',
	url: 'https://www.instagram.com/samarthishere',
	entry: './assets/entries/pangolin.png'
}];

var videoFormats = ['mov', 'm4v', 'mp4'];
var imageFormats = ['png', 'jpg'];
var assets = [];

for (var i = 0; i < entries.length; i++) {
	var obj = entries[i];
	var el;
	if (videoFormats.indexOf(obj.entry.split('.')[2]) > -1) {
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
  el.setAttribute('id', obj.handle)
	carousel.appendChild(el);
}

var flkty = new Flickity(carousel, {
  hash: true,
  dragThreshold: 1,
  selectedAttraction: 0.2,
  friction: 0.8,
	wrapAround: true
});
function updateTexture(index) {
  var url = entries[index].entry;
  var isVideo = videoFormats.indexOf(url.split('.')[2]) > -1;
  faceCanvas.updateTexture(url, isVideo);
  if('url' in entries[index]) {
    artist.style.pointerEvents = 'all';
    artist.href = entries[index].url;
  } else {
    artist.style.pointerEvents = 'none';
    artist.href = '#';
  }
  artistLabel.textContent = entries[index].handle;
}
flkty.on('change', updateTexture);
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
		const positionBufferData = predictions[0].scaledMesh.reduce((acc, pos) => acc.concat(pos), []);
		if (!faceCanvas) {
			const props = {
				id: 'faceCanvas',
				textureFilePath: entries[0].entry,
				w,
				h
      }
      faceCanvas = new FacePaint(props);
      updateTexture(flkty.selectedIndex);
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
})();
