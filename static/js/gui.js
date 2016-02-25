var dr_method = 'pca';
var fill_type = 'group';
var data = [], metadata = [], cont_legend = [];
var margin = {top: 80, right: 50, bottom: 10, left: 20},
    width  = ($(window).width()*0.8-margin.left-margin.right),
    height = ($(window).height()*0.8-margin.top-margin.bottom);
var color20 = d3.scale.ordinal().domain([0,1,2,3,4,5,6,7,8,9,10,11])
                .range(["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"])
var color_cont = {};

// Load some data
params = [] 

$(document).on('change', '.btn-file :file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        console.log(numFiles);
        console.log(label);
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;
        
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
    });
});

$( document ).ready(function() {
  d3.json("/query/").post(JSON.stringify(params), function(error, json) {
    if (error) return console.warn(error);
   // json = JSON.parse(jsonstr);
    init_axes()
    metadata = json.metadata; 
    data = json.data;
    create_d3_color_scales();
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

$('#group-a').on('click', function(e){
  fill_type = 'group';
  draw_mds_plot();  
  e.preventDefault();
});

$('#vs-a').on('click', function(e){
  fill_type = 'vs';
  draw_mds_plot();  
  e.preventDefault();
});

$('#ag-a').on('click', function(e){
  fill_type = 'ag';
  draw_mds_plot();  
  e.preventDefault();
});



