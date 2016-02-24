var dr_method = 'pca';
var data = [];
var margin = {top: 80, right: 50, bottom: 10, left: 50},
    width  = ($(window).width()*0.8-margin.left-margin.right),
    height = ($(window).height()*0.8-margin.top-margin.bottom);

// Load some data
params = [] 
$( document ).ready(function() {
  d3.json("/query/").post(JSON.stringify(params), function(error, json) {
    if (error) return console.warn(error);
    init_axes()
    data = JSON.parse(json);
  });
});

$('#pca-a').on('click', function(e){
  d3.select('.plot-header-text').text('Principal Component Analysis');
  dr_method = 'pca';
  draw_mds_plot();  
  e.preventDefault();
});

$('#kpca-a').on('click', function(e){
  d3.select('.plot-header-text').text('Kernel-PCA');
  dr_method = 'kpca';
  draw_mds_plot();  
  e.preventDefault();
});

$('#mds-a').on('click', function(e){
  d3.select('.plot-header-text').text('Multi Dimensional Scaling');
  dr_method = 'mds';
  draw_mds_plot();  
  e.preventDefault();
});

$('#isomap-a').on('click', function(e){
  d3.select('.plot-header-text').text('Isomap');
  dr_method = 'isomap';
  draw_mds_plot();  
  e.preventDefault();
});

$('#tsne-a').on('click', function(e){
  d3.select('.plot-header-text').text('t-SNE');
  dr_method = 'tsne'
  draw_mds_plot();  
  e.preventDefault();
});

$('#lle-a').on('click', function(e){
  d3.select('.plot-header-text').text('Local Linear Embedding (Std)');
  dr_method = 'lle-standard'
  draw_mds_plot();  
  e.preventDefault();
});

$('#ltsa-a').on('click', function(e){
  d3.select('.plot-header-text').text('Local Tangent-Space Alignment');
  dr_method = 'lle-ltsa'
  draw_mds_plot();  
  e.preventDefault();
});

$('#hess-a').on('click', function(e){
  d3.select('.plot-header-text').text('Local Linear Embedding (hessian)');
  dr_method = 'lle-hessian'
  draw_mds_plot();  
  e.preventDefault();
});

$('#llem-a').on('click', function(e){
  d3.select('.plot-header-text').text('Local Linear Embedding (modified)');
  dr_method = 'lle-modified'
  draw_mds_plot();  
  e.preventDefault();
});


