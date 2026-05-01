document.addEventListener('DOMContentLoaded', () => {
    const loadBtn = document.getElementById('loadBtn');
    const chunksContainer = document.getElementById('chunksContainer');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const stats = document.getElementById('stats');

    loadBtn.addEventListener('click', async () => {
        try {
            loading.style.display = 'flex';
            error.style.display = 'none';
            chunksContainer.innerHTML = '';
            stats.innerHTML = '';

            const response = await fetch('/split');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const chunks = await response.json();
            loading.style.display = 'none';

            if (!chunks || chunks.length === 0) {
                error.style.display = 'block';
                error.textContent = 'No chunks found';
                return;
            }

            // Display stats
            const totalChars = chunks.reduce((sum, c) => sum + c.length, 0);
            stats.innerHTML = `
                <span class="stat-item">📦 ${chunks.length} chunks</span>
                <span class="stat-item">📊 ${totalChars.toLocaleString()} total characters</span>
            `;

            // Display chunks
            chunks.forEach((chunk, index) => {
                const chunkEl = document.createElement('div');
                chunkEl.className = 'chunk-card';
                chunkEl.innerHTML = `
                    <div class="chunk-header">
                        <span class="chunk-number">Chunk ${index + 1}</span>
                        <span class="chunk-length">${chunk.length} chars</span>
                    </div>
                    <div class="chunk-content">${escapeHtml(chunk.chunk)}</div>
                `;
                chunksContainer.appendChild(chunkEl);
            });

        } catch (err) {
            loading.style.display = 'none';
            error.style.display = 'block';
            error.textContent = `Error: ${err.message}`;
            console.error('Fetch error:', err);
        }
    });

    // Load chunks on page load
    loadBtn.click();

    // Helper function to escape HTML
    function escapeHtml(text) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        return textarea.innerHTML;
    }
});
