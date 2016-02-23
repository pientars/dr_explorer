
var shown_features = {'film':['audience_score', 'critic_score', 'year', 'runtime', 'betweenness_centrality', 'clustering_coefficient'],
                      'actor':['betweenness_centrality', 'clustering_coefficient'],
                      'director':['betweenness_centrality', 'clustering_coefficient']},
    short_features = {'audience_score':'Aud Score', 'critic_score':'Crit Score', 'year':'Year', 'runtime':'Length',
                      'betweenness_centrality':'Bet. Centrality', 'clustering_coefficient':'Clust. Coeff'}

function update_table() {
  var tab = d3.select('.table-div').append('table')
    .attr('class', 'small-font')
    .attr('id', 'feature-table')
    .attr('cellspacing', 0)
    .attr('width', '100%');

  var header = tab.append('thead')
  var multi_row = header.append('tr');
  var tbody = tab.append('tbody');
  var h_row = header.append('tr');

  multi_row.append('th').text('Result').attr('rowspan', 2);

  for (var i = 0; i < q_struct.length; i++){
    var struct_list = q_struct[i],
        n_cols = 0;
    h_row.append('th').text('Name')
    h_row.append('th').text('Type')
    struct_list.forEach(function(label){
      shown_features[label].forEach(function(feature) {
        h_row.append('th').text(short_features[feature]);
        n_cols++;
      });
    });
    multi_row.append('th').text('Node-'+i).attr('colspan', n_cols+2)
  };

  for(var i = 0; i < meta_nodes.length; i++) {
    var res = meta_nodes[i]
    var node_row = tbody.append('tr');
    node_row.attr('id', 'row'+i)
    node_row.append('td').text(i);
    res.nodes.forEach(function(nod){
      node_row.append('td').text(nod.name.cut_name_to_length(config.table.clip_length));
      node_row.append('td').text(nod.label);
      shown_features[nod.label].forEach(function(feature) {
        if (feature === 'betweenness_centrality' || feature === 'clustering_coefficient') {
          node_row.append('td').text(nod.features[feature].toExponential(3))
        } else {
          node_row.append('td').text(nod.features[feature])
        }
      });
    });
    node_row.on('mouseover', row_mouseover)
    node_row.on('mouseout', row_mouseout)
  }

  $('#feature-table').DataTable({
        "scrollY":"350px"
   });

}


function row_mouseover(row) {
  var meta_id = parseInt(this.id.substr(3,this.id.length))
  var res = meta_nodes[meta_id]
  hover_context_node_set = res.nodes_set;
  hover_context_node_list = res.nodes;

  //Meta highlight
  d3.select('#dr'+meta_id)
    .classed('hover-dot', true)
    .style('fill', config.colors.hover)
    .style('opacity', config.colors.hover_opacity )
    .style('stroke', config.metagraph.nodes.hover_stroke_color);
  //Table Highlight
  d3.select(this)
    .classed('hover-row', true)
    .style('background-color', config.colors.hover_lighter)
  //Context highlight
  highlight_from_dr();
  color_edges();
}

function row_mouseout(){
   d3.select(this)
    .style('background-color', 'white')
  unhover_all();
  uncolor_edges();
}


