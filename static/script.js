const documentsContainer = document.getElementById("documents");
const statusElement = document.getElementById("status");
const queryInput = document.getElementById("query-input");
const searchButton = document.getElementById("search-button");

function renderDocuments(documents) {
	documentsContainer.innerHTML = "";

	if (!documents.length) {
		statusElement.textContent = "No documents found.";
		return;
	}

	statusElement.textContent = `Loaded ${documents.length} documents`;

	for (const item of documents) {
		const card = document.createElement("article");
		card.className = "document-card";

		const id = document.createElement("h2");
		id.className = "document-id";
		id.textContent = item.id;

		const doc = document.createElement("p");
		doc.className = "document-text";
		doc.textContent = item.document;

		card.append(id, doc);
		documentsContainer.appendChild(card);
	}
}

function renderSearchResults(results, query) {
	documentsContainer.innerHTML = "";

	if (!results.length) {
		statusElement.textContent = `No search results for "${query}".`;
		return;
	}

	statusElement.textContent = `Found ${results.length} result(s) for "${query}"`;

	for (const item of results) {
		const card = document.createElement("article");
		card.className = "document-card";

		const id = document.createElement("h2");
		id.className = "document-id";
		id.textContent = item.id;

		const doc = document.createElement("p");
		doc.className = "document-text";
		doc.textContent = item.document;

		const distance = document.createElement("p");
		distance.className = "document-distance";
		distance.textContent = `Distance: ${Number(item.distance).toFixed(4)}`;

		card.append(id, doc, distance);
		documentsContainer.appendChild(card);
	}
}

function normalizeSearchResults(rawResults) {
	if (!Array.isArray(rawResults) || !rawResults.length) {
		return [];
	}

	const first = rawResults[0];
	const hasNestedArrays =
		first &&
		Array.isArray(first.id) &&
		Array.isArray(first.document) &&
		Array.isArray(first.distance);

	if (hasNestedArrays) {
		const count = Math.min(5, first.id.length, first.document.length, first.distance.length);
		const flattened = [];

		for (let i = 0; i < count; i += 1) {
			flattened.push({
				id: first.id[i],
				document: first.document[i],
				distance: first.distance[i],
			});
		}

		return flattened;
	}

	return rawResults.slice(0, 5);
}

async function loadDocuments() {
	try {
		const response = await fetch("/documents");

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const documents = await response.json();
		renderDocuments(documents);
	} catch (error) {
		statusElement.textContent = "Failed to load documents.";
		documentsContainer.innerHTML = `<p class="error">${error.message}</p>`;
	}
}

async function runSearch() {
	const query = queryInput.value.trim();

	if (!query) {
		statusElement.textContent = "Please enter a search query.";
		return;
	}

	statusElement.textContent = "Searching...";

	try {
		const response = await fetch(`/search?query=${encodeURIComponent(query)}`);

		if (!response.ok) {
			throw new Error(`Request failed with status ${response.status}`);
		}

		const rawResults = await response.json();
		const results = normalizeSearchResults(rawResults);
		renderSearchResults(results, query);
	} catch (error) {
		statusElement.textContent = "Failed to run search.";
		documentsContainer.innerHTML = `<p class="error">${error.message}</p>`;
	}
}

searchButton.addEventListener("click", runSearch);
queryInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		runSearch();
	}
});

loadDocuments();
