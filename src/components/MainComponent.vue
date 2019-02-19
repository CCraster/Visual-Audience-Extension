<template>
  <el-container>
    <el-header class="view-header">
      <app-header />  <!-- header -->
    </el-header>
    <el-container>
      <el-aside class="view-networkStructure">
        <network-structure-view />  <!-- network-structure-view -->
      </el-aside>
      <el-main class="view-modelEvaluationComponent">
        <model-evaluation-view /> <!-- model-evaluation-view -->
      </el-main>
    </el-container>
    <el-main class="view-trainingData">
      <hidden-state-view />  <!-- training-data-view -->
    </el-main>
  </el-container>
</template>

<script>
// import bus from '@/eventBus';
import Header from '@/components/Header';
import NetworkStructureView from '@/components/charts/NetworkStructureView'
import ModelEvaluationComponent from '@/components/ModelEvaluationComponent';
import HiddenStateView from '@/components/charts/HiddenStateView';

export default {
  name: 'MainComponent', 
  components: {
    'app-header': Header, 
    'network-structure-view': NetworkStructureView,
    'model-evaluation-view': ModelEvaluationComponent,
    'hidden-state-view': HiddenStateView,
  },
  data(){
    return {
    }
  },
  methods: {
    // 读取数据函数
    async fetch(name_data, type){
      let path_common = '@/../static/data/';
      return await d3[type](path_common + name_data);
    },
    // 出发数据准备完成信号
    emitDataLoadingCompletedSignal(){
      bus.$emit('DataLoadingCompleted', [this.data_hiddenLayerValues, this.data_modelEvaluation]);
    },
  },
  async mounted(){
    // this.data_hiddenLayerValues = await this.fetch(this.path_dataSource + '/log_neuron_state.json', 'json');
    // this.data_modelEvaluation = await this.fetch(this.path_dataSource + '/loss_save.1.json', 'json');
    // this.emitDataLoadingCompletedSignal();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-container{
  height: 100%;
}
.view-header{
  background-color: #262626;
  color: #fff;
  height: 50px !important;
  margin-bottom: 4px;
}
.view-networkStructure{
  background-color: #fff;
  color: #333;
  margin: 0px 6px 0px 6px;
  width: 60% !important;
  box-shadow: 1px 1px 4px #aaa;
  border-radius: 3px;
}
.view-modelEvaluationComponent{
  background-color: #fff;
  color: #333;
  margin: 0px 6px 0px 0px;
  padding: 0;
  box-shadow: 1px 1px 4px #aaa;
  border-radius: 3px;
}
.view-trainingData{
  background-color: #fff;
  color: #333;
  height: 1200px;
  margin: 6px 6px 6px 6px;
  padding: 0;
  box-shadow: 1px 1px 4px #aaa;
  border-radius: 3px;
}
</style>
