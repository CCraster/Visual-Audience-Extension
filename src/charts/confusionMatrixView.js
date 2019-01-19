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

}

export default chart;