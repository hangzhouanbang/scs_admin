<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>数据统计</b></el-breadcrumb-item>
        <el-breadcrumb-item>基础数据统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick" class="el-col el-col-24" style="margin:30px 0 50px 0;">
      <el-tab-pane name="first">
        <span slot="label">今日新增 {{addCountToday}}</span>
        <el-select v-model="type" clearable placeholder="请选择" style="margin:30px 523px 0;" @change="linechart">
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
            <el-select v-model="year" clearable placeholder="请选择年份" @change="particulars">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="month" clearable placeholder="请选择月份" @change="particulars">
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
            prop="createTime"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="addUserCount"
            label="新增用户">
          </el-table-column>
          <el-table-column
            prop="totalUserCount"
            label="用户总量">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label">在线人数 {{onlineCount}}</span>
        <el-select v-model="online" clearable placeholder="请选择" style="margin:30px 523px 0;" @change="usercount">
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
            <el-select v-model="year" clearable placeholder="请选择年份" @change="particulars">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="month" clearable placeholder="请选择月份" @change="particulars">
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
            prop="createTime"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="onlineCount"
            label="同时在线">
          </el-table-column>
          <el-table-column
            prop="maxOnlineTime"
            label="峰值时段">
          </el-table-column>
          <el-table-column
            prop="loginUser"
            label="登录用户数">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="third">
        <span slot="label">启动次数 {{powerCount}}</span>
        <el-select v-model="start" clearable placeholder="请选择" style="margin:30px 523px 0;" @change="startnumber">
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
            <el-select v-model="year" clearable placeholder="请选择年份" @change="particulars">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="month" clearable placeholder="请选择月份" @change="particulars">
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
            prop="createTime"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="powerCount"
            label="启动次数">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="fourth">
        <span slot="label">昨日活跃 {{activeUserCount}}</span>
        <table>
          <tr>
            <td></td>
            <td>昨日</td>
            <td>过去七日</td>
            <td>过去30日</td>
          </tr>
          <tr>
            <td>活跃玩家</td>
            <td>{{activeUser}}</td>
            <td>{{activeUser1}}</td>
            <td>{{activeUser2}}</td>
          </tr>
          <tr>
            <td>平均在线</td>
            <td>{{dayOnlineTime}}</td>
            <td>{{dayOnlineTime1}}</td>
            <td>{{dayOnlineTime2}}</td>
          </tr>
        </table>
        <el-select v-model="active" clearable placeholder="请选择" style="margin:30px 523px 0;" @change="yesterdayactive">
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
            <el-select v-model="year" clearable placeholder="请选择年份" @change="particulars">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="month" clearable placeholder="请选择月份" @change="particulars">
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
            prop="createTime"
            label="日期">
          </el-table-column>
          <el-table-column
            prop="activeUser"
            label="活跃用户">
          </el-table-column>
          <el-table-column
            prop="dayOnlineTime"
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
          year:'',
          month:'',
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
          ],
          addCountToday:'',
          onlineCount:'',
          activeUserCount:'',
          powerCount:'',
          type:'本日新增',
          online:'本日在线',
          start:'本日启动',
          active:'本周活跃',
          countByMonth:'',
          countByToday:'',
          countByWeek:'',
          today:[],
          week:[],
          yue:[],
          activeUser:'',
          activeUser1:'',
          activeUser2:'',
          dayOnlineTime:'',
          dayOnlineTime1:'',
          dayOnlineTime2:'',
        }
      },
      methods: {
        handleSearch(){
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/currentCount',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
          }).then((res) => {
              // console.log(res.data.data)
              this.addCountToday = res.data.data.addCountToday;
              this.onlineCount = res.data.data.onlineCount;
              this.activeUserCount = res.data.data.activeUserCount;
              this.powerCount = res.data.data.powerCount;
            })
        },
        handleClick(tab, event) {
          if(tab.index == '0'){
            this.linechart()
          }
          if(tab.index == '1'){
            this.usercount()
          }
          if(tab.index == '2'){
            this.startnumber()
          }
          if(tab.index == '3'){
            this.yesterdayactive()
            this.active_user_subtotal()
          }
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
          return year + '-' + rightTwo(month) + '-' + rightTwo(date) + ' ' + rightTwo(hours) + ':' + rightTwo(minutes) + ':' + rightTwo(seconds);
        },
        //今日新增
        information(time){
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/getDetailedReport',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              currentTime:time
            }
          }).then((res) => {
            // console.log(res.data.data)
            this.tableData = res.data.data
            for(let i = 0;i < this.tableData.length;i++){
              this.tableData[i].createTime = this.dateTimeFormat(this.tableData[i].createTime)
              this.tableData[i].maxOnlineTime = this.dateTimeFormat(this.tableData[i].maxOnlineTime)
              this.tableData[i].dayOnlineTime = Math.ceil(this.tableData[i].dayOnlineTime / 1000 / 60 / 60)
            }
          })
        },
        particulars(){
          let year = this.year.substring(0,4)
          let month = this.month.split("月")[0]
          if(month.length == 1){
            month = '0' + month
          }
          let date = year + '-' + month
          this.information(new Date(date).getTime())
        },
        linechart(){
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/addUserGraph',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
          }).then((res) => {
            // console.log(res.data.data)
            this.countByToday = res.data.data.countByToday
            this.countByWeek = res.data.data.countByWeek
            this.countByMonth = res.data.data.countByMonth
            if(this.type == '本周新增'){
              for(let i = 1;i < 8;i++){
                this.week.push('周'+i)
              }
              this.drawLine('',this.week,this.countByWeek)
              this.week = []
            }
            if(this.type == '本月新增'){
              for(let i = 0;i < 31;i++){
                this.yue.push(i+1+'号')
              }
              this.drawLine('',this.yue,this.countByMonth)
              this.yue = []
            }
            if(this.type == '本日新增' || this.type == ''){
              for(let i = 0;i < 24;i++){
                this.today.push(i+'点')
              }
              this.drawLine('',this.today,this.countByToday)
              this.today = []
            }
          })
        },
        //在线人数
        usercount(){
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/onlineUserGraph',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
          }).then((res) => {
            // console.log(res.data.data)
            this.countByToday = res.data.data.countByToday
            this.countByWeek = res.data.data.countByWeek
            this.countByMonth = res.data.data.countByMonth
            console.log(this.countByToday)
            if(this.online == '本周在线'){
              for(let i = 1;i < 8;i++){
                this.week.push('周'+i)
              }
              this.drawLine(1,this.week,this.countByWeek)
              this.week = []
            }
            if(this.online == '本月在线'){
              for(let i = 0;i < 31;i++){
                this.yue.push(i+1+'号')
              }
              this.drawLine(1,this.yue,this.countByMonth)
              this.yue = []
            }
            if(this.online == '本日在线' || this.online == ''){
              for(let i = 0;i < 24;i++){
                this.today.push(i+'点')
              }
              this.drawLine(1,this.today,this.countByToday)
              this.today = []
            }
          })
        },
        //启动次数
        startnumber(){
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/powerCountGraph',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
          }).then((res) => {
            // console.log(res.data.data)
            this.countByToday = res.data.data.countByToday
            this.countByWeek = res.data.data.countByWeek
            this.countByMonth = res.data.data.countByMonth
            console.log(this.countByToday)
            if(this.start == '本周启动'){
              for(let i = 1;i < 8;i++){
                this.week.push('周'+i)
              }
              this.drawLine(2,this.week,this.countByWeek)
              this.week = []
            }
            if(this.start == '本月启动'){
              for(let i = 0;i < 31;i++){
                this.yue.push(i+1+'号')
              }
              this.drawLine(2,this.yue,this.countByMonth)
              this.yue = []
            }
            if(this.start == '本日启动' || this.start == ''){
              for(let i = 0;i < 24;i++){
                this.today.push(i+'点')
              }
              this.drawLine(2,this.today,this.countByToday)
              this.today = []
            }
          })
        },
        //昨日活跃
        yesterdayactive(){
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/activeUserGraph',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
          }).then((res) => {
            // console.log(res.data.data)
            this.countByWeek = res.data.data.countByWeek
            this.countByMonth = res.data.data.countByMonth
            console.log(this.active)
            if(this.active == '本周活跃' || this.active == ''){
              for(let i = 1;i < 8;i++){
                this.week.push('周'+i)
              }
              this.drawLine(3,this.week,this.countByWeek)
              this.week = []
            }
            if(this.active == '本月活跃'){
              for(let i = 0;i < 31;i++){
                this.yue.push(i+1+'号')
              }
              this.drawLine(3,this.yue,this.countByMonth)
              this.yue = []
            }
          })
        },
        //活跃用户小计
        active_user_subtotal(){
          axios({
            method: 'post',
            url: this.global.mPath + '/datareport/activeUserSubtotal',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {}
          }).then((res) => {
            console.log(res.data.data)
            this.activeUser = res.data.data[0].activeUser
            this.dayOnlineTime = res.data.data[0].dayOnlineTime
            this.activeUser1 = res.data.data[1].activeUser
            this.dayOnlineTime1 = res.data.data[1].dayOnlineTime
            this.activeUser2 = res.data.data[2].activeUser
            this.dayOnlineTime2 = res.data.data[2].dayOnlineTime
          })
        },
        //折线图
        drawLine(number,time,loginMember){
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'+number))
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
              data: time
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name:'',
                type:'line',
                stack: '总量',
                data:loginMember
              }
            ]
          })
        }
      },
      mounted(){
        this.linechart()
        this.handleSearch()
        this.information(new Date().getTime())
        let myDate = new Date();
        this.year = myDate.getFullYear() + '年'
        this.month = myDate.getMonth() + 1 + '月'
      }
    }
</script>

<style scoped>
  #myChart,
  #myChart1,
  #myChart2,
  #myChart3{
    width:auto !important;
    height:340px !important;
  }
  table{
    margin-top:20px;
  }
  table,tr{
    width:100%;
    border-collapse: collapse;
  }
  td{
    border:1px solid #ebeef5;
    width:25%;
    text-align: center;
    color:#909399;
  }
</style>
