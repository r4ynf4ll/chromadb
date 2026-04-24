const documentsContainer = document.getElementById("documents");
const statusElement = document.getElementById("status");

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

loadDocuments();
