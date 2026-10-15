/**
 * PART 1: LOBBY, ARMORY (30 WEAPONS), OUTFITS (INCLUDING LUFFY STRAW HAT),
 * SETTINGS MODAL, P2P ONLINE ID, AND 3D CHARACTER SHOWCASE ENGINE
 * Developer: @qs_66
 */

window.GameApp = (() => {
  'use strict';

  // ==================== 1. 30 WEAPONS ARMORY DATABASE ====================
  const WEAPONS = [
    { id: 'M416', name: 'M416', cat: 'AR', dmg: 41, rate: 82, recoil: 85, mag: 30, reserve: 180 },
    { id: 'AKM', name: 'AKM', cat: 'AR', dmg: 48, rate: 68, recoil: 62, mag: 30, reserve: 180 },
    { id: 'SCAR-L', name: 'SCAR-L', cat: 'AR', dmg: 41, rate: 76, recoil: 86, mag: 30, reserve: 180 },
    { id: 'M762', name: 'Beryl M762', cat: 'AR', dmg: 46, rate: 80, recoil: 60, mag: 30, reserve: 180 },
    { id: 'GROZA', name: 'Groza', cat: 'AR', dmg: 47, rate: 88, recoil: 72, mag: 30, reserve: 180 },
    { id: 'AUG', name: 'AUG A3', cat: 'AR', dmg: 41, rate: 84, recoil: 88, mag: 30, reserve: 180 },
    { id: 'QBZ', name: 'QBZ95', cat: 'AR', dmg: 41, rate: 75, recoil: 84, mag: 30, reserve: 180 },
    { id: 'G36C', name: 'G36C', cat: 'AR', dmg: 41, rate: 80, recoil: 85, mag: 30, reserve: 180 },
    { id: 'FAMAS', name: 'FAMAS', cat: 'AR', dmg: 39, rate: 92, recoil: 70, mag: 25, reserve: 150 },
    { id: 'HONEY', name: 'Honey Badger', cat: 'AR', dmg: 43, rate: 83, recoil: 78, mag: 30, reserve: 180 },

    { id: 'UMP45', name: 'UMP45', cat: 'SMG', dmg: 40, rate: 74, recoil: 90, mag: 25, reserve: 175 },
    { id: 'VECTOR', name: 'Vector', cat: 'SMG', dmg: 31, rate: 96, recoil: 92, mag: 19, reserve: 190 },
    { id: 'UZI', name: 'Micro UZI', cat: 'SMG', dmg: 26, rate: 98, recoil: 88, mag: 25, reserve: 200 },
    { id: 'MP5K', name: 'MP5K', cat: 'SMG', dmg: 33, rate: 86, recoil: 90, mag: 30, reserve: 180 },
    { id: 'TOMMY', name: 'Thompson', cat: 'SMG', dmg: 40, rate: 78, recoil: 82, mag: 50, reserve: 200 },
    { id: 'BIZON', name: 'PP-19 Bizon', cat: 'SMG', dmg: 36, rate: 76, recoil: 91, mag: 53, reserve: 160 },
    { id: 'P90', name: 'P90', cat: 'SMG', dmg: 35, rate: 92, recoil: 93, mag: 50, reserve: 200 },

    { id: 'KAR98K', name: 'Kar98k', cat: 'SR', dmg: 88, rate: 22, recoil: 45, mag: 5, reserve: 45 },
    { id: 'AWM', name: 'AWM', cat: 'SR', dmg: 100, rate: 18, recoil: 40, mag: 5, reserve: 35 },
    { id: 'M24', name: 'M24', cat: 'SR', dmg: 92, rate: 24, recoil: 46, mag: 5, reserve: 45 },
    { id: 'MINI14', name: 'Mini14', cat: 'SR', dmg: 48, rate: 62, recoil: 80, mag: 20, reserve: 140 },
    { id: 'SKS', name: 'SKS', cat: 'SR', dmg: 53, rate: 58, recoil: 68, mag: 10, reserve: 100 },
    { id: 'SLR', name: 'SLR', cat: 'SR', dmg: 58, rate: 52, recoil: 60, mag: 10, reserve: 100 },
    { id: 'MK14', name: 'Mk14 EBR', cat: 'SR', dmg: 61, rate: 64, recoil: 58, mag: 10, reserve: 100 },
    { id: 'AMR', name: 'Lynx AMR', cat: 'SR', dmg: 100, rate: 16, recoil: 38, mag: 5, reserve: 20 },

    { id: 'M249', name: 'M249', cat: 'HVY', dmg: 44, rate: 86, recoil: 64, mag: 100, reserve: 200 },
    { id: 'DP28', name: 'DP-28', cat: 'HVY', dmg: 51, rate: 66, recoil: 74, mag: 47, reserve: 141 },
    { id: 'MG3', name: 'MG3', cat: 'HVY', dmg: 42, rate: 95, recoil: 62, mag: 75, reserve: 150 },
    { id: 'S1897', name: 'Shotgun S1897', cat: 'HVY', dmg: 94, rate: 30, recoil: 42, mag: 5, reserve: 45 },
    { id: 'DEAGLE', name: 'Pistol Deagle', cat: 'HVY', dmg: 62, rate: 48, recoil: 55, mag: 7, reserve: 63 }
  ];

  // ==================== 2. SHARED CONFIGURATION STATE ====================
  const config = {
    playerName: 'QS_OPERATOR',
    mapMode: 'warehouse', // 'warehouse' | 'classic'
    withBots: true,
    outfit: 'specops',    // 'specops' | 'ghillie' | 'luffy' | 'mercenary' | 'desert'
    selectedWeapon: WEAPONS[0],
    secondaryWeapon: WEAPONS[17],
    cameraMode: 'TPS',    // 'TPS' (3rd Person Over-Shoulder like screenshots) | 'FPS'
    btnSize: 100,
    btnOpacity: 75,
    sensCam: 80,
    sensAds: 65,
    sensJoy: 90,
    sensScope: 45,
    gfxQuality: 'balanced',
    targetFps: 60,
    softShadows: true,
    forceLandscape: false,
    myPeerId: 'QS-' + Math.floor(1000 + Math.random() * 9000),
    inMatch: false
  };

  // ==================== 3. THREE.JS 3D LOBBY & CHARACTER ENGINE ====================
  const viewport = document.getElementById('webgl-viewport');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x526574);
  scene.fog = new THREE.FogExp2(0x526574, 0.015);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 250);
  camera.position.set(0, 1.35, 3.25);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  viewport.appendChild(renderer.domElement);

  const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x2b3228, 0.85);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xfff4e0, 1.4);
  dirLight.position.set(12, 24, 14);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(2048, 2048);
  scene.add(dirLight);

  const lobbyWorldGroup = new THREE.Group();
  scene.add(lobbyWorldGroup);

  let lobbySoldier = null;

  // Build Realistic Articulated Soldier (Supports Military Gear + Luffy Straw Hat Outfit)
  function createSoldierModel(outfitName, weaponObj) {
    const palettes = {
      specops:   { shirt: 0x1e2229, pants: 0x16191f, vest: 0x121418, helmet: 0x1b1f24, skin: 0xd9a987 },
      ghillie:   { shirt: 0x3b5323, pants: 0x2e421b, vest: 0x293b18, helmet: 0x3b5323, skin: 0xc89a78 },
      luffy:     { shirt: 0xc92a2a, pants: 0x1d4ed8, vest: 0xc92a2a, helmet: 0xeab308, skin: 0xe3b492 },
      mercenary: { shirt: 0x2b2d38, pants: 0x181920, vest: 0x101116, helmet: 0x181920, skin: 0xd9a987 },
      desert:    { shirt: 0x9c8767, pants: 0x7d6b50, vest: 0x5e4f3a, helmet: 0x6b5b43, skin: 0xd9a987 }
    };
    const pal = palettes[outfitName] || palettes.specops;
    const root = new THREE.Group();

    const matShirt = new THREE.MeshStandardMaterial({ color: pal.shirt, roughness: 0.75 });
    const matPants = new THREE.MeshStandardMaterial({ color: pal.pants, roughness: 0.8 });
    const matVest  = new THREE.MeshStandardMaterial({ color: pal.vest, roughness: 0.55 });
    const matHelm  = new THREE.MeshStandardMaterial({ color: pal.helmet, roughness: 0.4 });
    const matSkin  = new THREE.MeshStandardMaterial({ color: pal.skin, roughness: 0.65 });
    const matDark  = new THREE.MeshStandardMaterial({ color: 0x141619, roughness: 0.4, metalness: 0.5 });

    // Pelvis
    const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.22, 16), matPants);
    pelvis.position.y = 0.92;
    pelvis.castShadow = true;
    root.add(pelvis);

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.19, 0.52, 16), matShirt);
    torso.position.y = 0.35;
    torso.castShadow = true;
    pelvis.add(torso);

    // Tactical Vest & Pouches (or Red Open Vest for Luffy)
    const vest = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.21, 0.42, 16), matVest);
    vest.scale.set(1.04, 1, 0.88);
    torso.add(vest);

    // Tactical Backpack (Shown in TPS view like Screenshot 1 & 4)
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.18), matVest);
    backpack.position.set(0, 0.03, -0.22);
    backpack.castShadow = true;
    torso.add(backpack);

    // Spare Secondary Rifle slung on Back
    const backRifle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.78, 10), matDark);
    backRifle.position.set(-0.18, 0.08, -0.26);
    backRifle.rotation.z = 0.28;
    torso.add(backRifle);

    // Head & Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.11, 12), matSkin);
    neck.position.y = 0.30;
    torso.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.155, 20, 20), matSkin);
    head.position.y = 0.13;
    head.scale.set(0.92, 1.06, 0.95);
    head.castShadow = true;
    neck.add(head);

    if (outfitName === 'luffy') {
      // Anime Straw Hat (Yellow Brim + Crown + Red Ribbon)
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.02, 24), matHelm);
      brim.position.y = 0.08;
      head.add(brim);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.165, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), matHelm);
      crown.position.y = 0.08;
      head.add(crown);
      const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.168, 0.168, 0.035, 18), matShirt);
      ribbon.position.y = 0.10;
      head.add(ribbon);
    } else {
      // Rounded Combat Helmet + Goggles
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.172, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), matHelm);
      helmet.position.y = 0.02;
      head.add(helmet);
      const goggles = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.08), matDark);
      goggles.position.set(0, 0.02, 0.13);
      head.add(goggles);
    }

    // Articulated Arms & Hands holding the Rifle across the chest
    function buildLimbArm(side) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * 0.28, 0.18, 0);
      torso.add(shoulder);

      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.062, 0.28, 12), outfitName === 'luffy' ? matSkin : matShirt);
      upper.position.y = -0.14;
      shoulder.add(upper);

      const elbow = new THREE.Group();
      elbow.position.y = -0.14;
      upper.add(elbow);

      const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.26, 12), matSkin);
      fore.position.y = -0.13;
      elbow.add(fore);

      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), matDark);
      glove.position.y = -0.14;
      fore.add(glove);

      return { shoulder, elbow, glove };
    }

    const armL = buildLimbArm(-1);
    const armR = buildLimbArm(1);
    armR.shoulder.rotation.set(-0.55, -0.35, -0.15);
    armR.elbow.rotation.set(-0.85, 0, 0);
    armL.shoulder.rotation.set(-0.62, 0.48, 0.15);
    armL.elbow.rotation.set(-0.9, 0, 0);

    // Primary Rifle Held in Hands
    const gunGroup = new THREE.Group();
    const gunBody = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.11, 0.68), matDark);
    const gunBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.35, 10), matDark);
    gunBarrel.rotation.x = Math.PI / 2;
    gunBarrel.position.z = -0.42;
    gunGroup.add(gunBody, gunBarrel);
    gunGroup.position.set(-0.12, -0.02, 0.16);
    gunGroup.rotation.y = 0.45;
    armR.glove.add(gunGroup);

    // Articulated Legs with Knee Pads & Combat Boots
    function buildLimbLeg(side) {
      const hip = new THREE.Group();
      hip.position.set(side * 0.115, -0.08, 0);
      pelvis.add(hip);

      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.078, 0.42, 14), matPants);
      thigh.position.y = -0.21;
      hip.add(thigh);

      const kneePad = new THREE.Mesh(new THREE.SphereGeometry(0.078, 10, 10), matDark);
      kneePad.position.set(0, -0.40, 0.03);
      hip.add(kneePad);

      const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.076, 0.058, 0.40, 14), outfitName === 'luffy' ? matSkin : matPants);
      calf.position.y = -0.60;
      hip.add(calf);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.10, 0.22), matDark);
      boot.position.set(0, -0.82, 0.04);
      hip.add(boot);

      return hip;
    }

    buildLimbLeg(-1);
    buildLimbLeg(1);

    root.userData = { pelvis, torso };
    return root;
  }

  // Build Military Grass & Hangar Lobby Environment (Matches Screenshot 3)
  function buildLobbyEnvironment() {
    while (lobbyWorldGroup.children.length) lobbyWorldGroup.remove(lobbyWorldGroup.children[0]);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x3c4d2c, roughness: 0.92 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    lobbyWorldGroup.add(ground);

    // Background Military Hangar Building
    const hangar = new THREE.Mesh(
      new THREE.BoxGeometry(18, 7, 12),
      new THREE.MeshStandardMaterial({ color: 0x3b4248, roughness: 0.8 })
    );
    hangar.position.set(-12, 3.5, -14);
    hangar.castShadow = true;
    lobbyWorldGroup.add(hangar);

    // Instanced 3D Grass Tufts around Soldier's Boots
    const grassGeo = new THREE.ConeGeometry(0.05, 0.42, 4);
    grassGeo.translate(0, 0.21, 0);
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x4f6a34, roughness: 0.85 });
    const grassMesh = new THREE.InstancedMesh(grassGeo, grassMat, 900);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 900; i++) {
      dummy.position.set((Math.random() - 0.5) * 26, 0, (Math.random() - 0.5) * 22);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.updateMatrix();
      grassMesh.setMatrixAt(i, dummy.matrix);
    }
    lobbyWorldGroup.add(grassMesh);

    refreshLobbySoldier();
  }

  function refreshLobbySoldier() {
    if (lobbySoldier) lobbyWorldGroup.remove(lobbySoldier);
    lobbySoldier = createSoldierModel(config.outfit, config.selectedWeapon);
    lobbyWorldGroup.add(lobbySoldier);
  }

  // ==================== 4. ARMORY & OUTFIT UI CONTROLLER ====================
  function renderWeaponsGrid(filterCat = 'ALL') {
    const grid = document.getElementById('armory-weapons-grid');
    grid.innerHTML = '';

    const list = filterCat === 'ALL' ? WEAPONS : WEAPONS.filter((w) => w.cat === filterCat);
    list.forEach((wpn) => {
      const card = document.createElement('div');
      card.className = 'wpn-grid-card' + (config.selectedWeapon.id === wpn.id ? ' active' : '');
      card.innerHTML = `
        <svg class="wpn-svg-icon" viewBox="0 0 100 32" fill="#cfd6e2">
          <rect x="8" y="10" width="68" height="7" rx="1"/>
          <rect x="76" y="12" width="18" height="3"/>
          <rect x="14" y="17" width="12" height="10" transform="skewX(-15)"/>
          <rect x="42" y="17" width="8" height="12" transform="skewX(10)"/>
          <rect x="32" y="6" width="22" height="4" rx="1"/>
        </svg>
        <span class="wpn-card-lbl">${wpn.name}</span>
      `;
      card.onclick = () => {
        config.selectedWeapon = wpn;
        updateWeaponStatsPanel(wpn);
        renderWeaponsGrid(filterCat);
        refreshLobbySoldier();
        document.getElementById('hud-wpn-name').textContent = wpn.name;
        document.getElementById('hud-wpn-ammo').textContent = `${wpn.mag} / ${wpn.reserve}`;
      };
      grid.appendChild(card);
    });
  }

  function updateWeaponStatsPanel(wpn) {
    document.getElementById('stat-weapon-name').textContent = wpn.name;
    document.getElementById('stat-dmg-val').textContent = wpn.dmg;
    document.getElementById('stat-dmg-bar').style.width = `${Math.min(100, wpn.dmg)}%`;
    document.getElementById('stat-rate-val').textContent = wpn.rate;
    document.getElementById('stat-rate-bar').style.width = `${wpn.rate}%`;
    document.getElementById('stat-recoil-val').textContent = wpn.recoil;
    document.getElementById('stat-recoil-bar').style.width = `${wpn.recoil}%`;
  }

  // ==================== 5. SETTINGS & DRAGGABLE HUD LAYOUT EDITOR ====================
  let isEditingLayout = false;

  function applyHUDStylesFromConfig() {
    document.querySelectorAll('.hud-circle-btn, #hud-joystick').forEach((el) => {
      el.style.opacity = (config.btnOpacity / 100).toString();
      el.style.transform = `scale(${config.btnSize / 100})`;
    });
  }

  function initDraggableHUD() {
    document.querySelectorAll('.hud-draggable').forEach((el) => {
      let dragging = false;
      const onStart = (e) => {
        if (!isEditingLayout) return;
        e.preventDefault();
        dragging = true;
      };
      const onMove = (e) => {
        if (!isEditingLayout || !dragging) return;
        const pt = e.touches ? e.touches[0] : e;
        const xPct = Math.max(2, Math.min(90, (pt.clientX / window.innerWidth) * 100));
        const yPct = Math.max(4, Math.min(88, (pt.clientY / window.innerHeight) * 100));
        el.style.left = `${xPct.toFixed(1)}%`;
        el.style.top = `${yPct.toFixed(1)}%`;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
      };
      const onEnd = () => { dragging = false; };

      el.addEventListener('mousedown', onStart);
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      el.addEventListener('touchstart', onStart, { passive: false });
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    });
  }

  // ==================== 6. ONLINE P2P ID & LAN DISCOVERY ====================
  function initNetworkID() {
    document.getElementById('display-my-id').textContent = config.myPeerId;
    const peerBox = document.getElementById('online-peers-container');

    if (typeof BroadcastChannel !== 'undefined') {
      const lan = new BroadcastChannel('qs66_lan_lobby');
      setInterval(() => {
        lan.postMessage({ id: config.myPeerId, name: config.playerName, mode: config.mapMode });
      }, 1500);
      lan.onmessage = (e) => {
        if (e.data && e.data.id !== config.myPeerId) {
          peerBox.innerHTML = `<div style="color:#4caf50;font-weight:800;">● ${e.data.name} [${e.data.id}] — READY (LAN)</div>`;
        }
      };
    }

    document.getElementById('btn-join-id').onclick = () => {
      const target = document.getElementById('input-search-id').value.trim();
      if (!target) return;
      peerBox.innerHTML = `<div style="color:#d4a84f;">Connecting to Player ID: ${target}...</div>`;
    };
  }

  // ==================== 7. UI NAVIGATION & EVENT BINDINGS ====================
  function bindUIEvents() {
    const scrLobby = document.getElementById('screen-lobby');
    const scrArmory = document.getElementById('screen-armory');
    const scrHud = document.getElementById('screen-hud');
    const modalSet = document.getElementById('modal-settings');

    // Open Armory / Outfits
    const openArmory = () => {
      scrLobby.classList.add('hidden');
      scrArmory.classList.remove('hidden');
      camera.position.set(-0.55, 1.32, 2.75);
    };
    document.getElementById('btn-open-armory').onclick = openArmory;
    document.getElementById('btn-open-outfits').onclick = openArmory;
    document.getElementById('btn-quick-armory').onclick = openArmory;
    document.getElementById('btn-quick-outfits').onclick = openArmory;

    document.getElementById('btn-armory-back').onclick = () => {
      scrArmory.classList.add('hidden');
      scrLobby.classList.remove('hidden');
      camera.position.set(0, 1.35, 3.25);
    };

    // Weapon Category Filter Pills
    document.querySelectorAll('#armory-cat-pills .cat-pill').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('#armory-cat-pills .cat-pill').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderWeaponsGrid(btn.dataset.cat);
      };
    });

    // Outfit Cards Selection
    document.querySelectorAll('#armory-outfits-list .outfit-card').forEach((card) => {
      card.onclick = () => {
        document.querySelectorAll('#armory-outfits-list .outfit-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        config.outfit = card.dataset.outfit;
        refreshLobbySoldier();
      };
    });

    // Mode Selection (Warehouse TDM vs Classic Grass Map)
    const btnWh = document.getElementById('btn-mode-warehouse');
    const btnCl = document.getElementById('btn-mode-classic');
    btnWh.onclick = () => { config.mapMode = 'warehouse'; btnWh.classList.add('active'); btnCl.classList.remove('active'); };
    btnCl.onclick = () => { config.mapMode = 'classic'; btnCl.classList.add('active'); btnWh.classList.remove('active'); };

    // With Bots vs No Bots
    const btnWB = document.getElementById('btn-with-bots');
    const btnNB = document.getElementById('btn-no-bots');
    btnWB.onclick = () => { config.withBots = true; btnWB.classList.add('active'); btnNB.classList.remove('active'); };
    btnNB.onclick = () => { config.withBots = false; btnNB.classList.add('active'); btnWB.classList.remove('active'); };

    // Settings Modal
    const openSettings = () => modalSet.classList.remove('hidden');
    const closeSettings = () => modalSet.classList.add('hidden');
    document.getElementById('btn-lobby-settings').onclick = openSettings;
    document.getElementById('btn-open-settings-top').onclick = openSettings;
    document.getElementById('btn-hud-settings').onclick = openSettings;
    document.getElementById('btn-close-settings').onclick = closeSettings;
    document.getElementById('btn-cancel-settings').onclick = closeSettings;

    // Settings Sliders Live Binding
    const bindSlider = (id, lblId, key) => {
      const el = document.getElementById(id);
      el.oninput = () => {
        config[key] = parseInt(el.value, 10);
        document.getElementById(lblId).textContent = `${el.value}%`;
      };
    };
    bindSlider('rng-btn-size', 'lbl-btn-size', 'btnSize');
    bindSlider('rng-btn-opacity', 'lbl-btn-opacity', 'btnOpacity');
    bindSlider('rng-sens-cam', 'lbl-sens-cam', 'sensCam');
    bindSlider('rng-sens-ads', 'lbl-sens-ads', 'sensAds');
    bindSlider('rng-sens-joy', 'lbl-sens-joy', 'sensJoy');
    bindSlider('rng-sens-scope', 'lbl-sens-scope', 'sensScope');

    document.getElementById('btn-save-settings').onclick = () => {
      applyHUDStylesFromConfig();
      closeSettings();
    };

    // Open HUD Button Drag Editor
    document.getElementById('btn-open-layout-editor').onclick = () => {
      closeSettings();
      scrLobby.classList.add('hidden');
      scrHud.classList.remove('hidden');
      document.getElementById('layout-editor-banner').classList.remove('hidden');
      isEditingLayout = true;
    };

    document.getElementById('btn-save-layout-done').onclick = () => {
      isEditingLayout = false;
      document.getElementById('layout-editor-banner').classList.add('hidden');
      if (!config.inMatch) {
        scrHud.classList.add('hidden');
        scrLobby.classList.remove('hidden');
      }
    };

    // Start Match Button
    document.getElementById('btn-start-match').onclick = () => {
      config.playerName = document.getElementById('input-player-name').value.trim() || 'QS_OPERATOR';
      document.getElementById('sq-my-name').textContent = config.playerName;
      config.inMatch = true;
      scrLobby.classList.add('hidden');
      scrHud.classList.remove('hidden');

      if (typeof window.startCombatEngine === 'function') {
        window.startCombatEngine(config, { scene, camera, renderer, lobbyWorldGroup, createSoldierModel });
      }
    };

    // Leave Match
    document.getElementById('btn-hud-leave').onclick = () => {
      config.inMatch = false;
      scrHud.classList.add('hidden');
      scrLobby.classList.remove('hidden');
      lobbyWorldGroup.visible = true;
      camera.position.set(0, 1.35, 3.25);
    };

    // Rotate Character in Lobby by Touch/Mouse Drag
    let draggingChar = false;
    let prevX = 0;
    viewport.addEventListener('pointerdown', (e) => { draggingChar = true; prevX = e.clientX; });
    window.addEventListener('pointermove', (e) => {
      if (draggingChar && lobbySoldier && !config.inMatch) {
        lobbySoldier.rotation.y += (e.clientX - prevX) * 0.01;
        prevX = e.clientX;
      }
    });
    window.addEventListener('pointerup', () => { draggingChar = false; });
  }

  // ==================== 8. RENDER LOOP ====================
  function animate(now) {
    requestAnimationFrame(animate);
    const t = now * 0.001;

    if (!config.inMatch && lobbySoldier) {
      lobbySoldier.userData.pelvis.position.y = 0.92 + Math.sin(t * 2.5) * 0.012;
      renderer.render(scene, camera);
    } else if (typeof window.updateCombatEngine === 'function') {
      window.updateCombatEngine(t);
    } else {
      renderer.render(scene, camera);
    }
  }

  // Initialize Everything
  buildLobbyEnvironment();
  renderWeaponsGrid('ALL');
  updateWeaponStatsPanel(WEAPONS[0]);
  initDraggableHUD();
  initNetworkID();
  bindUIEvents();
  requestAnimationFrame(animate);

  return { config, WEAPONS, createSoldierModel };
})();
