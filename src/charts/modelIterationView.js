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
  // this.update();
}

chart.update = function(_data){
  d3.select('#g_container_target').remove();
  let data = _data || this.config.data;
  if(data.length === 0) return;
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
              // .call(transition);

  svg.call(drawLegend); // 绘制图例
  svg.call(hoverOnModelIteration); // tooltips
  
  // 函数：绘制legend
  function drawLegend(svg){
    let width_legend = 18, height_legend = 2;
    let width_rectAndText = 50, height_rectAndText = 15;
    let padding_rectAndText = 5;
    let g_legend_modelIteration = svg.append('g')
                                      .attr('id', 'g_legend_modelIteration')
                                      .attr('transform', `translate(${width_svg - margin.right - width_rectAndText}, ${yScale(1)})`);
    g_legend_modelIteration.selectAll('rect')  // legend图形
                            .data(Object.keys(colorRule))
                            .enter()
                            .append('rect')
                            .attr('x', 0)
                            .attr('y', (d, i) => height_rectAndText * i)
                            .attr('width', width_legend)
                            .attr('height', height_legend)
                            .attr('fill', d => colorRule[d]);
    g_legend_modelIteration.selectAll('text')  // legend文字
                          .data(Object.keys(colorRule))
                          .enter()
                          .append('text')
                          .attr('x', width_legend + padding_rectAndText)
                          .attr('y', (d, i) => height_rectAndText * i)
                          .attr('dy', '.5em')
                          .attr("font-weight", "bold")
                          .attr("font-size", "80%")
                          .text(d => d);
  }

  // 函数：鼠标悬浮显示tooltips
  function hoverOnModelIteration(svg){
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
              .attr('d', lineGenerator([[0, 0], [0, 1]]));
    g_tooltips.selectAll('circle')
              .data(d3.range(2))
              .enter()
              .append('circle')
              .attr('cx', (d, i) => xScale(0))
              .attr('cy', (d, i) => yScale(data[i]['value'][0]))
              .attr('r', radius_tooltips)
              .attr('fill', 'white')
              .attr('stroke', (d, i) => colorRule[data[i]['name']]);
    function handleMouseMoved(){
      d3.event.preventDefault();
      let xm = Math.round(xScale.invert(d3.event.layerX));
      g_tooltips.select('path')
                .attr('d', lineGenerator([[xm, 0], [xm, 1]]));
      g_tooltips.selectAll('circle')
                .data(d3.range(2))
                .attr('cx', (d, i) => xScale(xm))
                .attr('cy', (d, i) => yScale(data[i]['value'][xm]));
      let div_tooltips = d3.select('.tooltips');
      div_tooltips.html(
        `<span style="display: inline-block; margin-bottom: 8px;">第${xm + 1}次训练</span><br />
        <span style="float: left;">loss: </span><br />
        <span style="float: left;">${data[0]['value'][xm].toFixed(10)}</span><br />
        <span style="float: left;">acc: </span><br />
        <span style="float: left;">${data[1]['value'][xm].toFixed(10)}</span><br />
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

  // 函数：过度动画
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