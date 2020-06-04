(function () {
  let gallery = 'ar';
  var gallerySelector = document.querySelector('.gallery-types');
  function switchGallery() {
    var selected = document.querySelector('input[name="type"]:checked');
    if(selected.value === 'ar') {
      gallery = 'ar';
      document.body.classList.add('ar');
      document.body.classList.remove('photos');
      flkty.select( 0, true, true );
      updateTexture(0);
      renderPredictions();
    } else {
      gallery = 'photos';
      document.body.classList.add('photos');
      document.body.classList.remove('ar');
      photoFlkty.select( 0, true, true );
      updateArtist(0);
    }
  }
  gallerySelector.addEventListener('change', switchGallery);
  
  var carousel = document.querySelector('.carousel');
	var entries = [{
		handle: 'ankitmehrasb',
		url: 'https://www.instagram.com/ankitmehrasb',
		entry: './assets/entries/digital/ankit.png'
	}, {
		handle: 'tanishijain_art',
		url: 'https://www.instagram.com/tanishijain_art',
		entry: './assets/entries/digital/tanishi.png'
	}, {
		handle: 'anishathampy',
		url: 'https://www.instagram.com/anishathampy',
		entry: './assets/entries/digital/anisha.mp4'
	}, {
		handle: 'anishathampy',
		url: 'https://www.instagram.com/anishathampy',
		entry: './assets/entries/digital/anisha.jpg'
	}, {
		handle: 'enchaussettes',
		url: 'https://www.instagram.com/enchaussettes',
		entry: './assets/entries/digital/enchaussettes.png'
	}, {
		handle: 'abhinanda_lahiri',
		entry: './assets/entries/digital/avhinanda1.png'
	}, {
		handle: 'abhinanda_lahiri',
		entry: './assets/entries/digital/avhinanda2.png'
	}, {
		handle: 'samarthishere',
		url: 'https://www.instagram.com/samarthishere',
		entry: './assets/entries/digital/giraffe.jpg'
	}, {
		handle: 'samarthishere',
		url: 'https://www.instagram.com/samarthishere',
		entry: './assets/entries/digital/pangolin.png'
	}];

	var videoFormats = ['mov', 'm4v', 'mp4'];
	// var imageFormats = ['png', 'jpg'];
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
		el.classList.add('texture');
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
		if ('url' in entries[index]) {
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
    if(gallery === 'ar') requestAnimationFrame(renderPredictions);
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

  var photoCarousel = document.querySelector('.photo-carousel');
	var photoEntries = [{
			entry: './assets/entries/photos/aayushi_choksi.jpg',
			handle: 'aayushi choksi'
		},
		{
			entry: './assets/entries/photos/anmol_sony_.jpeg',
			url: 'https://instagram.com/anmol_sony_',
			handle: 'anmol_sony_'
		},
		{
			entry: './assets/entries/photos/anmol_sony_1.jpeg',
			url: 'https://instagram.com/anmol_sony_',
			handle: 'anmol_sony_'
		},
		{
			entry: './assets/entries/photos/pallvi_chandel.JPG',
			handle: 'pallvi chandel'
		},
		{
			entry: './assets/entries/photos/tilottmaa9.jpg',
			url: 'https://instagram.com/tilottmaa9',
			handle: 'tilottmaa9'
		}
  ];
  
  for (var i = 0; i < photoEntries.length; i++) {
		var obj = photoEntries[i];
		var el = document.createElement('img');
		el.src = obj.entry;
		el.classList.add('photo', 'carousel-cell');
		// el.setAttribute('id', obj.handle)
		photoCarousel.appendChild(el);
	}

	var photoFlkty = new Flickity(photoCarousel, {
		dragThreshold: 1,
		selectedAttraction: 0.2,
		friction: 0.8,
		wrapAround: true
  });
  function updateArtist(index) {
		if ('url' in photoEntries[index]) {
			artist.style.pointerEvents = 'all';
			artist.href = photoEntries[index].url;
		} else {
			artist.style.pointerEvents = 'none';
			artist.href = '#';
		}
		artistLabel.textContent = photoEntries[index].handle;
	}
	photoFlkty.on('change', updateArtist);
})();
