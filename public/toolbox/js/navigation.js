// Detect if loaded inside an iframe and add mode class to document immediately
if (window.self !== window.top) {
    document.documentElement.classList.add('in-iframe');
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('in-iframe');
        
        // Dynamically inject a Back button on sub-tool pages when loaded in an iframe
        if (window.location.pathname.includes('/tools/')) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                const backBtn = document.createElement('div');
                backBtn.className = 'iframe-back-btn-container';
                backBtn.style.cssText = 'margin-bottom: 12px; display: flex; align-items: center;';
                backBtn.innerHTML = `
                    <a href="../index.html" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #ffffff; border: 1px solid #d0d0d0; border-radius: 4px; color: #333; text-decoration: none; font-size: 0.85rem; font-weight: 600; font-family: sans-serif; transition: background 0.1s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                        Back to Toolbox Dashboard
                    </a>
                `;
                mainContent.insertBefore(backBtn, mainContent.firstChild);
            }
        }
    });
}

/**
 * Shared Navigation Script for SolarFlow Toolbox
 * Handles sidebar toggle for mobile and responsive behavior
 */
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const overlay = document.getElementById('overlay');

    function openSidebar() {
        sidebar?.classList.add('open');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar?.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileNavToggle && sidebar && sidebarCloseBtn && overlay) {
        mobileNavToggle.addEventListener('click', openSidebar);
        sidebarCloseBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when window resizes to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            closeSidebar();
        }
    });
});

