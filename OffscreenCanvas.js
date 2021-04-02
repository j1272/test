var one = document.getElementById("load").getContext("bitmaprenderer");

var offscreen = new OffscreenCanvas(256, 256);
var gl = offscreen.getContext('webgl');

// ... some drawing for the first canvas using the gl context ...

// Commit rendering to the first canvas
var bitmapOne = offscreen.transferToImageBitmap();
one.transferFromImageBitmap(bitmapOne);

// ... some more drawing for the second canvas using the gl context ...

onmessage = function(evt) {
  const canvas = evt.data.canvas;
  const gl = canvas.getContext("webgl");

  function render(time) {
    // ... some drawing using the gl context ...
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
};