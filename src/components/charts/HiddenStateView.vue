<template>
  <div id="container_hiddenStateView">
    <div id="hiddenStateView_config">
      <label>sourse:</label>
      <el-select v-model="dataChoosed" placeholder="请选择数据源" size="mini" @change="onDataSourseChange($event)">
      <el-option v-for="item in dataAllSourse" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div id="hiddenStateView_main"></div>
  </div>
</template>

<script>
import bus from '@/eventBus';
import hiddenStateView from '@/charts/hiddenStateView.js';

export default {
  name: 'HiddenStateView',
  data(){
    return {
      data_hiddenLayerValues: {},
      dataChoosed: 'layer_hidden_1',
    }
  },
  computed:{
    dataAllSourse(){  // 所有的数据源组成的选项option
      let keys_all = Object.keys(this.data_hiddenLayerValues);
      let data_sourse_temp = [];
      keys_all.forEach(item => {
        data_sourse_temp.push({value: item, label: item});
      });
      return data_sourse_temp;
    }
  },
  methods: {
    // 监听数据源变化
    onDataSourseChange(data_sourse_selected){
      this.dataChoosed = data_sourse_selected;
      hiddenStateView.update(this.data_hiddenLayerValues[this.dataChoosed]);
      // console.log(this.dataChoosed);
    },
    // 监听数据准备完全信号
    onDataLoadingCompletedSignal(){
      let that = this;
      bus.$on('DataLoadingCompleted', (data) => {
        that.data_hiddenLayerValues = data[0];
        hiddenStateView.update(that.data_hiddenLayerValues[that.dataChoosed]);
      });
    }
  },
  async mounted(){
    hiddenStateView.create({target: 'hiddenStateView_main', data: this.data_hiddenLayerValues[this.dataChoosed]});
    this.onDataLoadingCompletedSignal();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_hiddenStateView{
  height: 100%;
}
#hiddenStateView_config{
  height: 36px;
  padding-top: 4px;
  box-sizing: border-box;
  /* background-color: antiquewhite; */
}
#hiddenStateView_main{
  height: calc(100% - 36px);
  /* background-color: azure; */
}
</style>
