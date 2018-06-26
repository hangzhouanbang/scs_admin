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
          options:[
            {value:'瑞安麻将'}
          ]
        }
      },
      mounted(){
        this.drawLine();
      },
      methods: {
        handleSearch(){},
        drawLine(){
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))
          var colors = ['#ea82f6', '#0ed3f0', '#F030BC'];
          myChart.setOption({
            title: {
              text: ''
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
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
                name:'邮件营销',
                type:'line',
                stack: '总量',
                data:[120, 132, 101, 134, 90, 230, 210]
              },
              {
                name:'联盟广告',
                type:'line',
                stack: '总量',
                data:[220, 182, 191, 234, 290, 330, 310]
              },
              {
                name:'视频广告',
                type:'line',
                stack: '总量',
                data:[150, 232, 201, 154, 190, 330, 410]
              },
              {
                name:'直接访问',
                type:'line',
                stack: '总量',
                data:[320, 332, 301, 334, 390, 330, 320]
              },
              {
                name:'搜索引擎',
                type:'line',
                stack: '总量',
                data:[820, 932, 901, 934, 1290, 1330, 1320]
              }
            ]
          })
          // 绘制图表
          // myChart.setOption({
          //   color: colors,
          //   title: { text: '' },
          //   tooltip: {
          //     trigger: 'axis'
          //   },
          //   legend:{
          //     data:['独立玩家','游戏局数','会员人数']
          //   },
          //   grid: {
          //     top: 70,
          //     bottom: 50,
          //     borderWidth:0,
          //     containLabel:true
          //   },
          //   xAxis: [
          //     //上月横坐标轴
          //     {
          //       type: 'category',
          //       axisLabel:{
          //         formatter:function(name){
          //           var showNames = ["1","5","10","15","20","25","30"];
          //           return (showNames.indexOf(name) === -1 ? "" : name )
          //         }
          //       },
          //       axisTick: {
          //         show:false,
          //         alignWithLabel: true
          //       },
          //       //上部横坐标的线
          //       axisLine: {
          //         onZero: false
          //       },
          //       data:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
          //     },
          //     //本月横坐标轴
          //     {
          //       show:false,
          //       type: 'category',
          //       axisLabel:{
          //         formatter:function(name){
          //           var showNames = ["1","5","10","15","20","25","30"];
          //           return (showNames.indexOf(name) === -1 ? "" : name )
          //         }
          //       },
          //       data: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"]
          //     }
          //   ],
          //   yAxis: [
          //     {
          //       type: 'value',
          //       splitLine : {
          //         show:false
          //       },
          //       axisTick: {
          //         show:false
          //       },
          //       axisLine: {
          //         onZero: false,
          //       },
          //       axisPointer:{
          //         show:false
          //       }
          //     }
          //   ],
          //   series: [
          //     {
          //       name:'独立玩家',
          //       type:'line',
          //       itemStyle : {
          //         normal : {
          //           lineStyle:{
          //             width:4//折线宽度
          //           }
          //         }
          //       },
          //       //设置阴影
          //       lineStyle: {
          //         normal: {
          //           width: 3,
          //           shadowColor: 'rgba(195,60,211,1)',
          //           shadowBlur: 5,
          //           fillRect:(0,3,6,0)
          //         }
          //       },
          //       symbolSize: 4,
          //       smooth: true,
          //       data: [5, 20, 36, 10, 10, 20]
          //     },
          //     {
          //       name:'游戏局数',
          //       //控制悬浮框的
          //       xAxisIndex: 1,
          //       type:'line',
          //       itemStyle : {
          //         normal : {
          //           lineStyle:{
          //             width:4//折线宽度
          //           }
          //         }
          //       },
          //       //设置阴影
          //       lineStyle: {
          //         normal: {
          //           width: 3,
          //           shadowColor: 'rgba(16,161,182,1)',
          //           shadowBlur: 5,
          //           fillRect:(0,3,6,0)
          //         }
          //       },
          //       symbolSize: 4,
          //       smooth: true,
          //       data: [10, 20, 30, 10, 10, 20]
          //     },
          //     {
          //       name:'会员人数',
          //       //控制悬浮框的
          //       xAxisIndex: 1,
          //       type:'line',
          //       itemStyle : {
          //         normal : {
          //           lineStyle:{
          //             width:4//折线宽度
          //           }
          //         }
          //       },
          //       //设置阴影
          //       lineStyle: {
          //         normal: {
          //           width: 3,
          //           shadowColor: 'rgba(240,48,188,1)',
          //           shadowBlur: 5,
          //           fillRect:(0,3,6,0)
          //         }
          //       },
          //       symbolSize: 4,
          //       smooth: true,
          //       data: [50, 20, 60, 10, 20, 10]
          //     }
          //   ],
          // });
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
