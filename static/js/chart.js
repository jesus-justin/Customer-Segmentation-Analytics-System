/*
   Customer Segmentation Analytics System - JavaScript
   Handles all client-side interactions and API calls
*/

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

const safeListen = (el, event, handler) => {
    if (!el) {
        return false;
    }
    el.addEventListener(event, handler);
    return true;
};

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
            color: '#2563eb',
            width: 3
        },
        marker: {
            size: 8,
            color: '#2563eb'
        }
    };

    const layout = {
        title: 'Silhouette Score vs Number of Clusters',
        xaxis: { title: 'Number of Clusters (k)' },
        yaxis: { title: 'Silhouette Score' },
        plot_bgcolor: 'rgba(240, 240, 240, 0.9)',
        paper_bgcolor: 'white',
        font: { family: 'Arial, sans-serif', size: 12 }
    };

    Plotly.newPlot('silhouetteChart', [trace], layout);

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
});

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
            Plotly.newPlot('scatterPlot', vizData.scatter_chart.data, vizData.scatter_chart.layout);
            Plotly.newPlot('distributionChart', vizData.distribution_chart.data, vizData.distribution_chart.layout);
        } else {
            showToast(vizData.error || 'No visualizations available yet.', 'warning');
        }
    } catch (error) {
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
            heatmapEl.innerHTML = '<p class="text-muted">Correlation heatmap will appear after data upload.</p>';
            return;
        }

        const trace = {
            z: data.matrix,
            x: data.features,
            y: data.features,
            type: 'heatmap',
            colorscale: 'Blues',
            showscale: true,
            hoverongaps: false
        };

        const layout = {
            title: 'Feature Correlation Heatmap',
            xaxis: { title: 'Features' },
            yaxis: { title: 'Features' },
            margin: { l: 70, r: 20, t: 40, b: 70 },
            paper_bgcolor: 'white',
            plot_bgcolor: 'rgba(240, 240, 240, 0.9)'
        };

        Plotly.newPlot('correlationHeatmap', [trace], layout);
    } catch (error) {
        heatmapEl.innerHTML = '<p class="text-muted">Unable to load correlation heatmap.</p>';
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
