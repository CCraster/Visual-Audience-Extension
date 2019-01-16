/*
*
*/
const chart = {};

chart.create = function(config){
  chart.config = config;
  this.config.margin = {top: 15, right: 15, bottom: 30, left: 35};
  this.config.width_svg = document.getElementById(this.config.target).clientWidth;
  this.config.height_svg = document.getElementById(this.config.target).clientHeight - 4;  // ？？？？要减4才能不突出高度
  this.config.colorRule = {
    'loss': '#F56C6C',
    'acc': '#67C23A',
  };
  this.config.svg = d3.select(`#${this.config.target}`)
                      .append('svg')
                      .attr('width', this.config.width_svg)
                      .attr('height', this.config.height_svg);
  this.update();
}

chart.update = function(_data){
  d3.select('#g_container_target').remove();
  let data = _data || this.config.data;
  let margin = this.config.margin,
      width_svg = this.config.width_svg,
      height_svg = this.config.height_svg,
      colorRule = this.config.colorRule,
      svg = this.config.svg.append('g').attr('id', 'g_container_target');
  let xScale = d3.scaleLinear()
                .domain([0, data[0]['value'].length])
                .range([margin.left, width_svg - margin.right]);
  let yScale = d3.scaleLinear()
                .domain([0, 1])
                .range([height_svg - margin.bottom, margin.top]);
  let xAxis = g => g.attr('transform', `translate(0, ${height_svg - margin.bottom})`)
                  .call(d3.axisBottom(xScale).ticks(width_svg / 15).tickSizeOuter(0))
                  .call(g => g.select(".domain").remove())
                  .call(g => g.selectAll(".tick line").clone()
                              .attr("y2", -height_svg)
                              .attr("stroke-opacity", 0.1)
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
                              .text('target'));
  let line = d3.line()
              .defined(d => !isNaN(d))
              .x((d, i) => xScale(i))
              .y((d, i) => yScale(d));

  svg.append("g")
    .attr('id', 'g_target_xAxis')
    .call(xAxis);
  svg.append("g")
    .attr('id', 'g_target_yAxis')
    .call(yAxis);
  let path = svg.append("g")
              .attr('id', 'g_path')
              .attr("fill", "none")
              // .attr("stroke", "steelblue")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data)
            .enter().append("path")
                    .attr('id', d => `path_${d.name}`)
                    .attr("opacity", .6)
                    .attr("stroke", d => colorRule[d.name])
                    .style("mix-blend-mode", "multiply")
                    .attr("d", d => line(d['value']))
              .call(transition);
  
  function transition(path){
    path.transition()
        .duration(7500)
        .attrTween("stroke-dasharray", tweenDash)
        // .on("end", function() { d3.select(this).call(transition); });
  }
  function tweenDash(){
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function(t) { return i(t) };
  }
}

export default chart;