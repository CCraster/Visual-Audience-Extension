<template>
  <div id="container_modelEvaluationComponent">
    <div id="modelEvaluationComponent_dynamicComponent">
      <el-switch 
      v-model="isModelIterationView" 
      active-color="#409EFF" 
      inactive-color="#409EFF" 
      active-text="ModelIteration" 
      inactive-text="ConfusionMatrix"
      class="modelEvaluationComponent_switch" 
      @change="emitViewChangeSignal">
      </el-switch>
    </div>
    <div id="modelEvaluationComponent_main">
      <keep-alive>
      <component :is="isModelIterationView === true ? views['modelIterationView'] : views['confusionMatrixView']"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import bus from '@/eventBus';
import ModelIterationView from '@/components/charts/ModelIterationView';
import ConfusionMatrixView from '@/components/charts/ConfusionMatrixView';
import { setTimeout } from 'timers';

export default {
  name: 'ModelEvaluationComponent',
  components: {
    'model-evaluation-view': ModelIterationView,
    'confusion-matrix-view': ConfusionMatrixView
  },
  data(){
    return {
      data_modelEvaluation: [],
      views: {'modelIterationView': ModelIterationView, 'confusionMatrixView': ConfusionMatrixView},
      isModelIterationView: false,
      isFirstTimeChange: true,
    }
  },
  methods: {
    // 监听数据准备完全信号
    onDataLoadingCompletedSignal(){
      let that = this;
      bus.$on('DataLoadingCompleted', (data) => {
        that.data_modelEvaluation = data[1];
        bus.$emit(this.isModelIterationView ? 'Signal_ModelIteration' : 'Signal_ConfusionMatrix', that.data_modelEvaluation);
      });
    },
    // 出发视图改变信号
    emitViewChangeSignal(){
      if(this.isFirstTimeChange){
        setTimeout(() => {  // 延迟出发信号，等混淆矩阵视图加载完成启动信号监听函数，js任务机制
          bus.$emit(!this.isModelIterationView ? 'Signal_ConfusionMatrix' : 'Signal_ModelIteration', this.data_modelEvaluation);
        }, 0);
        this.isFirstTimeChange = false;
      }
    },
  },
  mounted(){
    this.onDataLoadingCompletedSignal();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_modelEvaluationComponent{
  height: 100%;
}
#modelEvaluationComponent_dynamicComponent{
  height: 36px;
  padding-top: 4px;
  box-sizing: border-box;
  /* background-color: antiquewhite; */
}
.modelEvaluationComponent_switch{
  float: right;
  margin-right: 10px;
}
#modelEvaluationComponent_main{
  height: calc(100% - 36px);
  /* background-color: azure; */
}
</style>
