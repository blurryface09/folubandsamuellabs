"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/*
 * FOLUB hero: a modern villa that assembles itself on load, then settles into a
 * slow cinematic orbit with gold dust drifting through a navy dusk. Built with
 * plain three.js so it stays light and fully under our control. Honours
 * prefers-reduced-motion by rendering the finished house, still.
 */

const NAVY = 0x16283a;
const NAVY_SOFT = 0x243d57;
const WALL = 0xf1ece1;
const WALL_DARK = 0xcfc6b5;
const GOLD = 0xc6a24a;

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}

export function HouseScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(NAVY, 10, 26);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // fill the container: keep a high-res buffer but let CSS scale the element
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    // ---- lighting -------------------------------------------------------
    scene.add(new THREE.HemisphereLight(0x9fb3c8, NAVY, 0.55));

    const key = new THREE.DirectionalLight(0xffe9c2, 2.1);
    key.position.set(6, 9, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 40;
    key.shadow.camera.left = -10;
    key.shadow.camera.right = 10;
    key.shadow.camera.top = 10;
    key.shadow.camera.bottom = -10;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x6f8fb0, 0.8);
    rim.position.set(-7, 4, -6);
    scene.add(rim);

    const goldGlow = new THREE.PointLight(GOLD, 6, 14, 2);
    goldGlow.position.set(0, 2, 3);
    scene.add(goldGlow);

    // ---- house group ----------------------------------------------------
    const house = new THREE.Group();
    house.scale.setScalar(0.72);
    scene.add(house);

    type Piece = {
      mesh: THREE.Mesh;
      baseY: number;
      height: number;
      start: number; // seconds into the assemble timeline
      dur: number;
      mode: "rise" | "drop";
    };
    const pieces: Piece[] = [];

    const wallMat = new THREE.MeshStandardMaterial({ color: WALL, roughness: 0.85, metalness: 0.02 });
    const wallDarkMat = new THREE.MeshStandardMaterial({ color: WALL_DARK, roughness: 0.9 });
    const roofMat = new THREE.MeshStandardMaterial({ color: NAVY_SOFT, roughness: 0.6, metalness: 0.25 });
    const goldMat = new THREE.MeshStandardMaterial({
      color: GOLD,
      roughness: 0.35,
      metalness: 0.85,
      emissive: GOLD,
      emissiveIntensity: 0,
    });

    function addBox(
      w: number,
      h: number,
      d: number,
      x: number,
      baseY: number,
      z: number,
      mat: THREE.Material,
      start: number,
      dur: number,
      mode: Piece["mode"] = "rise",
    ) {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(x, baseY + h / 2, z);
      house.add(mesh);
      pieces.push({ mesh, baseY, height: h, start, dur, mode });

      // gold outline
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }),
      );
      mesh.add(edges);
      (mesh.userData.edge as THREE.LineBasicMaterial) = edges.material as THREE.LineBasicMaterial;
      return mesh;
    }

    // foundation, two tiered floors, a cantilever slab, and a flat roof
    addBox(5.2, 0.35, 4.0, 0, 0, 0, wallDarkMat, 0.0, 0.8);
    addBox(4.6, 1.5, 3.4, 0, 0.35, 0, wallMat, 0.5, 1.0);
    addBox(5.4, 0.16, 4.0, 0.1, 1.85, 0, roofMat, 1.4, 0.6); // cantilever
    addBox(3.6, 1.35, 2.8, -0.5, 2.01, 0.2, wallMat, 1.7, 1.0);
    addBox(4.0, 0.18, 3.1, -0.5, 3.36, 0.2, roofMat, 2.5, 0.7, "drop"); // roof

    // ---- windows (emissive gold) ---------------------------------------
    const windows: THREE.Mesh[] = [];
    function addWindow(w: number, h: number, x: number, y: number, z: number) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), goldMat);
      mesh.position.set(x, y, z);
      house.add(mesh);
      windows.push(mesh);
    }
    // ground floor: three tall panes on the front face (z = 1.7)
    addWindow(0.55, 1.0, -1.1, 1.1, 1.71);
    addWindow(0.55, 1.0, 0.0, 1.1, 1.71);
    addWindow(0.55, 1.0, 1.1, 1.1, 1.71);
    // upper floor: a long horizontal band (front face z = 1.6)
    addWindow(2.6, 0.55, -0.5, 2.7, 1.61);

    // ---- ground plot ----------------------------------------------------
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(16, 64),
      new THREE.MeshStandardMaterial({ color: NAVY, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(5.4, 5.5, 96),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.18, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // ---- gold dust ------------------------------------------------------
    const dustCount = 260;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustSpeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 20;
      dustPos[i * 3 + 1] = Math.random() * 10;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      dustSpeed[i] = Math.random() * 0.4 + 0.1;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: GOLD, size: 0.05, transparent: true, opacity: 0.6, depthWrite: false }),
    );
    scene.add(dust);

    // ---- resize ---------------------------------------------------------
    function resize() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ---- animation ------------------------------------------------------
    const clock = new THREE.Clock();
    const ASSEMBLE = 4.6;
    let raf = 0;

    function setPiece(p: Piece, prog: number) {
      const e = easeOutCubic(THREE.MathUtils.clamp(prog, 0, 1));
      if (p.mode === "rise") {
        p.mesh.scale.y = Math.max(e, 0.0001);
        p.mesh.position.y = p.baseY + (p.height / 2) * e;
      } else {
        p.mesh.scale.setScalar(1);
        p.mesh.position.y = p.baseY + p.height / 2 + (1 - e) * 3.5;
      }
      const edge = p.mesh.userData.edge as THREE.LineBasicMaterial | undefined;
      if (edge) edge.opacity = THREE.MathUtils.clamp((prog - 0.3) * 1.4, 0, 0.55);
    }

    function render() {
      const t = reduced ? 999 : clock.getElapsedTime();

      // assemble
      for (const p of pieces) setPiece(p, (t - p.start) / p.dur);

      // windows light up after the shell is up, then breathe gently
      const winBase = THREE.MathUtils.clamp((t - 3.2) / 1.3, 0, 1);
      const breathe = reduced ? 1 : 0.82 + Math.sin(t * 1.3) * 0.18;
      goldMat.emissiveIntensity = winBase * breathe * 0.85;
      goldGlow.intensity = 1.5 + winBase * breathe * 3;

      // gentle cinematic sway once assembled — the villa holds the right side
      const settle = THREE.MathUtils.clamp((t - ASSEMBLE) / 3.5, 0, 1);
      const angle = reduced ? -0.5 : -0.5 + Math.sin(t * 0.08) * 0.1;
      const radius = 15 - settle * 1.0;
      camera.position.set(
        Math.sin(angle) * radius,
        4.6 + (reduced ? 0 : Math.sin(t * 0.25) * 0.2),
        Math.cos(angle) * radius,
      );
      // aim just left of centre so the villa sits a touch right of the text
      camera.lookAt(-0.6, 1.2, 0);

      // dust drift
      if (!reduced) {
        const pos = dust.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < dustCount; i++) {
          let y = pos.getY(i) + dustSpeed[i] * 0.01;
          if (y > 10) y = 0;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;
        ring.rotation.z = t * 0.05;
      }

      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(render);
    }
    render();
    if (reduced) renderer.render(scene, camera);

    // ---- cleanup --------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
          obj.geometry?.dispose();
          const m = obj.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m?.dispose();
        }
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
