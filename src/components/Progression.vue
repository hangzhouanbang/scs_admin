<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>报表统计</b></el-breadcrumb-item>
        <el-breadcrumb-item>游戏数据日报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item label="游戏名" label-width="68px">
          <el-select v-model="filters.pay_type" placeholder="请选择"  clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" label-width="68px">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" label-width="68px">
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <!--折线图-->
      <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'

  export default {
      name: "Progression",
      data() {
        return {
          filters:{
            startTime:new Date(),
            endTime:new Date(),
            pay_type:'瑞安麻将'
          },
          state:{},
          currentMember:[],
          gameNum:[],
          loginMember:[],
          Time:[],
          options:[
            {value:'瑞安麻将'},
            {value:'温州麻将'},
            {value:'放炮麻将'},
            {value:'点炮麻将'},
            {value:'温州双扣'}
          ]
        }
      },
      methods: {
        handleSearch(){
          if(this.filters.pay_type){
            if(this.filters.pay_type == '瑞安麻将'){
              this.state.pay_type = 'ruianMajiang'
            }
            if(this.filters.pay_type == '温州麻将'){
              this.state.pay_type = 'wenzhouMajiang'
            }
            if(this.filters.pay_type == '放炮麻将'){
              this.state.pay_type = 'fangpaoMajiang'
            }
          }
          if(this.filters.startTime){
            let date = new Date(this.filters.startTime);
            this.state.startTime = date.getTime();
          }else{
            this.state.startTime = new Date().getTime();
          }
          if(this.filters.endTime){
            let date = new Date(this.filters.endTime);
            this.state.endTime = date.getTime();
          }else{
            this.state.endTime = new Date().getTime();
          }
          if(this.state.endTime - this.state.startTime < 0){
            return;
          }
          axios({
            url:this.global.mPath + '/datareport/gamereport',
            method: 'post',
            params:{
              startTime:this.state.startTime,
              endTime:this.state.endTime,
              game:this.state.pay_type,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            this.currentMember=[]
            this.gameNum=[]
            this.loginMember=[]
            this.Time=[]
              for(let i = 0;i < res.data.data.length;i++){
                this.currentMember.push(res.data.data[i].currentMember);
                this.gameNum.push(res.data.data[i].gameNum);
                this.loginMember.push(res.data.data[i].loginMember);
                this.Time.push(this.dateTimeFormat(res.data.data[i].date));
              }
              this.drawLine(this.loginMember,this.gameNum,this.currentMember)
            },
          ).catch((e) => {})
        },
        dateTimeFormat(value) {
          let time = new Date(+value);
          let rightTwo = (v) => {
            v = '0' + v;
            return v.substring(v.length - 2, v.length)
          };
          if (time == null) return;
          let year = time.getFullYear();
          let month = time.getMonth() + 1;
          let date = time.getDate();
          let hours = time.getHours();
          let minutes = time.getMinutes();
          let seconds = time.getSeconds();
          return year + '-' + rightTwo(month) + '-' + rightTwo(date);
        },
        //折线图
        drawLine(loginMember,gameNum,currentMember){
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))
          myChart.setOption({
            title: {
              text: ''
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:['独立玩家','游戏局数','会员人数']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                // saveAsImage: {} //下载
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.Time
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name:'独立玩家',
                type:'line',
                stack: '总量',
                data:loginMember
              },
              {
                name:'游戏局数',
                type:'line',
                stack: '总量',
                data:gameNum
              },
              {
                name:'会员人数',
                type:'line',
                stack: '总量',
                data:currentMember
              }
            ]
          })
        }
      },
      mounted(){
        this.handleSearch()
      }
    }
</script>

<style scoped>
  .toolbar{
    margin-top:30px;
  }
  #myChart{
    width:auto !important;
    height:600px !important;
  }
</style>
