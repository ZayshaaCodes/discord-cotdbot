// In your main.js file
async function fetchClubData() {
    const response = await fetch('/api/clubData');
    const clubData = await response.json();

    // Display the club data on the web UI
    const clubDataElement = document.getElementById('club-data');
    clubDataElement.textContent = JSON.stringify(clubData, null, 2);
}

// Call the fetchClubData function when the page loads
fetchClubData();

async function fetchCOTDQueue() {
    const response = await fetch('/api/cotdQueue');
    const cotdQueue = await response.json();

    // Display the club data on the web UI
    const cotdQueueElement = document.getElementById('cotd-queue');
    cotdQueueElement.textContent = JSON.stringify(cotdQueue, null, 2);
}

// Call the fetchCOTDQueue function when the page loads
fetchCOTDQueue();