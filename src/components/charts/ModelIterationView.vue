<template>
  <div id="container_modelIterationView">
  </div>
</template>

<script>
import bus from '@/eventBus';
import modelIterationView from '@/charts/modelIterationView.js';

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
    onDataLoadingCompletedSignal(){
      let that = this;
      bus.$on('DataLoadingCompleted', (data) => {
        that.data_modelEvaluation = data[1];
        modelIterationView.update(that.prepareResultData(that.data_modelEvaluation));
      });
    }
  },
  mounted(){
    modelIterationView.create({target: 'container_modelIterationView', data: []});
    this.onDataLoadingCompletedSignal();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_modelIterationView{
  height: 100%;
}
</style>
