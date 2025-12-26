import re

with open('src/app.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix line 360 (fig = px.scatter...)
for i in range(len(lines)):
    # Fix "           fig = px.scatter" to "        fig = px.scatter"
    if '           fig = px.scatter' in lines[i]:
        lines[i] = lines[i].replace('           fig = px.scatter', '        fig = px.scatter')
    # Fix "                color_discrete_sequence" to "            color_discrete_sequence"
    elif '                color_discrete_sequence=' in lines[i]:
        lines[i] = lines[i].replace('                color_discrete_sequence=', '            color_discrete_sequence=')
    # Fix "            # Update scatter markers" to "        # Update scatter markers"
    elif lines[i].strip().startswith('# Update scatter markers'):
        if lines[i].startswith('            #'):
            lines[i] = '        ' + lines[i].strip() + '\n'
    # Fix "            fig.update_traces(" to "        fig.update_traces("
    elif '            fig.update_traces(' in lines[i] and 'marker=' in lines[i+1]:
        lines[i] = lines[i].replace('            fig.update_traces(', '        fig.update_traces(')
    # Fix any lines with 12 spaces that should have 8 (inside visualizations function)
    elif lines[i].startswith('            ') and i > 340 and i < 420:
        # Check if this is part of a dict/list continuation - keep 12 spaces
        if any(keyword in lines[i] for keyword in ['marker=', 'size=', 'line=', 'opacity=', 'selector=', 'width=', 'color=']):
            pass  # Keep indentation for dict parameters
        else:
            # Reduce from 12 to 8 spaces
            lines[i] = lines[i][4:]

with open('src/app.py', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Fixed all indentations!")
