/*
* @date: 20190228
*/
const chart = {};

chart.create = function(config){
  chart.config = config;
  this.config.margin = {top: 15, right: 15, bottom: 30, left: 10};
  this.config.width_svg = document.getElementById(this.config.target).clientWidth;
  this.config.height_svg = document.getElementById(this.config.target).clientHeight - 4;  // ？？？？要减4才能不突出高度
  this.config.colorRule = {
    'tp': '#67C23A',
    'fp': '#99d77a',
    'tn': '#F56C6C',
    'fn': '#fabcbc',
  };
  this.config.svg = d3.select(`#${this.config.target}`)
                      .append('svg')
                      .attr('width', this.config.width_svg)
                      .attr('height', this.config.height_svg);
  this.update();
}

chart.update = function(_data){
  d3.select('#g_container_confusionMatrix').remove();
  let data = _data || this.config.data;
  if(data.length === 0) return;
  let stack = d3.stack()
                .keys(['fn', 'tn', 'fp', 'tp'])
                .offset(_offsetForConfusionMatrix);
  data = stack(data);                                                                                                                                   
  let margin = this.config.margin,
      width_svg = this.config.width_svg,
      height_svg = this.config.height_svg,
      colorRule = this.config.colorRule,
      svg = this.config.svg.append('g').attr('id', 'g_container_confusionMatrix');
  let xScale = d3.scaleLinear()
                .domain([0, data[0].length])
                .range([margin.left, width_svg - margin.right]);
  let yScale = d3.scaleLinear()
                .domain([0, 15000])
                .range([height_svg - margin.bottom, margin.top]);
  let xAxis = g => g.attr("transform", `translate(0,${height_svg - margin.bottom})`)
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
  let area = d3.area()
              .curve(d3.curveBasis)
              .x((d, i) => xScale(i))
              .y0(d => yScale(d[0]))
              .y1(d => yScale(d[1]));
  
  svg.append('g')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('fill', (d) => colorRule[d.key])
    .attr('d', (d) => area(d));
  svg.append('g')
    .call(xAxis);
  
  svg.call(hoverOnConfusionMatrix);

  // 绘制legend
  let start_pos_x = 0, start_pos_y = 10;
  let width_legend = 18, height_legend = 2;
  let width_rectAndText = 50, height_rectAndText = 15;
  let padding_rectAndText = 5;
  let g_legend_confusionMatrix = svg.append('g')
                                    .attr('id', 'g_legend_confusionMatrix')
                                    .attr('transform', `translate(${width_svg - margin.right - width_rectAndText * 2}, ${yScale(13000) - height_rectAndText * 2.5})`);
  g_legend_confusionMatrix.selectAll('rect')  // legend图形
                          .data(Object.keys(colorRule))
                          .enter()
                          .append('rect')
                          .attr('x', (d, i) => {if(i % 2 === 0) {start_pos_x = 0; return start_pos_x}; return start_pos_x + width_rectAndText;})
                          .attr('y', (d, i) => {if(i !==0 && i % 2 === 0) {start_pos_y += height_rectAndText; return start_pos_y}; return start_pos_y;})
                          .attr('width', width_legend)
                          .attr('height', height_legend)
                          .attr('fill', d => colorRule[d]);
  g_legend_confusionMatrix.selectAll('text')  // legend文字
                        .data(Object.keys(colorRule))
                        .enter()
                        .append('text')
                        .attr('x', (d, i) => {if(i % 2 === 0) {start_pos_x = 0; return start_pos_x + width_legend + padding_rectAndText}; return start_pos_x + width_rectAndText + width_legend + padding_rectAndText;})
                        .attr('y', (d, i) => {if(i !==0 && i % 2 === 0) {start_pos_y += height_rectAndText; return start_pos_y}; return start_pos_y;})
                        .attr('dy', '-0.6em')
                        .attr("font-weight", "bold")
                        .attr("font-size", "80%")
                        .text(d => d.toUpperCase());

  // 鼠标悬浮显示tooltips
  function hoverOnConfusionMatrix(svg){
    let radius_tooltips = 4;
    svg.style('position', 'relative');
    svg.on('mousemove', handleMouseMoved)
      .on('mouseenter', handleMouseEntered)
      .on('mouseleave', handleMouseLeft);
    let g_tooltips = svg.append('g')
                        .attr('display', 'none');
    let lineGenerator = d3.line()
                          .x(d => xScale(d[0]))
                          .y(d => yScale(d[1]));
    g_tooltips.append('path')
              .attr('stroke', 'gray')
              .attr('opacity', '.5')
              .attr('fill', 'none')
              .attr('d', lineGenerator([[0, 0], [0, 18000]]));
    g_tooltips.selectAll('circle')
              .data(d3.range(4))
              .enter()
              .append('circle')
              .attr('cx', (d, i) => xScale(0))
              .attr('cy', (d, i) => yScale(data[i][0][1]))
              .attr('r', radius_tooltips)
              .attr('fill', 'white')
              .attr('stroke', (d, i) => colorRule[data[i].key]);
    function handleMouseMoved(){
      d3.event.preventDefault();
      let xm = Math.round(xScale.invert(d3.event.layerX));
      g_tooltips.select('path')
                .attr('d', lineGenerator([[xm, 0], [xm, 18000]]));
      g_tooltips.selectAll('circle')
                .data(d3.range(4))
                .attr('cx', (d, i) => xScale(xm))
                .attr('cy', (d, i) => yScale(data[i][xm][1]));
      let div_tooltips = d3.select('.tooltips');
      div_tooltips.html(
        `<span style="display: inline-block; margin-bottom: 8px;">第${xm + 1}次训练</span><br />
        <span style="float: left; margin-left: 10px;">TP: ${data[3][xm][1] - data[3][xm][0]}</span><br />
        <span style="float: left; margin-left: 10px;">FP: ${data[2][xm][1] - data[2][xm][0]}</span><br />
        <span style="float: left; margin-left: 10px;">TN: ${data[1][xm][1] - data[1][xm][0]}</span><br />
        <span style="float: left; margin-left: 10px;">FN: ${data[0][xm][1] - data[0][xm][0]}</span>
        `
      );
      div_tooltips.style('top', (height_svg - margin.top - margin.bottom) / 2 - 55 + margin.top + 'px');
      div_tooltips.style('left', (x = d3.event.layerX) => { 
        if(width_svg - x > 130)
          return x + 10 + 'px';
        else
          return x - 120 - 10 + 'px';
      });

    }
    function handleMouseEntered(){
      g_tooltips.attr('display', null);
      d3.select('.tooltips').style('display', 'block');
    }
    function handleMouseLeft(){
      g_tooltips.attr('display', 'none');
      d3.select('.tooltips').style('display', 'none');
    }
  }

  // 堆叠图的offset函数，用以改变数据的相对位置
  function _offsetForConfusionMatrix(series, order){
    let padding_class = 1000;
    let start_class = 2000;
    if (!((n = series.length) > 1)) return;
    for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
      s0 = s1, s1 = series[order[i]];
      for (var j = 0; j < m; ++j) {
        if(i === 1){  // 设置起点
          s0[j][0] += start_class;
          s0[j][1] += start_class;
        }
        if(i % 2 === 1) // 设置每类之间的间隔
          s1[j][1] += s1[j][0] = s0[j][1];
        else
          s1[j][1] += s1[j][0] = s0[j][1] + padding_class;
      }
    }
  }
}

export default chart;