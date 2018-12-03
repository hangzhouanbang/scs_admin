<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>数据统计</b></el-breadcrumb-item>
        <el-breadcrumb-item>基础数据统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick" class="el-col el-col-24" style="margin-top:30px;">
      <el-tab-pane label="今日新增 698" name="first">
        <el-select v-model="value4" clearable placeholder="请选择" style="margin:30px 523px 0;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--折线图-->
        <div id="myChart" :style="{width: '300px', height: '300px',margin:'0 auto'}"></div>
        <el-form :inline="true" :model="filters" style="margin-top:30px;">
          <el-form-item label="新增用户明细">
            <el-select v-model="value4" clearable placeholder="请选择年份">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value4" clearable placeholder="请选择月份">
              <el-option
                v-for="item in months"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="name"
            label="新增用户">
          </el-table-column>
          <el-table-column
            prop="address"
            label="用户总量">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="在线人数 698" name="second">
        <el-select v-model="value4" clearable placeholder="请选择" style="margin:30px 523px 0;">
          <el-option
            v-for="item in onlines"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--折线图-->
        <div id="myChart1" :style="{width: '300px', height: '300px',margin:'0 auto'}"></div>
        <el-form :inline="true" :model="filters" style="margin-top:30px;">
          <el-form-item label="在线人数明细">
            <el-select v-model="value4" clearable placeholder="请选择年份">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value4" clearable placeholder="请选择月份">
              <el-option
                v-for="item in months"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="name"
            label="同时在线">
          </el-table-column>
          <el-table-column
            prop="address"
            label="峰值时段">
          </el-table-column>
          <el-table-column
            prop="address"
            label="登录用户数">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="启动次数 698" name="third">
        <el-select v-model="value4" clearable placeholder="请选择" style="margin:30px 523px 0;">
          <el-option
            v-for="item in starts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--折线图-->
        <div id="myChart2" :style="{width: '300px', height: '300px',margin:'0 auto'}"></div>
        <el-form :inline="true" :model="filters" style="margin-top:30px;">
          <el-form-item label="启动次数">
            <el-select v-model="value4" clearable placeholder="请选择年份">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value4" clearable placeholder="请选择月份">
              <el-option
                v-for="item in months"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="name"
            label="启动次数">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="昨日活跃 698" name="fourth">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="昨日活跃用户">
          </el-table-column>
          <el-table-column
            prop="name"
            label="过去7天活跃用户">
          </el-table-column>
          <el-table-column
            prop="name"
            label="过去30天活跃用户">
          </el-table-column>
          <el-table-column
            prop="name"
            label="平均在线统计">
          </el-table-column>
        </el-table>
        <el-select v-model="value4" clearable placeholder="请选择" style="margin:30px 523px 0;">
          <el-option
            v-for="item in actives"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--折线图-->
        <div id="myChart3" :style="{width: '300px', height: '300px',margin:'0 auto'}"></div>
        <el-form :inline="true" :model="filters" style="margin-top:30px;">
          <el-form-item label="活跃用户明细">
            <el-select v-model="value4" clearable placeholder="请选择年份">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="value4" clearable placeholder="请选择月份">
              <el-option
                v-for="item in months"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="name"
            label="活跃用户">
          </el-table-column>
          <el-table-column
            prop="name"
            label="日均在线时长">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </el-row>
</template>

<script>
  import axios from 'axios'
    export default {
      name: "BasicStatistics",
      data() {
        return {
          activeName2: 'first',
          options:[
            {value:'本日新增'},
            {value:'本周新增'},
            {value:'本月新增'},
          ],
          filters:{},
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
          tableData:[],
          value4:'',
          onlines:[
            {value:'本日在线'},
            {value:'本周在线'},
            {value:'本月在线'},
          ],
          starts:[
            {value:'本日启动'},
            {value:'本周启动'},
            {value:'本月启动'},
          ],
          actives:[
            {value:'本周活跃'},
            {value:'本月活跃'},
          ]
        };
      },
      methods: {
        handleClick(tab, event) {
          // console.log(tab, event);
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
              data:[]
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
        this.drawLine()
      }
    }
</script>

<style scoped>
  #myChart{
    width:auto !important;
    height:340px !important;
  }
</style>
