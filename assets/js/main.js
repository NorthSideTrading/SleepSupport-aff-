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
}

// === Outbound click tracking ===
document.addEventListener('click', e=>{
    const a=e.target.closest('a.cta'); if(!a) return;
    const payload={event:'outbound_click',offer:a.dataset.offer||a.textContent.trim(),page_path:location.pathname,event_id:uuid(),...params()};
    navigator.sendBeacon?.('https://REPLACE-KEITARO-ENDPOINT', new Blob([JSON.stringify(payload)],{type:'application/json'}));
    window.gtag && gtag('event','outbound_click', payload);
}, true);

/**
 * Load product data from JSON file
 */
async function loadProductData() {
    try {
        const response = await fetch('/data/offers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        productData = await response.json();
        
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

// === When hydrating tables, flag first row as Top Pick ===
function renderSupplements(items){
    const tbody=document.getElementById('supp-table'); if(!tbody) return;
    tbody.innerHTML='';
    // Sort by rank_priority (1 = highest payout)
    const sortedItems = [...items].sort((a, b) => a.rank_priority - b.rank_priority);
    
    sortedItems.forEach((it, i)=>{
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
                <div class="product-cell">
                    <div class="product-image">
                        <img src="${it.img}" alt="${it.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <div class="k">${it.name}</div>
                        <div class="rating">${rating}</div>
                        <div class="small">${it.form||''}</div>
                        ${badge}
                    </div>
                </div>
            </td>
            <td><span class="small">${it.form||''}</span></td>
            <td>
                <div class="key-points">
                    ${(it.key_points||[]).slice(0,3).map(point => `<div class="key-point">• ${point}</div>`).join('')}
                </div>
            </td>
            <td><span class="small">${it.notes||''}</span></td>
            <td><span class="small">${it.guarantee||'—'}</span></td>
            <td>
                <a class="btn btn-primary cta" data-offer="${it.slug}" href="${it.cta_url}" target="_blank" rel="nofollow sponsored noopener">Check Price</a>
                <a class="btn btn-ghost mt8" href="#">Read Review</a>
            </td>`;
        tbody.appendChild(tr);
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

// Service Worker registration - per specification
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}