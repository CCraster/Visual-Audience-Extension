<template>
  <div id="container_trainingDataView">
    <div id="trainingDataView_config">
      <label>sourse:</label>
      <el-select v-model="dataChoosed" placeholder="请选择数据源" size="mini" @change="onDataSourseChange($event)">
      <el-option v-for="item in dataAllSourse" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div id="trainingDataView_main"></div>
  </div>
</template>

<script>
import trainingDataView from '@/charts/trainingDataView.js';

export default {
  name: 'TrainingDataView',
  data () {
    return {
      trainingData: {},
      dataChoosed: 'layer_hidden_2',
    }
  },
  computed:{
    dataAllSourse(){  // 所有的数据源组成的选项option
      let keys_all = Object.keys(this.trainingData);
      let data_sourse_temp = [];
      keys_all.forEach(item => {
        data_sourse_temp.push({value: item, label: item});
      });
      return data_sourse_temp;
    }
  },
  methods: {
    // 读取数据函数
    async fetch(name_data, type){
      let path_common = '@/../static/data/';
      return await d3[type](path_common + name_data);
    },
    // 监听数据源变化
    onDataSourseChange(data_sourse_selected){
      this.dataChoosed = data_sourse_selected;
      trainingDataView.update(this.trainingData[this.dataChoosed]);
      console.log(this.dataChoosed);
    }
  },
  async mounted(){
    let target = 'trainingDataView_main';
    this.trainingData = await this.fetch('log_neuron_state.json', 'json');
    trainingDataView.create({target: target, data: this.trainingData[this.dataChoosed]});
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_trainingDataView{
  height: 100%;
}
#trainingDataView_config{
  height: 36px;
  padding-top: 4px;
  box-sizing: border-box;
  /* background-color: antiquewhite; */
}
#trainingDataView_main{
  height: calc(100% - 36px);
  /* background-color: azure; */
}
</style>
