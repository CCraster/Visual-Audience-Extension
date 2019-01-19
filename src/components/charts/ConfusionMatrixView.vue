<template>
  <div id="container_confusionMatrixView">
    {{data_modelEvaluation.length}}
  </div>
</template>

<script>
import bus from '@/eventBus';
import confusionMatrixView from '@/charts/confusionMatrixView.js';

export default {
  name: 'ConfusionMatrixView',
  data(){
    return {
      data_modelEvaluation: [],
      msg: 'this is ConfusionMatrixView'
    }
  },
  methods: {
    // 监听数据准备完全信号
    onViewChangeSignal(){
      let that = this;
      bus.$on('ViewChange', (data) => {
        that.data_modelEvaluation = data;
        // modelIterationView.update(that.prepareResultData(that.data_modelEvaluation));
      });
    },
  },
  mounted(){
    this.onViewChangeSignal();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_confusionMatrixView{
  height: 100%;
}
</style>
