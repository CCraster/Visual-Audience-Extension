<template>
  <div id="container_resultView">
    <div id="resultView_config">
      <el-checkbox-group class="resultView_checkbox" v-model="checkedTargets" :min="1" :max="targets.length" @change="onTargetChange($event)">
        <el-checkbox v-for="target in targets" :label="target" :key="target">{{target}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div id="resultView_main"></div>
  </div>
</template>

<script>
import resultView from '@/charts/ResultView.js';

export default {
  name: 'ResultView',
  data () {
    return {
      lossData: [],
      targets: [],
      checkedTargets: ['loss', 'acc'],
    }
  },
  computed: {
    // targets(){
    //   let targets_temp = Object.keys(this.lossData[0]);
    //   return targets_temp;
    // },
  },
  methods: {
    // 读取数据函数
    async fetch(name_data, type){
      let path_common = '@/../static/data/';
      return await d3[type](path_common + name_data);
    },
    // 获取所有的指标
    getTargets(){ 
      this.targets = Object.keys(this.lossData[0][1]);
    },
    // 处理checkbox选中事件
    onTargetChange(event){
      resultView.update(this.prepareResultData());
    },
    // 根据选中的数据，制造合适的数据格式
    prepareResultData(){
      let data_temp = [];
      let checkedTargets_temp = this.checkedTargets;
      checkedTargets_temp.forEach(item => {
        data_temp.push({name: item, value: []});
      });
      this.lossData.forEach(item => {
        checkedTargets_temp.forEach(single_target => {
          let index = checkedTargets_temp.indexOf(single_target);
          if(index > -1) data_temp[index].value.push(item[1][single_target]);
        });
      });
      return data_temp;
    },
  },
  async mounted(){
    this.lossData = await this.fetch('loss_save.json', 'json');
    this.getTargets();
    resultView.create({target: 'resultView_main', data: this.prepareResultData()});
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_resultView{
  height: 100%;
}
#resultView_config{
  height: 36px;
  padding-top: 8px;
  box-sizing: border-box;
  /* background-color: antiquewhite; */
}
.resultView_checkbox{  /* 调整checkbox样式 */
  float: right;
  padding-right: 10px;
}
.resultView_checkbox label{
  margin-left: 15px;
}
/* span{
  padding-left: 50px !important;
} */
#resultView_main{
  height: calc(100% - 36px);
  /* background-color: azure; */
}
</style>
