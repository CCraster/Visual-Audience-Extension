<template>
  <div id="container_networkStructureView">
    <div id="networkStructureView_header">
      <el-button size="mini" type="primary" @click="handleRetrainClicked">ReTrain</el-button>
      <span class="networkStructureView_configIcon"> <i class="el-icon-setting" @click="handleSettingClicked"></i> </span>
      <div id="div_networkStructureView_config">
        <span><label>hidden layer:</label><el-input v-model="config_hiddenLayer" placeholder="hidden layer" size="mini"></el-input></span>
        <span><label>loss function:</label><el-select v-model="config_lossFunction" placeholder="please select" size="mini">
            <el-option label="binaryCrossentropy" value="binaryCrossentropy"></el-option>
            <el-option label="meanSquaredError" value="meanSquaredError"></el-option>
            <el-option label="categoricalCrossentropy" value="categoricalCrossentropy"></el-option>
          </el-select>
        </span>
        <span><label>ati function:</label><el-select v-model="config_activateFunction" placeholder="please select" size="mini">
            <el-option label="sigmoid" value="sigmoid"></el-option>
            <el-option label="relu" value="relu"></el-option>
            <el-option label="tanh" value="tanh"></el-option>
            <el-option label="elu" value="elu"></el-option>
          </el-select>
        </span>
        <span><label>learning rate:</label><el-input v-model="config_learningRate" placeholder="learning rate" size="mini"></el-input></span>
        <span><label>batch size:</label><el-input v-model="config_batchSize" placeholder="batch size" size="mini"></el-input></span>
        <span><label>epoch:</label><el-input v-model="config_epoch" placeholder="epoch" size="mini"></el-input></span>
        <el-button size="mini" type="primary" @click="handleNetworkStructureChange">Submit</el-button>
      </div>
    </div>
    <div id="networkStructureView_main">
      <input type="text" id="input_example" value='1' class="networkStructureView_input" style="display: none"/>
    </div>
  </div>
</template>

<script>
import bus from '@/eventBus';
import networkStructureView from '@/charts/networkStructureView.js'

export default {
  name: 'NetworkStructureView',
  data () {
    return {
      config_hiddenLayer: '',
      config_lossFunction: 'binaryCrossentropy',
      config_activateFunction: 'sigmoid',
      config_learningRate: 0.01,
      config_batchSize: 32,
      config_epoch: 400,
      data_hiddenLayerValues: {},
      data_modelEvaluation: [],
      data_networkStructure: [],
      path_dataSource: 'hidden_four',
    }
  },
  methods: {
    // 读取数据函数
    async fetch(name_data, type){
      let path_common = '@/../static/data/';console.log(path_common + name_data);
      return await d3[type](path_common + name_data);
    },
    // 发出数据准备完成信号
    emitDataLoadingCompletedSignal(){
      bus.$emit('DataLoadingCompleted', [this.data_hiddenLayerValues, this.data_modelEvaluation]);
    },
    // 数据读取
    async dataLoading(){
      this.data_hiddenLayerValues = await this.fetch(this.path_dataSource + '/log_neuron_state.json', 'json');  // 读取隐藏层状态值数据
      this.data_modelEvaluation = await this.fetch(this.path_dataSource + '/loss_save.json', 'json'); // 读取模型评估数据
      let data_networkStructure_temp = [{name: 'layer_input', value: 412}]; // 构造网络结构数据
      let layer_hidden = Object.keys(this.data_hiddenLayerValues);
      for(let i = 0; i < layer_hidden.length; i++){
        let single_layer = {name: layer_hidden[i], value: this.data_hiddenLayerValues[layer_hidden[i]][0].length};
        data_networkStructure_temp.push(single_layer);
      }
      this.data_networkStructure = data_networkStructure_temp;
      this.config_hiddenLayer = this.data_networkStructure.slice(1, -1).map( d => d.value ).toString();

      this.emitDataLoadingCompletedSignal();
    },
    // 网络结构配置被点击
    handleSettingClicked(){
      let display = d3.select('#div_networkStructureView_config').style('display');
      if(display === 'none') d3.select('#div_networkStructureView_config').style('display', 'block');
      else d3.select('#div_networkStructureView_config').style('display', 'none');
    },
    // 模型重新训练按钮被点击
    async handleRetrainClicked(){
      let file_dir = {
        4: 'hidden_four', 
        3: 'hidden_three',
        2: 'hidden_two', 
        1: 'hidden_one', 
        0: 'old', 
      };
      if(this.config_hiddenLayer.length === 0) this.path_dataSource = file_dir[0];  // 0代表的数据，隐含层值的变化不是那种“0或1”的不规则形状
      else this.path_dataSource = file_dir[this.config_hiddenLayer.split(',').length];
      await this.dataLoading();
      networkStructureView.update(this.data_networkStructure);
    },
    // 网络结构重绘按钮被点击
    handleNetworkStructureChange(){
      d3.select('#div_networkStructureView_config').style('display', 'none');
      let data_networkStructure_temp = [{name: 'layer_input', value: 412}];
      let hidden_layer_array = this.config_hiddenLayer.split(',');
      for(let i = 0; i < hidden_layer_array.length; i++){
        let single_layer = {name: `layer_hidden_${i + 1}`, value: hidden_layer_array[i]};
        data_networkStructure_temp.push(single_layer);
      }
      data_networkStructure_temp.push({name: 'layer_output', value: 1});
      this.data_networkStructure = data_networkStructure_temp;
      networkStructureView.update(this.data_networkStructure);
    }
  },
  async mounted(){
    await this.dataLoading();
    networkStructureView.create({target: 'networkStructureView_main', data: this.data_networkStructure});
    // this.emitDataLoadingCompletedSignal();
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
#networkStructureView_header{
  position: relative;
  height: 36px;
  padding-top: 4px;
  box-sizing: border-box;
  /* background-color: antiquewhite; */
}
#div_networkStructureView_config{
  position: absolute;
  display: none;
  user-select: none;
  width: 200px;
  height: 220px;
  padding: 10px;
  top: 40px;
  right: 10px;
  background: rgba(255, 255, 255, 1);
  z-index: 200;
  border: 2px;
  box-shadow: 1px 1px 4px #aaa;
}
#div_networkStructureView_config button{
  float: none;
  margin-left: 60px;
}
#div_networkStructureView_config span{
  display: inline-block;
  margin-bottom: 4px;
}
#div_networkStructureView_config span label{
  display: inline-block;
  width: 80px;
  height: calc(28px - 2px);
  line-height: calc(28px - 2px);
  border-radius: 3px;
  text-align: center;
  padding: 0 5px;
  margin-right: 2px;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 80%;
  border: solid #bdbec2 1px;
}
#div_networkStructureView_config span div{
  width: 105px;
}
.networkStructureView_configIcon{
  float: right;
  margin: 2px 10px 0 0 ;
  font-size: 150%;
}
.networkStructureView_configIcon :hover{
  color: #E6A23C;
}
.networkStructureView_configIcon :active{
  font-size: 90%;
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
