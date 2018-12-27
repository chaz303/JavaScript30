const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.err(`oh my`, err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  console.log(width, height);

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
//    pixels = greenScreen(pixels);
//    pixels = inversion(pixels);
  //      pixels = threeWaySplit(pixels);
    pixels = twoWaySplit(pixels);
//    pixels = solarization(pixels);
//    pixels = solarmod(pixels);
//    pixels = redShift(pixels);
//    pixels = glitch(pixels);
//    pixels = colorShake(pixels);
//    pixels = shakeEffect(pixels);
    //    ctx.globalAlpha = 0.8;
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome')
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`
  strip.insertBefore(link, strip.firstChild);
}

// EFFECTS

function shakeEffect(pixels) {
  const horshiftPixels = 6;
  const vershiftPixels = 4;
  const horshift = 4 * Math.ceil(Math.random() * horshiftPixels);
  const vershift = 4 * video.videoWidth * Math.ceil(Math.random() * vershiftPixels);
  const shift = horshift + vershift;
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = Math.round((pixels.data[i + 0] + (pixels.data[i + shift]/2)) / 1.5);
    pixels.data[i + 1] = Math.round((pixels.data[i + 1] + (pixels.data[i + 1 + shift]/2)) / 1.5);
    pixels.data[i + 2] = Math.round((pixels.data[i + 2] + (pixels.data[i + 2 + shift]/2)) / 1.5);
  }
  return pixels;
}

function threeWaySplit(pixels) {
  const vertOffset = Math.ceil(Math.random() * 5) * 4;
  console.log(vertOffset);
  const horOffset = Math.round(Math.random() * 4);
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + Math.floor(video.videoWidth * 4 * 0.333)]; // RED
    pixels.data[i + 1] = pixels.data[i + 1 + Math.floor(video.videoWidth * 4 * 0.666)]; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

function twoWaySplit(pixels) {
  const vertOffset = Math.ceil(Math.random() * 5) * 4;
  console.log(vertOffset);
  const horOffset = Math.round(Math.random() * 4);
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + Math.floor(video.videoWidth * 4 * 0.5)];
    pixels.data[i + 1] = (pixels.data[i + 1 + Math.floor(video.videoWidth * 4 * 0.5)] + pixels.data[i + 1]) / 1.5;
    pixels.data[i + 2] = pixels.data[i + 2]; // BLUE
  }
  return pixels;
}

function redShift(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = (pixels.data[i + 0]);
    pixels.data[i + 1] = (pixels.data[i + 1]);
    pixels.data[i + 2] = (pixels.data[i + 2]);
  }
  return pixels;
}

function inversion(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = (pixels.data[i + 0] * -1) + 255;
    pixels.data[i + 1] = (pixels.data[i + 1] * -1) + 255;
    pixels.data[i + 2] = (pixels.data[i + 2] * -1) + 255;
  }
  return pixels;
}

function solarization(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0];
    pixels.data[i + 1] = pixels.data[i + 1];
    pixels.data[i + 2] = pixels.data[i + 2];
  }
  for (let j = 0; j < pixels.data.length; j++) {
    if ((j + 1) % 4 != 0 && pixels.data[j] < 128){
      pixels.data[j] = (pixels.data[j] * -1) + 255;
    }
  }
  return pixels;
}

function solarmod(pixels) {
  let mod = Math.ceil(Math.random() * 512);
     
  for (let j = 0; j < pixels.data.length; j++) {
    if ((j + 1) % 4 != 0 && j % mod && pixels.data[j] < 128){
      pixels.data[j] = (pixels.data[j] * -1) + 255;
    }
  }
  return pixels;
}

function glitch(pixels) {
  const mod = Math.ceil(Math.random() * 512);
  const divisor = 1.2;
  
  for (let j = 0; j < pixels.data.length; j++) {
    if ((j + 1) % 4 != 0 && j % mod == 0){
      pixels.data[j] = 245; //(pixels.data[j] * -1) + 255;
    }
  }
  return pixels;
}

function colorShake(pixels) {
  const vertOffset = Math.ceil(Math.random() * 6) * 4;
  for(let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + (vertOffset * video.videoWidth + vertOffset)]; // RED
    pixels.data[i + 1] = pixels.data[i + 1]; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2 + (vertOffset * video.videoWidth - vertOffset)]; // BLUE
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
