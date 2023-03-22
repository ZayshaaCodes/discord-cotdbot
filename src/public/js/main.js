

async function fetchData({ key, id, elementId }) {
    const url = id ? `/api/data/${key}/${id}` : `/api/data/${key}`;
    const response = await fetch(url);
    const data = await response.json();

    const element = document.getElementById(elementId);
    element.textContent = JSON.stringify(data, null, 2);
}