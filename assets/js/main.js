/**
 * Sleep Support Guide - Main JavaScript
 * Professional affiliate comparison microsite per specification
 * Age 40+ optimized with comprehensive tracking
 */

// Product data store - loads from /data/offers.json
let productData = {
    supplements: [],
    non_pill: []
};

// UUID generator function - per specification
function uuid() {
    return crypto.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// URL parameters helper - per specification
function params() {
    const u = new URL(location.href), o = {};
    for (const [k, v] of u.searchParams) o[k] = v;
    return o;
}

// Outbound click tracking - per specification
function trackOutboundClick(e) {
    const a = e.target.closest('a.cta');
    if (!a) return;
    const payload = {
        event: 'outbound_click',
        offer: a.dataset.offer,
        page_path: location.pathname,
        event_id: uuid(),
        ...params()
    };
    navigator.sendBeacon?.('https://REPLACE-KEITARO-ENDPOINT', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    window.gtag && gtag('event', 'outbound_click', payload);
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Load product data
    loadProductData();
    
    // Setup outbound click tracking
    document.addEventListener('click', trackOutboundClick, true);
    
    // Auto "Updated:" stamps - per specification
    document.querySelectorAll('[data-updated]').forEach(el => {
        const d = new Date(), m = d.toLocaleString('en-US', { month: 'long' }), y = d.getFullYear();
        el.textContent = `Updated: ${m} ${y}`;
    });
    
    // Initialize table functionality
    initializeTables();
    
    // Setup accessibility features
    setupAccessibility();
    
    // Setup performance monitoring
    setupPerformanceMonitoring();
}

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
        if (currentPage === 'non-pill-solutions' || currentPage === 'supplements') {
            populateComparisonTable(currentPage);
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

/**
 * Populate comparison table with data
 */
function populateComparisonTable(type) {
    const tableBodyId = type === 'non-pill-solutions' ? 'nonPillTableBody' : 'supplementsTableBody';
    const tableBody = document.getElementById(tableBodyId);
    const dataKey = type === 'non-pill-solutions' ? 'non_pill' : 'supplements';
    
    if (!tableBody || !productData[dataKey]) return;
    
    tableBody.innerHTML = '';
    
    // Sort supplements by rank_priority (1 = highest payout)
    const data = type === 'supplements' 
        ? [...productData[dataKey]].sort((a, b) => a.rank_priority - b.rank_priority)
        : productData[dataKey];
    
    data.forEach((product, index) => {
        const row = createTableRow(product, type, index);
        tableBody.appendChild(row);
    });
}

/**
 * Create table row for product
 */
function createTableRow(product, type, index) {
    const row = document.createElement('tr');
    row.className = 'product-row';
    row.setAttribute('data-product-slug', product.slug);
    
    if (type === 'non-pill-solutions') {
        row.innerHTML = `
            <td>
                <div class="product-name">${product.name}</div>
            </td>
            <td><span class="text-sm">${product.type}</span></td>
            <td><span class="text-sm">${product.comfort}</span></td>
            <td><span class="text-sm">${product.care}</span></td>
            <td><span class="text-sm">${product.trial}</span></td>
            <td>
                <div class="cta-buttons">
                    <a class="cta" data-offer="${product.slug}" href="${product.cta_url}" target="_blank" rel="nofollow sponsored noopener">Check Price</a>
                    <a class="ghost" href="#">Read Guide</a>
                </div>
            </td>
        `;
    } else if (type === 'supplements') {
        // Per specification - supplements table with rank_priority ordering
        row.innerHTML = `
            <td>
                <div class="product-name">${product.name}</div>
            </td>
            <td><span class="text-sm">${product.form}</span></td>
            <td><span class="text-sm">${product.key_points.join(', ')}</span></td>
            <td><span class="text-sm">${product.notes}</span></td>
            <td><span class="text-sm">${product.guarantee}</span></td>
            <td>
                <div class="cta-buttons">
                    <a class="cta" data-offer="${product.slug}" href="${product.cta_url}" target="_blank" rel="nofollow sponsored noopener">Check Price</a>
                    <a class="ghost" href="#">Read Review</a>
                </div>
            </td>
        `;
    }
    
    return row;
}

/**
 * Initialize table functionality
 */
function initializeTables() {
    // Add global sort table function to window
    window.sortTable = sortTable;
}

/**
 * Sort table by column
 */
function sortTable(columnIndex) {
    const table = document.querySelector('.comparison-table');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);
    
    // Get current sort direction
    const currentDirection = table.getAttribute('data-sort-dir') || 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    table.setAttribute('data-sort-dir', newDirection);
    
    // Sort rows
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        
        // Standard text comparison
        if (newDirection === 'asc') {
            return aText.localeCompare(bText, undefined, { numeric: true });
        } else {
            return bText.localeCompare(aText, undefined, { numeric: true });
        }
    });
    
    // Rebuild table body
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort indicators
    updateSortIndicators(table, columnIndex, newDirection);
    
    // Announce sort to screen readers
    announceToScreenReader(`Table sorted by column ${columnIndex + 1}, ${newDirection}ending order`);
}

/**
 * Update sort indicators in table headers
 */
function updateSortIndicators(table, activeColumn, direction) {
    const indicators = table.querySelectorAll('.sort-indicator');
    indicators.forEach((indicator, index) => {
        if (index === activeColumn) {
            indicator.textContent = direction === 'asc' ? '↑' : '↓';
            indicator.setAttribute('aria-label', `Sorted ${direction}ending`);
        } else {
            indicator.textContent = '⇅';
            indicator.setAttribute('aria-label', 'Sortable');
        }
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
    const tables = document.querySelectorAll('.comparison-table');
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
        
        // Add keyboard navigation
        table.addEventListener('keydown', handleTableKeydown);
    });
}

/**
 * Handle keyboard navigation in tables
 */
function handleTableKeydown(event) {
    const target = event.target;
    if (!target.matches('th[onclick]')) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        target.click();
    }
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