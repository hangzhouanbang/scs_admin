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
          filters:{},
          state:{},
          currentMember:[],
          gameNum:[],
          loginMember:[],
          options:[
            {value:'瑞安麻将'}
          ]
        }
      },
      methods: {
        handleSearch(){
          if(this.filters.startTime){
            let date = new Date(this.filters.startTime);
            this.state.startTime = date.getTime();
          }
          if(this.filters.endTime){
            let date = new Date(this.filters.endTime);
            this.state.endTime = date.getTime();
          }
          if(this.filters.startTime &&
            this.filters.endTime &&
            this.state.endTime - this.state.startTime < 0){
            return;
          }
          axios({
            url:'/api/datareport/platform',
            method: 'post',
            params:{
              startTime:this.state.startTime,
              endTime:this.state.endTime
            }
          }).then((res) => {
              for(let i = 0;i < res.data.data.length;i++){
                console.log(res.data.data[i])
                this.currentMember.push(res.data.data[i].currentMember);
                this.gameNum.push(res.data.data[i].gameNum);
                this.loginMember.push(res.data.data[i].loginMember);
              }
              this.drawLine(this.loginMember,this.gameNum,this.currentMember)
            },
          ).catch((e) => {})
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
              data: ['周一','周二','周三','周四','周五','周六','周日']
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
