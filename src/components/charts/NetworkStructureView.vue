<template>
  <div id="container_networkStructureView">
    <div id="networkStructureView_config">
      <el-button size="mini" type="primary">ReTrain</el-button>
    </div>
    <div id="networkStructureView_main">
      <input type="text" id="input_example" value='1' class="networkStructureView_input" style="display: none"/>
    </div>
  </div>
</template>

<script>
import networkStructureView from '@/charts/networkStructureView.js'

export default {
  name: 'NetworkStructureView',
  data () {
    return {
      msg: 'this is NetworkStructureView view'
    }
  },
  mounted(){
    networkStructureView.create({target: 'networkStructureView_main', data: [
      {name: 'layer_input', value: 300},
      {name: 'layer_hidden_1', value: 200},
      {name: 'layer_hidden_2', value: 100},
      {name: 'layer_hidden_3', value: 10},
      {name: 'layer_output', value: 1},
    ]});
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container_networkStructureView{
  height: 100%;
}
.el-button{
  float: right;
  margin-right: 10px;
}
#networkStructureView_config{
  height: 36px;
  padding-top: 4px;
  box-sizing: border-box;
  /* background-color: antiquewhite; */
}
#networkStructureView_main{
  position: relative;
  height: calc(100% - 36px);
  /* background-color: azure; */
}
.networkStructureView_input{
  position: absolute;
  border: 1px solid #409EFF;
  border-radius: 3px;
  padding: 2px 0px;
  text-align: center;
}
</style>
