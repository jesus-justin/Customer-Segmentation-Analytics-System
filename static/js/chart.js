/**
 * chart.js
 * Enhanced with better documentation
 * Last updated: 2025-12-29
 */
/*
   Customer Segmentation Analytics System - JavaScript
   Handles all client-side interactions and API calls
*/

// Animated Counter Function
function animateCounter(element, target, duration = 1000, decimals = 0) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
    }, 16);
}

// Animate elements when they come into view
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate counters
                if (entry.target.classList.contains('stat-value') || 
                    entry.target.classList.contains('metric-value')) {
                    const value = parseFloat(entry.target.dataset.value || entry.target.textContent);
                    const decimals = entry.target.dataset.decimals || 0;
                    if (!isNaN(value)) {
                        animateCounter(entry.target, value, 1000, parseInt(decimals));
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.card, .stat-item, .metric-card').forEach(el => {
        observer.observe(el);
    });
}

// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-toggle-icon');
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Update charts on theme change if on results page
            if (window.location.pathname === '/results') {
                updateChartsTheme();
            }
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon theme-toggle-icon' : 'fas fa-sun theme-toggle-icon';
        }
    }
    
    // Initialize animation observers
    observeElements();
});

// Update chart themes
function updateChartsTheme() {
    const scatterDiv = document.getElementById('scatterPlot');
    const distDiv = document.getElementById('distributionChart');
    const heatmapDiv = document.getElementById('correlationHeatmap');
    
    // Update scatter plot if it exists
    if (scatterDiv && scatterDiv.data) {
        Plotly.relayout('scatterPlot', getChartLayout('Customer Segments Visualization'));
    }
    
    // Update distribution chart if it exists
    if (distDiv && distDiv.data) {
        Plotly.relayout('distributionChart', getChartLayout('Cluster Distribution'));
    }
    
    // Update heatmap if it exists
    if (heatmapDiv && heatmapDiv.data) {
        Plotly.relayout('correlationHeatmap', getChartLayout('Feature Correlation Heatmap'));
    }
}

// Global state
let fileSelected = false;
let dataLoaded = false;
let optimalClusters = null;

// DOM helpers and elements
const getEl = (id) => document.getElementById(id);
const uploadArea = getEl('uploadArea');
const fileInput = getEl('fileInput');
const uploadBtn = getEl('uploadBtn');
const fileInfo = getEl('fileInfo');
const fileName = getEl('fileName');
const dataStats = getEl('dataStats');
const nClustersSlider = getEl('nClusters');
const clusterValue = getEl('clusterValue');
const findOptimalBtn = getEl('findOptimalBtn');
const clusterBtn = getEl('clusterBtn');
const viewResultsBtn = getEl('viewResultsBtn');
const exportBtn = getEl('exportBtn');
const resetBtn = getEl('resetBtn');
const loadingSpinner = getEl('loadingSpinner');
const loadingText = getEl('loadingText');
const toast = getEl('toast');
    const stateHistory = getEl('stateHistory');
    const restoreStateBtn = getEl('restoreStateBtn');
    const saveStateBtn = getEl('saveStateBtn');
const sampleBtnId = 'loadSampleBtn';

const safeListen = (el, event, handler) => {
    if (!el) {
        return false;
    }
    el.addEventListener(event, handler);
    return true;
};

// Add Load Sample button if upload area is present
if (uploadArea && !document.getElementById(sampleBtnId)) {
    const btn = document.createElement('button');
    btn.id = sampleBtnId;
    btn.className = 'btn btn-secondary';
    btn.style.marginTop = '10px';
    btn.innerHTML = '<i class="fas fa-database"></i> Load Sample Dataset';
    uploadArea.parentElement.appendChild(btn);
    btn.addEventListener('click', async function(){
        showLoading(true, 'Loading sample dataset...');
        try {
            const res = await fetch('/api/sample-data', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                dataLoaded = true;
                findOptimalBtn && (findOptimalBtn.disabled = false);
                clusterBtn && (clusterBtn.disabled = false);
                // Display basic stats
                displayDataStats({ Age: { count: data.shape[0] } }, data.features || []);
                showToast('Sample dataset loaded', 'success');
            } else {
                showToast(data.error || 'Failed to load sample dataset', 'error');
            }
        } catch (e) {
            showToast('Network error while loading sample', 'error');
        } finally {
            showLoading(false);
        }
    });
}

// File Upload Handling (only binds on pages that have upload elements)
safeListen(uploadArea, 'click', () => fileInput && fileInput.click());

safeListen(uploadArea, 'dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2563eb';
    uploadArea.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
});

safeListen(uploadArea, 'dragleave', () => {
    uploadArea.style.borderColor = '#e2e8f0';
    uploadArea.style.backgroundColor = '#f8fafc';
});

safeListen(uploadArea, 'drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e2e8f0';
    uploadArea.style.backgroundColor = '#f8fafc';
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && fileInput) {
        fileInput.files = files;
        handleFileSelect();
    }
});

safeListen(fileInput, 'change', handleFileSelect);

function handleFileSelect() {
    const file = fileInput.files[0];
    if (file && file.name.endsWith('.csv')) {
        fileSelected = true;
        fileName.textContent = `✓ ${file.name}`;
        uploadBtn.style.display = 'inline-flex';
        uploadBtn.disabled = false;
        uploadArea.style.display = 'none';
        fileInfo.style.display = 'block';
    }
}

safeListen(uploadBtn, 'click', uploadFile);

async function uploadFile() {
    const file = fileInput.files[0];
    if (!file) {
        showToast('Please select a file', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    showLoading(true, 'Uploading and processing data...');

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            dataLoaded = true;
            displayDataStats(data.statistics, data.features);
            findOptimalBtn.disabled = false;
            clusterBtn.disabled = false;
            showToast('Data uploaded and processed successfully!', 'success');
        } else {
            showToast(data.error || 'Upload failed', 'error');
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function displayDataStats(statistics, features) {
    let statsHTML = '';
    
    // Display shape
    if (statistics.Age && statistics.Age.count) {
        const rows = Math.floor(statistics.Age.count);
        statsHTML += `
            <div class="stat-item">
                <div class="stat-label">Total Customers</div>
                <div class="stat-value">${rows}</div>
            </div>
        `;
    }
    
    // Display features
    statsHTML += `
        <div class="stat-item">
            <div class="stat-label">Features</div>
            <div class="stat-value">${features.length}</div>
        </div>
    `;

    dataStats.innerHTML = statsHTML;
    
    // Fetch and display data quality metrics
    fetch('/api/data-quality')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayDataQuality(data.metrics);
            }
        })
        .catch(error => console.error('Error fetching data quality metrics:', error));
}

function displayDataQuality(metrics) {
    const qualityDiv = document.getElementById('dataQuality');
    const qualityGrid = document.getElementById('qualityGrid');
    
    if (!qualityDiv || !metrics) return;
    
    let qualityHTML = '';
    
    // Display key metrics
    qualityHTML += `
        <div class="quality-metric">
            <div class="quality-label">Total Rows</div>
            <div class="quality-value">${metrics.total_rows}</div>
        </div>
        <div class="quality-metric">
            <div class="quality-label">Columns</div>
            <div class="quality-value">${metrics.total_columns}</div>
        </div>
        <div class="quality-metric ${metrics.duplicate_rows > 0 ? 'warning' : ''}">
            <div class="quality-label">Duplicates</div>
            <div class="quality-value">${metrics.duplicate_rows}</div>
        </div>
        <div class="quality-metric">
            <div class="quality-label">Memory (MB)</div>
            <div class="quality-value">${metrics.memory_usage_mb}</div>
        </div>
    `;
    
    qualityGrid.innerHTML = qualityHTML;
    qualityDiv.style.display = 'block';
}

// N-Clusters Slider
safeListen(nClustersSlider, 'input', (e) => {
    clusterValue.textContent = e.target.value;
});

// Find Optimal Clusters
safeListen(findOptimalBtn, 'click', findOptimalClusters);

async function findOptimalClusters() {
    if (!dataLoaded) {
        showToast('Please upload data first', 'error');
        return;
    }

    showLoading(true, 'Analyzing optimal clusters...');

    try {
        const response = await fetch('/api/optimal-clusters');
        const data = await response.json();

        if (data.success) {
            optimalClusters = data.optimal_k;
            displayOptimalChart(data.chart_data, data.optimal_k);
            showToast(`Optimal clusters: ${data.optimal_k}`, 'success');
        } else {
            showToast(data.error || 'Analysis failed', 'error');
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function displayOptimalChart(chartData, optimalK) {
    const optimalChart = document.getElementById('optimalChart');
    optimalChart.style.display = 'block';

    const trace = {
        x: chartData.x,
        y: chartData.y,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Silhouette Score',
        line: {
            color: ChartColors.vibrant[0],
            width: 4,
            shape: 'spline',
            smoothing: 1.3
        },
        marker: {
            size: 12,
            color: ChartColors.vibrant[0],
            line: {
                color: 'white',
                width: 2
            }
        },
        fill: 'tonexty',
        fillcolor: 'rgba(255, 107, 107, 0.1)'
    };

    const layout = getChartLayout(
        'Silhouette Score Analysis',
        'Number of Clusters (k)',
        'Silhouette Score'
    );

    Plotly.newPlot('silhouetteChart', [trace], layout, ChartAnimationConfig);

    const resultHTML = `
        <p style="color: #10b981; font-weight: bold; font-size: 1.1rem;">
            ✓ Optimal number of clusters: <span style="color: #2563eb; font-size: 1.3rem;">${optimalK}</span>
        </p>
        <p style="color: #64748b; margin-top: 0.5rem;">This value achieved the highest silhouette score and indicates the best cluster separation.</p>
    `;

    document.getElementById('optimalResult').innerHTML = resultHTML;

    // Update slider
    nClustersSlider.value = optimalK;
    clusterValue.textContent = optimalK;
}

// Clustering
safeListen(clusterBtn, 'click', performClustering);

async function performClustering() {
    if (!dataLoaded) {
        showToast('Please upload data first', 'error');
        return;
    }

    const nClusters = parseInt(nClustersSlider.value);

    showLoading(true, 'Performing K-Means clustering...');

    try {
        const response = await fetch('/api/cluster', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ n_clusters: nClusters })
        });

        const data = await response.json();

        if (data.success) {
            displayClusteringResults(data);
            viewResultsBtn.style.display = 'inline-flex';
            showToast('Clustering completed successfully!', 'success');
        } else {
            showToast(data.error || 'Clustering failed', 'error');
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function displayClusteringResults(data) {
    const clusteringResult = document.getElementById('clusteringResult');
    clusteringResult.style.display = 'block';

    let metricsHTML = '';

    // Silhouette Score
    metricsHTML += `
        <div class="metric-card success">
            <div class="metric-label">Silhouette Score</div>
            <div class="metric-value">${data.metrics.silhouette_score}</div>
        </div>
    `;

    // Davies-Bouldin Index
    metricsHTML += `
        <div class="metric-card">
            <div class="metric-label">Davies-Bouldin Index</div>
            <div class="metric-value">${data.metrics.davies_bouldin_score}</div>
        </div>
    `;

    // Number of Clusters
    metricsHTML += `
        <div class="metric-card warning">
            <div class="metric-label">Number of Clusters</div>
            <div class="metric-value">${data.n_clusters}</div>
        </div>
    `;

    document.getElementById('metricsGrid').innerHTML = metricsHTML;

    // Store cluster analysis for results page
    sessionStorage.setItem('clusterAnalysis', JSON.stringify(data.cluster_analysis));
    sessionStorage.setItem('recommendations', JSON.stringify(data.recommendations));
    sessionStorage.setItem('metrics', JSON.stringify(data.metrics));
    sessionStorage.setItem('clusterProfiles', JSON.stringify(data.cluster_profiles || {}));
    sessionStorage.setItem('centroids', JSON.stringify(data.centroids || {}));
}

// View Results Button
safeListen(viewResultsBtn, 'click', () => {
    window.location.href = '/results';
});

// Export Button
safeListen(exportBtn, 'click', exportResults);

async function exportResults() {
    showLoading(true, 'Exporting results...');

    try {
        const response = await fetch('/api/export');
        const data = await response.json();

        if (data.success) {
            showToast('Results exported successfully!', 'success');
        } else {
            showToast(data.error || 'Export failed', 'error');
        }
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

// Reset Button
safeListen(resetBtn, 'click', async () => {
    if (confirm('Are you sure you want to reset the analysis? This action cannot be undone.')) {
        showLoading(true, 'Resetting analysis...');

        try {
            const response = await fetch('/api/reset', { method: 'POST' });
            const data = await response.json();

            if (data.success) {
                showToast('Analysis reset. Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            showLoading(false);
        }
    }
});

// Results Page - Load Data
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/results') {
        loadResultsData();
    }

    // Fetch recent analysis metadata if section exists
    if (stateHistory) {
        loadStateHistory();
        safeListen(restoreStateBtn, 'click', restoreState);
        safeListen(saveStateBtn, 'click', saveStateNow);
    }
});

async function loadStateHistory() {
    const container = getEl('stateHistory');
    if (!container) return;
    try {
        const res = await fetch('/api/state-history');
        const data = await res.json();
        if (!data.success || !data.history || data.history.length === 0) {
            container.innerHTML = '<p class="text-muted">No saved analysis found yet.</p>';
            return;
        }
        const items = data.history.map((h) => {
            const sizeMb = (h.size_bytes / (1024 * 1024)).toFixed(2);
            return `<div class="history-row">
                <div>
                    <div class="history-label">Last saved</div>
                    <div class="history-value">${h.last_modified}</div>
                </div>
                <div class="history-meta">${sizeMb} MB</div>
            </div>`;
        }).join('');
        container.innerHTML = items;
        // Re-attach actions if re-rendered
        const restoreBtn = document.getElementById('restoreStateBtn');
        const saveBtn = document.getElementById('saveStateBtn');
        safeListen(restoreBtn, 'click', restoreState);
        safeListen(saveBtn, 'click', saveStateNow);
    } catch (e) {
        container.innerHTML = '<p class="text-muted">Could not load recent analysis.</p>';
    }
}

async function restoreState() {
    showLoading(true, 'Restoring last analysis...');
    try {
        const res = await fetch('/api/load-state', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            showToast('State restored. You can view results or rerun clustering.', 'success');
            // Enable downstream actions
            findOptimalBtn && (findOptimalBtn.disabled = false);
            clusterBtn && (clusterBtn.disabled = false);
        } else {
            showToast(data.message || data.error || 'No saved state found', 'warning');
        }
    } catch (e) {
        showToast('Failed to restore state', 'error');
    } finally {
        showLoading(false);
    }
}

async function saveStateNow() {
    showLoading(true, 'Saving current analysis...');
    try {
        const res = await fetch('/api/save-state', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            showToast('Analysis saved', 'success');
            loadStateHistory();
        } else {
            showToast(data.error || 'Save failed', 'error');
        }
    } catch (e) {
        showToast('Save request failed', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadResultsData() {
    showLoading(true, 'Generating visualizations...');

    try {
        // Attempt to pull fresh analysis from the API, fall back to sessionStorage if unavailable
        let clusterAnalysis = null;
        let recommendations = null;
        let metrics = null;
        let profiles = null;

        try {
            const response = await fetch('/api/cluster-data');
            const apiData = await response.json();

            if (apiData.success) {
                clusterAnalysis = apiData.cluster_analysis;
                recommendations = apiData.recommendations;
                metrics = apiData.metrics;
                profiles = apiData.cluster_profiles || apiData.profiles;
            } else {
                showToast(apiData.error || 'No cluster data available. Run clustering first.', 'warning');
                clusterAnalysis = JSON.parse(sessionStorage.getItem('clusterAnalysis') || '{}');
                recommendations = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
                metrics = JSON.parse(sessionStorage.getItem('metrics') || '{}');
                profiles = JSON.parse(sessionStorage.getItem('clusterProfiles') || '{}');
            }
        } catch (fetchError) {
            // Graceful degradation to sessionStorage so results page still renders after redirect
            clusterAnalysis = JSON.parse(sessionStorage.getItem('clusterAnalysis') || '{}');
            recommendations = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
            metrics = JSON.parse(sessionStorage.getItem('metrics') || '{}');
            profiles = JSON.parse(sessionStorage.getItem('clusterProfiles') || '{}');
        }

        const metricsDisplay = getEl('metricsDisplay');
        if (metricsDisplay && metrics && Object.keys(metrics).length > 0) {
            let metricsHTML = '';
            metricsHTML += `
                <div class="metric-card success">
                    <div class="metric-label">Silhouette Score</div>
                    <div class="metric-value">${metrics.silhouette_score}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-label">Davies-Bouldin Index</div>
                    <div class="metric-value">${metrics.davies_bouldin_score}</div>
                </div>
            `;
            metricsDisplay.innerHTML = metricsHTML;
        } else if (metricsDisplay) {
            metricsDisplay.innerHTML = '<p class="text-muted">No metrics available yet. Upload data and run clustering.</p>';
        }

        const analysisDiv = getEl('clusterAnalysis');
        if (analysisDiv && clusterAnalysis && Object.keys(clusterAnalysis).length > 0) {
            let analysisHTML = '';
            for (const [clusterId, analysis] of Object.entries(clusterAnalysis)) {
                analysisHTML += `
                    <div class="cluster-item">
                        <h3>Cluster ${clusterId}</h3>
                        <div class="cluster-stats">
                            <div class="cluster-stat">
                                <div class="cluster-stat-label">Size</div>
                                <div class="cluster-stat-value">${analysis.size}</div>
                            </div>
                            <div class="cluster-stat">
                                <div class="cluster-stat-label">Percentage</div>
                                <div class="cluster-stat-value">${analysis.percentage}%</div>
                            </div>
                        </div>
                    </div>
                `;
            }
            analysisDiv.innerHTML = analysisHTML;
        } else if (analysisDiv) {
            analysisDiv.innerHTML = '<p class="text-muted">No cluster analysis to display.</p>';
        }

        const recDiv = getEl('recommendationsDisplay');
        if (recDiv && recommendations && Object.keys(recommendations).length > 0) {
            let recommendationsHTML = '';
            for (const recommendation of Object.values(recommendations)) {
                recommendationsHTML += `
                    <div class="recommendation-item">
                        <div class="recommendation-text">${recommendation}</div>
                    </div>
                `;
            }
            recDiv.innerHTML = recommendationsHTML;
        } else if (recDiv) {
            recDiv.innerHTML = '<p class="text-muted">Recommendations will appear after clustering.</p>';
        }

        if (profiles && Object.keys(profiles).length > 0) {
            sessionStorage.setItem('clusterProfiles', JSON.stringify(profiles));
        }

        const profilesDiv = getEl('clusterProfiles');
        if (profilesDiv && profiles && Object.keys(profiles).length > 0) {
            let profilesHTML = '';
            for (const [clusterId, profile] of Object.entries(profiles)) {
                const meanValues = profile.mean_values || {};
                const featureHighlights = Object.entries(meanValues)
                    .slice(0, 5)
                    .map(([name, value]) => `<span class="badge">${name}: ${value}</span>`) 
                    .join('');
                profilesHTML += `
                    <div class="cluster-profile">
                        <div class="cluster-profile-header">
                            <span class="cluster-chip">Cluster ${clusterId}</span>
                            <span class="text-muted">${profile.count} customers • ${profile.percentage}%</span>
                        </div>
                        <div class="cluster-profile-body">${featureHighlights || '<span class="text-muted">No numeric features found.</span>'}</div>
                    </div>
                `;
            }
            profilesDiv.innerHTML = profilesHTML;
        } else if (profilesDiv) {
            profilesDiv.innerHTML = '<p class="text-muted">Profiles will appear after clustering.</p>';
        }

        await loadVisualizations();
        await loadCorrelationHeatmap();
    } catch (error) {
        showToast(`Error loading results: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

async function loadVisualizations() {
    const scatterPlot = getEl('scatterPlot');
    const distributionChart = getEl('distributionChart');

    if (!scatterPlot || !distributionChart) {
        return;
    }

    try {
        const vizResponse = await fetch('/api/visualizations');
        const vizData = await vizResponse.json();

        if (vizData.success) {
            // Apply theme-aware configuration to scatter chart
            const scatterLayout = {
                ...vizData.scatter_chart.layout,
                ...getChartLayout(
                    vizData.scatter_chart.layout.title?.text || 'Customer Segments Visualization',
                    vizData.scatter_chart.layout.xaxis?.title || 'Feature 1',
                    vizData.scatter_chart.layout.yaxis?.title || 'Feature 2'
                )
            };
            
            // Apply theme-aware configuration to distribution chart
            const distLayout = {
                ...vizData.distribution_chart.layout,
                ...getChartLayout(
                    vizData.distribution_chart.layout.title?.text || 'Cluster Distribution',
                    'Cluster ID',
                    'Number of Customers'
                )
            };
            
            Plotly.newPlot('scatterPlot', vizData.scatter_chart.data, scatterLayout, {responsive: true});
            Plotly.newPlot('distributionChart', vizData.distribution_chart.data, distLayout, {responsive: true});
        } else {
            // Show placeholder message
            scatterPlot.innerHTML = '<div class="chart-placeholder"><i class="fas fa-chart-scatter fa-3x"></i><p>Run clustering analysis to see customer segments visualization</p></div>';
            distributionChart.innerHTML = '<div class="chart-placeholder"><i class="fas fa-chart-bar fa-3x"></i><p>Cluster distribution will appear after analysis</p></div>';
            showToast(vizData.error || 'No visualizations available yet.', 'warning');
        }
    } catch (error) {
        scatterPlot.innerHTML = '<div class="chart-placeholder"><i class="fas fa-exclamation-triangle fa-3x"></i><p>Unable to load visualization</p></div>';
        distributionChart.innerHTML = '<div class="chart-placeholder"><i class="fas fa-exclamation-triangle fa-3x"></i><p>Unable to load chart</p></div>';
        showToast(`Visualization error: ${error.message}`, 'error');
    }
}

async function loadCorrelationHeatmap() {
    const heatmapEl = getEl('correlationHeatmap');
    if (!heatmapEl) {
        return;
    }

    try {
        const response = await fetch('/api/correlation-matrix');
        const data = await response.json();

        if (!data.success) {
            heatmapEl.innerHTML = '<div class="chart-placeholder"><i class="fas fa-th-large fa-3x"></i><p>Correlation heatmap will appear after data upload</p></div>';
            return;
        }

        const trace = {
            z: data.matrix,
            x: data.features,
            y: data.features,
            type: 'heatmap',
                colorscale: [
                    [0, 'rgb(255,245,240)'],
                    [0.25, 'rgb(252,174,145)'],
                    [0.5, 'rgb(251,106,74)'],
                    [0.75, 'rgb(222,45,38)'],
                    [1, 'rgb(165,15,21)']
                ],
            showscale: true,
            hoverongaps: false,
                hovertemplate: '<b>%{y}</b> vs <b>%{x}</b><br>Correlation: %{z:.3f}<extra></extra>',
                text: data.matrix.map(row => row.map(val => val.toFixed(2))),
                texttemplate: '%{text}',
                textfont: {
                    size: 10,
                    color: 'white'
                }
        };

        const layout = getChartLayout('Feature Correlation Heatmap', 'Features', 'Features');
        layout.margin = { l: 120, r: 20, t: 60, b: 120 };
        layout.xaxis.tickangle = -45;
        layout.yaxis.autorange = 'reversed';
            layout.height = Math.max(500, data.features.length * 50);
            layout.width = Math.max(600, data.features.length * 50);

        Plotly.newPlot('correlationHeatmap', [trace], layout, {responsive: true});
    } catch (error) {
        heatmapEl.innerHTML = '<div class="chart-placeholder"><i class="fas fa-exclamation-triangle fa-3x"></i><p>Unable to load correlation heatmap</p></div>';
        showToast(`Correlation heatmap error: ${error.message}`, 'error');
    }
}

// Utility Functions
function showLoading(show, text = 'Processing...') {
    if (show) {
        loadingText.textContent = text;
        loadingSpinner.style.display = 'flex';
    } else {
        loadingSpinner.style.display = 'none';
    }
}

function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast-notification toast-${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Prevent default form submission
document.addEventListener('submit', (e) => {
    if (e.target.tagName === 'FORM') {
        e.preventDefault();
    }
});
/* ============================================
   JS Enhancement 1: Smooth Scroll Behavior
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});

/* ============================================
   JS Enhancement 2: Form Validation Utilities
   ============================================ */
const FormValidator = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^[\d\s\-\+\(\)]+$/.test(value),
    url: (value) => {
        try {
            new URL(value);
            return true;
        } catch (e) {
            return false;
        }
    },
    required: (value) => value && value.trim().length > 0,
    minLength: (value, length) => value && value.length >= length,
    maxLength: (value, length) => value && value.length <= length,
    validateForm: function(formElement) {
        const errors = {};
        formElement.querySelectorAll('[data-validate]').forEach(field => {
            const validationType = field.dataset.validate;
            if (this[validationType] && !this[validationType](field.value)) {
                errors[field.name] = `Invalid ${validationType}`;
            }
        });
        return errors;
    }
};

/* ============================================
   JS Enhancement 3: Animation Utilities
   ============================================ */
const AnimationUtils = {
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in`;
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    },
    slideUp: (element, duration = 300) => {
        element.style.transform = 'translateY(20px)';
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms ease-out`;
        setTimeout(() => {
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 10);
    },
    pulse: (element) => {
        element.classList.add('animate-pulse');
        setTimeout(() => element.classList.remove('animate-pulse'), 2000);
    },
    bounce: (element) => {
        element.style.animation = 'bounce 0.6s';
        setTimeout(() => element.style.animation = '', 600);
    }
};

/* ============================================
   JS Enhancement 4: Event Delegation System
   ============================================ */
const EventManager = {
    handlers: new Map(),
    on: function(selector, eventType, callback) {
        document.addEventListener(eventType, (e) => {
            if (e.target.matches(selector)) {
                callback.call(e.target, e);
            }
        });
    },
    off: function(selector, eventType) {
        // Note: Modern approach stores handlers for potential removal
        const key = `${selector}-${eventType}`;
        this.handlers.delete(key);
    },
    trigger: function(element, eventType) {
        const event = new Event(eventType, { bubbles: true });
        element.dispatchEvent(event);
    }
};

/* ============================================
   JS Enhancement 5: LocalStorage Integration
   ============================================ */
const StorageManager = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage unavailable:', e);
        }
    },
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('LocalStorage read error:', e);
            return defaultValue;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('LocalStorage delete error:', e);
        }
    },
    clear: () => {
        try {
            localStorage.clear();
        } catch (e) {
            console.warn('LocalStorage clear error:', e);
        }
    }
};

/* ============================================
   JS Enhancement 6: Performance Monitoring
   ============================================ */
const PerformanceMonitor = {
    marks: {},
    startMeasure: function(name) {
        this.marks[name] = performance.now();
    },
    endMeasure: function(name) {
        if (this.marks[name]) {
            const duration = performance.now() - this.marks[name];
            console.log(`${name}: ${duration.toFixed(2)}ms`);
            delete this.marks[name];
            return duration;
        }
    },
    getMetrics: function() {
        return {
            navigation: performance.getEntriesByType('navigation')[0],
            paints: performance.getEntriesByType('paint'),
            resources: performance.getEntriesByType('resource').slice(0, 5)
        };
    }
};

/* ============================================
   JS Enhancement 7: Tooltip System
   ============================================ */
const TooltipManager = {
    init: function() {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-popup';
                tooltip.textContent = element.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '8px 12px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '12px';
                tooltip.style.zIndex = '10000';
                
                element.tooltip = tooltip;
            });
            
            element.addEventListener('mouseleave', (e) => {
                if (element.tooltip) {
                    element.tooltip.remove();
                    delete element.tooltip;
                }
            });
        });
    }
};

/* ============================================
   JS Enhancement 8: Lazy Loading System
   ============================================ */
const LazyLoader = {
    init: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
};

/* ============================================
   JS Enhancement 9: Keyboard Shortcuts
   ============================================ */
const KeyboardShortcuts = {
    shortcuts: new Map(),
    register: function(key, callback) {
        this.shortcuts.set(key, callback);
    },
    init: function() {
        document.addEventListener('keydown', (e) => {
            const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.key.toLowerCase()}`;
            if (this.shortcuts.has(key)) {
                e.preventDefault();
                this.shortcuts.get(key)();
            }
        });
    }
};

/* ============================================
   JS Enhancement 10: Analytics Tracking
   ============================================ */
const Analytics = {
    events: [],
    trackEvent: function(category, action, label = '') {
        const event = {
            timestamp: new Date(),
            category,
            action,
            label,
            url: window.location.href
        };
        this.events.push(event);
        // Optional: Send to analytics service
        if (window.gtag) {
            gtag('event', action, { event_category: category, event_label: label });
        }
    },
    trackPageView: function() {
        this.trackEvent('pageview', 'view', document.title);
    },
    getEvents: function() {
        return this.events;
    }
};

/* ============================================
   JS Enhancement 11: Responsive Utilities
   ============================================ */
const ResponsiveHelper = {
    isMobile: () => window.innerWidth < 768,
    isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: () => window.innerWidth >= 1024,
    onResize: function(callback) {
        window.addEventListener('resize', callback);
    }
};

/* ============================================
   JS Enhancement 12: Filter & Sort Utilities
   ============================================ */
const DataUtils = {
    filterBy: (array, key, value) => array.filter(item => item[key] === value),
    sortBy: (array, key, order = 'asc') => {
        return [...array].sort((a, b) => {
            if (order === 'asc') return a[key] > b[key] ? 1 : -1;
            return a[key] < b[key] ? 1 : -1;
        });
    },
    groupBy: (array, key) => {
        return array.reduce((acc, item) => {
            const group = item[key];
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
        }, {})
    },
    sumBy: (array, key) => array.reduce((sum, item) => sum + (item[key] || 0), 0),
    averageBy: (array, key) => {
        const sum = DataUtils.sumBy(array, key);
        return array.length > 0 ? sum / array.length : 0;
    }
};
