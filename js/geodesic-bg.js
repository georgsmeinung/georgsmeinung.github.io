// 3D Geodesic Background with Three.js (Single Dense Outer Mesh)
(function () {
  function initGeodesic() {
    if (typeof THREE === 'undefined') {
      setTimeout(initGeodesic, 50);
      return;
    }

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7.5;

    // WebGL Renderer with transparency
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Theme colors: balanced, visible yet elegant slate-gray tones
    const themeStyles = {
      dark: {
        lineColor: 0x64748b,   // slate-500: elegant visible steel slate on dark
        lineOpacity: 0.26,
        pointColor: 0x94a3b8,  // slate-400: delicate visible micro-nodes
        pointOpacity: 0.30,
        pointSize: 0.016
      },
      light: {
        lineColor: 0x94a3b8,   // slate-400: clear neutral slate on light background
        lineOpacity: 0.20,
        pointColor: 0x64748b,  // slate-500: delicate visible micro-nodes
        pointOpacity: 0.25,
        pointSize: 0.016
      }
    };

    function getCurrentTheme() {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    let currentTheme = getCurrentTheme();
    let colors = themeStyles[currentTheme];

    // Group container for combined rotations
    const geodesicGroup = new THREE.Group();
    scene.add(geodesicGroup);

    // High-Density Geodesic Sphere (Icosahedron detail 8 -> 1.3M micro-triangles)
    const radius = 2.45;
    const geom = new THREE.IcosahedronGeometry(radius, 8);
    const wireframe = new THREE.WireframeGeometry(geom);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: colors.lineColor,
      transparent: true,
      opacity: colors.lineOpacity,
      linewidth: 1
    });
    const mesh = new THREE.LineSegments(wireframe, lineMaterial);
    geodesicGroup.add(mesh);

    // Position group: original framing (offset to the right on desktop, centered on mobile)
    function updateGroupPosition() {
      const isMobile = window.innerWidth <= 860;
      geodesicGroup.position.x = isMobile ? 0 : 2.0;
      geodesicGroup.position.y = isMobile ? -0.3 : 0;
      camera.position.z = isMobile ? 8.0 : 7.0;
    }
    updateGroupPosition();

    // Vertex Micro-Nodes / Particles
    const pointGeom = new THREE.BufferGeometry();
    pointGeom.setAttribute('position', geom.getAttribute('position'));
    const pointMaterial = new THREE.PointsMaterial({
      color: colors.pointColor,
      size: colors.pointSize,
      transparent: true,
      opacity: colors.pointOpacity,
      blending: THREE.AdditiveBlending
    });
    const pointMesh = new THREE.Points(pointGeom, pointMaterial);
    geodesicGroup.add(pointMesh);

    // Apply theme color updates
    function applyTheme(theme) {
      const pal = themeStyles[theme];
      if (!pal) return;

      lineMaterial.color.setHex(pal.lineColor);
      lineMaterial.opacity = pal.lineOpacity;

      pointMaterial.color.setHex(pal.pointColor);
      pointMaterial.opacity = pal.pointOpacity;
      pointMaterial.size = pal.pointSize;
    }

    // Watch for theme attribute changes on <html>
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = getCurrentTheme();
          applyTheme(newTheme);
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Mouse Parallax tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    window.addEventListener('mousemove', (event) => {
      const normX = (event.clientX / window.innerWidth) * 2 - 1;
      const normY = -(event.clientY / window.innerHeight) * 2 + 1;

      targetRotationY = normX * 0.45;
      targetRotationX = -normY * 0.35;
    }, { passive: true });

    // Responsive resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      updateGroupPosition();
    });

    // Animation Loop with Visibility optimization
    let isRunning = true;
    let clock = new THREE.Clock();

    function animate() {
      if (!isRunning) return;
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Smooth elegant rotation
      mesh.rotation.y += delta * 0.07;
      mesh.rotation.x += delta * 0.035;
      pointMesh.rotation.y = mesh.rotation.y;
      pointMesh.rotation.x = mesh.rotation.x;

      // Subtle parallax damping
      geodesicGroup.rotation.y += (targetRotationY - geodesicGroup.rotation.y) * 0.05;
      geodesicGroup.rotation.x += (targetRotationX - geodesicGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    }

    // Page visibility API: pause rendering when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning = false;
      } else {
        isRunning = true;
        clock.getDelta();
        animate();
      }
    });

    // Start animation loop
    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGeodesic);
  } else {
    initGeodesic();
  }
})();
