<template>
  <div id="container_confusionMatrixView">
    <!-- {{data_modelEvaluation.length}} -->
    <div class='tooltips'></div>
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
      bus.$on('Signal_ConfusionMatrix', (data) => {
        that.data_modelEvaluation = data;
        confusionMatrixView.update(that.data_modelEvaluation);
      });
    },
  },
  mounted(){
    confusionMatrixView.create({target: 'container_confusionMatrixView', data: []});
    this.onViewChangeSignal();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_confusionMatrixView{
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
