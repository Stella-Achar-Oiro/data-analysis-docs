/**
 * Mermaid.js Initialization and Configuration
 * Handles diagram rendering in documentation
 */

(function() {
    'use strict';

    // Mermaid configuration
    const mermaidConfig = {
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
            // Primary colors
            primaryColor: '#e7f1ff',
            primaryBorderColor: '#007bff',
            primaryTextColor: '#212529',

            // Secondary colors
            secondaryColor: '#f8f9fa',
            secondaryBorderColor: '#dee2e6',
            secondaryTextColor: '#6c757d',

            // Tertiary colors
            tertiaryColor: '#d4edda',
            tertiaryBorderColor: '#28a745',
            tertiaryTextColor: '#155724',

            // Line and text colors
            lineColor: '#007bff',
            textColor: '#212529',

            // Flowchart specific
            nodeBorder: '#007bff',
            nodeTextColor: '#212529',
            clusterBkg: '#f8f9fa',
            clusterBorder: '#dee2e6',

            // Sequence diagram
            actorBkg: '#e7f1ff',
            actorBorder: '#007bff',
            actorTextColor: '#212529',
            signalColor: '#007bff',

            // Font
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px'
        },
        flowchart: {
            htmlLabels: true,
            curve: 'basis',
            padding: 20,
            nodeSpacing: 50,
            rankSpacing: 50,
            useMaxWidth: true
        },
        sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
            useMaxWidth: true
        },
        gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            barGap: 4,
            topPadding: 50,
            leftPadding: 75,
            gridLineStartPadding: 35,
            fontSize: 11,
            sectionFontSize: 11,
            numberSectionStyles: 4,
            axisFormat: '%Y-%m-%d'
        }
    };

    /**
     * Initialize Mermaid
     */
    function initMermaid() {
        if (typeof mermaid === 'undefined') {
            console.warn('Mermaid.js not loaded');
            return;
        }

        mermaid.initialize(mermaidConfig);

        // Process all mermaid diagrams
        renderMermaidDiagrams();
    }

    /**
     * Render all Mermaid diagrams on the page
     */
    async function renderMermaidDiagrams() {
        const diagrams = document.querySelectorAll('.mermaid, pre code.language-mermaid');

        for (let i = 0; i < diagrams.length; i++) {
            const element = diagrams[i];

            // Skip if already rendered
            if (element.dataset.processed === 'true') continue;

            try {
                let graphDefinition = element.textContent.trim();

                // Create container for rendered diagram
                const container = document.createElement('div');
                container.className = 'mermaid-container';

                // Generate unique ID
                const id = `mermaid-${Date.now()}-${i}`;

                // Render the diagram
                const { svg } = await mermaid.render(id, graphDefinition);

                // Insert rendered SVG
                container.innerHTML = svg;

                // Add watermark overlay
                const watermark = document.createElement('div');
                watermark.className = 'diagram-watermark';
                watermark.textContent = 'DEMO';
                container.appendChild(watermark);

                // Replace original element
                if (element.tagName === 'CODE') {
                    element.parentElement.replaceWith(container);
                } else {
                    element.innerHTML = container.innerHTML;
                    element.dataset.processed = 'true';
                }

            } catch (error) {
                console.error('Mermaid rendering error:', error);
                element.innerHTML = `<div class="mermaid-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Diagram rendering failed</span>
                </div>`;
            }
        }
    }

    /**
     * Add CSS for mermaid containers
     */
    function addMermaidStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .mermaid-container {
                position: relative;
                background: #f8f9fa;
                border-radius: 8px;
                padding: 24px;
                margin: 20px 0;
                overflow-x: auto;
            }

            .mermaid-container svg {
                max-width: 100%;
                height: auto;
            }

            .diagram-watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 64px;
                font-weight: 700;
                color: rgba(0, 123, 255, 0.04);
                pointer-events: none;
                white-space: nowrap;
                z-index: 1;
            }

            .mermaid-error {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 16px;
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 8px;
                color: #dc3545;
                font-size: 14px;
            }

            .mermaid-error i {
                font-size: 18px;
            }

            /* Override mermaid default styles */
            .mermaid .node rect,
            .mermaid .node circle,
            .mermaid .node ellipse,
            .mermaid .node polygon {
                stroke-width: 2px;
            }

            .mermaid .edgePath .path {
                stroke-width: 2px;
            }

            .mermaid .cluster rect {
                stroke-width: 1px;
            }
        `;
        document.head.appendChild(styles);
    }

    /**
     * Observe DOM for dynamically added diagrams
     */
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            let hasNewDiagrams = false;

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains('mermaid') ||
                            node.querySelector?.('.mermaid, pre code.language-mermaid')) {
                            hasNewDiagrams = true;
                        }
                    }
                });
            });

            if (hasNewDiagrams) {
                setTimeout(renderMermaidDiagrams, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize when DOM is ready
    function init() {
        addMermaidStyles();
        initMermaid();
        observeDOMChanges();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for manual re-rendering
    window.renderMermaidDiagrams = renderMermaidDiagrams;

})();
