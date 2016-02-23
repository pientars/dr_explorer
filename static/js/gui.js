var dr_method = 'pca';
var data = [];
// Load some data
params = [] 
$( document ).ready(function() {
  d3.json("/query/").post(JSON.stringify(params), function(error, json) {
    if (error) return console.warn(error);
    console.log('I GOT THE DATA')
    console.log(json)
    init_axes()
    data = JSON.parse(json);
  });
});


$('#pca-a').on('click', function(e){
  d3.select('.plot-header-text').text('PCA');
  dr_method = 'pca'
  draw_mds_plot();  
  e.preventDefault();
});

$('#kpca-a').on('click', function(e){
  d3.select('.plot-header-text').text('Kernel-PCA');
  dr_method = 'kpca'
  e.preventDefault();
});

$('#mds-a').on('click', function(e){
  d3.select('.plot-header-text').text('MDS');
  dr_method = 'mds'
  e.preventDefault();
});

$('#isomap-a').on('click', function(e){
  d3.select('.plot-header-text').text('Isomap');
  dr_method = 'pca'
  e.preventDefault();
});

$('#tsne-a').on('click', function(e){
  d3.select('.plot-header-text').text('t-SNE');
  dr_method = 'tsne'
  e.preventDefault();
});

