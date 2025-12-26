"""Fix indentation in app.py"""

with open('src/app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the malformed visualizations function
old_section = '''@app.route('/api/visualizations', methods=['GET'])
def visualizations():
    """
    Generate visualizations for clusters
    """
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
            )'''

new_section = '''@app.route('/api/visualizations', methods=['GET'])
def visualizations():
    """
    Generate visualizations for clusters
    """
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
        )'''

content = content.replace(old_section, new_section)

with open('src/app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed indentation!")
