function showNotification(message) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.style.cssText = `
        position:fixed;
        top:20px;
        right:20px;
        background:#28a745;
        color:#fff;
        padding:12px 18px;
        border-radius:8px;
        z-index:9999;
    `;
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2500);
}
