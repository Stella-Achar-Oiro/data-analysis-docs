/**
 * Security Features for Documentation System
 * Implements copy protection, print blocking, and access logging
 */

(function() {
    'use strict';

    // Configuration
    const SESSION_TIMEOUT_MINUTES = 15;
    const IDLE_TIMEOUT_MINUTES = 10;

    // Session tracking
    let sessionStart = Date.now();
    let lastActivity = Date.now();

    /**
     * Log security event to server
     */
    async function logSecurityEvent(action, details = '') {
        try {
            const pathParts = window.location.pathname.split('/');
            const module = pathParts[2] || 'general';
            const topic = pathParts[3] || 'general';

            await fetch(`/api/log-print/${module}/${topic}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });
        } catch (error) {
            console.warn('Failed to log security event');
        }
    }

    /**
     * Show security warning modal
     */
    function showSecurityWarning(message) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 32px;
            border-radius: 12px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        `;

        modal.innerHTML = `
            <div style="font-size: 48px; color: #dc3545; margin-bottom: 16px;">
                <i class="fas fa-shield-alt"></i>
            </div>
            <h3 style="font-size: 20px; font-weight: 600; color: #212529; margin-bottom: 12px;">
                Security Notice
            </h3>
            <p style="font-size: 14px; color: #6c757d; margin-bottom: 24px;">
                ${message}
            </p>
            <button onclick="this.closest('div').parentElement.remove()" style="
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
            ">
                I Understand
            </button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 5000);
    }

    /**
     * Disable right-click context menu
     */
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        logSecurityEvent('RIGHT_CLICK_ATTEMPT');
        showSecurityWarning('Right-click is disabled for security purposes. This action has been logged.');
        return false;
    });

    /**
     * Disable text selection on protected content
     */
    document.addEventListener('selectstart', function(e) {
        const target = e.target;
        const isProtected = target.closest('.doc-content, .dashboard-container, .chart-container');
        if (isProtected) {
            e.preventDefault();
            return false;
        }
    });

    /**
     * Block keyboard shortcuts
     */
    document.addEventListener('keydown', function(e) {
        // Update activity timestamp
        lastActivity = Date.now();

        // Ctrl/Cmd + S (Save)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            logSecurityEvent('SAVE_ATTEMPT');
            showSecurityWarning('Saving is disabled. This documentation is view-only.');
            return false;
        }

        // Ctrl/Cmd + P (Print)
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            logSecurityEvent('PRINT_ATTEMPT');
            showSecurityWarning('Printing is disabled. Your print attempt has been logged.');
            return false;
        }

        // Ctrl/Cmd + C (Copy) on protected content
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            const selection = window.getSelection();
            const selectedElement = selection.anchorNode?.parentElement;
            if (selectedElement && selectedElement.closest('.doc-content, .dashboard-container')) {
                e.preventDefault();
                logSecurityEvent('COPY_ATTEMPT');
                showSecurityWarning('Copying is disabled. This content is protected.');
                return false;
            }
        }

        // Ctrl/Cmd + U (View Source)
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
            e.preventDefault();
            logSecurityEvent('VIEW_SOURCE_ATTEMPT');
            return false;
        }

        // Ctrl/Cmd + Shift + I (Dev Tools)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            logSecurityEvent('DEVTOOLS_ATTEMPT');
            return false;
        }

        // Ctrl/Cmd + Shift + J (Console)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
            e.preventDefault();
            logSecurityEvent('DEVTOOLS_ATTEMPT');
            return false;
        }

        // F12 (Dev Tools)
        if (e.key === 'F12') {
            e.preventDefault();
            logSecurityEvent('DEVTOOLS_ATTEMPT');
            return false;
        }

        // Ctrl/Cmd + Shift + C (Element Inspector)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            logSecurityEvent('INSPECTOR_ATTEMPT');
            return false;
        }
    });

    /**
     * Block drag events on images and content
     */
    document.addEventListener('dragstart', function(e) {
        const target = e.target;
        if (target.tagName === 'IMG' || target.closest('.doc-content, .dashboard-container')) {
            e.preventDefault();
            logSecurityEvent('DRAG_ATTEMPT');
            return false;
        }
    });

    /**
     * Session timeout checker
     */
    function checkSessionTimeout() {
        const elapsed = Date.now() - sessionStart;
        const idleTime = Date.now() - lastActivity;

        // Check total session timeout
        if (elapsed > SESSION_TIMEOUT_MINUTES * 60 * 1000) {
            logSecurityEvent('SESSION_TIMEOUT');
            window.location.href = '/logout?reason=timeout';
            return;
        }

        // Check idle timeout
        if (idleTime > IDLE_TIMEOUT_MINUTES * 60 * 1000) {
            logSecurityEvent('IDLE_TIMEOUT');
            showSessionWarning();
        }
    }

    /**
     * Show session expiring warning
     */
    function showSessionWarning() {
        const overlay = document.createElement('div');
        overlay.id = 'sessionWarning';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        `;

        overlay.innerHTML = `
            <div style="
                background: white;
                padding: 32px;
                border-radius: 12px;
                max-width: 400px;
                text-align: center;
            ">
                <div style="font-size: 48px; color: #ffc107; margin-bottom: 16px;">
                    <i class="fas fa-clock"></i>
                </div>
                <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">
                    Session Expiring
                </h3>
                <p style="font-size: 14px; color: #6c757d; margin-bottom: 24px;">
                    Your session is about to expire due to inactivity. Click continue to stay logged in.
                </p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button onclick="window.location.href='/logout'" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 14px;
                        cursor: pointer;
                    ">
                        Logout
                    </button>
                    <button onclick="continueSession()" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 14px;
                        cursor: pointer;
                    ">
                        Continue
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
    }

    /**
     * Continue session
     */
    window.continueSession = function() {
        lastActivity = Date.now();
        const warning = document.getElementById('sessionWarning');
        if (warning) {
            warning.remove();
        }
    };

    /**
     * Track user activity
     */
    ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, function() {
            lastActivity = Date.now();
        }, { passive: true });
    });

    /**
     * Window blur detection (tab switching)
     */
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            logSecurityEvent('TAB_HIDDEN');
        }
    });

    /**
     * Before print event
     */
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        logSecurityEvent('PRINT_ATTEMPT');
        return false;
    });

    /**
     * Initialize security features
     */
    function initSecurity() {
        // Apply user-select: none to protected content
        const protectedElements = document.querySelectorAll('.doc-content, .dashboard-container, .chart-container');
        protectedElements.forEach(el => {
            el.style.userSelect = 'none';
            el.style.webkitUserSelect = 'none';
            el.style.mozUserSelect = 'none';
            el.style.msUserSelect = 'none';
        });

        // Disable image dragging
        document.querySelectorAll('img').forEach(img => {
            img.draggable = false;
        });

        // Start session timeout checker
        setInterval(checkSessionTimeout, 60000); // Check every minute

        // Log page view
        logSecurityEvent('PAGE_VIEW');

        console.log('%cSecurity Active', 'color: #28a745; font-weight: bold; font-size: 14px;');
        console.log('%cThis documentation is protected. All actions are logged.', 'color: #6c757d; font-size: 12px;');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

})();
