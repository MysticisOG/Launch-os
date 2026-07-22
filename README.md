<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Launch-os</title>
    <style>

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        header {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        h1 {
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: -0.025em;
            color: #38bdf8;
        }

        #clock {
            font-family: monospace;
            font-size: 1.1rem;
            background: rgba(15, 23, 42, 0.5);
            padding: 0.35rem 0.75rem;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        main {
            flex: 1;
            padding: 2rem;
            peak-width: 900px;
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            overflow-response: auto;
        }

        .card {
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 1.5rem;
            backdrop-filter: blur(10px);
        }

        .card h2 {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: #cbd5e1;
            font-weight: 500;
        }

        #launch-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .launch-item {
            background: rgba(15, 23, 42, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.2s;
        }

        .launch-item:hover {
            background: rgba(15, 23, 42, 0.7);
        }

        .launch-name {
            font-weight: 500;
        }

        .launch-time {
            font-size: 0.85rem;
            color: #94a3b8;
            font-family: monospace;
        }
    </style>
</head>
<body>

    <header>
        <h1>Launch-os</h1>
        <div id="clock">00:00:00</div>
    </header>

    <main>
        <section class="card">
            <h2>Featured Rocket Launches</h2>
            <ul id="launch-list">
                <li class="launch-item">
                    <span class="launch-name">Loading launches...</span>
                </li>
            </ul>
        </section>
    </main>

    <script>

        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            const clockElement = document.getElementById('clock');
            if (clockElement) {
                clockElement.textContent = `${hours}:${minutes}:${seconds}`;
            }
        }

        setInterval(updateClock, 1000);
        updateClock();

        async function fetchLaunches() {
            const listElement = document.getElementById('launch-list');

            try {

                const response = await fetch('https:
                const data = await response.json();

                if (data && data.results) {
                    listElement.innerHTML = '';

                    data.results.forEach(launch => {
                        const li = document.createElement('li');
                        li.className = 'launch-item';

                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'launch-name';
                        nameSpan.textContent = launch.name;

                        const timeSpan = document.createElement('span');
                        timeSpan.className = 'launch-time';
                        const launchDate = new Date(launch.net);
                        timeSpan.textContent = launchDate.toLocaleString();

                        li.appendChild(nameSpan);
                        li.appendChild(timeSpan);
                        listElement.appendChild(li);
                    });
                }
            } catch (error) {
                console.error('Error fetching launches:', error);
                listElement.innerHTML = '<li class="launch-item"><span class="launch-name">Unable to load live launches. Check connection.</span></li>';
            }
        }

        fetchLaunches();
    </script>
</body>
</html>