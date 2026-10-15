/**
 * PART 2: 3D COMBAT ENGINE (TPS / FPS), WAREHOUSE & CLASSIC GRASS MAPS,
 * REALISTIC WEAPON AUDIO, GRENADES, AI BOTS (4v4 TDM), AND P2P MULTIPLAYER SYNC
 * Developer: @qs_66
 */

(() => {
  'use strict';

  // ==================== 1. REALISTIC MULTI-LAYER WEBAUDIO SYNTHESIZER ====================
  class CombatAudio {
    constructor() {
      this.ctx = null;
      this.noiseBuf = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();

        const sr = this.ctx.sampleRate;
        this.noiseBuf = this.ctx.createBuffer(1, sr * 1.2, sr);
        const data = this.noiseBuf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sr * 0.22));
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playGunshot(cat = 'AR', dist = 0) {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const vol = Math.max(0.08, 1 - dist / 120);
      const pitchMap = { AR: 1.0, SMG: 1.28, SR: 0.55, HVY: 0.78 };
      const pitch = pitchMap[cat] || 1.0;

      // 1. Low-end explosion punch
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(150 * pitch, now);
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.13);
      subGain.gain.setValueAtTime(0.95 * vol, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      sub.connect(subGain).connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.14);

      // 2. Supersonic crack & gunpowder blast
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1250 * pitch, now);
      filter.Q.value = 0.7;

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(1.1 * vol, now);
      nGain.gain.exponentialRampToValueAtTime(0.008, now + 0.28);
      noise.connect(filter).connect(nGain).connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.30);

      // 3. Mechanical metallic bolt snap
      const bolt = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bolt.type = 'square';
      bolt.frequency.setValueAtTime(2200 * pitch, now + 0.02);
      bolt.frequency.exponentialRampToValueAtTime(580, now + 0.065);
      bGain.gain.setValueAtTime(0.16 * vol, now + 0.02);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      bolt.connect(bGain).connect(this.ctx.destination);
      bolt.start(now + 0.02);
      bolt.stop(now + 0.075);
    }

    playExplosion(dist = 0) {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const vol = Math.max(0.15, 1 - dist / 140);

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuf;
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(480, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(1.4 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.95);

      noise.connect(lowpass).connect(gain).connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 1.0);
    }

    playReload() {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [0.05, 0.55, 1.15].forEach((t, i) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400 + i * 180, now + t);
        g.gain.setValueAtTime(0.18, now + t);
        g.gain.exponentialRampToValueAtTime(0.001, now + t + 0.08);
        osc.connect(g).connect(this.ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + 0.09);
      });
    }

    playHit(isHead = false) {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHead ? 2100 : 1250, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.065);
      g.gain.setValueAtTime(0.35, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(g).connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    }
  }

  const sfx = new CombatAudio();

  // ==================== 2. PROCEDURAL HD TEXTURE GENERATOR ====================
  function makeProceduralTexture(type) {
    const cvs = document.createElement('canvas');
    cvs.width = 256;
    cvs.height = 256;
    const ctx = cvs.getContext('2d');

    if (type === 'container_red' || type === 'container_blue' || type === 'container_green') {
      const baseMap = {
        container_red: '#7c2522',
        container_blue: '#1e446b',
        container_green: '#2b5434'
      };
      ctx.fillStyle = baseMap[type];
      ctx.fillRect(0, 0, 256, 256);

      // Corrugated steel vertical ribs
      for (let x = 0; x < 256; x += 16) {
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(x, 0, 6, 256);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x + 6, 0, 4, 256);
      }
      // Weathering & rust patches
      for (let i = 0; i < 120; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(65,30,15,0.25)' : 'rgba(0,0,0,0.18)';
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 4 + Math.random() * 14, 4 + Math.random() * 14);
      }
    } else if (type === 'crate_wood') {
      ctx.fillStyle = '#735334';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#3d2914';
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 248, 248);
      for (let y = 32; y < 256; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
    } else {
      // Concrete / Ground grit
      ctx.fillStyle = '#474a4f';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 900; i++) {
        const v = 50 + Math.floor(Math.random() * 45);
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
      }
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // Floating Healthbar & Nameplate Sprite Builder for Bots/Enemies
  function createNameplateSprite(name, isEnemy) {
    const cvs = document.createElement('canvas');
    cvs.width = 256;
    cvs.height = 64;
    const ctx = cvs.getContext('2d');

    const tex = new THREE.CanvasTexture(cvs);
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1.4, 0.35, 1);
    sprite.position.set(0, 2.05, 0);

    sprite.userData.updatePlate = (hp) => {
      ctx.clearRect(0, 0, 256, 64);
      ctx.font = 'bold 20px Segoe UI, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(name, 128, 24);

      // Background Bar
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(28, 34, 200, 14);

      // HP Fill
      ctx.fillStyle = isEnemy ? '#d93829' : '#29b6f6';
      ctx.fillRect(30, 36, Math.max(0, (hp / 100) * 196), 10);
      tex.needsUpdate = true;
    };

    sprite.userData.updatePlate(100);
    return sprite;
  }

  // ==================== 3. COMBAT STATE & ENTITIES ====================
  let appCfg = null;
  let threeCtx = null;
  let combatWorldGroup = null;
  let playerMesh = null;
  let muzzleFlashLight = null;

  const match = {
    initialized: false,
    lastTime: 0,
    fpsFrames: 0,
    fpsClock: 0,
    currentFps: 60,
    timeLeft: 480, // 8:00 minutes
    lastTimerTick: 0,

    // Player Physics & Stance
    pos: new THREE.Vector3(0, 0, 28),
    vel: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    stance: 'stand', // 'stand' | 'crouch' | 'prone'
    isGrounded: true,
    isScoped: false,
    isFiring: false,
    isReloading: false,
    lastShotTime: 0,

    // Weapon Loadout State
    slot: 0,
    weapons: [],
    mag: 30,
    reserve: 180,
    hp: 100,
    scoreBlue: 0,
    scoreRed: 0,

    // Controls
    joyVec: { x: 0, y: 0 },
    keys: {},

    // World Objects
    colliders: [],
    actors: [],
    particles: [],
    grenades: [],
    remotePeers: new Map()
  };

  // ==================== 4. MAP BUILDERS (WAREHOUSE & CLASSIC GRASS) ====================
  function clearCombatWorld() {
    if (!combatWorldGroup) return;
    while (combatWorldGroup.children.length) {
      combatWorldGroup.remove(combatWorldGroup.children[0]);
    }
    match.colliders = [];
    match.actors = [];
    match.particles = [];
    match.grenades = [];
  }

  function addSolidBox(w, h, d, x, y, z, material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    combatWorldGroup.add(mesh);
    match.colliders.push(new THREE.Box3().setFromObject(mesh));
    return mesh;
  }

  function buildWarehouseArena() {
    const { scene } = threeCtx;
    scene.background = new THREE.Color(0x7c8d9e);
    scene.fog = new THREE.FogExp2(0x7c8d9e, 0.008);

    const texConcrete = makeProceduralTexture('concrete');
    texConcrete.repeat.set(16, 20);
    const matFloor = new THREE.MeshStandardMaterial({ map: texConcrete, roughness: 0.88 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(76, 96), matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    combatWorldGroup.add(floor);

    // Warehouse Outer Walls & Roof Trusses (Like Screenshot 1 & 4)
    const matWall = new THREE.MeshStandardMaterial({ color: 0x4c525a, roughness: 0.78 });
    addSolidBox(76, 11, 2, 0, 5.5, -46, matWall);
    addSolidBox(76, 11, 2, 0, 5.5, 46, matWall);
    addSolidBox(2, 11, 92, -37, 5.5, 0, matWall);
    addSolidBox(2, 11, 92, 37, 5.5, 0, matWall);

    // Overhead Steel Roof Beams casting skylight shadows
    const matBeam = new THREE.MeshStandardMaterial({ color: 0x26292e, metalness: 0.6, roughness: 0.4 });
    for (let z = -36; z <= 36; z += 12) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(74, 0.6, 1.2), matBeam);
      beam.position.set(0, 10.8, z);
      beam.castShadow = true;
      combatWorldGroup.add(beam);
    }

    // Shipping Containers (Red, Blue, Green) + Wooden Crates + Concrete Barriers
    const matRed = new THREE.MeshStandardMaterial({ map: makeProceduralTexture('container_red'), roughness: 0.6, metalness: 0.3 });
    const matBlue = new THREE.MeshStandardMaterial({ map: makeProceduralTexture('container_blue'), roughness: 0.6, metalness: 0.3 });
    const matGreen = new THREE.MeshStandardMaterial({ map: makeProceduralTexture('container_green'), roughness: 0.6, metalness: 0.3 });
    const matWood = new THREE.MeshStandardMaterial({ map: makeProceduralTexture('crate_wood'), roughness: 0.8 });
    const matBarrier = new THREE.MeshStandardMaterial({ color: 0x6b7075, roughness: 0.85 });

    // Symmetrical Containers
    addSolidBox(4.6, 4.4, 11.5, -14, 2.2, -16, matBlue);
    addSolidBox(4.6, 4.4, 11.5, 14, 2.2, -16, matRed);
    addSolidBox(4.6, 4.4, 11.5, -14, 2.2, 16, matGreen);
    addSolidBox(4.6, 4.4, 11.5, 14, 2.2, 16, matBlue);
    addSolidBox(5.2, 4.4, 9.5, 0, 2.2, 0, matGreen);

    // Stacked Containers on Sides
    addSolidBox(4.6, 4.4, 11.5, -26, 2.2, 0, matRed);
    addSolidBox(4.6, 4.4, 11.5, 26, 2.2, 0, matGreen);

    // Concrete Cover Barriers
    addSolidBox(4.4, 1.35, 0.7, -6.5, 0.67, -8.5, matBarrier);
    addSolidBox(4.4, 1.35, 0.7, 6.5, 0.67, 8.5, matBarrier);
    addSolidBox(4.4, 1.35, 0.7, 6.5, 0.67, -8.5, matBarrier);
    addSolidBox(4.4, 1.35, 0.7, -6.5, 0.67, 8.5, matBarrier);

    // Wooden Tactical Crates
    const crateCoords = [
      [-9, 1.0, 22], [9, 1.0, 22], [-9, 1.0, -22], [9, 1.0, -22],
      [-18, 1.0, 6], [18, 1.0, -6], [-4, 1.0, 14], [4, 1.0, -14]
    ];
    crateCoords.forEach(([x, y, z]) => addSolidBox(2.0, 2.0, 2.0, x, y, z, matWood));

    // Wild Grass patches along the ground (matching Screenshot 1)
    spawnInstancedGrass(1400, 68, 84);
  }

  function buildClassicGrasslandArena() {
    const { scene } = threeCtx;
    scene.background = new THREE.Color(0x87a7c0);
    scene.fog = new THREE.FogExp2(0x87a7c0, 0.0055);

    const matGround = new THREE.MeshStandardMaterial({ color: 0x3b522b, roughness: 0.94 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), matGround);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    combatWorldGroup.add(ground);

    // 4,500 3D Grass Blades
    spawnInstancedGrass(4500, 145, 145);

    // Military Outpost Warehouses & Watchtowers
    const matBldg = new THREE.MeshStandardMaterial({ color: 0x555b60, roughness: 0.8 });
    const matWood = new THREE.MeshStandardMaterial({ map: makeProceduralTexture('crate_wood'), roughness: 0.8 });
    const matBarrier = new THREE.MeshStandardMaterial({ color: 0x6c7075, roughness: 0.85 });

    addSolidBox(14, 5.5, 9, -22, 2.75, -14, matBldg);
    addSolidBox(14, 5.5, 9, 22, 2.75, 14, matBldg);

    // Concrete Bunkers & Crates in Center
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      addSolidBox(3.8, 1.4, 0.8, i * 6, 0.7, (i % 2 === 0 ? 7 : -7), matBarrier);
      addSolidBox(2.1, 2.1, 2.1, i * 7, 1.05, (i % 2 === 0 ? -12 : 12), matWood);
    }

    // Trees & Rocks around the field
    const matTrunk = new THREE.MeshStandardMaterial({ color: 0x4b3621, roughness: 0.9 });
    const matLeaves = new THREE.MeshStandardMaterial({ color: 0x28471e, roughness: 0.85 });
    for (let i = 0; i < 22; i++) {
      const tx = Math.sin(i * 1.9) * 44;
      const tz = Math.cos(i * 2.4) * 44;
      if (Math.abs(tx) < 8 && Math.abs(tz) < 8) continue;
      addSolidBox(0.8, 4.0, 0.8, tx, 2.0, tz, matTrunk);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(2.8, 5.5, 10), matLeaves);
      crown.position.set(tx, 5.5, tz);
      crown.castShadow = true;
      combatWorldGroup.add(crown);
    }
  }

  function spawnInstancedGrass(count, rangeX, rangeZ) {
    const bladeGeo = new THREE.ConeGeometry(0.07, 0.58, 4);
    bladeGeo.translate(0, 0.29, 0);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x4b6e32, roughness: 0.82 });
    const inst = new THREE.InstancedMesh(bladeGeo, bladeMat, count);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      dummy.position.set((Math.random() - 0.5) * rangeX, 0, (Math.random() - 0.5) * rangeZ);
      dummy.rotation.y = Math.random() * Math.PI;
      const s = 0.65 + Math.random() * 0.85;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    combatWorldGroup.add(inst);
  }

  // ==================== 5. SOLDIER ANIMATION & HITBOX TAGGER ====================
  function tagHeadHitboxes(soldierModel) {
    const pelvis = soldierModel.userData.pelvis;
    const torso = soldierModel.userData.torso;
    if (!pelvis || !torso) return;

    const hipL = pelvis.children[1];
    const hipR = pelvis.children[2];
    const neck = torso.children[3];
    const armL = torso.children[4];
    const armR = torso.children[5];

    if (neck) {
      neck.traverse((child) => {
        if (child.isMesh) child.userData.isHead = true;
      });
    }

    soldierModel.userData.rig = { pelvis, torso, hipL, hipR, armL, armR };
  }

  function animateSoldierRig(soldierModel, t, moveSpeed, stance = 'stand') {
    const rig = soldierModel.userData.rig;
    if (!rig) return;

    if (stance === 'prone') {
      rig.pelvis.position.y = 0.28;
      rig.pelvis.rotation.x = -Math.PI / 2.1;
      rig.hipL.rotation.x = 0.15;
      rig.hipR.rotation.x = -0.15;
      return;
    }

    rig.pelvis.rotation.x = 0;
    const baseHeight = stance === 'crouch' ? 0.62 : 0.92;
    rig.pelvis.position.y = baseHeight + Math.abs(Math.sin(t * 9)) * 0.03 * moveSpeed;

    if (moveSpeed > 0.08) {
      const cyc = t * 10.5;
      rig.hipL.rotation.x = Math.sin(cyc) * 0.62 * moveSpeed;
      rig.hipR.rotation.x = Math.sin(cyc + Math.PI) * 0.62 * moveSpeed;
      rig.torso.rotation.y = Math.sin(cyc) * 0.07 * moveSpeed;
    } else {
      const crouchLeg = stance === 'crouch' ? -0.45 : 0;
      rig.hipL.rotation.x = crouchLeg;
      rig.hipR.rotation.x = crouchLeg;
      rig.torso.rotation.y = 0;
    }
  }

  // ==================== 6. SPAWN PLAYER & 4v4 AI BOTS ====================
  function spawnCombatActors() {
    // 1. Local Player 3D Soldier Model (Visible in TPS Over-Shoulder View)
    playerMesh = threeCtx.createSoldierModel(appCfg.outfit, match.weapons[match.slot]);
    tagHeadHitboxes(playerMesh);
    combatWorldGroup.add(playerMesh);

    muzzleFlashLight = new THREE.PointLight(0xffaa33, 0, 9);
    combatWorldGroup.add(muzzleFlashLight);

    // 2. AI Bots (3 Blue Allies + 4 Red Enemies) if WITH BOTS is selected
    if (!appCfg.withBots) return;

    const roster = [
      { name: 'Ghost_Unit', team: 'blue', outfit: 'specops', x: -8, z: 28 },
      { name: 'Tactical_03', team: 'blue', outfit: 'desert', x: 8, z: 28 },
      { name: 'Sniper_IQ', team: 'blue', outfit: 'ghillie', x: -14, z: 25 },
      { name: 'عدو_1', team: 'red', outfit: 'mercenary', x: -10, z: -28 },
      { name: 'عدو_2', team: 'red', outfit: 'desert', x: 10, z: -28 },
      { name: 'عدو_3', team: 'red', outfit: 'ghillie', x: 0, z: -25 },
      { name: 'عدو_4', team: 'red', outfit: 'luffy', x: 15, z: -28 }
    ];

    roster.forEach((b) => {
      const mesh = threeCtx.createSoldierModel(b.outfit, match.weapons[0]);
      tagHeadHitboxes(mesh);
      mesh.position.set(b.x, 0, b.z);
      mesh.rotation.y = b.team === 'blue' ? Math.PI : 0;

      const plate = createNameplateSprite(b.name, b.team === 'red');
      mesh.add(plate);
      combatWorldGroup.add(mesh);

      match.actors.push({
        isBot: true,
        name: b.name,
        team: b.team,
        mesh,
        plate,
        hp: 100,
        spawn: new THREE.Vector3(b.x, 0, b.z),
        moveDir: new THREE.Vector3(0, 0, b.team === 'blue' ? -1 : 1),
        nextTurn: 0,
        lastFire: 0
      });
    });
  }

  function collidesWithWorld(pos, radius = 0.55) {
    const box = new THREE.Box3(
      new THREE.Vector3(pos.x - radius, 0.1, pos.z - radius),
      new THREE.Vector3(pos.x + radius, 1.8, pos.z + radius)
    );
    for (let i = 0; i < match.colliders.length; i++) {
      if (box.intersectsBox(match.colliders[i])) return true;
    }
    return false;
  }

  // ==================== 7. SHOOTING, SPARKS, TRACERS & GRENADES ====================
  const raycaster = new THREE.Raycaster();

  function spawnImpactSparks(point, colorHex = 0xffbb33, count = 8) {
    const geo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geo, mat);
      p.position.copy(point);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        1.5 + Math.random() * 4,
        (Math.random() - 0.5) * 6
      );
      combatWorldGroup.add(p);
      match.particles.push({ mesh: p, vel, life: 0.32 });
    }
  }

  function spawnBulletTracer(startPos, endPos) {
    const mat = new THREE.LineBasicMaterial({ color: 0xffe082, transparent: true, opacity: 0.85 });
    const geo = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
    const line = new THREE.Line(geo, mat);
    combatWorldGroup.add(line);
    match.particles.push({ mesh: line, vel: null, life: 0.06 });
  }

  function executeShot() {
    if (!appCfg.inMatch || match.isReloading) return;
    const wpn = match.weapons[match.slot];
    const now = performance.now() * 0.001;
    const fireInterval = Math.max(0.055, (115 - wpn.rate) * 0.0022);
    if (now - match.lastShotTime < fireInterval) return;

    if (match.mag <= 0) {
      reloadWeapon();
      return;
    }

    match.lastShotTime = now;
    match.mag--;
    updateWeaponHUD();

    // Gunshot Audio & Muzzle Flash
    sfx.playGunshot(wpn.cat, 0);
    const muzzlePos = match.pos.clone().add(new THREE.Vector3(0, 1.35, 0));
    muzzleFlashLight.position.copy(muzzlePos);
    muzzleFlashLight.intensity = 5.0;
    setTimeout(() => { if (muzzleFlashLight) muzzleFlashLight.intensity = 0; }, 45);

    // Camera Recoil Kick
    const recoilStep = (105 - wpn.recoil) * 0.00035;
    match.pitch = Math.min(1.2, match.pitch + recoilStep);
    match.yaw += (Math.random() - 0.5) * recoilStep * 0.7;

    // Raycast from Center Crosshair
    raycaster.setFromCamera(new THREE.Vector2(0, 0), threeCtx.camera);

    const enemyMeshes = [];
    match.actors.forEach((a) => {
      if (a.team === 'red') enemyMeshes.push(a.mesh);
    });

    const actorHits = raycaster.intersectObjects(enemyMeshes, true);
    if (actorHits.length > 0) {
      const hit = actorHits[0];
      const isHead = Boolean(hit.object.userData && hit.object.userData.isHead);
      const dmg = isHead ? wpn.dmg * 2.2 : wpn.dmg;

      spawnBulletTracer(muzzlePos, hit.point);
      spawnImpactSparks(hit.point, 0xd92626, 10);
      sfx.playHit(isHead);

      let victim = null;
      for (const a of match.actors) {
        let p = hit.object;
        while (p) {
          if (p === a.mesh) { victim = a; break; }
          p = p.parent;
        }
        if (victim) break;
      }

      if (victim) {
        victim.hp -= dmg;
        victim.plate.userData.updatePlate(victim.hp);
        if (victim.hp <= 0) {
          match.scoreBlue++;
          document.getElementById('hud-score-blue').textContent = match.scoreBlue;
          addKillFeedItem(`${appCfg.playerName} 🔫 ${victim.name}${isHead ? ' [HEADSHOT]' : ''}`);
          respawnBot(victim);
        }
      }
      return;
    }

    // Check Environment Impact Sparks
    const worldHits = raycaster.intersectObjects(combatWorldGroup.children, false);
    if (worldHits.length > 0) {
      spawnBulletTracer(muzzlePos, worldHits[0].point);
      spawnImpactSparks(worldHits[0].point, 0xffcc44, 6);
    }
  }

  function throwFragGrenade() {
    if (!appCfg.inMatch) return;
    const grenMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x2d3a24, metalness: 0.5, roughness: 0.4 })
    );
    const startPos = match.pos.clone().add(new THREE.Vector3(0, 1.5, 0));
    grenMesh.position.copy(startPos);
    combatWorldGroup.add(grenMesh);

    const forward = new THREE.Vector3(-Math.sin(match.yaw), 0.45 + match.pitch * 0.5, -Math.cos(match.yaw)).normalize();
    match.grenades.push({
      mesh: grenMesh,
      vel: forward.multiplyScalar(17),
      timer: 2.2
    });
  }

  function reloadWeapon() {
    if (match.isReloading || match.reserve <= 0) return;
    const wpn = match.weapons[match.slot];
    if (match.mag >= wpn.mag) return;

    match.isReloading = true;
    sfx.playReload();
    document.getElementById('hud-wpn-ammo').textContent = 'RELOADING...';

    setTimeout(() => {
      const needed = wpn.mag - match.mag;
      const take = Math.min(needed, match.reserve);
      match.mag += take;
      match.reserve -= take;
      match.isReloading = false;
      updateWeaponHUD();
    }, 2000);
  }

  function updateWeaponHUD() {
    const wpn = match.weapons[match.slot];
    document.getElementById('hud-wpn-name').textContent = wpn.name;
    document.getElementById('hud-wpn-ammo').textContent = `${match.mag} / ${match.reserve}`;
  }

  function addKillFeedItem(msg) {
    const box = document.getElementById('hud-killfeed');
    if (!box) return;
    box.style.position = 'absolute';
    box.style.top = '135px';
    box.style.right = '14px';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.gap = '4px';

    const row = document.createElement('div');
    row.style.background = 'rgba(8,10,14,0.82)';
    row.style.borderRight = '3px solid #d4a84f';
    row.style.padding = '4px 10px';
    row.style.fontSize = '11px';
    row.style.fontWeight = '800';
    row.textContent = msg;
    box.prepend(row);
    setTimeout(() => row.remove(), 3500);
  }

  function respawnBot(bot) {
    bot.hp = 100;
    bot.plate.userData.updatePlate(100);
    bot.mesh.position.copy(bot.spawn);
    bot.mesh.position.x += (Math.random() - 0.5) * 9;
  }

  // ==================== 8. TOUCH & KEYBOARD CONTROLS SETUP ====================
  function initCombatControls() {
    if (match.initialized) return;
    match.initialized = true;

    const touchLeft = document.getElementById('hud-touch-left');
    const touchRight = document.getElementById('hud-touch-right');
    const joyKnob = document.getElementById('joy-knob');
    const layoutBanner = document.getElementById('layout-editor-banner');

    const isEditingHUD = () => !layoutBanner.classList.contains('hidden');

    let joyTouchId = null;
    let joyStart = { x: 0, y: 0 };
    let lookTouchId = null;
    let lastLook = { x: 0, y: 0 };

    touchLeft.addEventListener('touchstart', (e) => {
      if (isEditingHUD()) return;
      for (const t of e.changedTouches) {
        if (joyTouchId === null) {
          joyTouchId = t.identifier;
          joyStart = { x: t.clientX, y: t.clientY };
        }
      }
    }, { passive: true });

    touchRight.addEventListener('touchstart', (e) => {
      if (isEditingHUD()) return;
      for (const t of e.changedTouches) {
        if (lookTouchId === null) {
          lookTouchId = t.identifier;
          lastLook = { x: t.clientX, y: t.clientY };
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isEditingHUD()) return;
      for (const t of e.changedTouches) {
        if (t.identifier === joyTouchId) {
          const dx = t.clientX - joyStart.x;
          const dy = t.clientY - joyStart.y;
          const maxR = 45;
          const dist = Math.min(maxR, Math.hypot(dx, dy));
          const ang = Math.atan2(dy, dx);
          const kx = Math.cos(ang) * dist;
          const ky = Math.sin(ang) * dist;
          joyKnob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
          match.joyVec.x = kx / maxR;
          match.joyVec.y = ky / maxR;
        } else if (t.identifier === lookTouchId) {
          const dx = t.clientX - lastLook.x;
          const dy = t.clientY - lastLook.y;
          lastLook = { x: t.clientX, y: t.clientY };
          const sensScale = match.isScoped ? (appCfg.sensScope / 100) : (appCfg.sensCam / 100);
          match.yaw -= dx * 0.0045 * sensScale;
          match.pitch = Math.max(-0.95, Math.min(0.95, match.pitch - dy * 0.0045 * sensScale));
        }
      }
    }, { passive: true });

    const clearTouches = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === joyTouchId) {
          joyTouchId = null;
          match.joyVec.x = 0;
          match.joyVec.y = 0;
          joyKnob.style.transform = 'translate(-50%, -50%)';
        }
        if (t.identifier === lookTouchId) {
          lookTouchId = null;
        }
      }
    };
    window.addEventListener('touchend', clearTouches);
    window.addEventListener('touchcancel', clearTouches);

    // Circular HUD Action Buttons
    const bindBtn = (id, downFn, upFn) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        if (isEditingHUD()) return;
        e.preventDefault();
        downFn();
      }, { passive: false });
      el.addEventListener('touchend', (e) => {
        if (isEditingHUD() || !upFn) return;
        e.preventDefault();
        upFn();
      }, { passive: false });
      el.addEventListener('mousedown', () => { if (!isEditingHUD()) downFn(); });
      window.addEventListener('mouseup', () => { if (!isEditingHUD() && upFn) upFn(); });
    };

    bindBtn('btn-act-fire-right', () => { match.isFiring = true; }, () => { match.isFiring = false; });
    bindBtn('btn-act-fire-left', () => { match.isFiring = true; }, () => { match.isFiring = false; });
    bindBtn('btn-act-reload', () => reloadWeapon());
    bindBtn('btn-act-grenade', () => throwFragGrenade());

    bindBtn('btn-act-scope', () => {
      match.isScoped = !match.isScoped;
      threeCtx.camera.fov = match.isScoped ? 30 : 58;
      threeCtx.camera.updateProjectionMatrix();
    });

    bindBtn('btn-act-jump', () => {
      if (match.isGrounded) {
        match.stance = 'stand';
        match.vel.y = 7.4;
        match.isGrounded = false;
      }
    });

    bindBtn('btn-act-crouch', () => {
      match.stance = match.stance === 'crouch' ? 'stand' : 'crouch';
    });

    bindBtn('btn-act-prone', () => {
      match.stance = match.stance === 'prone' ? 'stand' : 'prone';
    });

    // Camera Mode Toggle (TPS Over-Shoulder <-> FPS)
    document.getElementById('btn-hud-camera').onclick = () => {
      appCfg.cameraMode = appCfg.cameraMode === 'TPS' ? 'FPS' : 'TPS';
    };

    // Weapon Swap Card on Bottom Bar
    document.getElementById('btn-hud-swap-weapon').onclick = () => {
      match.slot = match.slot === 0 ? 1 : 0;
      const wpn = match.weapons[match.slot];
      match.mag = wpn.mag;
      match.reserve = wpn.reserve;
      updateWeaponHUD();
    };

    // PC Keyboard & Mouse Support
    window.addEventListener('keydown', (e) => {
      match.keys[e.code] = true;
      if (e.code === 'KeyR') reloadWeapon();
      if (e.code === 'KeyG') throwFragGrenade();
      if (e.code === 'KeyC') match.stance = match.stance === 'crouch' ? 'stand' : 'crouch';
      if (e.code === 'KeyZ') match.stance = match.stance === 'prone' ? 'stand' : 'prone';
      if (e.code === 'KeyV') appCfg.cameraMode = appCfg.cameraMode === 'TPS' ? 'FPS' : 'TPS';
      if (e.code === 'Space' && match.isGrounded) {
        match.stance = 'stand';
        match.vel.y = 7.4;
        match.isGrounded = false;
      }
    });
    window.addEventListener('keyup', (e) => { match.keys[e.code] = false; });
  }

  // ==================== 9. RADAR MINIMAP RENDERER ====================
  const radarCvs = document.getElementById('radar-canvas');
  const rCtx = radarCvs ? radarCvs.getContext('2d') : null;

  function renderRadar() {
    if (!rCtx) return;
    rCtx.fillStyle = '#141c24';
    rCtx.fillRect(0, 0, 110, 110);

    // Grid & View Cone
    rCtx.strokeStyle = 'rgba(255,255,255,0.12)';
    rCtx.beginPath();
    rCtx.arc(55, 55, 42, 0, Math.PI * 2);
    rCtx.stroke();

    rCtx.fillStyle = 'rgba(255,255,255,0.12)';
    rCtx.beginPath();
    rCtx.moveTo(55, 55);
    rCtx.arc(55, 55, 46, -Math.PI / 2 - 0.45, -Math.PI / 2 + 0.45);
    rCtx.closePath();
    rCtx.fill();

    // Allies & Enemies Dots
    match.actors.forEach((a) => {
      const dx = (a.mesh.position.x - match.pos.x) * 1.15;
      const dz = (a.mesh.position.z - match.pos.z) * 1.15;
      const rx = Math.max(8, Math.min(102, 55 + dx));
      const ry = Math.max(8, Math.min(102, 55 + dz));
      rCtx.fillStyle = a.team === 'blue' ? '#29b6f6' : '#ef5350';
      rCtx.beginPath();
      rCtx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      rCtx.fill();
    });

    // Player Arrow Center
    rCtx.fillStyle = '#f5b82e';
    rCtx.beginPath();
    rCtx.arc(55, 55, 4, 0, Math.PI * 2);
    rCtx.fill();
  }

  // ==================== 10. START & UPDATE ENGINE HOOKS ====================
  window.startCombatEngine = (config, ctx) => {
    appCfg = config;
    threeCtx = ctx;
    sfx.init();

    if (!combatWorldGroup) {
      combatWorldGroup = new THREE.Group();
      threeCtx.scene.add(combatWorldGroup);
    }

    threeCtx.lobbyWorldGroup.visible = false;
    combatWorldGroup.visible = true;
    clearCombatWorld();

    match.weapons = [config.selectedWeapon, config.secondaryWeapon];
    match.slot = 0;
    match.mag = match.weapons[0].mag;
    match.reserve = match.weapons[0].reserve;
    match.hp = 100;
    match.scoreBlue = 0;
    match.scoreRed = 0;
    match.pos.set(0, 0, 28);
    match.yaw = 0;
    match.pitch = 0;
    match.stance = 'stand';
    match.isScoped = false;

    document.getElementById('hud-score-blue').textContent = '0';
    document.getElementById('hud-score-red').textContent = '0';
    document.getElementById('hud-hp-num').textContent = '100';
    document.getElementById('hud-hp-fill').style.width = '100%';
    updateWeaponHUD();

    if (config.mapMode === 'warehouse') {
      buildWarehouseArena();
    } else {
      buildClassicGrasslandArena();
    }

    spawnCombatActors();
    initCombatControls();
    match.lastTime = performance.now() * 0.001;
  };

  window.updateCombatEngine = (nowSec) => {
    if (!appCfg || !appCfg.inMatch || !combatWorldGroup) return;
    combatWorldGroup.visible = true;

    const dt = Math.min(0.05, Math.max(0.001, nowSec - match.lastTime));
    match.lastTime = nowSec;

    // Telemetry FPS & Timer
    match.fpsFrames++;
    if (nowSec - match.fpsClock >= 0.5) {
      match.currentFps = Math.min(appCfg.targetFps, Math.round(match.fpsFrames / (nowSec - match.fpsClock)));
      document.getElementById('hud-telemetry').textContent = `FPS: ${match.currentFps} | PING: 22ms | @qs_66`;
      match.fpsFrames = 0;
      match.fpsClock = nowSec;
    }

    if (nowSec - match.lastTimerTick >= 1.0) {
      match.lastTimerTick = nowSec;
      match.timeLeft = Math.max(0, match.timeLeft - 1);
      const mins = String(Math.floor(match.timeLeft / 60)).padStart(2, '0');
      const secs = String(match.timeLeft % 60).padStart(2, '0');
      document.getElementById('hud-timer').textContent = `${mins}:${secs}`;
    }

    // 1. Player Movement Input
    let mx = match.joyVec.x;
    let my = match.joyVec.y;
    if (match.keys['KeyW'] || match.keys['ArrowUp']) my = -1;
    if (match.keys['KeyS'] || match.keys['ArrowDown']) my = 1;
    if (match.keys['KeyA'] || match.keys['ArrowLeft']) mx = -1;
    if (match.keys['KeyD'] || match.keys['ArrowRight']) mx = 1;

    const stanceSpeed = match.stance === 'prone' ? 2.6 : match.stance === 'crouch' ? 4.8 : 8.2;
    const joyScale = appCfg.sensJoy / 90;
    const speed = stanceSpeed * joyScale;

    const fwd = new THREE.Vector3(-Math.sin(match.yaw), 0, -Math.cos(match.yaw));
    const right = new THREE.Vector3(Math.cos(match.yaw), 0, -Math.sin(match.yaw));

    const moveDelta = new THREE.Vector3()
      .addScaledVector(right, mx * speed * dt)
      .addScaledVector(fwd, -my * speed * dt);

    const candX = match.pos.clone().add(new THREE.Vector3(moveDelta.x, 0, 0));
    if (!collidesWithWorld(candX)) match.pos.x = candX.x;

    const candZ = match.pos.clone().add(new THREE.Vector3(0, 0, moveDelta.z));
    if (!collidesWithWorld(candZ)) match.pos.z = candZ.z;

    // Gravity & Jump
    if (!match.isGrounded) {
      match.vel.y -= 19.5 * dt;
      match.pos.y += match.vel.y * dt;
      if (match.pos.y <= 0) {
        match.pos.y = 0;
        match.vel.y = 0;
        match.isGrounded = true;
      }
    }

    // 2. Update 3D Player Character Mesh & TPS / FPS Camera
    const moveMag = Math.min(1, Math.hypot(mx, my));
    if (playerMesh) {
      playerMesh.position.copy(match.pos);
      playerMesh.rotation.y = match.yaw + Math.PI;
      playerMesh.visible = appCfg.cameraMode === 'TPS' && !match.isScoped;
      animateSoldierRig(playerMesh, nowSec, moveMag, match.stance);
    }

    const eyeH = match.stance === 'prone' ? 0.45 : match.stance === 'crouch' ? 1.15 : 1.62;
    const cam = threeCtx.camera;
    cam.rotation.order = 'YXZ';

    if (appCfg.cameraMode === 'TPS' && !match.isScoped) {
      // Over-the-right-shoulder TPS Camera (Exact match to Screenshot 1 & 4)
      const backDist = 2.45;
      const shoulderRight = 0.52;
      const camPos = match.pos.clone()
        .add(new THREE.Vector3(0, eyeH + 0.22, 0))
        .addScaledVector(fwd, -backDist)
        .addScaledVector(right, shoulderRight);

      cam.position.copy(camPos);
      cam.rotation.y = match.yaw;
      cam.rotation.x = match.pitch;
    } else {
      // First-Person / Scope Camera
      cam.position.set(match.pos.x, match.pos.y + eyeH, match.pos.z);
      cam.rotation.y = match.yaw;
      cam.rotation.x = match.pitch;
    }

    if (match.isFiring) {
      executeShot();
    }

    // 3. Update Active Grenades & Explosions
    for (let i = match.grenades.length - 1; i >= 0; i--) {
      const g = match.grenades[i];
      g.timer -= dt;
      g.vel.y -= 16 * dt;
      g.mesh.position.addScaledVector(g.vel, dt);
      if (g.mesh.position.y < 0.12) {
        g.mesh.position.y = 0.12;
        g.vel.y *= -0.45;
        g.vel.x *= 0.7;
        g.vel.z *= 0.7;
      }
      if (g.timer <= 0) {
        sfx.playExplosion(match.pos.distanceTo(g.mesh.position));
        spawnImpactSparks(g.mesh.position, 0xff6600, 26);
        match.actors.forEach((a) => {
          if (a.team === 'red' && a.mesh.position.distanceTo(g.mesh.position) < 9.5) {
            a.hp -= 120;
            if (a.hp <= 0) {
              match.scoreBlue++;
              document.getElementById('hud-score-blue').textContent = match.scoreBlue;
              addKillFeedItem(`${appCfg.playerName} 💣 ${a.name}`);
              respawnBot(a);
            }
          }
        });
        combatWorldGroup.remove(g.mesh);
        match.grenades.splice(i, 1);
      }
    }

    // 4. Update Sparks & Tracer Particles
    for (let i = match.particles.length - 1; i >= 0; i--) {
      const p = match.particles[i];
      p.life -= dt;
      if (p.vel) {
        p.vel.y -= 12 * dt;
        p.mesh.position.addScaledVector(p.vel, dt);
      }
      if (p.life <= 0) {
        combatWorldGroup.remove(p.mesh);
        match.particles.splice(i, 1);
      }
    }

    // 5. Update 4v4 Tactical AI Bots
    match.actors.forEach((bot) => {
      if (!bot.isBot) return;

      if (nowSec > bot.nextTurn) {
        bot.nextTurn = nowSec + 1.5 + Math.random() * 1.5;
        const ang = (Math.random() - 0.5) * 1.8 + (bot.team === 'blue' ? Math.PI : 0);
        bot.moveDir.set(Math.sin(ang), 0, Math.cos(ang));
      }

      const step = bot.moveDir.clone().multiplyScalar(4.8 * dt);
      const nextBotPos = bot.mesh.position.clone().add(step);
      if (!collidesWithWorld(nextBotPos, 0.5) && Math.abs(nextBotPos.x) < 33 && Math.abs(nextBotPos.z) < 41) {
        bot.mesh.position.copy(nextBotPos);
      } else {
        bot.moveDir.negate();
      }

      // Acquire closest enemy target
      let targetPos = match.pos;
      if (bot.team === 'blue') {
        const enemy = match.actors.find((e) => e.team === 'red');
        if (enemy) targetPos = enemy.mesh.position;
      }

      const dx = targetPos.x - bot.mesh.position.x;
      const dz = targetPos.z - bot.mesh.position.z;
      bot.mesh.rotation.y = Math.atan2(dx, dz);
      animateSoldierRig(bot.mesh, nowSec, 0.85, 'stand');

      const dist = Math.hypot(dx, dz);
      if (dist < 32 && nowSec - bot.lastFire > 1.25) {
        bot.lastFire = nowSec;
        sfx.playGunshot('AR', dist);

        if (bot.team === 'red' && Math.random() < 0.22) {
          match.hp = Math.max(0, match.hp - 14);
          document.getElementById('hud-hp-num').textContent = match.hp;
          document.getElementById('hud-hp-fill').style.width = `${match.hp}%`;

          if (match.hp <= 0) {
            match.scoreRed++;
            document.getElementById('hud-score-red').textContent = match.scoreRed;
            addKillFeedItem(`${bot.name} 🔫 ${appCfg.playerName}`);
            match.hp = 100;
            document.getElementById('hud-hp-num').textContent = '100';
            document.getElementById('hud-hp-fill').style.width = '100%';
            match.pos.set((Math.random() - 0.5) * 10, 0, 28);
          }
        }
      }
    });

    renderRadar();
    threeCtx.renderer.render(threeCtx.scene, cam);
  };
})();
