/*
*
*/
const chart = {};

chart.create = function(config){
  chart.config = config;
  this.config.margin = {top: 20, right: 25, bottom: 20, left: 10};
  this.config.width_svg = document.getElementById(this.config.target).clientWidth;
  this.config.height_svg = document.getElementById(this.config.target).clientHeight - 4;  // ？？？？要减4才能不突出高度
  this.config.width_legend = 110;
  this.config.colorRule = {
    'layer_input': '#F56C6C',
    'layer_hidden': '#909399',
    'layer_output': '#67C23A',
  };
  this.config.svg = d3.select(`#${this.config.target}`)
                      .append('svg')
                      .attr('width', this.config.width_svg)
                      .attr('height', this.config.height_svg);
  this.init();
}

chart.init = function(){
  let data = this.config.data;
  let margin = this.config.margin,
      width_svg = this.config.width_svg,
      height_svg = this.config.height_svg,
      width_legend = this.config.width_legend,
      colorRule = this.config.colorRule,
      svg = this.config.svg.append('g').attr('id', 'g_container_networkStructure');

  // 绘制图例
  svg.append('g')
      .attr('id', 'g_networkStructure_legend')
      .attr('transform', `translate(${width_svg - margin.right - width_legend}, ${margin.top})`)
      .selectAll('circle')
      .data(Object.keys(colorRule))
      .enter().append('circle')
              .style('fill', d => colorRule[d])
              .attr('cx', 10)
              .attr('cy', (d, i) => { return i * 24 + 10; })
              .attr('r', 10)
  svg.select('#g_networkStructure_legend')
      .selectAll('text')
      .data(Object.keys(colorRule))
      .enter().append('text')
              .attr('x', 10 + 14)
              .attr('y', (d, i) => { return i * 24 + 10 + 5; })
              .style('fill', d => colorRule[d])
              .text(d => d.split('_')[1] + ' neuron');
  
  // 绘制网络结构
  let width_neuronInput = 100;
  let width_reduceHiddenLayer = 40;
  let padding_rect = 2;
  svg.append('g')
      .attr('id', 'g_networkStructure_neuronContainer')
      .attr('transform', `translate(${margin.left + width_neuronInput}, ${margin.top})`);
  let g_neuronContainer = d3.select('#g_networkStructure_neuronContainer');
  let width_neuron_available = width_svg - width_neuronInput - width_legend - margin.left - margin.right * 2 - width_reduceHiddenLayer,
      height_neuron_available = height_svg - margin.top - margin.bottom;
  let neuron_radius = parseInt(height_neuron_available / (data.length * 2 + 2 * data.length - 1 * 2));  // 计算圆的半径
  let neuron_padding = neuron_radius; // 每层之间的间隔

  data.forEach((single_layer, i) => {
    let g_neuronGroup = g_neuronContainer.append('g')
                                        .attr('id', 'g_neuronGroup-' + single_layer.name)
                                        .attr('transform', `translate(0, ${(2 * neuron_radius + neuron_padding * 2) * i})`);
    let color_fill = (() => { // 得出每层的配色
                  let array_temp = single_layer.name.split('_');
                  return colorRule[array_temp[0] + '_' + array_temp[1]];
                })();
    
    
    let input_example = document.getElementById('input_example'); // 生成input
    let input_temp = input_example.cloneNode(true);
    input_temp.id = `input-${single_layer.name}`;
    input_temp.value = single_layer.value;
    input_temp.style.height = 2 * neuron_radius - padding_rect + 'px';
    input_temp.style.width = 3 * neuron_radius + 'px';
    input_temp.style.top = (2 * neuron_radius + neuron_padding * 2) * i + margin.top - padding_rect + 'px';
    input_temp.style.left = (width_neuronInput - 3 * neuron_radius) + 'px';
    input_temp.style.display = 'block';
    input_temp.style['border-color'] = color_fill;
    document.getElementById(this.config.target).appendChild(input_temp);

    g_neuronGroup.append('rect')  // 绘制每层的底框
                .attr('x', 0 - padding_rect)
                .attr('y', 0 - padding_rect)
                .attr('width', width_neuron_available + padding_rect * 2)
                .attr('height', neuron_radius * 2 + padding_rect * 2)
                .style('fill', 'none')
                .style('stroke', color_fill)
                .style('stroke-opacity', .7)
                .style('stroke-dasharray', [4, 2]);
    if(i > 0 && i < data.length - 1){ // 绘制隐层后面的减号
      g_neuronGroup.append('text')
                  .attr('x', width_neuron_available + padding_rect)
                  .attr('y', neuron_radius + padding_rect)
                  .attr('dx', '.25em')
                  .attr('dy', '.25em')
                  .style('fill', color_fill)
                  .attr("font-weight", "bold")
                  .attr("font-size", "200%")
                  .text('-');
    }
    if(i < data.length - 1){  // 绘制增加隐层的图形
      g_neuronGroup.append('text')
                  .attr('x', width_neuron_available / 2)
                  .attr('y', neuron_radius * 2 + neuron_padding)
                  .attr('dx', '-.25em')
                  .attr('dy', '.25em')
                  .style('fill', colorRule['layer_hidden'])
                  .attr("font-weight", "bold")
                  .attr("font-size", "200%")
                  .text('+');
    }

    let start_pos;  // 判断g容器的宽度是否足够
    let num_neuron_max; // 保存宽度能够容纳的最多的圆的数目
    let width_enough = parseInt((width_neuron_available - 2 * single_layer.value * neuron_radius - (single_layer.value - 1) * neuron_padding * 0.5) / 2);
    if(width_enough < 0){ // 长度超过时的绘制
      num_neuron_max = parseInt((width_neuron_available + 0.5 * neuron_radius) / 2.5 / neuron_radius);  // 计算最多可以放几个圆
      // num_neuron_max % 2 === 0 ? num_neuron_max -= 1 : num_neuron_max = num_neuron_max; // 让圆总数为奇数
      start_pos = parseInt((width_neuron_available - 2 * num_neuron_max * neuron_radius - (num_neuron_max - 1) * neuron_padding * 0.5) / 2);
      for(let i = 0; i < num_neuron_max; i++){
        if(i === parseInt(num_neuron_max / 2)){ // 绘制省略号
          let num_smallCircle = 6;
          let radius_smallCircle = parseInt(2 * neuron_radius / (2.5 * num_smallCircle));
          let cy = (2 * neuron_radius - 2 * radius_smallCircle) / 2 + radius_smallCircle;
          let start_pos_smallCircle = start_pos + (2 * neuron_radius + neuron_padding * 0.5) * i + neuron_radius / 2 - radius_smallCircle;
          for(let j = 0; j < num_smallCircle; j++){
            g_neuronGroup.append('circle')
                        .attr('cx', start_pos_smallCircle + 2.5 * radius_smallCircle * j + radius_smallCircle)
                        .attr('cy', cy)
                        .attr('r', radius_smallCircle)
                        .style('fill', color_fill);
          }
        }else{  // 绘制两边的圆
          let cx = start_pos + (2 * neuron_radius + neuron_padding * 0.5) * i + neuron_radius;
          drawCircle(g_neuronGroup, cx, neuron_radius, neuron_radius, color_fill);
        }
      }
    }else{   // 长度足够时的绘制
      start_pos = width_enough;
      for(let i = 0; i < single_layer.value; i++){
        let cx = start_pos + (2 * neuron_radius + neuron_padding * 0.5) * i + neuron_radius;
        drawCircle(g_neuronGroup, cx, neuron_radius, neuron_radius, color_fill);
      }
    }

  });

  // 绘制单个神经元函数
  function drawCircle(g, cx, cy, r, color_fill){
    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', r)
      .style('fill', color_fill);
  }
}

export default chart;