<template>
  <div id="container_modelIterationView">
    <div class='tooltips'></div>
  </div>
</template>

<script>
import bus from '@/eventBus';
import modelIterationView from '@/charts/modelIterationView.js';
import { setTimeout } from 'timers';

export default {
  name: 'ModelIterationView',
  data(){
    return {
      data_modelEvaluation: [],
      targets: ['loss', 'acc'],
      checkedTargets: ['loss', 'acc'],
    }
  },
  methods: {
    // 处理checkbox选中事件
    onTargetChange(event){
      modelIterationView.update(this.prepareResultData());
    },
    // 根据选中的数据，制造合适的数据格式
    prepareResultData(){
      let data_temp = [];
      let checkedTargets_temp = this.checkedTargets;
      checkedTargets_temp.forEach(item => {
        data_temp.push({name: item, value: []});
      });
      this.data_modelEvaluation.forEach(item => {
        checkedTargets_temp.forEach(single_target => {
          let index = checkedTargets_temp.indexOf(single_target);
          if(index > -1) data_temp[index].value.push(item[single_target]);
        });
      });
      return data_temp;
    },
    // 监听数据准备完全信号
    onModelIterationSignal(){
      let that = this;
      bus.$on('Signal_ModelIteration', (data) => {
        that.data_modelEvaluation = data;
        modelIterationView.update(that.prepareResultData(that.data_modelEvaluation));
      });
    }
  },
  mounted(){
    modelIterationView.create({target: 'container_modelIterationView', data: []});
    this.onModelIterationSignal();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_modelIterationView{
  position: relative;
  height: 100%;
}
.tooltips{
  width: 100px;
  height: 90px;
  position: absolute;
  display: none;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  border-radius: 2px;
  padding: 10px;
  text-align: center;
}
</style>
