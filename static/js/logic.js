    var width = 960,
        height = 547;

//   d3.json("https://gist.githubusercontent.com/abenrob/787723ca91772591b47e/raw/8a7f176072d508218e120773943b595c998991be/world-50m.json", function(error, world) {
//       svg.append("g")
//         .attr("class", "land")
//       .selectAll("path")
//         .data([topojson.feature(world, world.objects.land)])
//         .enter().append("path")
//         .attr("d", path);
//     svg.append("g")
//         .attr("class", "boundary")
//       .selectAll("boundary")
//         .data([topojson.feature(world, world.objects.countries)])
//         .enter().append("path")
//         .attr("d", path);
//     svg.append("g")
//       .attr("class", "graticule")
//       .selectAll("path")
//       .data(projection.lines)
//       //.enter().append("path")
//       //.attr("d", path);
//   });


var width = 960;
var height= 547;

//var projection = d3.geoPatterson()
  var projection = d3.geoMercator()
    .scale(130)
    .translate([width / 2, height / 2])
    .precision(0.1);

var path = d3.geoPath()
    .projection(projection);

 var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg.append("path")
    .datum(d3.geoGraticule10())
    .attr("class", "graticule")
    .attr("d", path);

d3.json("this_is_a_globe_bostock.json", function(error, world) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

  svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);
});



var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"
var url_2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Grab the data with d3
d3.json(url, function(response) {
//var locations = []
//var lats_and_longs = []
// for (var i = 0; i < response.features.length; i++) {
//  var loc = response.features[i];
//  var coords = {'long':loc.geometry.coordinates[0],'lat':loc.geometry.coordinates[1],'mag':loc.properties.mag, 'title':loc.properties.title} 
//  locations.push(coords)
//  lats_and_longs.push(loc.geometry.coordinates[0],loc.geometry.coordinates[1],loc.properties.mag)
// }
//var coord_array = []
//var i,j,chunk = 3;
//for (i=0,j=lats_and_longs.length; i<j; i+=chunk) {
//    coord_array.push(lats_and_longs.slice(i,i+chunk));
//}


var radius = d3.scaleSqrt()
  //input value
    .domain([0, 9])
  // ouput value
    .range([0,27]);

var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

  var color_domain = [2, 3, 4, 5, 6]
  var ext_color_domain = [1, 2, 3, 4, 5, 6]
  var legend_labels = ["< 2", "2+", "3+", "4+", "5+", "> 6"]              
  var color = d3.scaleThreshold()
  .domain(color_domain)
  .range(["#adfcad", "#ffcb40", "#ffba00", "#ff7d73", "#ff4e40", "#ff1300"]);


  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain([9,0])
    .range(d3.schemeSet2);
    //.range('#edf8b1','#7fcdbb','#2c7fb8');





    var feature = svg.selectAll("circle")
      .data(response.features)
      .enter().append("circle")
      .style("stroke", "black")  
      .style("opacity", function (d){return (d.properties.mag)}) 
      //.style("fill", "red")
      .style("fill", function (d) { return color(d.properties.mag); } )


      //.attr("r", function(d) { return radius(d.properties.mag); })
      .attr("r", function (d){return (d.properties.mag)})
      .attr("cx", function (d) { return projection([d.geometry.coordinates[0],d.geometry.coordinates[1]])[0]; })
      .attr("cy", function (d) { return projection([d.geometry.coordinates[0],d.geometry.coordinates[1]])[1]; })
      //.attr("r", function(d) { return Math.sqrt(d); });
      //.attr("data-legend",function(d) { return d.name})

      .on("mouseover", function(d) {    
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html(d.properties.title)  
                .style('color', 'white')
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0);


  var legend = svg.selectAll("g.legend")
  //.data(d3.schemeSet2)
  .data(ext_color_domain)
  .enter().append("g")
  .attr("class", "legend");

  //var ls_w = 125, ls_h = 385;
  var ls_w = 25, ls_h = 15;





  legend.append("rect")
  .attr("x", 890)
  //.attr("y", 400)
  .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  //.style("fill", function(d, i) { return 'white'})
  .style("fill", function(d, i) { return color(d); })
  .style("opacity", 0.8);


  //svg.selectAll("title_text")
  //  .data(["Magnitude:"])
  //  .attr("x", 935)
  //  .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
 


  legend.append("text")
  .attr("x", 935)
  //.attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
  .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return legend_labels[i]; });
  
  legend.append("text")
    .attr("x", 885)
    .attr("y", 438)
    .text('Magnitude')






});

});