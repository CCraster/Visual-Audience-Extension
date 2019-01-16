<template>
  <el-container>
    <el-header class="view-header">
      <app-header />  <!-- header -->
    </el-header>
    <el-container>
      <el-aside class="view-networkStructure">
        <network-structure-view />  <!-- network-structure-view -->
      </el-aside>
      <el-main class="view-result">
        <result-view /> <!-- result-view -->
      </el-main>
    </el-container>
    <el-main class="view-trainingData">
      <training-data-view />  <!-- training-data-view -->
    </el-main>
  </el-container>
</template>

<script>
import Header from '@/components/Header';
import NetworkStructureView from '@/components/charts/NetworkStructureView'
import ResultView from '@/components/charts/ResultView';
import TrainingDataView from '@/components/charts/TrainingDataView';

export default {
  name: 'MainComponent', 
  components: {
    'app-header': Header, 
    'network-structure-view': NetworkStructureView,
    'result-view': ResultView,
    'training-data-view': TrainingDataView,
  },
  data () {
    return {
      msg: 'this is main component！！！'
    }
  },
  mounted(){
    // classification();
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
}
.view-result{
  background-color: #fff;
  color: #333;
  margin: 0px 6px 0px 0px;
  padding: 0;
  box-shadow: 1px 1px 4px #aaa;
}
.view-trainingData{
  background-color: #fff;
  color: #333;
  height: 1200px;
  margin: 6px 6px 6px 6px;
  padding: 0;
  box-shadow: 1px 1px 4px #aaa;
}
</style>
