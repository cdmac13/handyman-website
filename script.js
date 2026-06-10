/**
 * Eric the Handyman & Remodeling - Interactive Logic
 * Louisville, KY
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initEstimator();
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
 * Project Cost Estimator Logic
 */
function initEstimator() {
    const serviceSelect = document.getElementById('calc-service');
    const sizeSlider = document.getElementById('calc-size');
    const sizeDisplay = document.getElementById('calc-size-val');
    const tierRadios = document.querySelectorAll('input[name="calc-tier"]');
    
    // Result Elements
    const resultDays = document.getElementById('result-days');
    const resultLabor = document.getElementById('result-labor');
    const resultMaterials = document.getElementById('result-materials');
    const resultTotal = document.getElementById('result-total');
    const lockBtn = document.getElementById('lock-estimate-btn');
    const formBudgetInput = document.getElementById('form-budget');

    if (!serviceSelect || !sizeSlider) return;

    // Multipliers for Material Tiers
    const tierMultipliers = {
        standard: 1.0,
        premium: 1.6,
        luxury: 2.8
    };

    // Material Base Rates per service type (Ballpark for Louisville)
    const materialRates = {
        'custom-shower': { base: 800, unit: 12 },
        'bath-remodel': { base: 1200, unit: 18 },
        'tile-floor': { base: 300, unit: 6 },
        'carpentry': { base: 200, unit: 4 },
        'drywall-paint': { base: 150, unit: 2 }
    };

    function calculateEstimate() {
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const serviceKey = serviceSelect.value;
        const size = parseInt(sizeSlider.value);
        const selectedTier = document.querySelector('input[name="calc-tier"]:checked').value;
        
        // Extract Labor Data from HTML Attributes
        const laborBase = parseFloat(selectedOption.getAttribute('data-base'));
        const laborUnit = parseFloat(selectedOption.getAttribute('data-unit'));
        const baseDays = parseInt(selectedOption.getAttribute('data-days'));

        // Update Size Display
        sizeDisplay.textContent = `${size} sq. ft.`;

        // 1. Calculate Labor
        // Formula: Base Labor + (Unit Labor * Size)
        const totalLabor = laborBase + (laborUnit * size);

        // 2. Calculate Materials
        // Formula: (Base Mat + (Unit Mat * Size)) * Tier Multiplier
        const matData = materialRates[serviceKey];
        const baseMaterials = (matData.base + (matData.unit * size)) * tierMultipliers[selectedTier];

        // 3. Calculate Days
        // Increase days slightly for very large projects
        const extraDays = Math.floor(size / 150);
        const totalDays = baseDays + extraDays;

        // 4. Calculate Total Range (approx +/- 10% for site variables)
        const subtotal = totalLabor + baseMaterials;
        const rangeMin = Math.round((subtotal * 0.9) / 50) * 50; // Round to nearest 50
        const rangeMax = Math.round((subtotal * 1.1) / 50) * 50;

        // Update UI
        resultDays.textContent = `~${totalDays} Work Days`;
        resultLabor.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalLabor);
        resultMaterials.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(baseMaterials);
        resultTotal.textContent = `$${rangeMin.toLocaleString()} - $${rangeMax.toLocaleString()}`;

        // Store result for the contact form
        if (formBudgetInput) {
            formBudgetInput.value = `$${rangeMin.toLocaleString()} - $${rangeMax.toLocaleString()} (Est. ${totalDays} Days)`;
        }
    }

    // Event Listeners
    serviceSelect.addEventListener('change', calculateEstimate);
    sizeSlider.addEventListener('input', calculateEstimate);
    tierRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            // Update active visual state for parent labels
            document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('active'));
            e.target.closest('.radio-card').classList.add('active');
            calculateEstimate();
        });
    });

    // Lock Button - Smooth scroll to contact
    lockBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            // Focus on name input
            setTimeout(() => {
                const nameInput = document.getElementById('name');
                if (nameInput) nameInput.focus();
            }, 800);
        }
    });

    // Initial Run
    calculateEstimate();
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
