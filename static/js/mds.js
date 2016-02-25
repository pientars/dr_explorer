var x_value = function(d) { return d[dr_method].x;}, // data -> value
    x_scale = d3.scale.linear().range([0, width-180]), // value -> display
    x_map = function(d) { return x_scale(x_value(d));}, // data -> display
    x_axis = d3.svg.axis().scale(x_scale).orient("bottom");

var y_value = function(d) { return d[dr_method].y;}, // data -> value
    y_scale = d3.scale.linear().range([height, 0]), // value -> display
    y_map = function(d) { return y_scale(y_value(d));}, // data -> display
    y_axis = d3.svg.axis().scale(y_scale).orient("left");

var svg_dr = d3.select(".dr-div").append("svg")
    .attr("width", width-margin.right)
    .attr("height", height+10)
  .append("g")
    .attr("transform", "translate(" + margin.left + ",0)");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var legend = undefined;

function init_axes(){
  // x-axis
  svg_dr.append("g")
      .attr("class", "x_axis axis")
      .attr("transform", "translate(0," + height + ")")
      .style('opacity', 0)
      .call(x_axis)
  // y-axis
  svg_dr.append("g")
      .attr("class", "y_axis axis")
      .style('opacity', 0)      
      .call(y_axis)
}

// load data
function draw_mds_plot(){

  console.log(data)
  // don't want dots overlapping axis, so add in buffer to data domain
  x_scale.domain([d3.min(data, x_value)-1, d3.max(data, x_value)+1]).nice();
  y_scale.domain([d3.min(data, y_value)-1, d3.max(data, y_value)+1]).nice();

  //axes updates
  d3.selectAll('.x_axis')
    .transition()
    .duration(500)
    .style('opacity', 1)
    .call(x_axis);
  d3.selectAll('.y_axis')
    .transition()
    .duration(500)
    .style('opacity', 1)
    .call(y_axis);
 
  //update
  svg_dr.selectAll('.drdot').transition().duration(500)
    .attr("r", 5)
    .style('fill', function(d) { 
      return (fill_type === 'group') ? color20(d.features[fill_type]) : color_cont[fill_type](d.features[fill_type]); })
    .attr("cx", x_map)
    .attr("cy", y_map);

  // draw dots
  svg_dr.selectAll(".drdot")
      .data(data)
    .enter().append("circle")
      .attr("class", "drdot")
      .attr('id', function(d) { return 'dr'+d.id; })
      .attr("r", config.metagraph.nodes.radius)
      .attr("cx", x_map)
      .attr("cy", y_map)
      .style('fill', function(d) {
        return (fill_type === 'group') ? color20(d.features[fill_type]) : color_cont[fill_type](d.features[fill_type]); })
      .style("stroke", config.metagraph.nodes.normal_stroke_color)
      .style("opacity", 1)
      .on("mouseover", result_mouseover)
      .on("mouseout", result_mouseout);

 
  //LEGENDS
  if (fill_type === 'group') {
    d3.selectAll('.cont_legend').transition().duration(500).style('opacity', 0);
    draw_ordinal_legend(svg_dr);
  } else {
    d3.selectAll('.ord_legend').transition().duration(500).style('opacity', 0);
    draw_cont_legend(svg_dr);
  }

}

function draw_ordinal_legend(svg_dr) {
  svg_dr.append("g")
    .attr("class", "ord_legend")
    .attr("transform", "translate("+(width-170)+",20)");

  var legendOrdinal = d3.legend.color()
    .shape("path", d3.svg.symbol().type("triangle-up").size(150)())
    .shapePadding(10)
    .scale(color20);
//    .scale(color_cont['group']);
  console.log(color20)
  svg_dr.select(".ord_legend")
    .call(legendOrdinal);
  
  d3.selectAll('.ord_legend')
    .selectAll('.cell')
    .selectAll('text').text( function(d,i) { return metadata.group[d]; });
  d3.select('.ord_legend').style('opacity', 1)
}

function draw_cont_legend(svg_dr) {
  cont_legend = color_cont[fill_type].ticks(6).reverse();
  // Add a legend for the color values.
  legend = svg_dr.selectAll(".cont_legend")
      .data(cont_legend)
  console.log(legend)
  
  d3.selectAll('.cont_legend').filter('rect').style("fill", color_cont[fill_type]);

  var legend_ent = legend
    .enter().append("g")
      .attr("class", "cont_legend")
      .attr("transform", function(d, i) { return "translate(" + (width - 170) + "," + (20 + i * 20) + ")"; });
  
  legend_ent.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", color_cont[fill_type]);

  legend_ent.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);
  d3.select('.legend_label').remove()
  d3.select('.cont_legend')
      .append("text")
      .attr("class", "legend_label")
      .attr("x", 4)
      .attr("y", -8)
      .attr("dy", ".35em")
      .text(fill_type);

  legend.exit().transition().duration(500)
    .style('opacity', 0)
    .remove()
}

function result_mouseover(node) {
 draw_hover(node, 200, 300);
}

function result_mouseout(node) {
 hide_hover(); 
}

function draw_hover(nod, delay, duration) {
  d3.select('#hover')
    .style('display', '')
    .style("left", (x_map(nod)+$('.sidebar').width()+120) + "px")
    .style("top",  y_map(nod)+20 + "px");
  tooltip = d3.select('#hover')
    .append("div")
    .style('fill', 'white')
    .attr('class', 'my-tooltip-class')
    .style('opacity', 0)
  add_hover_content(nod)
  tooltip.transition().delay(delay).duration(duration).style('opacity', 1);
}

function hide_hover() {
  tooltip.interrupt().transition();
  tooltip.style('opacity', 0);
  d3.select(".my-tooltip-class").remove();
  d3.select('#hover').style('display', 'none')
}

function add_hover_content(res) {
  var tab = tooltip.append('table')
    .attr('class', 'table table-condensed summary-table')
    .attr('id', 'popup-table');

  var headers = tab.append('tr');
  headers.append('td').text('Name:').attr('class', 'bold-font');
  headers.append('td').text(res.name);
}

function create_d3_color_scales(){
  for (var prop in metadata) {
    if (prop === 'group') color_cont['group'] = color20; 
    if(!metadata.hasOwnProperty(prop)) continue;  
    color_cont[prop] = d3.scale.linear()
        .domain([metadata[prop].min, (metadata[prop].max - metadata[prop].min)/2+metadata[prop].min, metadata[prop].max])
        .range(['#998ec3', '#f7f7f7', '#f1a340'])
  }
}

function intersect(a, b) {
  var ai=0, bi=0;
  var result = new Array();
  while( ai < a.length && bi < b.length ){
     if      (a[ai] < b[bi] ){ ai++; }
     else if (a[ai] > b[bi] ){ bi++; }
     else {
       result.push(a[ai]);
       ai++;
       bi++;
     }
  }
  return result;
}
