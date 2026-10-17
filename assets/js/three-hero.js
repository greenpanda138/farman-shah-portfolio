/* Farman Shah — interactive 3D hero scene (Three.js)
   Floating brand-colored geometry + particles with mouse parallax.
   Gracefully does nothing if WebGL/Three is unavailable, on mobile,
   or when the user prefers reduced motion. */
(function () {
  "use strict";

  var canvas = document.getElementById("hero3d");
  if (!canvas || typeof THREE === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.innerWidth < 640) return; /* keep phones light */

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0x8899bb, 0.75));
  var key = new THREE.DirectionalLight(0xf59e0b, 1.15);
  key.position.set(6, 8, 8);
  scene.add(key);
  var fill = new THREE.PointLight(0x3859c7, 1.5, 70);
  fill.position.set(-8, -4, 6);
  scene.add(fill);

  var AMBER = 0xf59e0b, AMBER_SOFT = 0xfbbf24, BLUE = 0x3859c7, SLATE = 0x94a3b8;

  function solid(color, opacity) {
    return new THREE.MeshStandardMaterial({
      color: color, roughness: 0.32, metalness: 0.6,
      transparent: opacity < 1, opacity: opacity
    });
  }
  function wire(color) {
    return new THREE.MeshBasicMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.38 });
  }

  var shapes = [];
  function add(geo, mat, x, y, z, s) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.scale.setScalar(s || 1);
    m.userData = {
      rx: (Math.random() - 0.5) * 0.007,
      ry: (Math.random() - 0.5) * 0.009,
      fy: Math.random() * Math.PI * 2,
      fs: 0.35 + Math.random() * 0.6,
      amp: 0.22 + Math.random() * 0.35,
      baseY: y
    };
    scene.add(m);
    shapes.push(m);
  }

  /* Right-side cluster (behind the avatar visual) + a few on the left */
  add(new THREE.IcosahedronGeometry(1.15, 0), solid(AMBER, 1), 5.4, 1.7, -2, 1);
  add(new THREE.TorusGeometry(0.95, 0.3, 16, 42), solid(BLUE, 0.92), 6.6, -1.5, -3.5, 1);
  add(new THREE.OctahedronGeometry(0.85, 0), wire(AMBER_SOFT), 4.3, -2.3, -1.5, 1);
  add(new THREE.TorusKnotGeometry(0.55, 0.18, 90, 12), solid(AMBER_SOFT, 0.95), 7.4, 2.3, -4, 1);
  add(new THREE.BoxGeometry(0.95, 0.95, 0.95), wire(SLATE), 3.5, 2.7, -3, 1);
  add(new THREE.IcosahedronGeometry(0.6, 1), solid(BLUE, 0.88), -5.8, 2.5, -3, 1);
  add(new THREE.TorusGeometry(0.52, 0.17, 12, 32), wire(AMBER), -6.6, -1.9, -2, 1);
  add(new THREE.OctahedronGeometry(0.5, 0), solid(AMBER, 0.9), -4.7, -2.7, -4, 1);
  add(new THREE.IcosahedronGeometry(0.42, 0), wire(SLATE), 0.6, 3.3, -5, 1);
  add(new THREE.BoxGeometry(0.62, 0.62, 0.62), solid(AMBER_SOFT, 0.88), -1.9, 3.1, -4, 1);

  /* ---------- drifting particles ---------- */
  var COUNT = 90;
  var pos = new Float32Array(COUNT * 3);
  for (var i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
    pos[i * 3 + 2] = -2 - Math.random() * 6;
  }
  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  var points = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: AMBER_SOFT, size: 0.07, transparent: true, opacity: 0.55
  }));
  scene.add(points);

  /* ---------- mouse parallax ---------- */
  var mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", function (e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* ---------- resize ---------- */
  function resize() {
    var w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---------- animate ---------- */
  var clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (document.hidden) return;
    var t = clock.getElapsedTime();

    mx += (tx - mx) * 0.045;
    my += (ty - my) * 0.045;
    camera.position.x = mx * 1.5;
    camera.position.y = -my * 1.0;
    camera.lookAt(0, 0, 0);

    for (var k = 0; k < shapes.length; k++) {
      var m = shapes[k], u = m.userData;
      m.rotation.x += u.rx;
      m.rotation.y += u.ry;
      m.position.y = u.baseY + Math.sin(t * u.fs + u.fy) * u.amp;
    }
    points.rotation.y = t * 0.02;

    renderer.render(scene, camera);
  })();
})();
