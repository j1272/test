import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.126.1/build/three.module.js";


      import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/loaders/GLTFLoader.js";
      import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/loaders/DRACOLoader.js";
      import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/loaders/RGBELoader.js";
      import { RoughnessMipmapper } from "https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/utils/RoughnessMipmapper.js";
    
// draco
      const draco = new DRACOLoader();
      draco.setDecoderPath(
        "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/"
      );
      draco.setDecoderConfig({ type: "js" });
      export const dracoLoader = draco;

      let camera, scene, renderer;

      let mouseX = 0,
        mouseY = 0;

      let windowHalfX = window.innerWidth / 2;
      let windowHalfY = window.innerHeight / 2;

      let mixer;

      const clock = new THREE.Clock();

      init();
      render();
      animate();

      function init() {
        const canvas = document.querySelector("#c");
        //canvas.width = innerWidth;
        //canvas.height = innerHeight;

        

        camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.01,
          1000
        );
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 80;

        scene = new THREE.Scene();
        


        new RGBELoader()
          .setDataType(THREE.UnsignedByteType)
          //.setPath("textures/")
          .load(
            "https://raw.githubusercontent.com/j1272/test/main/royal_esplanade_1k.hdr",
            function (texture) {
              const envMap = pmremGenerator.fromEquirectangular(texture).texture;

              //scene.background = envMap;
              scene.environment = envMap;

              texture.dispose();
              pmremGenerator.dispose();

              render();

              // model

              // use of RoughnessMipmapper is optional
              const roughnessMipmapper = new RoughnessMipmapper(renderer);

              const loader = new GLTFLoader();
              loader.setDRACOLoader(dracoLoader);

              loader.crossOrigin = true;
              loader.load(
                "https://raw.githubusercontent.com/j1272/test/main/draco/modelDraco9.gltf",
                function (gltf) {
                  gltf.scene.traverse(function (child) {
                    if (child.isMesh) {
                      // TOFIX RoughnessMipmapper seems to be broken with WebGL 2.0
                      // roughnessMipmapper.generateMipmaps( child.material );
                    }
                  });
                  const object = gltf.scene;
                  object.position.set(0, 0, 0);
                  object.scale.set(0.06, 0.06, 0.06);
                  object.rotation.set(-5.6, 5.9, 0.1);

                  scene.add(object);

                  roughnessMipmapper.dispose();

                  render();
                }
              );
            }
          );

        const onProgress = function (xhr) {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(Math.round(percentComplete, 2) + "% downloaded");
          }
        };

        const onError = function () {};

        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2;
        renderer.outputEncoding = THREE.sRGBEncoding;

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        document.addEventListener("mousemove", onDocumentMouseMove);

        window.addEventListener("resize", onWindowResize);
      }

      function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
      }

      //

      function animate() {
        requestAnimationFrame(animate);
        //const delta = clock.getDelta();

        //mixer.update(delta);

        render();
      }

      function render() {
        camera.position.x += (mouseX - camera.position.x) * 0.4;
        camera.position.y += (-mouseY - camera.position.y) * 0.4;

        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
