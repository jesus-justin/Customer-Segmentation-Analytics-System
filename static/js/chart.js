/*
   Customer Segmentation Analytics System - JavaScript
   Handles all client-side interactions and API calls
*/

// Global state
let fileSelected = false;
let dataLoaded = false;
let optimalClusters = null;

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const dataStats = document.getElementById('dataStats');
const nClustersSlider = document.getElementById('nClusters');
const clusterValue = document.getElementById('clusterValue');
const findOptimalBtn = document.getElementById('findOptimalBtn');
const clusterBtn = document.getElementById('clusterBtn');
const viewResultsBtn = document.getElementById('viewResultsBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const loadingText = document.getElementById('loadingText');
const toast = document.getElementById('toast');

// File Upload Handling
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#2563eb';
    uploadArea.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#e2e8f0';
    uploadArea.style.backgroundColor = '#f8fafc';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e2e8f0';
    uploadArea.style.backgroundColor = '#f8fafc';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect();
    }
});

fileInput.addEventListener('change', handleFileSelect);

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

uploadBtn.addEventListener('click', uploadFile);

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
nClustersSlider.addEventListener('input', (e) => {
    clusterValue.textContent = e.target.value;
});

// Find Optimal Clusters
findOptimalBtn.addEventListener('click', findOptimalClusters);

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
clusterBtn.addEventListener('click', performClustering);

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
}

// View Results Button
if (viewResultsBtn) {
    viewResultsBtn.addEventListener('click', () => {
        window.location.href = '/results';
    });
}

// Export Button
if (exportBtn) {
    exportBtn.addEventListener('click', exportResults);
}

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
if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
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
}

// Results Page - Load Data
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/results') {
        loadResultsData();
    }
});

async function loadResultsData() {
    showLoading(true, 'Generating visualizations...');

    try {
        // Load metrics and analysis from sessionStorage
        const clusterAnalysis = JSON.parse(sessionStorage.getItem('clusterAnalysis') || '{}');
        const recommendations = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
        const metrics = JSON.parse(sessionStorage.getItem('metrics') || '{}');

        // Display metrics
        if (Object.keys(metrics).length > 0) {
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
            document.getElementById('metricsDisplay').innerHTML = metricsHTML;
        }

        // Display cluster analysis
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
        document.getElementById('clusterAnalysis').innerHTML = analysisHTML;

        // Display recommendations
        let recommendationsHTML = '';
        for (const [clusterId, recommendation] of Object.entries(recommendations)) {
            recommendationsHTML += `
                <div class="recommendation-item">
                    <div class="recommendation-text">${recommendation}</div>
                </div>
            `;
        }
        document.getElementById('recommendationsDisplay').innerHTML = recommendationsHTML;

        // Load visualizations
        const vizResponse = await fetch('/api/visualizations');
        const vizData = await vizResponse.json();

        if (vizData.success) {
            Plotly.newPlot('scatterPlot', vizData.scatter_chart.data, vizData.scatter_chart.layout);
            Plotly.newPlot('distributionChart', vizData.distribution_chart.data, vizData.distribution_chart.layout);
        }
    } catch (error) {
        showToast(`Error loading results: ${error.message}`, 'error');
    } finally {
        showLoading(false);
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
