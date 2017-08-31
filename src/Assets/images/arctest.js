require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/views/3d/externalRenderers",
    "esri/geometry/SpatialReference",
    "esri/request",
    "dojo/domReady!"
  ],
  function (
    Map,
    SceneView,
    externalRenderers,
    SpatialReference,
    esriRequest
  ) {

    // Create a map
    //////////////////////////////////////////////////////////////////////////////////////
    var map = new Map({
      basemap: "satellite",
      ground: "world-elevation"
    });

    // Create a SceneView
    //////////////////////////////////////////////////////////////////////////////////////
    var view = new SceneView({
      container: "viewDiv",
      map: map,
      viewingMode: "global",
      center: [-158.056530, 21.616875],
      zoom: 15
    });

    // Disable lighting based on the current camera position.
    // We want to display the lighting according to the current time of day.
    view.environment.lighting.cameraTrackingEnabled = true;

    // Create our custom external renderer
    //////////////////////////////////////////////////////////////////////////////////////

    var windmillExternalRenderer = {
      renderer: null, // three.js renderer
      camera: null, // three.js camera
      scene: null, // three.js scene

      ambient: null, // three.js ambient light source

      windmills: [], // ISS model
      windScale: 1,

      windmillMaterial: new THREE.MeshLambertMaterial({
        color: 0xe03110
      }), // material for the ISS model

      cameraPositionInitialized: false, // we focus the view on the ISS once we receive our first data point

      /**
       * Setup function, called once by the ArcGIS JS API.
       */
      setup: function (context) {

        // initialize the three.js renderer
        //////////////////////////////////////////////////////////////////////////////////////
        this.renderer = new THREE.WebGLRenderer({
          context: context.gl,
          premultipliedAlpha: false
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setViewport(0, 0, view.width, view.height);

        // prevent three.js from clearing the buffers provided by the ArcGIS JS API.
        this.renderer.autoClearDepth = false;
        this.renderer.autoClearStencil = false;
        this.renderer.autoClearColor = false;

        // The ArcGIS JS API renders to custom offscreen buffers, and not to the default framebuffers.
        // We have to inject this bit of code into the three.js runtime in order for it to bind those
        // buffers instead of the default ones.
        var originalSetRenderTarget = this.renderer.setRenderTarget.bind(this.renderer);

        this.renderer.setRenderTarget = function (target) {
          originalSetRenderTarget(target);
          if (target == null) {
            context.bindRenderTarget();
          }
        }

        // setup the three.js scene
        ///////////////////////////////////////////////////////////////////////////////////////
        this.scene = new THREE.Scene();

        // setup the camera
        this.camera = new THREE.PerspectiveCamera();

        // setup scene lighting
        this.ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambient);

        // load WindMill mesh
        var windmillOBJ = "../../assets/data/windmill.obj";
        var loader = new THREE.OBJLoader(THREE.DefaultLoadingManager);
        var positions = [{
            lat: 21.607901,
            long: -158.0530193,
            elev: 197.4
          },
          {
            lat: 21.610067,
            long: -158.054915,
            elev: 176
          },
          {
            lat: 21.614507,
            long: -158.055275,
            elev: 176
          },
          {
            lat: 21.615969,
            long: -158.056275,
            elev: 171.7
          },
          {
            lat: 21.617545,
            long: -158.057258,
            elev: 161.4
          },
          {
            lat: 21.619487,
            long: -158.058486,
            elev: 145.9
          },
        ];
        for (let i = 0; i < positions.length; i++) {
          loader.load(windmillOBJ, function (object3d) {

            let windmill = object3d;
            windmill.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                child.material = this.windmillMaterial;
              }
            }.bind(this));

            var renderPos = [0, 0, 0];
            externalRenderers.toRenderCoordinates(view, [positions[i].long, positions[i].lat, positions[i].elev], 0, SpatialReference.WGS84, renderPos, 0, 1);

            windmill.position.set(renderPos[0], renderPos[1], renderPos[2]);
            windmill.scale.set(this.windScale, this.windScale, this.windScale);
            windmill.rotation.z += Math.PI/2;

            // add the model
            this.scene.add(windmill);
            this.windmills.push(windmill);

          }.bind(this), undefined, function (error) {
            console.error("Error loading WindMill mesh. ", error);
          });
        }

        // cleanup after ourselfs
        context.resetWebGLState();
      },

      render: function (context) {

        var cam = context.camera;

        this.camera.position.set(cam.eye[0], cam.eye[1], cam.eye[2]);
        this.camera.up.set(cam.up[0], cam.up[1], cam.up[2]);
        this.camera.lookAt(new THREE.Vector3(cam.center[0], cam.center[1], cam.center[2]));

        // Projection matrix can be copied directly
        this.camera.projectionMatrix.fromArray(cam.projectionMatrix);
        this.renderer.resetGLState();
        this.renderer.render(this.scene, this.camera);
        externalRenderers.requestRender(view);

        

        // cleanup
        context.resetWebGLState();
      }

    }


    // register the external renderer
    externalRenderers.add(view, windmillExternalRenderer);
  });
