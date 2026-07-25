const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const launchListEl = document.getElementById('launch-list');
const statusEl = document.getElementById('status');
const rocketTrailEl = document.getElementById('rocket-trail');
const webCanvas = document.getElementById('web-canvas');
const boostButton = document.getElementById('boost-toggle');
const messageButton = document.getElementById('mission-message');
const notesCard = document.querySelector('.notes-card');

let boostMode = false;
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
let webPoints = [];
let webContext = null;

const featuredLaunches = [
  {
    name: 'Starlink Group 9-3',
    net: '2026-07-18T19:45:00Z',
    location: 'Cape Canaveral, United States',
    provider: 'SpaceX',
    url: 'https://www.spacex.com/launches/'
  },
  {
    name: 'Europa Clipper',
    net: '2024-10-14T16:00:00Z',
    location: 'Cape Canaveral, United States',
    provider: 'NASA',
    url: 'https://www.nasa.gov/europa-clipper'
  },
  {
    name: 'Tiangong Space Station Crew Mission',
    net: '2026-07-21T03:30:00Z',
    location: 'Jiuquan, China',
    provider: 'China Manned Space Agency',
    url: 'https://www.cmse.gov.cn/'
  }
];

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  dateEl.textContent = now.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatLaunchDate(isoDate) {
  if (!isoDate) return 'TBD';
  return new Date(isoDate).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function renderLaunches(launches) {
  if (!launches.length) {
    launchListEl.innerHTML = '<p class="launch-item">No launches available right now.</p>';
    return;
  }

  launchListEl.innerHTML = launches
    .map((launch) => {
      const link = launch.url
        ? `<a class="launch-link" href="${launch.url}" target="_blank" rel="noreferrer">Open launch page</a>`
        : '';

      return `
        <article class="launch-item">
          <div class="launch-name">${launch.name || 'Unnamed launch'}</div>
          <div class="launch-meta">
            <span>${formatLaunchDate(launch.net)}</span>
            <span>•</span>
            <span>${launch.location || 'Location pending'}</span>
            <span>•</span>
            <span>${launch.provider || 'Unknown provider'}</span>
          </div>
          ${link}
        </article>`;
    })
    .join('');
}

function loadLaunches() {
  renderLaunches(featuredLaunches);
  statusEl.textContent = 'Showing featured launches';
}

function launchMessage() {
  const notes = [
    'Mission control reports perfect telemetry across the board.',
    'Keep an eye on the stars — today is a good day for liftoff.',
    'System check complete. The launch feed is locked and loading.',
    'Set your trajectory: adventure is waiting beyond the atmosphere.'
  ];

  const message = notes[Math.floor(Math.random() * notes.length)];
  notesCard.innerHTML = `<p>${message}</p><p>Tap the Mission Note button for another update.</p>`;
  statusEl.textContent = 'Mission note updated';
}

function toggleBoost() {
  boostMode = !boostMode;
  document.body.classList.toggle('boost-active', boostMode);
  boostButton.textContent = boostMode ? 'Stabilize Systems' : 'Engage Boost';
  statusEl.textContent = boostMode ? 'Boost mode activated' : 'Boost mode deactivated';
}

function setupFeatureButtons() {
  boostButton.addEventListener('click', toggleBoost);
  messageButton.addEventListener('click', launchMessage);
}

function initWebCanvas() {
  webContext = webCanvas.getContext('2d');
  const pointCount = 40;
  const spacing = Math.min(window.innerWidth, window.innerHeight) / 16;

  webPoints = Array.from({ length: pointCount }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: 0,
    vy: 0,
    baseX: Math.random() * window.innerWidth,
    baseY: Math.random() * window.innerHeight,
    radius: 1.5 + Math.random() * 2
  }));

  resizeWebCanvas();
  animateWeb();
}

function resizeWebCanvas() {
  webCanvas.width = window.innerWidth * devicePixelRatio;
  webCanvas.height = window.innerHeight * devicePixelRatio;
  webCanvas.style.width = `${window.innerWidth}px`;
  webCanvas.style.height = `${window.innerHeight}px`;
  if (webContext) {
    webContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
}

function animateWeb() {
  if (!webContext) return;
  webContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

  webPoints.forEach((point) => {
    const dx = cursorX - point.x;
    const dy = cursorY - point.y;
    const dist = Math.hypot(dx, dy);
    const attraction = Math.max(0, 120 - dist) / 120;
    const angle = Math.atan2(dy, dx);

    point.vx += Math.cos(angle) * attraction * 0.16;
    point.vy += Math.sin(angle) * attraction * 0.16;
    point.vx += (point.baseX - point.x) * 0.002;
    point.vy += (point.baseY - point.y) * 0.002;
    point.vx *= 0.92;
    point.vy *= 0.92;
    point.x += point.vx;
    point.y += point.vy;

    webPoints.forEach((other) => {
      if (other === point) return;
      const spacing = Math.hypot(point.x - other.x, point.y - other.y);
      if (spacing < 110) {
        const alpha = 0.18 * (1 - spacing / 110);
        webContext.strokeStyle = `rgba(110, 231, 249, ${alpha})`;
        webContext.lineWidth = 1;
        webContext.beginPath();
        webContext.moveTo(point.x, point.y);
        webContext.lineTo(other.x, other.y);
        webContext.stroke();
      }
    });
  });

  webContext.fillStyle = 'rgba(110, 231, 249, 0.92)';
  webPoints.forEach((point) => {
    webContext.beginPath();
    webContext.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    webContext.fill();
  });

  requestAnimationFrame(animateWeb);
}

function setupDrag() {
  const windows = document.querySelectorAll('.draggable');

  windows.forEach((windowEl) => {
    const titlebar = windowEl.querySelector('.window-titlebar');
    let active = false;
    let offsetX = 0;
    let offsetY = 0;

    titlebar.addEventListener('pointerdown', (event) => {
      active = true;
      titlebar.setPointerCapture(event.pointerId);
      const rect = windowEl.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      windowEl.style.right = 'auto';
      windowEl.style.bottom = 'auto';
      windowEl.style.left = `${rect.left}px`;
      windowEl.style.top = `${rect.top}px`;
      windowEl.classList.add('dragging');
    });

    titlebar.addEventListener('pointermove', (event) => {
      if (!active) return;
      windowEl.style.left = `${Math.max(8, event.clientX - offsetX)}px`;
      windowEl.style.top = `${Math.max(8, event.clientY - offsetY)}px`;
    });

    titlebar.addEventListener('pointerup', () => {
      active = false;
      windowEl.classList.remove('dragging');
    });
    titlebar.addEventListener('pointercancel', () => {
      active = false;
      windowEl.classList.remove('dragging');
    });
  });
}

function setupRocketTrail() {
  let trailTimer;
  document.addEventListener('pointermove', (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    rocketTrailEl.style.left = `${cursorX}px`;
    rocketTrailEl.style.top = `${cursorY}px`;
    rocketTrailEl.style.opacity = '1';

    if (boostMode) {
      rocketTrailEl.style.width = '18px';
      rocketTrailEl.style.height = '18px';
      rocketTrailEl.style.filter = 'blur(4px)';
    } else {
      rocketTrailEl.style.width = '10px';
      rocketTrailEl.style.height = '10px';
      rocketTrailEl.style.filter = 'blur(0px)';
    }

    clearTimeout(trailTimer);
    trailTimer = setTimeout(() => {
      rocketTrailEl.style.opacity = '0';
    }, 120);
  });
}

updateClock();
setInterval(updateClock, 1000);
loadLaunches();
initWebCanvas();
setupDrag();
setupFeatureButtons();
setupRocketTrail();
window.addEventListener('resize', resizeWebCanvas);
