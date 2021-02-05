window.onload = function() {

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 65, window.innerWidth/window.innerHeight, 0.1, 10000 );

  var renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0xFFFFFF );
  document.body.appendChild( renderer.domElement );

  camera.position.z = 190;

  var light = new THREE.DirectionalLight( 0xfcf9e8, 1 );
  scene.add(light);

  var ambiColor = "#cbc9bb";
  var ambientLight = new THREE.AmbientLight(ambiColor);
  scene.add(ambientLight);

  var manager = new THREE.LoadingManager();
  var loader  = new THREE.ImageLoader( manager );

  manager.onProgress = function ( item, loaded, total ) {

	};

  var textureBody = new THREE.Texture();
  var textureHead = new THREE.Texture();

  var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
  };

  var onError = function ( xhr ) { };

  loader.load( 'model/Body diff MAP.jpg', function ( image ) {
    textureBody.image = image;
    textureBody.needsUpdate = true;
  });

  loader.load( 'model/HEAD diff MAP.jpg', function ( image ) {
    textureHead.image = image;
    textureHead.needsUpdate = true;
  });

  var meshes = [];

  var objLoader = new THREE.OBJLoader();

  loader.load( "bb8.obj", function ( object ) {

    console.log(object);

    object.traverse( function ( child )
    {
      if ( child instanceof THREE.Mesh )
      {
        meshes.push(child);
      }
    });

    var head = meshes[0];
    var body = meshes[1];

    head.position.y = -80;
    body.position.y = -80;

    head.rotation.y = Math.PI/3;
    body.rotation.y = Math.PI/3;

    var mapHeightBody = new THREE.TextureLoader().load( "model/BODY bump MAP.jpg" );
    var mapHeightHead = new THREE.TextureLoader().load( "model/HEAD bump MAP.jpg" );

    head.material = new THREE.MeshPhongMaterial({map: textureHead, specular: 0xfceed2, bumpMap: mapHeightHead, bumpScale: 0.4, shininess: 25});
    body.material = new THREE.MeshPhongMaterial({map: textureBody, specular: 0xfceed2, bumpMap: mapHeightBody, bumpScale: 0.4, shininess: 25});

    console.log('head', head);

    scene.add(head);
    scene.add(body);

  }, onProgress, onError );

  controls = new THREE.TrackballControls( camera );

	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

  var render = function () {
    requestAnimationFrame( render );
    controls.update();
  	renderer.render(scene, camera);
  };

  render();

};
