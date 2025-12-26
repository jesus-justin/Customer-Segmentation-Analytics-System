"""Complete restoration of the visualizations function"""

# Read the entire file
with open('src/app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the broken visualizations function
# Find the start
start_marker = "@app.route('/api/visualizations', methods=['GET'])"
start_idx = content.find(start_marker)

# Find the end (next @app.route)
next_route_idx = content.find("@app.route('/api/cluster-data'", start_idx + 10)

# Replace the entire broken section with a corrected version
fixed_function = """@app.route('/api/visualizations', methods=['GET'])
def visualizations():
    \"\"\"
    Generate visualizations for clusters
    \"\"\"
    try:
        if CLUSTER_LABELS is None:
            return jsonify({'error': 'No clustering performed'}), 400
        
        # Create a copy with cluster labels
        viz_data = PROCESSED_DATA.copy()
        viz_data['Cluster'] = CLUSTER_LABELS.astype(str)  # Convert to string for categorical coloring
        
        # Get first two features for 2D visualization
        features = [col for col in PROCESSED_DATA.columns if col not in ['CustomerID']][:2]
        
        if len(features) < 2:
            features = PROCESSED_DATA.columns.tolist()[:2]
        
        # Create scatter plot
        fig = px.scatter(
            viz_data,
            x=features[0] if len(features) > 0 else viz_data.columns[0],
            y=features[1] if len(features) > 1 else viz_data.columns[1],
            color='Cluster',
            title='Customer Segments Visualization',
            labels={'Cluster': 'Cluster ID'},
            color_discrete_sequence=['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52']
        )
        
        # Update scatter markers to be more visible
        fig.update_traces(
            marker=dict(
                size=10,
                line=dict(width=1, color='white'),
                opacity=0.8
            ),
            selector=dict(mode='markers')
        )
        
        fig.update_layout(
            hovermode='closest',
            plot_bgcolor='rgba(240,240,240,0.9)',
            paper_bgcolor='white',
            font=dict(family='Arial, sans-serif', size=12),
            width=1000,
            height=600
        )
        
        scatter_chart = json.loads(plotly.io.to_json(fig))
        
        # Create cluster distribution chart
        cluster_counts = pd.Series(CLUSTER_LABELS).value_counts().sort_index()
        
        fig_dist = go.Figure(data=[
            go.Bar(
                x=cluster_counts.index.astype(str),
                y=cluster_counts.values.tolist(),
                marker=dict(
                    color=['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52'][:len(cluster_counts)],
                    line=dict(color='white', width=2)
                ),
                text=cluster_counts.values.tolist(),
                textposition='outside',
                hovertemplate='Cluster %{x}<br>Count: %{y}<extra></extra>'
            )
        ])
        
        fig_dist.update_layout(
            title='Cluster Distribution',
            xaxis_title='Cluster ID',
            yaxis_title='Number of Customers',
            plot_bgcolor='rgba(240,240,240,0.9)',
            paper_bgcolor='white',
            height=500,
            width=600
        )
        
        dist_chart = json.loads(plotly.io.to_json(fig_dist))
        
        return jsonify({
            'success': True,
            'scatter_chart': scatter_chart,
            'distribution_chart': dist_chart
        }), 200
    
    except Exception as e:
        app_logger.error(f"Visualization error: {str(e)}", exc_info=True)
        return jsonify({'error': f'Visualization error: {str(e)}'}), 500


"""

# Replace the broken section
new_content = content[:start_idx] + fixed_function + content[next_route_idx:]

# Write back
with open('src/app.py', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Fixed visualizations function!")
