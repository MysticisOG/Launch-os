const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const launchListEl = document.getElementById('launch-list');
const statusEl = document.getElementById('status');

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

updateClock();
setInterval(updateClock, 1000);
loadLaunches();
