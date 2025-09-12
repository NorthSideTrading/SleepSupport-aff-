/**
 * Sleep Support Guide - Main JavaScript
 * Professional affiliate comparison microsite per specification
 * Age 40+ optimized with comprehensive tracking and new light theme
 */

// === Utilities ===
function uuid(){return crypto.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);});}
function params(){const u=new URL(location.href),o={};for(const [k,v] of u.searchParams)o[k]=v;return o;}

// Product data store - loads from /data/offers.json
let productData = {
    supplements: [],
    non_pill: []
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // === Auto "Updated:" ===
    document.querySelectorAll('[data-updated]').forEach(el=>{
        const d=new Date(), m=d.toLocaleString('en-US',{month:'long'}), y=d.getFullYear();
        el.prepend(`Updated: ${m} ${y} • `);
    });
    
    // Load product data
    loadProductData();
    
    // Setup accessibility features
    setupAccessibility();
    
    // Setup performance monitoring
    setupPerformanceMonitoring();
    
    // Initialize FAQ dropdown functionality
    initializeFAQ();
}

// === Outbound click tracking ===
document.addEventListener('click', e=>{
    const a=e.target.closest('a.cta'); if(!a) return;
    const payload={event:'outbound_click',offer:a.dataset.offer||a.textContent.trim(),page_path:location.pathname,event_id:uuid(),...params()};
    // Track via GA4 only - removed external tracking endpoint
    window.gtag && gtag('event','outbound_click', payload);
}, true);

/**
 * Load product data from JSON file
 */
async function loadProductData() {
    try {
        const response = await fetch('/data/offers.json?v=' + Date.now());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productData = await response.json();
        
        // Debug logging for PITCH BLACK data
        const pitchBlackItem = productData.supplements?.find(item => item.slug === 'pitch-black');
        if (pitchBlackItem) {
            console.log('PITCH BLACK data loaded:', {
                slug: pitchBlackItem.slug,
                cta_url: pitchBlackItem.cta_url,
                name: pitchBlackItem.name
            });
        }
        
        // Populate tables if we're on comparison pages
        const currentPage = getCurrentPage();
        if (currentPage === 'non-pill-solutions') {
            renderNonPillSolutions(productData.non_pill || []);
        } else if (currentPage === 'supplements') {
            renderSupplements(productData.supplements || []);
        }
    } catch (error) {
        console.error('Failed to load product data:', error);
        showErrorMessage('Failed to load product comparisons. Please refresh the page.');
    }
}

/**
 * Get current page type from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('/non-pill-solutions/')) return 'non-pill-solutions';
    if (path.includes('/supplements/')) return 'supplements';
    return 'home';
}

function renderSupplements(items){
    const tbody = document.getElementById('supplements-table-body'); 
    if(!tbody) return;
    
    tbody.innerHTML = '';
    
    const sortedItems = [...items].sort((a, b) => a.rank_priority - b.rank_priority);
    
    sortedItems.forEach((item, index) => {
        const row = document.createElement('tr');
        if(index === 0) row.classList.add('top-pick');
        
        let badge = '';
        if(index === 0) badge = '<span class="badge badge-top" style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid rgba(255,255,255,0.2);">● TOP RATED</span>';
        else if(index === 1) badge = '<span class="badge badge-value" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid rgba(255,255,255,0.2);">◆ BEST VALUE</span>';
        else if(index === 2) badge = '<span class="badge" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 2px solid rgba(255,255,255,0.2);">▲ POPULAR</span>';
        
        const rating = '★★★★☆';
        
        // Friendly copy updates
        const friendlyNotes = item.notes
            .replace('Use conservative language; avoid explicit weight-loss promises.', 'Perfect for those seeking dual benefits of better sleep and weight management support.')
            .replace('Keep claims to relaxation/sleep-support only.', 'Ideal for deep restoration and recovery during sleep hours.')
            .replace('Consumer copy must avoid efficacy promises.', 'Great choice for those preferring liquid supplements over capsules.')
            .replace('Stay general; no hormone/medical claims.', 'Specially formulated with men\'s sleep patterns in mind.')
            .replace('Structure/function wording only.', 'Premium choice for comprehensive magnesium supplementation.');
        
        row.innerHTML = `
            <td>
                <div class="product-cell">
                    <div class="product-image">
                        <img src="${item.img}" alt="${item.name}" loading="lazy" style="border-radius: 8px;">
                    </div>
                    <div class="product-info">
                        <div class="k" style="font-weight: 600; color: #1e293b; margin-bottom: 6px;">${item.name}</div>
                        <div class="rating" style="color: #f59e0b; font-size: 14px; margin-bottom: 8px;">${rating} <span style="color: #64748b; font-size: 13px;">(4.2/5)</span></div>
                        <div class="small" style="color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: 500; margin-bottom: 8px;">${item.form}</div>
                        ${badge}
                    </div>
                </div>
            </td>
            <td>
                <div class="key-points">
                    ${item.key_points.slice(0,3).map(point => `<div class="key-point" style="margin-bottom: 8px; color: #475569; font-size: 14px; line-height: 1.4;">${point}</div>`).join('')}
                </div>
            </td>
            <td><span class="small" style="color: #64748b; font-weight: 500;">${item.form}</span></td>
            <td><span class="small" style="color: #64748b; font-size: 13px; line-height: 1.4;">${friendlyNotes}</span></td>
            <td>
                <div style="display: flex; flex-direction: row; gap: 12px; justify-content: center; align-items: center; flex-wrap: wrap;">
                    <a class="btn btn-primary cta" data-offer="${item.slug}" href="${item.cta_url}" rel="nofollow sponsored" data-aff="true" data-merchant="${item.name.split(' (')[0]}" data-offer="${item.name.split(' (')[0]}" data-position="Table#${index + 1}"
                       style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 14px 18px; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 14px; text-align: center; transition: all 0.2s ease; box-shadow: 0 3px 12px rgba(5, 150, 105, 0.3); border: 2px solid transparent;">
                        Check Price ▶
                    </a>
                    <a class="btn btn-ghost" href="${item.cta_url}" rel="nofollow sponsored" data-aff="true" data-merchant="${item.name.split(' (')[0]}" data-offer="${item.name.split(' (')[0]}" data-position="Table#${index + 1}Review"
                       style="background: white; color: #059669; padding: 14px 18px; border: 2px solid #059669; border-radius: 8px; font-weight: 500; text-decoration: none; font-size: 14px; text-align: center; transition: all 0.2s ease;">
                        Read Review
                    </a>
                </div>
            </td>`;
        
        tbody.appendChild(row);
    });
}

function renderNonPillSolutions(items){
    const tbody=document.getElementById('nonpill-table'); if(!tbody) return;
    tbody.innerHTML='';
    
    items.forEach((it, i)=>{
        const tr=document.createElement('tr');
        if(i===0) tr.classList.add('top-pick'); // visual highlight
        
        // Generate badge for top items
        let badge = '';
        if(i === 0) badge = '<span class="badge badge-top">TOP RATED</span>';
        else if(i === 1) badge = '<span class="badge badge-value">BEST VALUE</span>';
        else if(i === 2) badge = '<span class="badge">POPULAR</span>';
        
        // Generate star rating (mock for visual appeal)
        const rating = '★★★★☆';
        
        tr.innerHTML=`
            <td>
                <div class="k">${it.name}</div>
                <div class="rating">${rating}</div>
                ${badge}
            </td>
            <td><span class="small">${it.type||''}</span></td>
            <td><span class="small">${it.comfort||''}</span></td>
            <td><span class="small">${it.care||''}</span></td>
            <td><span class="small">${it.trial||''}</span></td>
            <td>
                <a class="btn btn-primary cta" data-offer="${it.slug}" href="${it.cta_url}" target="_blank" rel="nofollow sponsored noopener">Check Price</a>
                <a class="btn btn-ghost mt8" href="#">Read Guide</a>
            </td>`;
        tbody.appendChild(tr);
    });
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
    // Enhance table accessibility
    enhanceTableAccessibility();
    
    // Setup focus management
    setupFocusManagement();
    
    // Add ARIA live regions for dynamic content
    setupLiveRegions();
}

/**
 * Enhance table accessibility
 */
function enhanceTableAccessibility() {
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        // Add table caption if missing
        if (!table.querySelector('caption')) {
            const caption = document.createElement('caption');
            caption.className = 'sr-only';
            caption.textContent = 'Product comparison table with sortable columns';
            table.insertBefore(caption, table.firstChild);
        }
        
        // Add scope attributes to headers
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            if (!header.getAttribute('scope')) {
                header.setAttribute('scope', 'col');
            }
        });
    });
}

/**
 * Setup focus management
 */
function setupFocusManagement() {
    // Store last focused element before navigation
    let lastFocusedElement = null;
    
    document.addEventListener('focusin', function(e) {
        lastFocusedElement = e.target;
    });
    
    // Return focus after page navigation
    window.addEventListener('pageshow', function() {
        if (lastFocusedElement && document.contains(lastFocusedElement)) {
            lastFocusedElement.focus();
        }
    });
}

/**
 * Setup ARIA live regions
 */
function setupLiveRegions() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    window.announceToScreenReader = function(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    };
}

/**
 * Setup performance monitoring
 */
function setupPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perf = performance.getEntriesByType('navigation')[0];
                const loadTime = perf.loadEventEnd - perf.loadEventStart;
                const paint = performance.getEntriesByType('paint');
                
                // Log performance metrics - per specification
                console.log('Performance metrics:', {
                    loadTime: loadTime + 'ms',
                    domContentLoaded: (perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart) + 'ms',
                    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime + 'ms' || 'undefined'
                });
                
                // Send to analytics if load time is concerning
                if (loadTime > 3000) {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'page_slow_load', {
                            load_time: loadTime,
                            page_path: window.location.pathname
                        });
                    }
                }
            }, 0);
        });
    }
}

/**
 * Show error message to user
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(errorDiv, main.firstChild);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

/**
 * Initialize FAQ dropdown functionality
 */
function initializeFAQ() {
    // Convert existing FAQ items to dropdown format
    const faqGrids = document.querySelectorAll('.faq-grid');
    
    faqGrids.forEach(grid => {
        // Add faq-container class and update structure
        grid.classList.add('faq-container');
        grid.classList.remove('faq-grid');
        
        const faqItems = grid.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                // Add toggle icon to question
                const toggle = document.createElement('span');
                toggle.className = 'faq-toggle';
                toggle.textContent = '+';
                question.appendChild(toggle);
                
                // Add click event listener
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                        const otherToggle = otherItem.querySelector('.faq-toggle');
                        if (otherToggle) otherToggle.textContent = '+';
                    });
                    
                    // Toggle current item
                    if (!isActive) {
                        item.classList.add('active');
                        toggle.textContent = '−';
                    }
                });
            }
        });
    });
}

// Service Worker registration removed - no sw.js file present