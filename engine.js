/**
 * BATTLEGROUNDS PRO 3D ENGINE — DEVELOPED BY @qs_66
 * Includes:
 * 1. 30 Weapons Database + Multi-Layer Realistic Gunshot WebAudio Synthesizer
 * 2. Articulated Non-Boxy Humanoid Models (Capsules, Joints, Outfits, Limb Animation)
 * 3. Classic Grassland Map (Instanced 3D Grass) & Symmetrical TDM Warehouse Map
 * 4. P2P Online Multiplayer by Unique ID (PeerJS) + Local Network BroadcastChannel
 * 5. Full HUD Button Drag/Scale/Opacity Customizer with LocalStorage Persistence
 */

(() => {
  'use strict';

  // ==================== 1. 30 WEAPONS DATABASE ====================
  const WEAPONS_DB = [
    // ASSAULT RIFLES (10)
    { id: 'M416', name: 'M416', cat: 'AR', dmg: 41, rate: 0.086, mag: 30, reserve: 180, reload: 2.1, recoil: 0.014, fov: 45, pitch: 1.0, len: 0.85 },
    { id: 'AKM', name: 'AKM', cat: 'AR', dmg: 48, rate: 0.100, mag: 30, reserve: 180, reload: 2.4, recoil: 0.022, fov: 48, pitch: 0.78, len: 0.88 },
    { id: 'SCAR-L', name: 'SCAR-L', cat: 'AR', dmg: 41, rate: 0.096, mag: 30, reserve: 180, reload: 2.2, recoil: 0.013, fov: 45, pitch: 0.95, len: 0.84 },
    { id: 'M762', name: 'Beryl M762', cat: 'AR', dmg: 46, rate: 0.086, mag: 30, reserve: 180, reload: 2.3, recoil: 0.024, fov: 46, pitch: 0.82, len: 0.86 },
    { id: 'GROZA', name: 'Groza', cat: 'AR', dmg: 47, rate: 0.080, mag: 30, reserve: 180, reload: 2.6, recoil: 0.020, fov: 46, pitch: 0.85, len: 0.72 },
    { id: 'AUG', name: 'AUG A3', cat: 'AR', dmg: 41, rate: 0.085, mag: 30, reserve: 180, reload: 2.3, recoil: 0.012, fov: 44, pitch: 1.04, len: 0.75 },
    { id: 'QBZ', name: 'QBZ95', cat: 'AR', dmg: 41, rate: 0.092, mag: 30, reserve: 180, reload: 2.4, recoil: 0.013, fov: 45, pitch: 0.98, len: 0.76 },
    { id: 'G36C', name: 'G36C', cat: 'AR', dmg: 41, rate: 0.086, mag: 30, reserve: 180, reload: 2.2, recoil: 0.013, fov: 45, pitch: 1.02, len: 0.80 },
    { id: 'FAMAS', name: 'FAMAS', cat: 'AR', dmg: 39, rate: 0.067, mag: 25, reserve: 150, reload: 2.5, recoil: 0.018, fov: 45, pitch: 1.12, len: 0.74 },
    { id: 'HONEY', name: 'Honey Badger', cat: 'AR', dmg: 43, rate: 0.082, mag: 30, reserve: 180, reload: 2.0, recoil: 0.016, fov: 48, pitch: 0.90, len: 0.68 },

    // SUBMACHINE GUNS (7)
    { id: 'UMP45', name: 'UMP45', cat: 'SMG', dmg: 40, rate: 0.092, mag: 25, reserve: 175, reload: 1.9, recoil: 0.010, fov: 52, pitch: 1.15, len: 0.64 },
    { id: 'VECTOR', name: 'Kriss Vector', cat: 'SMG', dmg: 31, rate: 0.055, mag: 19, reserve: 190, reload: 1.7, recoil: 0.009, fov: 52, pitch: 1.35, len: 0.58 },
    { id: 'UZI', name: 'Micro UZI', cat: 'SMG', dmg: 26, rate: 0.048, mag: 25, reserve: 200, reload: 1.6, recoil: 0.011, fov: 55, pitch: 1.45, len: 0.48 },
    { id: 'TOMMY', name: 'Thompson SMG', cat: 'SMG', dmg: 40, rate: 0.080, mag: 50, reserve: 200, reload: 2.4, recoil: 0.015, fov: 52, pitch: 1.08, len: 0.70 },
    { id: 'BIZON', name: 'PP-19 Bizon', cat: 'SMG', dmg: 36, rate: 0.088, mag: 53, reserve: 160, reload: 2.3, recoil: 0.010, fov: 52, pitch: 1.18, len: 0.66 },
    { id: 'MP5K', name: 'MP5K', cat: 'SMG', dmg: 33, rate: 0.066, mag: 30, reserve: 180, reload: 2.1, recoil: 0.010, fov: 52, pitch: 1.25, len: 0.56 },
    { id: 'P90', name: 'FN P90', cat: 'SMG', dmg: 35, rate: 0.060, mag: 50, reserve: 200, reload: 2.5, recoil: 0.009, fov: 50, pitch: 1.30, len: 0.60 },

    // SNIPERS & DMRs (8)
    { id: 'KAR98K', name: 'Kar98k', cat: 'SR', dmg: 108, rate: 1.15, mag: 5, reserve: 45, reload: 3.0, recoil: 0.065, fov: 20, pitch: 0.55, len: 1.10 },
    { id: 'AWM', name: 'AWM Magnum', cat: 'SR', dmg: 145, rate: 1.35, mag: 5, reserve: 35, reload: 3.4, recoil: 0.080, fov: 16, pitch: 0.45, len: 1.18 },
    { id: 'M24', name: 'M24 Sniper', cat: 'SR', dmg: 112, rate: 1.10, mag: 5, reserve: 45, reload: 2.9, recoil: 0.062, fov: 18, pitch: 0.52, len: 1.12 },
    { id: 'MINI14', name: 'Mini14 DMR', cat: 'SR', dmg: 48, rate: 0.130, mag: 20, reserve: 140, reload: 2.3, recoil: 0.018, fov: 28, pitch: 0.92, len: 0.94 },
    { id: 'SLR', name: 'SLR DMR', cat: 'SR', dmg: 58, rate: 0.150, mag: 10, reserve: 100, reload: 2.6, recoil: 0.032, fov: 26, pitch: 0.70, len: 0.98 },
    { id: 'SKS', name: 'SKS DMR', cat: 'SR', dmg: 53, rate: 0.135, mag: 10, reserve: 100, reload: 2.4, recoil: 0.026, fov: 28, pitch: 0.76, len: 0.96 },
    { id: 'MK14', name: 'Mk14 EBR', cat: 'SR', dmg: 61, rate: 0.095, mag: 10, reserve: 100, reload: 2.7, recoil: 0.035, fov: 26, pitch: 0.68, len: 0.95 },
    { id: 'WIN94', name: 'Win94 Lever', cat: 'SR', dmg: 92, rate: 0.85, mag: 8, reserve: 64, reload: 2.8, recoil: 0.045, fov: 30, pitch: 0.64, len: 1.02 },

    // LMG, SHOTGUNS & PISTOLS (5)
    { id: 'M249', name: 'M249 SAW', cat: 'HVY', dmg: 44, rate: 0.075, mag: 100, reserve: 200, reload: 4.2, recoil: 0.022, fov: 46, pitch: 0.80, len: 0.95 },
    { id: 'DP28', name: 'DP-28 LMG', cat: 'HVY', dmg: 51, rate: 0.109, mag: 47, reserve: 141, reload: 3.6, recoil: 0.020, fov: 44, pitch: 0.72, len: 0.96 },
    { id: 'MG3', name: 'MG3 990RPM', cat: 'HVY', dmg: 42, rate: 0.060, mag: 75, reserve: 150, reload: 4.0, recoil: 0.024, fov: 46, pitch: 0.88, len: 0.98 },
    { id: 'S1897', name: 'S1897 Pump', cat: 'HVY', dmg: 118, rate: 0.75, mag: 5, reserve: 45, reload: 2.6, recoil: 0.070, fov: 52, pitch: 0.58, len: 0.90 },
    { id: 'DEAGLE', name: 'Desert Eagle', cat: 'HVY', dmg: 62, rate: 0.22, mag: 7, reserve: 63, reload: 1.8, recoil: 0.040, fov: 55, pitch: 0.66, len: 0.42 }
  ];

  // ==================== 2. OUTFITS PALETTE ====================
  const OUTFITS = {
    specops:  { shirt: 0x16181d, pants: 0x0f1014, vest: 0x22252c, helmet: 0x1a1c22, skin: 0xd8a886 },
    desert:   { shirt: 0x8c7a5b, pants: 0x6e5f45, vest: 0x4f4330, helmet: 0x5c4f38, skin: 0xd8a886 },
    ghillie:  { shirt: 0x2d4c2b, pants: 0x243d22, vest: 0x1e331c, helmet: 0x294227, skin: 0xc99b78 },
    arctic:   { shirt: 0xdbe2e9, pants: 0xbac4ce, vest: 0x7c8794, helmet: 0xced6de, skin: 0xd8a886 },
    crimson:  { shirt: 0x3b181c, pants: 0x17181c, vest: 0x121317, helmet: 0x261214, skin: 0xc99b78 },
    stealth:  { shirt: 0x0c0d10, pants: 0x08090b, vest: 0x14161b, helmet: 0x0a0b0d, skin: 0xd8a886 }
  };

  // ==================== 3. REALISTIC MULTI-LAYER AUDIO ENGINE ====================
  class RealisticAudioEngine {
    constructor() {
      this.ctx = null;
      this.noiseBuffer = null;
    }

    init() {
      if (this.ctx) {
        if (this.ctx.state === 'suspended') this.ctx.resume();
        return;
      }
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Create high-density white/pink noise buffer for realistic gunpowder blast
      const sampleRate = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, sampleRate * 1.0, sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.18));
      }
    }

    playGunshot(pitchFactor = 1.0, distance = 0) {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const distGain = Math.max(0.06, 1 - distance / 130);

      // Layer 1: Sub-bass chamber punch
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(145 * pitchFactor, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.11);
      subGain.gain.setValueAtTime(0.95 * distGain, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      subOsc.connect(subGain).connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.12);

      // Layer 2: Supersonic ballistic crack + gunpowder explosion
      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = this.noiseBuffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1100 * pitchFactor, now);
      bandpass.Q.value = 0.75;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(1.15 * distGain, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);

      noiseSrc.connect(bandpass).connect(noiseGain).connect(this.ctx.destination);
      noiseSrc.start(now);
      noiseSrc.stop(now + 0.28);

      // Layer 3: Metallic bolt carrier clack
      const mechOsc = this.ctx.createOscillator();
      const mechGain = this.ctx.createGain();
      mechOsc.type = 'square';
      mechOsc.frequency.setValueAtTime(2400 * pitchFactor, now + 0.02);
      mechOsc.frequency.exponentialRampToValueAtTime(620, now + 0.06);
      mechGain.gain.setValueAtTime(0.18 * distGain, now + 0.02);
      mechGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      mechOsc.connect(mechGain).connect(this.ctx.destination);
      mechOsc.start(now + 0.02);
      mechOsc.stop(now + 0.07);
    }

    playHitMarker(isHeadshot = false) {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHeadshot ? 1950 : 1200, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.06);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    }

    playReload() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [0.05, 0.45, 0.95].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(420 + idx * 190, now + offset);
        gain.gain.setValueAtTime(0.16, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
    }
  }

  const audio = new RealisticAudioEngine();

  // ==================== 4. GLOBAL GAME STATE ====================
  const state = {
    inMatch: false,
    withBots: true,
    mapMode: 'warehouse', // 'warehouse' or 'classic'
    outfit: 'specops',
    playerName: 'QS_OPERATOR',
    targetFPS: 90,
    shadowsEnabled: true,
    sensitivity: 1.0,
    forceLandscape: false,

    // Weapon Loadout (Primary + Secondary)
    loadout: [WEAPONS_DB[0], WEAPONS_DB[17]], // M416 + Kar98k
    activeSlot: 0,
    ammoInMag: 30,
    ammoReserve: 180,
    isReloading: false,
    isScoped: false,
    isFiring: false,
    lastShotTime: 0,

    // Player Transform & Physics
    playerPos: new THREE.Vector3(0, 0, 26),
    playerVel: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    peekDir: 0, // -1 Left, 0 Center, 1 Right
    isCrouching: false,
    isGrounded: true,
    hp: 100,
    scoreBlue: 0,
    scoreRed: 0,

    // Input Tracking
    moveInput: { x: 0, y: 0 },
    keys: {},

    // Entities
    colliders: [],
    actors: [], // Bots & Remote Players
    remotePeers: new Map()
  };

  // ==================== 5. THREE.JS SCENE & RENDERER ====================
  const container = document.getElementById('webgl-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x11151c);
  scene.fog = new THREE.FogExp2(0x11151c, 0.0075);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 320);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  container.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xdde8ff, 0x26292e, 0.75);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff5e4, 1.35);
  sunLight.position.set(35, 65, 25);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 180;
  const d = 55;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  scene.add(sunLight);

  // World Groups
  const mapGroup = new THREE.Group();
  const actorsGroup = new THREE.Group();
  const lobbyStageGroup = new THREE.Group();
  scene.add(mapGroup);
  scene.add(actorsGroup);
  scene.add(lobbyStageGroup);

  // First-Person Weapon Holder attached to Camera
  const fpWeaponGroup = new THREE.Group();
  camera.add(fpWeaponGroup);
  scene.add(camera);

  const muzzleLight = new THREE.PointLight(0xffaa33, 0, 8);
  fpWeaponGroup.add(muzzleLight);

  // ==================== 6. ARTICULATED REALISTIC HUMANOID BUILDER ====================
  // Uses rounded cylinders & spheres with pivot joints (Shoulders, Elbows, Hips, Knees)
  function createSmoothLimbGeometry(radiusTop, radiusBottom, height) {
    return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 14);
  }

  function createArticulatedCharacter(outfitKey = 'specops', team = 'blue') {
    const pal = OUTFITS[outfitKey] || OUTFITS.specops;
    const root = new THREE.Group();

    const matCloth = new THREE.MeshStandardMaterial({ color: pal.shirt, roughness: 0.75 });
    const matPants = new THREE.MeshStandardMaterial({ color: pal.pants, roughness: 0.8 });
    const matVest = new THREE.MeshStandardMaterial({ color: pal.vest, roughness: 0.55, metalness: 0.2 });
    const matHelm = new THREE.MeshStandardMaterial({ color: pal.helmet, roughness: 0.35, metalness: 0.45 });
    const matSkin = new THREE.MeshStandardMaterial({ color: pal.skin, roughness: 0.65 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.4, metalness: 0.6 });

    // Pelvis / Hips Pivot
    const pelvis = new THREE.Mesh(createSmoothLimbGeometry(0.19, 0.17, 0.22), matPants);
    pelvis.position.y = 0.92;
    pelvis.castShadow = true;
    root.add(pelvis);

    // Sculpted Upper Torso & Tactical Plate Carrier Vest
    const torso = new THREE.Mesh(createSmoothLimbGeometry(0.23, 0.19, 0.52), matCloth);
    torso.position.y = 0.35;
    torso.castShadow = true;
    pelvis.add(torso);

    const vest = new THREE.Mesh(createSmoothLimbGeometry(0.245, 0.21, 0.40), matVest);
    vest.position.y = 0.02;
    vest.scale.set(1.04, 1, 0.88);
    vest.castShadow = true;
    torso.add(vest);

    // Neck & Sculpted Spherical Head + Rounded Military Helmet & Visor
    const neck = new THREE.Mesh(createSmoothLimbGeometry(0.07, 0.08, 0.12), matSkin);
    neck.position.y = 0.30;
    torso.add(neck);

    const headGroup = new THREE.Group();
    headGroup.position.y = 0.12;
    neck.add(headGroup);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.155, 18, 18), matSkin);
    headMesh.scale.set(0.92, 1.08, 0.96);
    headMesh.castShadow = true;
    headMesh.userData.isHead = true;
    headGroup.add(headMesh);

    const helmetDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.172, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.62),
      matHelm
    );
    helmetDome.position.y = 0.02;
    helmetDome.castShadow = true;
    helmetDome.userData.isHead = true;
    headGroup.add(helmetDome);

    const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.07, 16, 1, false, -0.8, 1.6), matDark);
    visor.position.set(0, 0.01, 0.02);
    headGroup.add(visor);

    // Team Rim Indicator on Shoulders
    const teamColor = team === 'blue' ? 0x29b6f6 : 0xef5350;
    const badgeMat = new THREE.MeshBasicMaterial({ color: teamColor });

    // Articulated Arms (Left & Right)
    function buildArm(side) {
      const shoulderPivot = new THREE.Group();
      shoulderPivot.position.set(side * 0.28, 0.20, 0);
      torso.add(shoulderPivot);

      const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), matCloth);
      shoulderPivot.add(shoulderJoint);

      const armBand = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.076, 0.06, 12), badgeMat);
      armBand.position.y = -0.10;
      shoulderPivot.add(armBand);

      const upperArm = new THREE.Mesh(createSmoothLimbGeometry(0.075, 0.062, 0.28), matCloth);
      upperArm.position.y = -0.15;
      upperArm.castShadow = true;
      shoulderPivot.add(upperArm);

      const elbowPivot = new THREE.Group();
      elbowPivot.position.y = -0.15;
      upperArm.add(elbowPivot);

      const foreArm = new THREE.Mesh(createSmoothLimbGeometry(0.060, 0.048, 0.26), matSkin);
      foreArm.position.y = -0.13;
      foreArm.castShadow = true;
      elbowPivot.add(foreArm);

      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), matDark);
      glove.position.y = -0.14;
      foreArm.add(glove);

      return { shoulderPivot, elbowPivot, glove };
    }

    const leftArm = buildArm(-1);
    const rightArm = buildArm(1);

    // Pose Arms Holding Rifle
    rightArm.shoulderPivot.rotation.set(-0.65, -0.25, 0);
    rightArm.elbowPivot.rotation.set(-0.85, 0, 0);
    leftArm.shoulderPivot.rotation.set(-0.75, 0.42, 0);
    leftArm.elbowPivot.rotation.set(-0.95, 0, 0);

    // 3D Weapon Mesh in Right Hand
    const gunMesh = build3DWeaponMesh(state.loadout[0]);
    gunMesh.scale.set(0.65, 0.65, 0.65);
    gunMesh.position.set(0, -0.04, 0.18);
    rightArm.glove.add(gunMesh);

    // Articulated Legs (Hips, Thighs, Knees, Calves, Boots)
    function buildLeg(side) {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(side * 0.11, -0.08, 0);
      pelvis.add(hipPivot);

      const thigh = new THREE.Mesh(createSmoothLimbGeometry(0.095, 0.078, 0.42), matPants);
      thigh.position.y = -0.21;
      thigh.castShadow = true;
      hipPivot.add(thigh);

      const kneePivot = new THREE.Group();
      kneePivot.position.y = -0.21;
      thigh.add(kneePivot);

      const kneePad = new THREE.Mesh(new THREE.SphereGeometry(0.078, 10, 10), matDark);
      kneePad.position.z = 0.02;
      kneePivot.add(kneePad);

      const calf = new THREE.Mesh(createSmoothLimbGeometry(0.076, 0.058, 0.40), matPants);
      calf.position.y = -0.20;
      calf.castShadow = true;
      kneePivot.add(calf);

      const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.068, 0.11, 12), matDark);
      boot.position.set(0, -0.20, 0.03);
      boot.scale.set(1, 1, 1.45);
      calf.add(boot);

      return { hipPivot, kneePivot };
    }

    const leftLeg = buildLeg(-1);
    const rightLeg = buildLeg(1);

    root.userData.joints = {
      pelvis,
      torso,
      headGroup,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      gunMesh
    };

    return root;
  }

  // Smooth Procedural Skeletal Animation Updater
  function animateArticulatedCharacter(charMesh, time, speed, isCrouching = false) {
    const j = charMesh.userData.joints;
    if (!j) return;

    const crouchOffset = isCrouching ? -0.28 : 0;
    j.pelvis.position.y = 0.92 + crouchOffset + Math.abs(Math.sin(time * 9)) * 0.025 * speed;

    if (speed > 0.08) {
      const stride = time * 10;
      j.leftLeg.hipPivot.rotation.x = Math.sin(stride) * 0.65 * speed;
      j.rightLeg.hipPivot.rotation.x = Math.sin(stride + Math.PI) * 0.65 * speed;
      j.leftLeg.kneePivot.rotation.x = Math.max(0, Math.cos(stride) * 0.65 * speed);
      j.rightLeg.kneePivot.rotation.x = Math.max(0, Math.cos(stride + Math.PI) * 0.65 * speed);
      j.torso.rotation.y = Math.sin(stride) * 0.08 * speed;
    } else {
      // Idle Breathing
      j.leftLeg.hipPivot.rotation.x = isCrouching ? -0.55 : 0;
      j.rightLeg.hipPivot.rotation.x = isCrouching ? -0.55 : 0;
      j.leftLeg.kneePivot.rotation.x = isCrouching ? 0.95 : 0.05;
      j.rightLeg.kneePivot.rotation.x = isCrouching ? 0.95 : 0.05;
      j.torso.rotation.x = Math.sin(time * 2.2) * 0.02;
    }
  }

  // ==================== 7. 3D WEAPON MODEL GENERATOR ====================
  function build3DWeaponMesh(wpn) {
    const group = new THREE.Group();
    const gunMetal = new THREE.MeshStandardMaterial({ color: 0x1c1e24, roughness: 0.35, metalness: 0.82 });
    const accentMat = new THREE.MeshStandardMaterial({
      color: wpn.cat === 'SR' ? 0x3e3227 : wpn.cat === 'SMG' ? 0x282c34 : 0x15171c,
      roughness: 0.55,
      metalness: 0.4
    });

    // Receiver Body
    const receiver = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.042, wpn.len * 0.55, 12), accentMat);
    receiver.rotation.x = Math.PI / 2;
    group.add(receiver);

    // Rifled Barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, wpn.len * 0.65, 12), gunMetal);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = -wpn.len * 0.42;
    group.add(barrel);

    // Tactical Optic / Scope
    const scopeRadius = wpn.cat === 'SR' ? 0.028 : 0.020;
    const scopeLen = wpn.cat === 'SR' ? 0.26 : 0.12;
    const scope = new THREE.Mesh(new THREE.CylinderGeometry(scopeRadius, scopeRadius, scopeLen, 14), gunMetal);
    scope.rotation.x = Math.PI / 2;
    scope.position.set(0, 0.055, -0.04);
    group.add(scope);

    // Curved Magazine
    const mag = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.18, 8), gunMetal);
    mag.position.set(0, -0.10, -0.05);
    mag.rotation.x = 0.22;
    group.add(mag);

    return group;
  }

  function refreshFirstPersonWeapon() {
    while (fpWeaponGroup.children.length > 1) {
      fpWeaponGroup.remove(fpWeaponGroup.children[1]);
    }
    const wpn = state.loadout[state.activeSlot];
    const mesh = build3DWeaponMesh(wpn);
    mesh.position.set(0.24, -0.22, -0.45);
    fpWeaponGroup.add(mesh);
    muzzleLight.position.set(0.24, -0.18, -0.95);

    document.getElementById('hud-weapon-name').textContent = wpn.name;
    updateAmmoHUD();
  }

  function updateAmmoHUD() {
    document.getElementById('hud-ammo-text').textContent = `${state.ammoInMag} / ${state.ammoReserve}`;
  }

  // ==================== 8. LOBBY 3D STAGE ====================
  let lobbyCharacter = null;
  function buildLobbyPreviewStage() {
    while (lobbyStageGroup.children.length) lobbyStageGroup.remove(lobbyStageGroup.children[0]);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.5, 0.14, 32),
      new THREE.MeshStandardMaterial({ color: 0x14161d, roughness: 0.3, metalness: 0.7 })
    );
    platform.position.set(0, -0.07, 0);
    platform.receiveShadow = true;
    lobbyStageGroup.add(platform);

    lobbyCharacter = createArticulatedCharacter(state.outfit, 'blue');
    lobbyStageGroup.add(lobbyCharacter);

    const previewLabel = document.getElementById('preview-nametag');
    if (previewLabel) {
      previewLabel.textContent = `${state.playerName} | ${state.loadout[0].name}`;
    }
  }

  // ==================== 9. MAP BUILDERS (WAREHOUSE & CLASSIC GRASSLAND) ====================
  function clearMap() {
    while (mapGroup.children.length) mapGroup.remove(mapGroup.children[0]);
    state.colliders = [];
  }

  function addObstacle(mesh, isSolid = true) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mapGroup.add(mesh);
    if (isSolid) {
      const box = new THREE.Box3().setFromObject(mesh);
      state.colliders.push(box);
    }
  }

  function buildWarehouseMap() {
    clearMap();
    scene.background = new THREE.Color(0x161b24);
    scene.fog = new THREE.FogExp2(0x161b24, 0.011);

    const floorMat = new THREE.MeshStandardMaterial({ color: 0x2b2f36, roughness: 0.85, metalness: 0.1 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(76, 96), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    mapGroup.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e2229, roughness: 0.7, metalness: 0.3 });
    const wallSpecs = [
      [0, 5, -45, 76, 10, 2],
      [0, 5, 45, 76, 10, 2],
      [-37, 5, 0, 2, 10, 90],
      [37, 5, 0, 2, 10, 90]
    ];
    wallSpecs.forEach(([x, y, z, w, h, d]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      m.position.set(x, y, z);
      addObstacle(m, true);
    });

    // Symmetrical Shipping Containers & Concrete Barriers
    const containerColors = [0x6e2222, 0x1d3b5c, 0x25472c, 0x3b3f47];
    const layout = [
      [-14, 2.2, -16, 4.5, 4.4, 11, 0],
      [14, 2.2, -16, 4.5, 4.4, 11, 1],
      [-14, 2.2, 16, 4.5, 4.4, 11, 1],
      [14, 2.2, 16, 4.5, 4.4, 11, 0],
      [0, 2.2, 0, 5.2, 4.4, 9, 2],
      [-23, 1.3, 0, 4.5, 2.6, 4.5, 3],
      [23, 1.3, 0, 4.5, 2.6, 4.5, 3],
      [-6, 1.1, -7, 4.0, 2.2, 1.4, 3],
      [6, 1.1, 7, 4.0, 2.2, 1.4, 3]
    ];

    layout.forEach(([x, y, z, w, h, d, cIdx]) => {
      const mat = new THREE.MeshStandardMaterial({
        color: containerColors[cIdx],
        roughness: 0.6,
        metalness: 0.35
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      addObstacle(mesh, true);
    });
  }

  function buildClassicGrassMap() {
    clearMap();
    scene.background = new THREE.Color(0x6e8ca0);
    scene.fog = new THREE.FogExp2(0x6e8ca0, 0.006);

    // Rich Erangel Turf Ground
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x354f2b, roughness: 0.92, metalness: 0.02 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    mapGroup.add(ground);

    // Instanced 3D Grass Blades (4,500 blades with zero FPS drop)
    const grassCount = 4500;
    const bladeGeo = new THREE.ConeGeometry(0.08, 0.65, 4);
    bladeGeo.translate(0, 0.32, 0);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x496e37, roughness: 0.8 });
    const instancedGrass = new THREE.InstancedMesh(bladeGeo, bladeMat, grassCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < grassCount; i++) {
      dummy.position.set((Math.random() - 0.5) * 140, 0, (Math.random() - 0.5) * 140);
      dummy.rotation.y = Math.random() * Math.PI;
      const scale = 0.65 + Math.random() * 0.9;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      instancedGrass.setMatrixAt(i, dummy.matrix);
    }
    instancedGrass.receiveShadow = true;
    mapGroup.add(instancedGrass);

    // Natural Boulders, Trees & Compounds for Cover
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x55595e, roughness: 0.85 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x26451e, roughness: 0.8 });

    for (let i = 0; i < 24; i++) {
      const rx = Math.sin(i * 2.3) * 32 + (i % 2 === 0 ? 10 : -10);
      const rz = Math.cos(i * 1.7) * 34;
      if (Math.abs(rx) < 5 && Math.abs(rz) < 5) continue;

      if (i % 2 === 0) {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8), rockMat);
        rock.position.set(rx, 1.1, rz);
        rock.scale.set(1.3, 0.9, 1.2);
        addObstacle(rock, true);
      } else {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.48, 3.6, 10), trunkMat);
        trunk.position.set(rx, 1.8, rz);
        addObstacle(trunk, true);

        const crown = new THREE.Mesh(new THREE.ConeGeometry(2.4, 5.2, 12), foliageMat);
        crown.position.set(rx, 5.2, rz);
        addObstacle(crown, false);
      }
    }
  }

  // ==================== 10. AI BOTS & REMOTE PLAYERS SYSTEM ====================
  function clearActors() {
    while (actorsGroup.children.length) actorsGroup.remove(actorsGroup.children[0]);
    state.actors = [];
  }

  function spawnBots() {
    clearActors();
    if (!state.withBots) return;

    const botConfigs = [
      { name: 'ALLY_ALPHA', team: 'blue', outfit: 'specops', z: 26, x: -7 },
      { name: 'ALLY_BRAVO', team: 'blue', outfit: 'desert', z: 26, x: 7 },
      { name: 'ALLY_DELTA', team: 'blue', outfit: 'arctic', z: 24, x: -13 },
      { name: 'ENEMY_VIPER', team: 'red', outfit: 'crimson', z: -26, x: -9 },
      { name: 'ENEMY_REAPER', team: 'red', outfit: 'stealth', z: -26, x: 9 },
      { name: 'ENEMY_GHOST', team: 'red', outfit: 'ghillie', z: -24, x: 0 },
      { name: 'ENEMY_TITAN', team: 'red', outfit: 'crimson', z: -26, x: 15 }
    ];

    botConfigs.forEach((cfg) => {
      const mesh = createArticulatedCharacter(cfg.outfit, cfg.team);
      mesh.position.set(cfg.x, 0, cfg.z);
      mesh.rotation.y = cfg.team === 'blue' ? 0 : Math.PI;
      actorsGroup.add(mesh);

      state.actors.push({
        isBot: true,
        name: cfg.name,
        team: cfg.team,
        mesh,
        hp: 100,
        spawnPos: new THREE.Vector3(cfg.x, 0, cfg.z),
        targetDir: new THREE.Vector3(0, 0, cfg.team === 'blue' ? -1 : 1),
        nextDecision: 0,
        lastShot: 0
      });
    });
  }

  function checkCollision(pos, radius = 0.55) {
    const playerBox = new THREE.Box3(
      new THREE.Vector3(pos.x - radius, 0.1, pos.z - radius),
      new THREE.Vector3(pos.x + radius, 1.8, pos.z + radius)
    );
    for (let i = 0; i < state.colliders.length; i++) {
      if (playerBox.intersectsBox(state.colliders[i])) return true;
    }
    return false;
  }

  // ==================== 11. REAL P2P ID MULTIPLAYER & LAN SYNC ====================
  let peer = null;
  const activeConnections = [];
  const lanChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('qs66_battlegrounds_lan') : null;
  const myShortId = 'QS-' + Math.floor(1000 + Math.random() * 9000);

  function initNetworking() {
    const idLabel = document.getElementById('my-unique-id');
    if (idLabel) idLabel.textContent = myShortId;

    // BroadcastChannel for instant local/same-WiFi browser tabs discovery
    if (lanChannel) {
      lanChannel.onmessage = (ev) => {
        handleNetworkPacket(ev.data);
      };
      setInterval(() => {
        lanChannel.postMessage({
          type: 'presence',
          id: myShortId,
          name: state.playerName,
          outfit: state.outfit,
          pos: state.playerPos,
          yaw: state.yaw
        });
      }, 1000);
    }

    // PeerJS WebRTC for Global ID connection
    if (typeof Peer !== 'undefined') {
      try {
        peer = new Peer(myShortId);
        peer.on('connection', (conn) => {
          setupPeerConnection(conn);
        });
      } catch (e) {
        // Fallback silently if offline
      }
    }
  }

  function setupPeerConnection(conn) {
    activeConnections.push(conn);
    conn.on('data', (data) => handleNetworkPacket(data));
  }

  function broadcastStatePacket(extra = {}) {
    const pkt = {
      type: 'sync',
      id: myShortId,
      name: state.playerName,
      outfit: state.outfit,
      pos: { x: state.playerPos.x, y: state.playerPos.y, z: state.playerPos.z },
      yaw: state.yaw,
      isCrouching: state.isCrouching,
      ...extra
    };
    if (lanChannel) lanChannel.postMessage(pkt);
    activeConnections.forEach((c) => {
      if (c.open) c.send(pkt);
    });
  }

  function handleNetworkPacket(pkt) {
    if (!pkt || pkt.id === myShortId) return;

    if (!state.remotePeers.has(pkt.id)) {
      const remoteMesh = createArticulatedCharacter(pkt.outfit || 'crimson', 'red');
      actorsGroup.add(remoteMesh);
      const actorObj = {
        isBot: false,
        id: pkt.id,
        name: pkt.name || pkt.id,
        team: 'red',
        mesh: remoteMesh,
        hp: 100,
        spawnPos: new THREE.Vector3(0, 0, -26)
      };
      state.remotePeers.set(pkt.id, actorObj);
      state.actors.push(actorObj);
      updatePeersListUI();
    }

    const peerActor = state.remotePeers.get(pkt.id);
    if (pkt.pos && peerActor) {
      peerActor.mesh.position.set(pkt.pos.x, pkt.pos.y, pkt.pos.z);
      peerActor.mesh.rotation.y = pkt.yaw || 0;
      animateArticulatedCharacter(peerActor.mesh, performance.now() * 0.001, 0.8, pkt.isCrouching);
    }

    if (pkt.shotFired) {
      audio.playGunshot(0.95, state.playerPos.distanceTo(peerActor.mesh.position));
    }
  }

  function updatePeersListUI() {
    const el = document.getElementById('connected-peers-list');
    if (!el) return;
    if (state.remotePeers.size === 0) {
      el.textContent = 'No remote players yet. Share your ID above!';
      return;
    }
    el.innerHTML = Array.from(state.remotePeers.values())
      .map((p) => `<div>• ${p.name} [${p.id}] — ONLINE</div>`)
      .join('');
  }

  // ==================== 12. SHOOTING, RAYCASTING & KILL FEED ====================
  const raycaster = new THREE.Raycaster();

  function fireCurrentWeapon() {
    if (!state.inMatch || state.isReloading) return;
    const wpn = state.loadout[state.activeSlot];
    const now = performance.now() * 0.001;
    if (now - state.lastShotTime < wpn.rate) return;

    if (state.ammoInMag <= 0) {
      triggerReload();
      return;
    }

    state.lastShotTime = now;
    state.ammoInMag--;
    updateAmmoHUD();

    // Audio & Muzzle Flash
    audio.playGunshot(wpn.pitch, 0);
    muzzleLight.intensity = 4.5;
    setTimeout(() => { muzzleLight.intensity = 0; }, 45);

    // Weapon Kickback & Camera Recoil
    fpWeaponGroup.position.z = 0.06;
    state.pitch = Math.min(1.35, state.pitch + wpn.recoil);
    state.yaw += (Math.random() - 0.5) * wpn.recoil * 0.6;

    broadcastStatePacket({ shotFired: true });

    // Center-screen Raycast
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const enemyMeshes = [];
    state.actors.forEach((a) => {
      if (a.team === 'red') enemyMeshes.push(a.mesh);
    });

    const hits = raycaster.intersectObjects(enemyMeshes, true);
    if (hits.length > 0) {
      const hitObj = hits[0].object;
      const isHead = Boolean(hitObj.userData && hitObj.userData.isHead);
      const dmg = isHead ? wpn.dmg * 2.2 : wpn.dmg;

      // Find owning actor
      let hitActor = null;
      for (const a of state.actors) {
        let p = hitObj;
        while (p) {
          if (p === a.mesh) { hitActor = a; break; }
          p = p.parent;
        }
        if (hitActor) break;
      }

      if (hitActor) {
        hitActor.hp -= dmg;
        audio.playHitMarker(isHead);
        flashHitmarker(isHead);

        if (hitActor.hp <= 0) {
          state.scoreBlue++;
          document.getElementById('score-blue').textContent = state.scoreBlue;
          pushKillFeed(`${state.playerName} [${wpn.name}${isHead ? ' HEADSHOT' : ''}] ${hitActor.name}`);
          respawnActor(hitActor);
        }
      }
    }
  }

  function flashHitmarker(isHead) {
    const hm = document.getElementById('hitmarker');
    hm.style.borderColor = isHead ? '#ff3d3d' : '#ffffff';
    hm.style.opacity = '1';
    setTimeout(() => { hm.style.opacity = '0'; }, 90);
  }

  function pushKillFeed(text) {
    const feed = document.getElementById('kill-feed');
    const item = document.createElement('div');
    item.className = 'kill-item';
    item.textContent = text;
    feed.prepend(item);
    setTimeout(() => item.remove(), 3500);
  }

  function respawnActor(actor) {
    actor.hp = 100;
    actor.mesh.position.copy(actor.spawnPos);
    actor.mesh.position.x += (Math.random() - 0.5) * 8;
  }

  function triggerReload() {
    if (state.isReloading || state.ammoReserve <= 0) return;
    const wpn = state.loadout[state.activeSlot];
    if (state.ammoInMag >= wpn.mag) return;

    state.isReloading = true;
    audio.playReload();
    document.getElementById('hud-ammo-text').textContent = 'RELOADING...';

    setTimeout(() => {
      const needed = wpn.mag - state.ammoInMag;
      const take = Math.min(needed, state.ammoReserve);
      state.ammoInMag += take;
      state.ammoReserve -= take;
      state.isReloading = false;
      updateAmmoHUD();
    }, wpn.reload * 1000);
  }

  // ==================== 13. UI & ARMORY INITIALIZATION ====================
  function renderWeaponList(cat = 'ALL') {
    const listEl = document.getElementById('weapon-list-container');
    listEl.innerHTML = '';
    const filtered = cat === 'ALL' ? WEAPONS_DB : WEAPONS_DB.filter((w) => w.cat === cat);

    filtered.forEach((wpn) => {
      const card = document.createElement('div');
      card.className = 'weapon-item' + (state.loadout[0].id === wpn.id ? ' active' : '');
      card.innerHTML = `
        <div class="w-name">${wpn.name}</div>
        <div class="w-meta">${wpn.cat} | DMG ${wpn.dmg} | MAG ${wpn.mag}</div>
      `;
      card.onclick = () => {
        state.loadout[0] = wpn;
        state.ammoInMag = wpn.mag;
        state.ammoReserve = wpn.reserve;
        renderWeaponList(cat);
        buildLobbyPreviewStage();
      };
      listEl.appendChild(card);
    });
  }

  // ==================== 14. CUSTOM HUD CONTROLS LAYOUT EDITOR ====================
  let editingButton = null;
  let editorOpen = false;

  function loadSavedHUDLayout() {
    try {
      const raw = localStorage.getItem('qs66_hud_layout');
      if (!raw) return;
      const saved = JSON.parse(raw);
      document.querySelectorAll('.hud-control-btn').forEach((btn) => {
        const id = btn.dataset.btnId;
        if (saved[id]) {
          btn.style.left = saved[id].left;
          btn.style.top = saved[id].top;
          btn.style.right = 'auto';
          btn.style.bottom = 'auto';
          btn.style.transform = `scale(${saved[id].scale || 1})`;
          btn.style.opacity = saved[id].opacity || 0.82;
          btn.dataset.scale = saved[id].scale || 1;
          btn.dataset.opacity = saved[id].opacity || 0.82;
        }
      });
    } catch (e) {}
  }

  function saveHUDLayout() {
    const data = {};
    document.querySelectorAll('.hud-control-btn').forEach((btn) => {
      const id = btn.dataset.btnId;
      data[id] = {
        left: btn.style.left,
        top: btn.style.top,
        scale: parseFloat(btn.dataset.scale || '1'),
        opacity: parseFloat(btn.dataset.opacity || '0.82')
      };
    });
    try {
      localStorage.setItem('qs66_hud_layout', JSON.stringify(data));
    } catch (e) {}
  }

  function mapClientCoords(clientX, clientY) {
    if (!state.forceLandscape) return { x: clientX, y: clientY };
    const w = window.innerWidth;
    return { x: clientY, y: w - clientX };
  }

  function setupHUDCustomizer() {
    const modal = document.getElementById('editor-modal');
    const scaleSlider = document.getElementById('edit-btn-scale');
    const opacitySlider = document.getElementById('edit-btn-opacity');

    function openEditor() {
      editorOpen = true;
      document.getElementById('hud-screen').classList.remove('hidden');
      modal.classList.remove('hidden');
    }

    document.getElementById('btn-open-hud-editor').onclick = openEditor;
    document.getElementById('btn-hud-customize').onclick = openEditor;

    document.getElementById('btn-save-hud').onclick = () => {
      saveHUDLayout();
      editorOpen = false;
      modal.classList.add('hidden');
      if (!state.inMatch) document.getElementById('hud-screen').classList.add('hidden');
      document.querySelectorAll('.hud-control-btn').forEach((b) => b.classList.remove('selected-for-edit'));
    };

    document.getElementById('btn-reset-hud').onclick = () => {
      localStorage.removeItem('qs66_hud_layout');
      location.reload();
    };

    scaleSlider.oninput = () => {
      document.getElementById('edit-scale-val').textContent = `${scaleSlider.value}%`;
      if (editingButton) {
        const s = parseInt(scaleSlider.value, 10) / 100;
        editingButton.style.transform = `scale(${s})`;
        editingButton.dataset.scale = s;
      }
    };

    opacitySlider.oninput = () => {
      document.getElementById('edit-opacity-val').textContent = `${opacitySlider.value}%`;
      if (editingButton) {
        const o = parseInt(opacitySlider.value, 10) / 100;
        editingButton.style.opacity = o;
        editingButton.dataset.opacity = o;
      }
    };

    // Dragging HUD buttons when Editor is active
    document.querySelectorAll('.hud-control-btn').forEach((btn) => {
      let dragging = false;
      const startDrag = (ev) => {
        if (!editorOpen) return;
        ev.preventDefault();
        ev.stopPropagation();
        dragging = true;
        editingButton = btn;
        document.querySelectorAll('.hud-control-btn').forEach((b) => b.classList.remove('selected-for-edit'));
        btn.classList.add('selected-for-edit');
        document.getElementById('selected-btn-label').textContent = `Editing: ${btn.textContent}`;
      };

      const moveDrag = (ev) => {
        if (!editorOpen || !dragging) return;
        const pt = ev.touches ? ev.touches[0] : ev;
        const mapped = mapClientCoords(pt.clientX, pt.clientY);
        const rootRect = document.getElementById('app-root').getBoundingClientRect();
        const rw = state.forceLandscape ? window.innerHeight : rootRect.width;
        const rh = state.forceLandscape ? window.innerWidth : rootRect.height;

        const leftPct = Math.max(2, Math.min(92, ((mapped.x - 30) / rw) * 100));
        const topPct = Math.max(4, Math.min(88, ((mapped.y - 30) / rh) * 100));
        btn.style.left = `${leftPct.toFixed(1)}%`;
        btn.style.top = `${topPct.toFixed(1)}%`;
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
      };

      const endDrag = () => { dragging = false; };

      btn.addEventListener('mousedown', startDrag);
      window.addEventListener('mousemove', moveDrag);
      window.addEventListener('mouseup', endDrag);

      btn.addEventListener('touchstart', startDrag, { passive: false });
      window.addEventListener('touchmove', moveDrag, { passive: false });
      window.addEventListener('touchend', endDrag);
    });
  }

  // ==================== 15. MULTI-TOUCH FLOATING JOYSTICK & AIMING ====================
  function setupGameplayControls() {
    const moveZone = document.getElementById('move-touch-zone');
    const lookZone = document.getElementById('look-touch-zone');
    const joyRing = document.getElementById('joystick-ring');
    const joyKnob = document.getElementById('joystick-knob');

    let moveTouchId = null;
    let joyOrigin = { x: 0, y: 0 };
    let lookTouchId = null;
    let lastLook = { x: 0, y: 0 };

    moveZone.addEventListener('touchstart', (e) => {
      if (editorOpen) return;
      for (const t of e.changedTouches) {
        if (moveTouchId === null) {
          moveTouchId = t.identifier;
          const p = mapClientCoords(t.clientX, t.clientY);
          joyOrigin = p;
          joyRing.style.left = `${p.x - 60}px`;
          joyRing.style.top = `${p.y - 60}px`;
          joyRing.style.bottom = 'auto';
          joyKnob.style.transform = `translate(-50%, -50%)`;
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (editorOpen) return;
      for (const t of e.changedTouches) {
        if (t.identifier === moveTouchId) {
          const p = mapClientCoords(t.clientX, t.clientY);
          const dx = p.x - joyOrigin.x;
          const dy = p.y - joyOrigin.y;
          const dist = Math.min(50, Math.hypot(dx, dy));
          const angle = Math.atan2(dy, dx);
          const kx = Math.cos(angle) * dist;
          const ky = Math.sin(angle) * dist;
          joyKnob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
          state.moveInput.x = kx / 50;
          state.moveInput.y = ky / 50;
        } else if (t.identifier === lookTouchId) {
          const p = mapClientCoords(t.clientX, t.clientY);
          const dx = p.x - lastLook.x;
          const dy = p.y - lastLook.y;
          lastLook = p;
          const sens = 0.0042 * state.sensitivity * (state.isScoped ? 0.45 : 1);
          state.yaw -= dx * sens;
          state.pitch = Math.max(-1.25, Math.min(1.25, state.pitch - dy * sens));
        }
      }
    }, { passive: true });

    const endTouches = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === moveTouchId) {
          moveTouchId = null;
          state.moveInput.x = 0;
          state.moveInput.y = 0;
          joyKnob.style.transform = `translate(-50%, -50%)`;
        }
        if (t.identifier === lookTouchId) {
          lookTouchId = null;
        }
      }
    };
    window.addEventListener('touchend', endTouches);
    window.addEventListener('touchcancel', endTouches);

    lookZone.addEventListener('touchstart', (e) => {
      if (editorOpen) return;
      for (const t of e.changedTouches) {
        if (lookTouchId === null) {
          lookTouchId = t.identifier;
          lastLook = mapClientCoords(t.clientX, t.clientY);
        }
      }
    }, { passive: true });

    // Bind Tactical Action Buttons
    const bindHoldBtn = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      el.addEventListener('touchstart', (e) => { if (!editorOpen) { e.preventDefault(); onDown(); } });
      el.addEventListener('touchend', (e) => { if (!editorOpen && onUp) { e.preventDefault(); onUp(); } });
      el.addEventListener('mousedown', () => { if (!editorOpen) onDown(); });
      window.addEventListener('mouseup', () => { if (!editorOpen && onUp) onUp(); });
    };

    bindHoldBtn('btn-fire-right', () => { state.isFiring = true; }, () => { state.isFiring = false; });
    bindHoldBtn('btn-fire-left', () => { state.isFiring = true; }, () => { state.isFiring = false; });

    bindHoldBtn('btn-scope', () => {
      state.isScoped = !state.isScoped;
      const wpn = state.loadout[state.activeSlot];
      camera.fov = state.isScoped ? wpn.fov : 70;
      camera.updateProjectionMatrix();
      document.getElementById('scope-overlay').classList.toggle('hidden', !state.isScoped);
    });

    bindHoldBtn('btn-reload', () => triggerReload());
    bindHoldBtn('btn-jump', () => {
      if (state.isGrounded) {
        state.playerVel.y = 7.2;
        state.isGrounded = false;
      }
    });
    bindHoldBtn('btn-crouch', () => {
      state.isCrouching = !state.isCrouching;
    });
    bindHoldBtn('btn-peek-l', () => { state.peekDir = state.peekDir === -1 ? 0 : -1; });
    bindHoldBtn('btn-peek-r', () => { state.peekDir = state.peekDir === 1 ? 0 : 1; });
    bindHoldBtn('btn-switch-wpn', () => {
      state.activeSlot = state.activeSlot === 0 ? 1 : 0;
      const wpn = state.loadout[state.activeSlot];
      state.ammoInMag = wpn.mag;
      state.ammoReserve = wpn.reserve;
      refreshFirstPersonWeapon();
    });

    // PC Keyboard & Mouse Support
    window.addEventListener('keydown', (e) => {
      state.keys[e.code] = true;
      if (e.code === 'KeyR') triggerReload();
      if (e.code === 'KeyC') state.isCrouching = !state.isCrouching;
      if (e.code === 'KeyQ') state.peekDir = state.peekDir === -1 ? 0 : -1;
      if (e.code === 'KeyE') state.peekDir = state.peekDir === 1 ? 0 : 1;
      if (e.code === 'Space' && state.isGrounded) {
        state.playerVel.y = 7.2;
        state.isGrounded = false;
      }
    });
    window.addEventListener('keyup', (e) => { state.keys[e.code] = false; });

    renderer.domElement.addEventListener('mousedown', (e) => {
      if (!state.inMatch || editorOpen) return;
      if (document.pointerLockElement !== renderer.domElement) {
        renderer.domElement.requestPointerLock?.();
      }
      if (e.button === 0) state.isFiring = true;
    });
    window.addEventListener('mouseup', () => { state.isFiring = false; });
    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === renderer.domElement && state.inMatch) {
        const sens = 0.0022 * state.sensitivity * (state.isScoped ? 0.45 : 1);
        state.yaw -= e.movementX * sens;
        state.pitch = Math.max(-1.25, Math.min(1.25, state.pitch - e.movementY * sens));
      }
    });
  }

  // ==================== 16. LOBBY EVENTS & MATCH LAUNCHER ====================
  function bindLobbyEvents() {
    // Player Name
    const nameInput = document.getElementById('player-name-input');
    nameInput.oninput = () => {
      state.playerName = nameInput.value.trim() || 'QS_OPERATOR';
      buildLobbyPreviewStage();
    };

    // Matchmaking Mode (With Bots vs. No Bots Online ID)
    const btnWithBots = document.getElementById('mode-with-bots');
    const btnNoBots = document.getElementById('mode-no-bots');
    btnWithBots.onclick = () => {
      state.withBots = true;
      btnWithBots.classList.add('active');
      btnNoBots.classList.remove('active');
      updateStatusFooter();
    };
    btnNoBots.onclick = () => {
      state.withBots = false;
      btnNoBots.classList.add('active');
      btnWithBots.classList.remove('active');
      updateStatusFooter();
    };

    // Connect to Remote ID
    document.getElementById('btn-connect-id').onclick = () => {
      const targetId = document.getElementById('remote-id-input').value.trim();
      if (!targetId || !peer) return;
      const conn = peer.connect(targetId);
      setupPeerConnection(conn);
      document.getElementById('connected-peers-list').innerHTML = `<div>Connecting to ${targetId}...</div>`;
    };

    // Battle Map Selector
    const btnMapWh = document.getElementById('map-warehouse');
    const btnMapCl = document.getElementById('map-classic');
    btnMapWh.onclick = () => {
      state.mapMode = 'warehouse';
      btnMapWh.classList.add('active');
      btnMapCl.classList.remove('active');
      updateStatusFooter();
    };
    btnMapCl.onclick = () => {
      state.mapMode = 'classic';
      btnMapCl.classList.add('active');
      btnMapWh.classList.remove('active');
      updateStatusFooter();
    };

    // Outfit Selector
    document.querySelectorAll('#outfit-selector .dark-btn').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('#outfit-selector .dark-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.outfit = btn.dataset.outfit;
        buildLobbyPreviewStage();
      };
    });

    // Weapon Category Filter
    document.querySelectorAll('#weapon-cat-tabs .cat-tab').forEach((tab) => {
      tab.onclick = () => {
        document.querySelectorAll('#weapon-cat-tabs .cat-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        renderWeaponList(tab.dataset.cat);
      };
    });

    // FPS Target Selector
    document.querySelectorAll('[data-fps]').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('[data-fps]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.targetFPS = parseInt(btn.dataset.fps, 10);
      };
    });

    // Shadows Toggle
    const btnShadows = document.getElementById('btn-toggle-shadows');
    btnShadows.onclick = () => {
      state.shadowsEnabled = !state.shadowsEnabled;
      renderer.shadowMap.enabled = state.shadowsEnabled;
      btnShadows.textContent = `SHADOWS: ${state.shadowsEnabled ? 'HIGH' : 'OFF'}`;
    };

    // Sensitivity Slider
    const sensSlider = document.getElementById('sens-slider');
    sensSlider.oninput = () => {
      state.sensitivity = parseInt(sensSlider.value, 10) / 100;
      document.getElementById('sens-val').textContent = `${sensSlider.value}%`;
    };

    // Orientation Toggle
    const btnOrient = document.getElementById('btn-toggle-orientation');
    const checkAutoLandscape = () => {
      const root = document.getElementById('app-root');
      if (state.forceLandscape) {
        root.classList.add('force-landscape');
        renderer.setSize(window.innerHeight, window.innerWidth);
        camera.aspect = window.innerHeight / window.innerWidth;
      } else {
        root.classList.remove('force-landscape');
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
      }
      camera.updateProjectionMatrix();
    };

    btnOrient.onclick = () => {
      state.forceLandscape = !state.forceLandscape;
      btnOrient.textContent = `ORIENTATION: ${state.forceLandscape ? 'LANDSCAPE' : 'NORMAL'}`;
      checkAutoLandscape();
    };

    // Auto-rotate on portrait phone screens
    if (window.innerHeight > window.innerWidth) {
      state.forceLandscape = true;
      checkAutoLandscape();
    }
    window.addEventListener('resize', checkAutoLandscape);

    // Start & Leave Match
    document.getElementById('start-match-btn').onclick = startMatch;
    document.getElementById('btn-leave-match').onclick = returnToLobby;
  }

  function updateStatusFooter() {
    const mapText = state.mapMode === 'warehouse' ? 'TDM WAREHOUSE' : 'CLASSIC GRASSLAND';
    const botsText = state.withBots ? 'AI BOTS ENABLED' : 'NO BOTS (ONLINE P2P ID MODE)';
    document.getElementById('lobby-status-text').textContent = `MODE: ${mapText} | ${botsText}`;
  }

  function startMatch() {
    audio.init();
    state.inMatch = true;
    state.hp = 100;
    state.scoreBlue = 0;
    state.scoreRed = 0;
    state.playerPos.set(0, 0, 26);
    state.yaw = 0;
    state.pitch = 0;

    lobbyStageGroup.visible = false;
    fpWeaponGroup.visible = true;

    if (state.mapMode === 'warehouse') {
      buildWarehouseMap();
    } else {
      buildClassicGrassMap();
    }

    spawnBots();
    refreshFirstPersonWeapon();

    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('hud-screen').classList.remove('hidden');
    document.getElementById('hud-mode-label').textContent = state.mapMode === 'warehouse' ? 'TDM 40' : 'CLASSIC';
  }

  function returnToLobby() {
    state.inMatch = false;
    state.isFiring = false;
    state.isScoped = false;
    camera.fov = 70;
    camera.updateProjectionMatrix();

    clearMap();
    clearActors();
    lobbyStageGroup.visible = true;
    fpWeaponGroup.visible = false;

    document.getElementById('hud-screen').classList.add('hidden');
    document.getElementById('scope-overlay').classList.add('hidden');
    document.getElementById('lobby-screen').classList.remove('hidden');
  }

  // ==================== 17. MINIMAP RADAR RENDERER ====================
  const minimapCanvas = document.getElementById('minimap-canvas');
  const mCtx = minimapCanvas.getContext('2d');

  function drawMinimap() {
    mCtx.fillStyle = '#090b0f';
    mCtx.fillRect(0, 0, 115, 115);

    mCtx.strokeStyle = 'rgba(255,255,255,0.08)';
    mCtx.beginPath();
    mCtx.arc(57.5, 57.5, 48, 0, Math.PI * 2);
    mCtx.stroke();

    // Player Center Dot
    mCtx.fillStyle = '#ffffff';
    mCtx.beginPath();
    mCtx.arc(57.5, 57.5, 3.5, 0, Math.PI * 2);
    mCtx.fill();

    // Actors
    state.actors.forEach((a) => {
      const dx = (a.mesh.position.x - state.playerPos.x) * 1.1;
      const dz = (a.mesh.position.z - state.playerPos.z) * 1.1;
      const mx = Math.max(8, Math.min(107, 57.5 + dx));
      const my = Math.max(8, Math.min(107, 57.5 + dz));
      mCtx.fillStyle = a.team === 'blue' ? '#29b6f6' : '#ef5350';
      mCtx.beginPath();
      mCtx.arc(mx, my, 3, 0, Math.PI * 2);
      mCtx.fill();
    });
  }

  // ==================== 18. MAIN GAME LOOP & REAL FPS COUNTER ====================
  let lastFrameTime = performance.now();
  let fpsFrames = 0;
  let fpsTimer = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);

    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;

    // Real-time FPS Counter
    fpsFrames++;
    if (now - fpsTimer >= 500) {
      const currentFps = Math.min(state.targetFPS, Math.round((fpsFrames * 1000) / (now - fpsTimer)));
      document.getElementById('hud-fps-counter').textContent = `${currentFps} FPS`;
      document.getElementById('lobby-fps-badge').textContent = `FPS: ${currentFps}`;
      fpsFrames = 0;
      fpsTimer = now;
    }

    const elapsed = now * 0.001;

    if (!state.inMatch) {
      // Lobby Camera & Character Breathing Animation
      camera.position.set(0, 1.35, 2.85);
      camera.lookAt(0, 1.05, 0);
      if (lobbyCharacter) {
        lobbyCharacter.rotation.y = Math.sin(elapsed * 0.55) * 0.35;
        animateArticulatedCharacter(lobbyCharacter, elapsed, 0, false);
      }
      renderer.render(scene, camera);
      return;
    }

    // ---- IN-MATCH PLAYER MOVEMENT ----
    let kx = state.moveInput.x;
    let ky = state.moveInput.y;
    if (state.keys['KeyW'] || state.keys['ArrowUp']) ky = -1;
    if (state.keys['KeyS'] || state.keys['ArrowDown']) ky = 1;
    if (state.keys['KeyA'] || state.keys['ArrowLeft']) kx = -1;
    if (state.keys['KeyD'] || state.keys['ArrowRight']) kx = 1;

    const speed = state.isCrouching ? 4.8 : 8.2;
    const forward = new THREE.Vector3(-Math.sin(state.yaw), 0, -Math.cos(state.yaw));
    const right = new THREE.Vector3(Math.cos(state.yaw), 0, -Math.sin(state.yaw));

    const moveStep = new THREE.Vector3()
