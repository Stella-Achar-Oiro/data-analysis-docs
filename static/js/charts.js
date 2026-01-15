/**
 * Chart.js Configuration and Initialization
 * Creates all charts for dashboard and documentation
 */

// Chart.js default configuration
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.color = '#6c757d';

// Color palette
const chartColors = {
    primary: '#007bff',
    primaryLight: 'rgba(0, 123, 255, 0.1)',
    success: '#28a745',
    successLight: 'rgba(40, 167, 69, 0.1)',
    warning: '#ffc107',
    warningLight: 'rgba(255, 193, 7, 0.1)',
    danger: '#dc3545',
    dangerLight: 'rgba(220, 53, 69, 0.1)',
    info: '#17a2b8',
    infoLight: 'rgba(23, 162, 184, 0.1)',
    purple: '#8b5cf6',
    purpleLight: 'rgba(139, 92, 246, 0.1)',
    gray: '#6c757d',
    grayLight: 'rgba(108, 117, 125, 0.1)'
};

// Anonymous sample data
const sampleData = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [45000, 52000, 48000, 67000, 75000, 82000, 78000, 91000, 98000, 105000, 112000, 125000],
    orders: [150, 175, 160, 220, 250, 275, 260, 305, 328, 352, 375, 418],
    customers: [80, 95, 88, 115, 130, 142, 135, 158, 170, 182, 195, 210],
    products: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        values: [125000, 98000, 87000, 65000, 52000]
    },
    categories: {
        labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'],
        values: [285000, 195000, 165000, 125000, 85000]
    },
    segments: {
        labels: ['High Value', 'Regular', 'Occasional'],
        values: [45, 105, 150],
        percentages: [15, 35, 50]
    },
    regions: {
        labels: ['Region A', 'Region B', 'Region C', 'Region D'],
        values: [320000, 275000, 198000, 162000]
    }
};

/**
 * Format currency values
 */
function formatCurrency(value) {
    return '$' + value.toLocaleString();
}

/**
 * Create Revenue Trend Chart (Line)
 */
function createRevenueTrendChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampleData.months,
            datasets: [{
                label: 'Revenue ($)',
                data: sampleData.revenue,
                borderColor: chartColors.primary,
                backgroundColor: chartColors.primaryLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Revenue: ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

/**
 * Create Top Products Chart (Horizontal Bar)
 */
function createTopProductsChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sampleData.products.labels,
            datasets: [{
                label: 'Sales ($)',
                data: sampleData.products.values,
                backgroundColor: [
                    chartColors.primary,
                    chartColors.success,
                    chartColors.info,
                    chartColors.warning,
                    chartColors.purple
                ],
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.x);
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * Create Category Chart (Doughnut)
 */
function createCategoryChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: sampleData.categories.labels,
            datasets: [{
                data: sampleData.categories.values,
                backgroundColor: [
                    chartColors.primary,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.info,
                    chartColors.purple
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.parsed / total) * 100);
                            return context.label + ': ' + formatCurrency(context.parsed) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Customer Segments Chart (Pie)
 */
function createSegmentsChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: sampleData.segments.labels.map((label, i) =>
                label + ' (' + sampleData.segments.percentages[i] + '%)'
            ),
            datasets: [{
                data: sampleData.segments.values,
                backgroundColor: [
                    chartColors.success,
                    chartColors.primary,
                    chartColors.gray
                ],
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.parsed + ' customers';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Regional Performance Chart (Bar)
 */
function createRegionalChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sampleData.regions.labels,
            datasets: [{
                label: 'Revenue ($)',
                data: sampleData.regions.values,
                backgroundColor: chartColors.primary,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create Orders Trend Chart (Line with area)
 */
function createOrdersTrendChart(canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: sampleData.months,
            datasets: [{
                label: 'Orders',
                data: sampleData.orders,
                borderColor: chartColors.info,
                backgroundColor: chartColors.infoLight,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: chartColors.info,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(33, 37, 41, 0.9)',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

/**
 * Initialize all dashboard charts
 */
function initializeDashboardCharts() {
    createRevenueTrendChart('revenueTrendChart');
    createTopProductsChart('topProductsChart');
    createCategoryChart('categoryChart');
    createSegmentsChart('segmentsChart');
    createRegionalChart('regionalChart');
}

/**
 * Initialize charts within documentation content
 */
function initializeDocCharts() {
    // Look for chart containers with specific data attributes
    document.querySelectorAll('[data-chart]').forEach(container => {
        const chartType = container.dataset.chart;
        const canvasId = container.querySelector('canvas')?.id;

        if (!canvasId) return;

        switch (chartType) {
            case 'revenue':
                createRevenueTrendChart(canvasId);
                break;
            case 'products':
                createTopProductsChart(canvasId);
                break;
            case 'categories':
                createCategoryChart(canvasId);
                break;
            case 'segments':
                createSegmentsChart(canvasId);
                break;
            case 'regions':
                createRegionalChart(canvasId);
                break;
            case 'orders':
                createOrdersTrendChart(canvasId);
                break;
        }
    });
}

// Export functions for use in templates
window.initializeDashboardCharts = initializeDashboardCharts;
window.initializeDocCharts = initializeDocCharts;
window.createRevenueTrendChart = createRevenueTrendChart;
window.createTopProductsChart = createTopProductsChart;
window.createCategoryChart = createCategoryChart;
window.createSegmentsChart = createSegmentsChart;
window.createRegionalChart = createRegionalChart;
window.createOrdersTrendChart = createOrdersTrendChart;
