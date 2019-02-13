<template style="background-color:#000;">
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><b style="font-size: 18px;color: #4A90E2;"></b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-row :gutter="20" style="margin:10px 0 0 30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg total1">
            <img src="../assets/images/total_players.png" alt="">
          </div>
          <div class="rightText">
            <div class="num">{{filters.amount}}</div>
            <div class="type">总玩家</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg total2">
            <img src="../assets/images/member_player.png" alt="">
          </div>
          <div class="rightText">
            <div class="num">{{filters.vipAmount}}</div>
            <div class="type red">会员玩家</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg total3">
            <img src="../assets/images/GA.png" alt="">
          </div>
          <div class="rightText">
            <div class="num">{{filters.agentAmount}}</div>
            <div class="type">代理总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg total4">
            <img src="../assets/images/sale.png" alt="">
          </div>
          <div class="rightText">
            <div class="num">{{filters.totalSale}}</div>
            <div class="type">总销售额</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--柱状图-->
    <div id="main" :style="{width: 'auto', height: '400px',margin:'30px 0 30px 50px'}"></div>

    <div class="title">销售详情</div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;margin-top:20px;">
      <el-select v-model="year" placeholder="请选择年份" clearable style="margin-left:40px;width:120px;" @change="handleSearch1(value)">
        <el-option
          v-for="item in years"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select> 年
      <el-select v-model="yue" clearable placeholder="请选择月份" style="margin-left:20px;width:120px;" @change="handleSearch1(value)">
        <el-option
          v-for="item in month"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select> 月
    </el-col>

    <div class="number" style="padding-top:56px;">平台消费</div>
    <el-row :gutter="20" style="margin:20px 0 0 30px;">
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_rika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.memberRiNum}}张</div>
            <div class="type grey">{{filters1.memberRiAmount}}元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_zhouka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.memberZhouNum}}张</div>
            <div class="type grey">{{filters1.memberZhouAmount}}元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_yueka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.memberYueNum}}张</div>
            <div class="type grey">{{filters1.memberYueAmount}}元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_jika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.memberJiAmount}}张</div>
            <div class="type grey">{{filters1.memberJiNum}}元</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="number">代理采购</div>
    <el-row :gutter="20" style="margin:20px 0 70px 30px;">
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_rika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentRiNum}}张</div>
            <div class="type grey">{{filters1.agentRiAmount}}元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_zhouka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentZhouNum}}张</div>
            <div class="type grey">{{filters1.agentZhouAmount}}元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_yueka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentYueNum}}张</div>
            <div class="type grey">{{filters1.agentYueAmount}}元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_jika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentJiNum}}张</div>
            <div class="type grey">{{filters1.agentJiAmount}}元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_jade.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentYuNum}}个</div>
            <div class="type grey">{{filters1.agentYuAmount}}元</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "Index",
      data(){
        return{
          years:[
            {value:'2018'},
            {value:'2019'},
            {value:'2020'},
            {value:'2021'},
            {value:'2022'},
            {value:'2023'},
            {value:'2024'},
            {value:'2025'},
          ],
          month:[
            {value:'1'},
            {value:'2'},
            {value:'3'},
            {value:'4'},
            {value:'5'},
            {value:'6'},
            {value:'7'},
            {value:'8'},
            {value:'9'},
            {value:'10'},
            {value:'11'},
            {value:'12'},
          ],
          filters:[],
          filters1:[],
          value:'',
          value1:'',
          year:'',
          yue:'',
          yue1:'',
          agentBuy:[],
          totalAmount:[],
          memberBuy:[]
        }
      },
      methods:{
        handleSearch(year){
          axios({
            method: 'post',
            url: this.global.mPath + '/index/statistics',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'year': year,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data.data)
            this.filters = res.data.data;
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        handleSearch1(month){
          let myDate = new Date();
          if(!month){
            this.year = myDate.getFullYear();
            this.yue = myDate.getMonth()+1;
            if(this.yue < 10){
              this.yue1 = '0' + this.yue
            }else{
              this.yue1 = this.yue
            }
            this.value =  this.year +''+ this.yue1;
          }else{
            if(this.yue < 10){
              this.yue1 = '0' + this.yue
            }else{
              this.yue1 = this.yue
            }
            this.value =  this.year + '' + this.yue1
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/index/salesDetails',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'yearMonth': this.value,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data.data)
            this.filters1 = res.data.data;
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        },
        //柱状图
        drawLine(year){
          let myDate = new Date();
          this.value1 = myDate.getFullYear();
          axios({
            method: 'post',
            url: this.global.mPath + '/index/histogram',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'year': year,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data.data);
            this.filters2 = res.data.data;
            for(let i = 0;i < this.filters2.length;i++){
              this.agentBuy.push([i+1+'月',this.filters2[i].agentBuy]);
              this.memberBuy.push([i+1+'月',this.filters2[i].memberBuy]);
              this.totalAmount.push([i+1+'月',this.filters2[i].totalAmount])
            }

            let myChart = this.$echarts.init(document.getElementById('main'));
            let dataMouth = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
            let option = {
              tooltip : {
                axisPointer : {
                  type : 'shadow'
                }
              },
              title: {
                text:'销售总额',
                left:'left' ,
                top:'0',
                textStyle: {
                  color: '#666',
                  fontWeight: 'normal'
                }
              },
              toolbox: {
                feature: {
                  dataView: {show: false, readOnly: false},
                  magicType: {show: false, type: ['line', 'bar']},
                  restore: {show: false},
                  saveAsImage: {show: false}
                }
              },
              grid: {
                y: '10%',
                y2: '10%',
                x: '5%'
              },
              legend: {
                data:['玩家消费收入','代理消费收入']
              },
              xAxis:{
                type: 'category',
                axisLabel:{
                  interval: 0,    // {number}
                  rotate: 0
                },
                data: dataMouth
              },
              yAxis:{
                type: 'value',
                min: 0,
                interval: 10000
              },
              series: [
                {
                  name:'玩家消费收入',
                  type:'bar',
                  stack:'sum',
                  barWidth: 50,
                  itemStyle: {
                    normal: {
                      label:{
                        show:true
                      },
                      color: '#37a2da'
                    }
                  },
                  data: this.memberBuy
                },
                {
                  name:'代理消费收入',
                  type:'bar',
                  stack:'sum',
                  barWidth: 50,
                  itemStyle: {
                    normal: {
                      label:{
                        show:true
                      },
                      color: '#ffd85c'
                    }
                  },
                  data: this.agentBuy
                },
                {
                  name: '总计',
                  type: 'bar',
                  stack: 'sum',
                  label: {
                    normal: {
                      offset:['50', '80'],
                      show: true,
                      position: 'insideBottom',
                      formatter:'{c}',
                      textStyle:{ color:'#000' }
                    }
                  },
                  itemStyle:{
                    normal:{
                      color:'rgba(128, 128, 128, 0)'
                    }
                  },
                  data: this.totalAmount
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
          }).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 500:
                  this.$message({showClose: true, message: '服务器异常', type: 'warning'});
                  this.loading = false;//隐藏加载条
                  break;
                case 405:
                  this.$message({showClose: true, message: '请先登录', type: 'warning'});
                  break
              }
            }
          })
        }
      },
      mounted(){
        axios({
          url:this.global.mPath + '/login/admin_info',
          method:'post',
          params:{
            token:sessionStorage.getItem('token')
          }
        }).then((res) => {
          // console.log(res.data.success)
          if(res.data.success){
            let myDate = new Date();
            this.year = myDate.getFullYear();
            this.handleSearch( this.year);
            this.handleSearch1('');
            this.drawLine(this.year);
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style scoped lang="scss">
  .title{
    margin-top:30px;
    padding-bottom:10px;
    font-size:12px;
    color:#333;
  }
  .number{
    margin:20px 0 0 50px;
    color: #778CA2;
  }
  .sks{
    margin-top:20px;
    padding:10px 0 0 50px;
    font-size: 18px;
    color: #778CA2;
  }
  hr{
    border: 10px solid #D7ECF6;
    margin-top:40px;
  }
  .bg-purple{
    width:180px;
    height:60px;
    text-align: center;
    background: #f8fafb;
    border-radius: 4px;
    border:1px solid #f8fafb;
  }
  .bg-purple div:first-child{
    font-size:20px;
    margin-top:0;
  }
  .leftImg,
  .rightText{
    float:left;
  }
  .leftImg{
    width:70px;
    height:100%;
  }
  .leftImg img{
    width: 40px;
    height: 40px;
    margin: 10px 0 0 2px;
  }
  .leftImg .card{
    width:33px;
    height:45px;
  }
  .bg-purple{
    .rightText{
      margin:5px 0 0 30px;
    }
  }
  .rightText div:nth-child(2){
    font-size: 14px;
    color: #3688FF;
    margin-top:4px;
  }
  .rightText div.red{
   color:#E13743;
  }
  .rightText div.grey{
    color: #000;
  }
  .total1{
    background-color: #69cbca;
  }
  .total2{
    background-color: #fb6f61;
  }
  .total3{
    background-color: #f7d444;
  }
  .total4{
    background-color: #4daed5;
  }
</style>
