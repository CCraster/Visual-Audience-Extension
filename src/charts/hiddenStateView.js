/*
*
*/
const chart = {};

chart.create = function(config){
  chart.config = config;
  this.config.margin = {top: 15, right: 15, bottom: 30, left: 35};
  this.config.width_svg = document.getElementById(this.config.target).clientWidth;
  this.config.height_svg = document.getElementById(this.config.target).clientHeight - 4;  // ？？？？要减4才能不突出高度
  this.config.svg = d3.select(`#${this.config.target}`)
                      .append('svg')
                      .attr('width', this.config.width_svg)
                      .attr('height', this.config.height_svg);
}

chart.init = function(){

}

chart.update = function(_data){
  d3.select('#g_container_trainingData').remove();
  let data = _data || this.config.data;
  data = dataFormatChange(data);
  let margin = this.config.margin,
      width_svg = this.config.width_svg,
      height_svg = this.config.height_svg,
      svg = this.config.svg.append('g').attr('id', 'g_container_trainingData');
  let xScale = d3.scaleLinear()
                .domain([0, data[0].length])
                .range([margin.left, width_svg - margin.right]);
  let yScale = d3.scaleLinear()
                .domain([0, 1])
                .range([height_svg - margin.bottom, margin.top]);
  let xAxis = g => g.attr('transform', `translate(0, ${height_svg - margin.bottom})`)
                    .call(d3.axisBottom(xScale).ticks(width_svg / 30).tickSizeOuter(0))
                    .call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick line").clone()
                                .attr("y2", -height_svg)
                                .attr("stroke-opacity", .1)
                                .attr('stroke-dasharray', 2))
                    .call(g => g.selectAll('.tick text')
                                .attr('dx', '1.3em')
                                .attr('dy', '.2em')
                                .attr('transform', 'rotate(60)'));
  let yAxis = g => g.attr("transform", `translate(${margin.left}, 0)`)
                    .call(d3.axisLeft(yScale).ticks(15))
                    .call(g => g.select(".domain").remove())
                    .call(g => g.selectAll(".tick line").clone()
                                .attr("x2", width_svg)
                                .attr("stroke-opacity", 0.1)
                                .attr('stroke-dasharray', 2))
                    .call(g => g.select(".tick:last-of-type text").clone()
                                .attr("x", 3)
                                .attr("text-anchor", "start")
                                .attr("font-weight", "bold")
                                .text('neuron value'));
  let line = d3.line()
              .defined(d => !isNaN(d))
              .x((d, i) => xScale(i))
              .y((d, i) => yScale(d));
  
  svg.append("g")
    .attr('id', 'g_xAxis')
    .call(xAxis);
        
  svg.append("g")
    .attr('id', 'g_yAxis')
    .call(yAxis);
  
  let path = svg.append("g")
              .attr('id', 'g_path')
              .attr("fill", "none")
              .attr("stroke", "#909399")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data)
            .enter().append("path")
                    .attr("opacity", .6)
                    .style("mix-blend-mode", "multiply")
                    .attr("d", d => line(d))
              .call(transition);

  function transition(path) {
    path.transition()
        .duration(7500)
        .attrTween("stroke-dasharray", tweenDash)
        // .on("end", function() { d3.select(this).call(transition); });
  }
  function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t) };
  }

  // 数据格式转变函数
  function dataFormatChange(data){
    let data_temp = [];
    for(let i = 0; i < data[0].length; i++){
      let single_iteration = [];
      for(let j = 0; j < data.length; j++){
        single_iteration.push(data[j][i]);
      }
      data_temp.push(single_iteration);
    }
    return data_temp;
  }
}

export default chart;