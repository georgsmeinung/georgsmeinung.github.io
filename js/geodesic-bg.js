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

    // Theme colors: balanced, visible yet elegant slate-gray tones.
    // Each stroke is shaded per vertex: "lit" is the color of a front-facing,
    // fully illuminated stroke; "shadow" is what back-facing / unlit strokes
    // fade towards (close to the page background so they recede).
    const themeStyles = {
      dark: {
        lineLit: 0x94a3b8,     // slate-400
        lineShadow: 0x475569,  // slate-600: dim but still readable on dark
        lineOpacity: 0.20,
        pointLit: 0xcbd5e1,    // slate-300
        pointShadow: 0x475569, // slate-600
        pointOpacity: 0.22,
        pointSize: 0.016
      },
      light: {
        lineLit: 0x64748b,     // slate-500
        lineShadow: 0x94a3b8,  // slate-400: dim but still readable on light
        lineOpacity: 0.15,
        pointLit: 0x475569,    // slate-600
        pointShadow: 0x94a3b8, // slate-400
        pointOpacity: 0.16,
        pointSize: 0.016
      }
    };

    // Shading parameters (shared by lines and points)
    // - facing: dot(normal, viewDir). On a sphere centered at the origin the
    //   normal is simply normalize(position), so front (+1) / back (-1) is exact.
    // - light: wrapped Lambert from a key light in view space (upper-left-front),
    //   giving a soft illuminated gradient across the visible hemisphere.
    const shadeChunk = `
      uniform vec3 uLightDir;
      varying float vShade;
      varying float vFade;
      void computeShade(vec3 objPos, vec4 mvPos) {
        vec3 n = normalize(normalMatrix * normalize(objPos));
        vec3 viewDir = normalize(-mvPos.xyz);
        float facing = dot(n, viewDir);
        // 0 on the far hemisphere, 1 on the near one, smooth across the limb
        vFade = smoothstep(-0.55, 0.45, facing);
        float lambert = (dot(n, uLightDir) + 0.35) / 1.35; // wrap lighting
        lambert = clamp(lambert, 0.0, 1.0);
        // back strokes keep a floor of light so they stay visible, just dimmer
        vShade = mix(0.15, 1.0, vFade) * mix(0.45, 1.0, lambert);
      }
    `;

    const shadeFrag = `
      uniform vec3 uLit;
      uniform vec3 uShadow;
      uniform float uOpacity;
      varying float vShade;
      varying float vFade;
    `;

    const lightDir = new THREE.Vector3(-0.45, 0.55, 0.7).normalize();

    function makeLineMaterial(pal) {
      return new THREE.ShaderMaterial({
        uniforms: {
          uLightDir: { value: lightDir },
          uLit: { value: new THREE.Color(pal.lineLit) },
          uShadow: { value: new THREE.Color(pal.lineShadow) },
          uOpacity: { value: pal.lineOpacity }
        },
        vertexShader: shadeChunk + `
          void main() {
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            computeShade(position, mvPos);
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: shadeFrag + `
          void main() {
            vec3 col = mix(uShadow, uLit, vShade);
            float a = uOpacity * mix(0.5, 1.0, vFade) * mix(0.7, 1.0, vShade);
            gl_FragColor = vec4(col, a);
          }
        `,
        transparent: true,
        depthWrite: false
      });
    }

    function makePointMaterial(pal) {
      return new THREE.ShaderMaterial({
        uniforms: {
          uLightDir: { value: lightDir },
          uLit: { value: new THREE.Color(pal.pointLit) },
          uShadow: { value: new THREE.Color(pal.pointShadow) },
          uOpacity: { value: pal.pointOpacity },
          uSize: { value: pal.pointSize },
          uScale: { value: renderer.getDrawingBufferSize(new THREE.Vector2()).y / 2 }
        },
        vertexShader: shadeChunk + `
          uniform float uSize;
          uniform float uScale;
          void main() {
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            computeShade(position, mvPos);
            gl_PointSize = uSize * (uScale / -mvPos.z); // same attenuation as PointsMaterial
            gl_Position = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: shadeFrag + `
          void main() {
            vec3 col = mix(uShadow, uLit, vShade);
            float a = uOpacity * mix(0.35, 1.0, vFade) * mix(0.6, 1.0, vShade);
            gl_FragColor = vec4(col, a);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
    }

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
    const lineMaterial = makeLineMaterial(colors);
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
    const pointMaterial = makePointMaterial(colors);
    const pointMesh = new THREE.Points(pointGeom, pointMaterial);
    geodesicGroup.add(pointMesh);

    // Apply theme color updates
    function applyTheme(theme) {
      const pal = themeStyles[theme];
      if (!pal) return;

      lineMaterial.uniforms.uLit.value.setHex(pal.lineLit);
      lineMaterial.uniforms.uShadow.value.setHex(pal.lineShadow);
      lineMaterial.uniforms.uOpacity.value = pal.lineOpacity;

      pointMaterial.uniforms.uLit.value.setHex(pal.pointLit);
      pointMaterial.uniforms.uShadow.value.setHex(pal.pointShadow);
      pointMaterial.uniforms.uOpacity.value = pal.pointOpacity;
      pointMaterial.uniforms.uSize.value = pal.pointSize;
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
      pointMaterial.uniforms.uScale.value = renderer.getDrawingBufferSize(new THREE.Vector2()).y / 2;
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
