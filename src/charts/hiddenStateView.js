/*
* @date: 20190228
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
  this.config.opacity = {'hiddenStateView': 0.6, 'hiddenStateHeatMap': 0.4};
}

// 调整视图的重叠关系：谁上谁下，true就是要突出热力图
chart.reConfig = function(_flag_emphasizeSingleNeuron){
  this.config.flag_emphasizeSingleNeuron = _flag_emphasizeSingleNeuron;
  if(_flag_emphasizeSingleNeuron)
    this.config.opacity = {'hiddenStateView': 0.4, 'hiddenStateHeatMap': 0.6};
  else
    this.config.opacity = {'hiddenStateView': 0.6, 'hiddenStateHeatMap': 0.4};
  this.update();
}

chart.update = function(_data){
  d3.select('#g_container_views').remove();
  if(_data) this.config.data = _data;
  let data = _data || this.config.data;
  data = dataFormatChange(data);
  let margin = this.config.margin,
      width_svg = this.config.width_svg,
      height_svg = this.config.height_svg,
      g_container_views = this.config.svg.append('g').attr('id', 'g_container_views'),
      opacity = this.config.opacity,
      g_container_hiddenStateHeatMap, g_container_hiddenStateView;
  if(this.config.flag_emphasizeSingleNeuron){ // 根据flag改变视图上下关系
    g_container_hiddenStateView = g_container_views.append('g').attr('id', 'g_container_hiddenStateView'),
    g_container_hiddenStateHeatMap = g_container_views.append('g').attr('id', 'g_container_hiddenStateHeatMap');
  }else{
    g_container_hiddenStateHeatMap = g_container_views.append('g').attr('id', 'g_container_hiddenStateHeatMap'),
    g_container_hiddenStateView = g_container_views.append('g').attr('id', 'g_container_hiddenStateView');
  }
      
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
                                .attr("x", 5)
                                .attr('y', '-.5em')
                                .attr("text-anchor", "start")
                                .attr("font-weight", "bold")
                                .text('neuron value'));
  let line = d3.line()
              .defined(d => !isNaN(d))
              .x((d, i) => xScale(i))
              .y((d, i) => yScale(d));
  
  g_container_hiddenStateView.append("g")
    .attr('id', 'g_xAxis')
    .call(xAxis);
        
  g_container_hiddenStateView.append("g")
    .attr('id', 'g_yAxis')
    .call(yAxis);
  
  let path = g_container_hiddenStateView.append("g")
              .attr('id', 'g_path')
              .attr("fill", "none")
              .attr("stroke", "#909399")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data)
            .enter().append("path")
                    .attr("opacity", opacity['hiddenStateView'])
                    .style("mix-blend-mode", "multiply")
                    .attr("d", d => line(d))
              // .call(transition);

  ///////////////////////// hiddenStateView Heatmap绘制 /////////////////////////
  g_container_hiddenStateHeatMap.attr('transform', `translate(${margin.left}, ${margin.top})`)
                                .attr('opacity', opacity['hiddenStateHeatMap']);
  let width_heatMap = width_svg - margin.left - margin.right - 3,
      height_heatMap = height_svg - margin.top - margin.bottom;
  let padding_eachGrid = 0, // 格子之间的间隔
      padding_eachNeuron = 0; // 每个神经元数据之间的间隔
  let gridWidth = (width_heatMap - (data[0].length - 1) * padding_eachGrid) / data[0].length,
      gridHeight = (height_heatMap - (data.length - 1) * padding_eachNeuron) / data.length;
  let color_min = d3.hcl('#67C23A'),  // 颜色映射函数
      color_max = d3.hcl('#F56C6C'),
      colorRule = d3.interpolate(color_min, color_max);
  data.forEach((data_eachNeuron, num_neuron) =>{
    let g_container_eachNeuron = g_container_hiddenStateHeatMap.append('g')
                                    .attr('id', `g_container_eachNeuron_${num_neuron}`)
                                    .attr('transform', `translate(0, ${num_neuron * (gridHeight + padding_eachNeuron)})`);
    data_eachNeuron.forEach((value_eachEpoch, num_epoch) => {
      g_container_eachNeuron.append('rect')
                            .attr('x', num_epoch * (gridWidth + padding_eachGrid))
                            .attr('y', 0)
                            .attr('width', gridWidth)
                            .attr('height', gridHeight)
                            .attr('fill', colorRule(value_eachEpoch));
    });
  });
  function colorF(value){
    if(value > 0.4) return '#67C23A';
                              else return '#F56C6C';
  }
  
  
  ///////////////////////// chart.update()中的辅助函数 /////////////////////////
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