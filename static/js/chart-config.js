/**
 * Chart Configuration and Color Palettes
 * Beautiful color schemes for data visualization
 */

// Modern color palettes
const ChartColors = {
    primary: [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30cfd0'
    ],
    vibrant: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ],
    pastel: [
        '#FFB6C1', '#B0E0E6', '#DDA0DD', '#F0E68C',
        '#98FB98', '#FFE4B5', '#E0BBE4', '#FFDAB9'
    ],
    professional: [
        '#2C3E50', '#E74C3C', '#3498DB', '#2ECC71',
        '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22'
    ],
    gradient: [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(240, 147, 251, 0.8)',
        'rgba(79, 172, 254, 0.8)',
        'rgba(67, 233, 123, 0.8)',
        'rgba(250, 112, 154, 0.8)',
        'rgba(254, 225, 64, 0.8)',
        'rgba(48, 207, 208, 0.8)'
    ]
};

// Chart layout configurations
const ChartLayouts = {
    light: {
        plot_bgcolor: 'rgba(248, 250, 252, 0.5)',
        paper_bgcolor: 'rgba(255, 255, 255, 0.9)',
        font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 13,
            color: '#1e293b'
        },
        gridcolor: 'rgba(226, 232, 240, 0.8)',
        zerolinecolor: 'rgba(148, 163, 184, 0.5)'
    },
    dark: {
        plot_bgcolor: 'rgba(15, 23, 42, 0.5)',
        paper_bgcolor: 'rgba(30, 41, 59, 0.9)',
        font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 13,
            color: '#f1f5f9'
        },
        gridcolor: 'rgba(51, 65, 85, 0.8)',
        zerolinecolor: 'rgba(100, 116, 139, 0.5)'
    }
};

// Get current theme
function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
}

// Get theme-aware layout
function getChartLayout(title = '', xTitle = '', yTitle = '') {
    const theme = getCurrentTheme();
    const baseLayout = ChartLayouts[theme];
    
    return {
        title: {
            text: title,
            font: {
                ...baseLayout.font,
                size: 16,
                weight: 600
            }
        },
        xaxis: {
            title: xTitle,
            gridcolor: baseLayout.gridcolor,
            zerolinecolor: baseLayout.zerolinecolor,
            showgrid: true
        },
        yaxis: {
            title: yTitle,
            gridcolor: baseLayout.gridcolor,
            zerolinecolor: baseLayout.zerolinecolor,
            showgrid: true
        },
        plot_bgcolor: baseLayout.plot_bgcolor,
        paper_bgcolor: baseLayout.paper_bgcolor,
        font: baseLayout.font,
        hovermode: 'closest',
        showlegend: true,
        legend: {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            bordercolor: baseLayout.gridcolor,
            borderwidth: 1
        },
        margin: {
            l: 60,
            r: 40,
            t: 60,
            b: 60
        }
    };
}

// Enhanced configuration for scatter plots
function getScatterConfig(clusterCount) {
    return {
        colors: ChartColors.vibrant.slice(0, clusterCount),
        marker: {
            size: 10,
            opacity: 0.7,
            line: {
                color: 'white',
                width: 1
            }
        },
        mode: 'markers'
    };
}

// Enhanced configuration for bar charts
function getBarConfig() {
    return {
        marker: {
            color: ChartColors.gradient,
            line: {
                color: 'rgba(255, 255, 255, 0.5)',
                width: 1
            },
            opacity: 0.85
        }
    };
}

// Enhanced configuration for heatmaps
function getHeatmapConfig() {
    return {
        colorscale: [
            [0, '#667eea'],
            [0.5, '#f5f5f5'],
            [1, '#f093fb']
        ],
        showscale: true,
        colorbar: {
            thickness: 15,
            len: 0.7
        }
    };
}

// Chart animation configuration
const ChartAnimationConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true,
    toImageButtonOptions: {
        format: 'png',
        filename: 'customer_segmentation_chart',
        height: 800,
        width: 1200,
        scale: 2
    }
};

// Export configurations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ChartColors,
        ChartLayouts,
        getChartLayout,
        getScatterConfig,
        getBarConfig,
        getHeatmapConfig,
        ChartAnimationConfig
    };
}
