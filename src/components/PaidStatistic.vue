<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>数据统计</b></el-breadcrumb-item>
        <el-breadcrumb-item>付费数据统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-row style="background-color: #eee;margin-top:30px;">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <!--饼状图-->
          <div id="myChart1" :style="{width: '400px', height: '400px',margin:'30px 0 0 50px'}"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <div id="myChart2" :style="{width: '400px', height: '400px',margin:'30px 0 0 50px'}"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div id="myChart3" :style="{width: '400px', height: '400px',margin:'30px 0 0 50px'}"></div>
        </div>
      </el-col>
    </el-row>

    <div class="sks">商城售卡数</div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;margin-top:20px;">
      <el-select v-model="value4" clearable placeholder="请选择年份">
        <el-option
          v-for="item in years"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value" clearable placeholder="请选择月份" style="margin-left:40px;">
        <el-option
          v-for="item in months"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>

    <el-col :span="12" style="margin-top:30px;">
      <div style="float:left;background-color: #eee;width:350px;height:40px;">
        <span style="float:left;margin-top:10px;">本月销售总额</span>
        <span style="float:right;margin-top:10px;">222.00元</span>
      </div>
      <el-button size="text" @click="look" style="float:left;margin:3px 0 0 15px;color:#409EFF;font-size:12px;">查看详情</el-button>
    </el-col>
    <el-col :span="12" style="margin-top:30px;">
      <div style="float:left;background-color: #eee;width:350px;height:40px;">
        <span style="float:left;margin-top:10px;">本月ARPU（单个用户平均收益）</span>
        <span style="float:right;margin-top:10px;">10.00元</span>
      </div>
    </el-col>

    <el-row :gutter="20" style="margin:190px 0 0 30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple CARD">
          <div class="top" style="overflow: hidden;">
            <div class="leftImg">
              <img src="../assets/images/icon_rika.png" alt="" class="card">
            </div>
            <div class="rightText">
              <div class="num">10张</div>
              <div class="type grey">日卡</div>
            </div>
          </div>
          <span style="font-size: 20px;color: #252631;font-weight:bold;">金额：222.00元</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple CARD">
          <div class="top" style="overflow: hidden;">
            <div class="leftImg">
              <img src="../assets/images/icon_zhouka.png" alt="" class="card">
            </div>
            <div class="rightText">
              <div class="num">10张</div>
              <div class="type grey">周卡</div>
            </div>
          </div>
          <span style="font-size: 20px;color: #252631;font-weight:bold;">金额：222.00元</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple CARD">
          <div class="top" style="overflow: hidden;">
            <div class="leftImg">
              <img src="../assets/images/icon_yueka.png" alt="" class="card">
            </div>
            <div class="rightText">
              <div class="num">10张</div>
              <div class="type grey">月卡</div>
            </div>
          </div>
          <span style="font-size: 20px;color: #252631;font-weight:bold;">金额：222.00元</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple CARD">
          <div class="top" style="overflow: hidden;">
            <div class="leftImg">
              <img src="../assets/images/icon_jika.png" alt="" class="card">
            </div>
            <div class="rightText">
              <div class="num">10张</div>
              <div class="type grey">季卡</div>
            </div>
          </div>
          <span style="font-size: 20px;color: #252631;font-weight:bold;">金额：222.00元</span>
        </div>
      </el-col>
    </el-row>

  </el-row>
</template>

<script>
    export default {
        name: "PaidStatistic",
        data(){
          return{
            years:[
              {value:'2018年'},
              {value:'2019年'},
              {value:'2020年'},
              {value:'2021年'},
              {value:'2022年'},
              {value:'2023年'},
              {value:'2024年'},
            ],
            months:[
              {value:'1月'},
              {value:'2月'},
              {value:'3月'},
              {value:'4月'},
              {value:'5月'},
              {value:'6月'},
              {value:'7月'},
              {value:'8月'},
              {value:'9月'},
              {value:'10月'},
              {value:'11月'},
              {value:'12月'},
            ],
            value:'',
            value4:'',
          }
        },
        methods:{
          drawLinepoint(num,text) {
          // 基于准备好的dom，初始化echarts实例，找到图形容器。
            let myChart = this.$echarts.init(document.getElementById('myChart'+ num));
          // 绘制图表
            myChart.setOption({
              title: {
                text: text,
                x: 'center',
                top:10
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                left: 10,
                top: 250,
                bottom: 20,
                data: ['日卡', '周卡', '月卡', '季卡'],
                // selected: data.selected
              },
              color: ['#ff7474', '#ffc95e', '#f0a042', '#ff9f8c'],
              series: [{
                name: text,
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                  {
                    value: 1058,
                    name: '日卡'
                  },
                  {
                    value: 827,
                    name: '周卡'
                  },
                  {
                    value: 926,
                    name: '月卡'
                  },
                  {
                    value: 496,
                    name: '季卡'
                  }],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }]
            })
          },
          look(){
            this.$router.replace('/reCharge');
          }
        },
      mounted(){
          this.drawLinepoint(1,'当前会员玩家属性占比')
          this.drawLinepoint(2,'昨日活跃玩家属性占比')
          this.drawLinepoint(3,'玩家付费占比')
      }
    }
</script>

<style scoped>
  .sks{
    margin-top:50px;
    border-top:1px solid #000;
    padding-top:50px;
  }
  .CARD{
    width:200px;
    height:100px;
    text-align: center;
    background: #f8fafb;
    border-radius: 4px;
    border:1px solid #f8fafb;
  }
  .CARD div:nth-child(1){
    font-size: 26px;
    color: #252631;
    font-weight:bold;
  }
  .CARD div:nth-child(2){
    margin-top:5px;
    font-size: 14px;
    font-weight:bold;
  }
  .CARD .leftImg,
  .CARD .rightText{
    float:left;
  }
  .CARD .leftImg img{
    width:45px;
    height:45px;
    margin:13px 0 0 30px;
  }
  .CARD .leftImg .card{
    width:33px;
    height:45px;
  }
  .CARD .rightText{
    margin-left:30px;
  }
  .CARD .rightText div:nth-child(2){
    font-size: 14px;
    color: #3688FF;
  }
  .CARD .rightText div.red{
    color:#E13743;
  }
  .CARD .rightText div.grey{
    color: #778CA2;
  }
</style>
