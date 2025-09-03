/**
 * Sleep Help Hub - Main JavaScript
 * Professional affiliate comparison microsite
 * Age 40+ optimized with accessibility features
 */

// Product data store - loads from /data/offers.json
let productData = {
    devices: [],
    supplements: []
};

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
    
    // Initialize table functionality
    initializeTables();
    
    // Setup accessibility features
    setupAccessibility();
    
    // Setup performance monitoring
    setupPerformanceMonitoring();
    
    // Initialize mobile optimizations
    initializeMobileOptimizations();
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
        if (currentPage === 'devices' || currentPage === 'supplements') {
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
    if (path.includes('/devices/')) return 'devices';
    if (path.includes('/supplements/')) return 'supplements';
    return 'home';
}

/**
 * Populate comparison table with data
 */
function populateComparisonTable(type) {
    const tableBody = document.getElementById(`${type}-table-body`);
    if (!tableBody || !productData[type]) return;
    
    tableBody.innerHTML = '';
    
    productData[type].forEach((product, index) => {
        const row = createTableRow(product, type, index);
        tableBody.appendChild(row);
    });
    
    // Setup lazy loading for images if any
    setupLazyLoading();
}

/**
 * Create table row for product
 */
function createTableRow(product, type, index) {
    const row = document.createElement('tr');
    row.className = 'product-row';
    row.setAttribute('data-product-slug', product.slug);
    
    if (type === 'devices') {
        row.innerHTML = `
            <td>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.our_take}</div>
            </td>
            <td><span class="text-sm">${product.fit_type}</span></td>
            <td><span class="text-sm">${product.comfort}</span></td>
            <td><span class="text-sm">${product.care}</span></td>
            <td><span class="text-sm">${product.trial}</span></td>
            <td><span class="font-semibold">${product.price}</span></td>
            <td>
                <div class="table-actions">
                    <button 
                        onclick="trackOutboundClick(event, '${product.name}', '${product.cta_url}', 'check_price')" 
                        class="btn btn-primary"
                        data-testid="button-check-price-${product.slug}"
                        aria-label="Check price for ${product.name}">
                        Check Price
                    </button>
                    <button 
                        class="btn btn-secondary"
                        data-testid="button-read-review-${product.slug}"
                        aria-label="Read review for ${product.name}">
                        Read Review
                    </button>
                </div>
            </td>
        `;
    } else if (type === 'supplements') {
        row.innerHTML = `
            <td>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.our_take}</div>
            </td>
            <td><span class="text-sm">${product.form}</span></td>
            <td><span class="text-sm">${product.key_ingredients}</span></td>
            <td><span class="text-sm font-semibold" style="color: hsl(120, 60%, 30%);">${product.non_habit}</span></td>
            <td><span class="text-sm">${product.notes}</span></td>
            <td><span class="font-semibold">${product.price_per_serving}</span></td>
            <td>
                <div class="table-actions">
                    <button 
                        onclick="trackOutboundClick(event, '${product.name}', '${product.cta_url}', 'check_price')" 
                        class="btn btn-accent"
                        data-testid="button-check-price-${product.slug}"
                        aria-label="Check price for ${product.name}">
                        Check Price
                    </button>
                    <button 
                        class="btn btn-secondary"
                        data-testid="button-read-review-${product.slug}"
                        aria-label="Read review for ${product.name}">
                        Read Review
                    </button>
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
function sortTable(type, columnIndex) {
    const table = document.getElementById(`${type}-table`);
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
        
        // Handle price columns specially
        if (columnIndex === 5) {
            const aPrice = extractPrice(aText);
            const bPrice = extractPrice(bText);
            return newDirection === 'asc' ? aPrice - bPrice : bPrice - aPrice;
        }
        
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
 * Extract price value for comparison
 */
function extractPrice(priceText) {
    const match = priceText.match(/\$?([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
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
 * Track outbound affiliate clicks
 */
function trackOutboundClick(event, productName, url, action) {
    event.preventDefault();
    
    // Generate unique event ID (UUID v4 simplified)
    const eventId = generateEventId();
    
    // Collect tracking data
    const trackingData = {
        event_id: eventId,
        offer: productName,
        action: action,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        // UTM and click ID parameters
        gclid: getUrlParameter('gclid') || '',
        fbclid: getUrlParameter('fbclid') || '',
        utm_source: getUrlParameter('utm_source') || '',
        utm_medium: getUrlParameter('utm_medium') || '',
        utm_campaign: getUrlParameter('utm_campaign') || '',
        utm_term: getUrlParameter('utm_term') || '',
        utm_content: getUrlParameter('utm_content') || ''
    };
    
    // Send to Keitaro tracking endpoint (async, non-blocking)
    sendKeitaroTracking(trackingData);
    
    // Send to GA4 (if available)
    sendGA4Event(trackingData);
    
    // Open affiliate link after short delay to ensure tracking
    setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, 100);
    
    console.log('Outbound click tracked:', {
        product: productName,
        action: action,
        eventId: eventId
    });
}

/**
 * Send tracking data to Keitaro endpoint
 */
function sendKeitaroTracking(data) {
    // TODO: Replace with actual Keitaro tracking endpoint
    const keitaroEndpoint = process.env.KEITARO_ENDPOINT || '/api/track';
    
    if (navigator.sendBeacon) {
        // Use sendBeacon for reliability
        navigator.sendBeacon(keitaroEndpoint, JSON.stringify(data));
    } else {
        // Fallback to fetch with keepalive
        fetch(keitaroEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            keepalive: true
        }).catch(error => {
            console.warn('Keitaro tracking failed:', error);
        });
    }
}

/**
 * Send event to Google Analytics 4
 */
function sendGA4Event(data) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'outbound_click', {
            offer: data.offer,
            action: data.action,
            page_path: data.page_path,
            event_id: data.event_id,
            custom_parameter_1: data.utm_campaign || 'direct'
        });
    }
}

/**
 * Generate UUID v4 for event tracking
 */
function generateEventId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get URL parameter by name
 */
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Setup accessibility features
 */
function setupAccessibility() {
    // Add skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Enhance table keyboard navigation
    enhanceTableAccessibility();
    
    // Setup focus management for modals/dropdowns
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
 * Setup lazy loading for images
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
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
                
                // Log performance metrics
                console.log('Performance metrics:', {
                    loadTime: loadTime + 'ms',
                    domContentLoaded: (perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart) + 'ms',
                    firstPaint: performance.getEntriesByType('paint')[0]?.startTime + 'ms'
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
 * Initialize mobile optimizations
 */
function initializeMobileOptimizations() {
    // Touch-friendly table scrolling
    const tableWrappers = document.querySelectorAll('.table-wrapper');
    tableWrappers.forEach(wrapper => {
        wrapper.style.touchAction = 'pan-x';
    });
    
    // Mobile menu toggle if exists
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('open');
            mobileMenu.classList.toggle('open');
            mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
        });
    }
    
    // Optimize touch targets
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        if (rect.height < 44) {
            button.style.minHeight = '44px';
        }
    });
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
 * Smooth scroll utility
 */
function smoothScrollTo(target) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Utility: Debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for testing if in Node environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateEventId,
        extractPrice,
        getUrlParameter,
        debounce,
        throttle
    };
}

// Handle page visibility changes for analytics
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        // Send any pending analytics before page unload
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view_end', {
                page_path: window.location.pathname,
                engagement_time: Date.now() - performance.timing.navigationStart
            });
        }
    }
});

// Service Worker registration for offline functionality (optional)
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
