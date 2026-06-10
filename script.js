/**
 * Eric the Handyman & Remodeling - Interactive Logic
 * Louisville, KY
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFormHandling();
});

/**
 * Mobile Navigation Logic
 */
function initNavigation() {
    const hamburger = document.getElementById('hamburger-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

/**
 * Lead Form Submission Handling
 */
function initFormHandling() {
    const leadForm = document.getElementById('lead-form');
    const formStatus = document.getElementById('form-status');

    if (!leadForm) return;

    leadForm.addEventListener('submit', async (e) => {
        // Note: The form actually submits to Web3Forms via the HTML 'action'
        // But we can add extra feedback logic here if we were using AJAX.
        // For a simple static site, standard submission is fine.
        
        formStatus.textContent = "Processing your inquiry...";
        formStatus.style.color = "var(--color-primary)";
    });
}
