var margin = {top: 80, right: 25, bottom: 10, left: 25},
    width  = ($(window).width()-margin.left-margin.right)/2-10,
    height = ($(window).height()-margin.top-margin.bottom)/2;

var x_value = function(d) { return d[dr_method].x;}, // data -> value
    x_scale = d3.scale.linear().range([0, width]), // value -> display
    x_map = function(d) { return x_scale(x_value(d));}, // data -> display
    x_axis = d3.svg.axis().scale(x_scale).orient("bottom");

var y_value = function(d) { return d[dr_method].y;}, // data -> value
    y_scale = d3.scale.linear().range([height, 0]), // value -> display
    y_map = function(d) { return y_scale(y_value(d));}, // data -> display
    y_axis = d3.svg.axis().scale(y_scale).orient("left");

var svg_dr = d3.select(".dr-div").append("svg")
    .attr("width", width)
    .attr("height", height+10)
  .append("g")
    .attr("transform", "translate(" + margin.left + ",0)");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


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
  x_scale.domain([d3.min(data, x_value)-1, d3.max(data, x_value)+1]);
  y_scale.domain([d3.min(data, y_value)-1, d3.max(data, y_value)+1]);

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

  // draw dots
  svg_dr.selectAll(".drdot")
      .data(data)
    .enter().append("circle")
      .attr("class", "drdot")
      .attr('id', function(d) { return 'dr'+d.id})
      .attr("r", config.metagraph.nodes.radius)
      .attr("cx", x_map)
      .attr("cy", y_map)
      .style("stroke", config.metagraph.nodes.normal_stroke_color)
      .style("opacity", 0.2)
      .on("mouseover", result_mouseover)
      .on("mouseout", result_mouseout);

  //update
  svg_dr.selectAll('.drdot').transition().duration(500)
    .attr("r", 5)
    .attr("cx", x_map)
    .attr("cy", y_map);
}


function result_mouseover(node) {

}

function result_mouseout(node) {
}

function draw_hover(nod, delay, duration) {
  d3.select('#hover')
    .style('display', '')
    .style("left", (x_map(nod)+55) + "px")
    .style("top",  y_map(nod)+55 + "px");
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
  headers.append('td').text('Name').attr('class', 'bold-font');
  headers.append('td').text('Type').attr('class', 'bold-font');
  for (var i = 0; i < res.nodes.length; i++) {
    var row = tab.append('tr')
    row.append('td').text(res.nodes[i].name)
    row.append('td').text(res.nodes[i].label[0].capitalizeFirstLetter())
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
