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
          <div id="myChart1" :style="{width: '420px', height: '400px',margin:'30px 0 0 30px'}"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple-light">
          <div id="myChart2" :style="{width: '420px', height: '400px',margin:'30px 0 0 30px'}"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <div id="myChart3" :style="{width: '420px', height: '400px',margin:'30px 0 0 30px'}"></div>
        </div>
      </el-col>
    </el-row>

    <div class="sks">商城售卡数</div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;margin-top:20px;">
      <el-select v-model="year" clearable placeholder="请选择年份" @change="handleSearch(value)" style="width:140px;">
        <el-option
          v-for="item in years"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> 年
      <el-select v-model="yue" clearable placeholder="请选择月份" style="margin-left:20px;width:140px;" @change="handleSearch(value)">
        <el-option
          v-for="item in months"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select> 月
    </el-col>

    <el-col :span="12" style="margin-top:30px;">
      <div style="float:left;background-color: #eee;width:350px;height:40px;">
        <span style="float:left;margin-top:10px;">本月销售总额</span>
        <span style="float:right;margin-top:10px;">{{count.memberBuy}}元</span>
      </div>
      <el-button size="text" @click="look" style="float:left;margin:3px 0 0 15px;color:#409EFF;font-size:12px;">查看详情</el-button>
    </el-col>
    <el-col :span="12" style="margin-top:30px;">
      <div style="float:left;background-color: #eee;width:350px;height:40px;">
        <span style="float:left;margin-top:10px;">本月ARPU（单个用户平均收益）</span>
        <span style="float:right;margin-top:10px;">{{count.arpu}}元</span>
      </div>
    </el-col>

    <el-row :gutter="20" style="margin:190px 0 40px 30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple CARD">
          <div class="top" style="overflow: hidden;">
            <div class="leftImg">
              <img src="../assets/images/icon_rika.png" alt="" class="card">
            </div>
            <div class="rightText">
              <div class="num">{{count.memberRiNum}}张</div>
              <div class="type grey">日卡</div>
            </div>
          </div>
          <span style="font-size: 20px;color: #252631;font-weight:bold;">金额：{{count.memberRiAmount}}元</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple CARD">
          <div class="top" style="overflow: hidden;">
            <div class="leftImg">
              <img src="../assets/images/icon_zhouka.png" alt="" class="card">
            </div>
            <div class="rightText">
              <div class="num">{{count.memberZhouNum}}张</div>
              <div class="type grey">周卡</div>
            </div>
          </div>
          <span style="font-size: 20px;color: #252631;font-weight:bold;">金额：{{count.memberZhouAmount}}元</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple CARD">
          <div class="top" style="overflow: hidden;">
            <div class="leftImg">
              <img src="../assets/images/icon_yueka.png" alt="" class="card">
            </div>
            <div class="rightText">
              <div class="num">{{count.memberYueNum}}张</div>
              <div class="type grey">月卡</div>
            </div>
          </div>
          <span style="font-size: 20px;color: #252631;font-weight:bold;">金额：{{count.memberYueAmount}}元</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple CARD">
          <div class="top" style="overflow: hidden;">
            <div class="leftImg">
              <img src="../assets/images/icon_jika.png" alt="" class="card">
            </div>
            <div class="rightText">
              <div class="num">{{count.memberJiNum}}张</div>
              <div class="type grey">季卡</div>
            </div>
          </div>
          <span style="font-size: 20px;color: #252631;font-weight:bold;">金额：{{count.memberJiAmount}}元</span>
        </div>
      </el-col>
    </el-row>

  </el-row>
</template>

<script>
    import axios from 'axios'
    export default {
      name: "PaidStatistic",
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
          ],
          months:[
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
          value:'',
          year:'',
          yue:'',
          yue1:'',
          count:'',
          yesterdayPie:'',
          payPie:'',
          nowPie:'',
          name:[],
          nums:[],
          name1:[],
          nums1:[],
          name2:[],
          nums2:[],
          nowPie1:{
            title: {
              text: '当前会员玩家属性占比',
              x: 'center',
              top:10
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 10,
              top: 250,
              bottom: 20,
              data: [],
            },
            series : [
              {
                name: '',
                type: 'pie',
                radius : '55%',
                center: ['50%', '50%'],
                hoverAnimation:false, //是否开启 hover 在扇区上的放大动画效果
                selectedMode:'single',  //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
                selectedOffset:5, //选中扇区的偏移距离
                data:[],
                itemStyle: {
                  normal:{
                    label:{
                      show:true,
                      textStyle: {
                        fontSize: 12
                      },
                      formatter: function(params){ //避免文字太长做省略处理
                        let title=params.seriesName; //名字
                        let name=params.name; //名字
                        let percent=params.percent; //占比
                        let value=params.value; //数量
                        if(name.length>8){
                          return title.slice(0,7)+"..."+name +":"+ value +"("+percent+"%)";
                        }else{
                          return title +"\n"+name +":"+ value +"("+percent+"%)"
                        }
                      }
                    },
                    labelLine:{
                      show:true
                    }
                  },
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ],
            color: ['#ff7474', '#ffc95e', '#f0a042', '#ff9f8c','rgb(187,140,238)'] //饼图分块颜色设置
          },
          yesterdayPie1:{
            title: {
              text: '昨日活跃玩家属性占比',
              x: 'center',
              top:10
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 10,
              top: 100,
              bottom: 20,
              data: [],
            },
            series : [
              {
                name: '',
                type: 'pie',
                radius : '55%',
                center: ['50%', '50%'],
                hoverAnimation:false, //是否开启 hover 在扇区上的放大动画效果
                selectedMode:'single',  //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
                selectedOffset:5, //选中扇区的偏移距离
                data:[],
                itemStyle: {
                  normal:{
                    label:{
                      show:true,
                      textStyle: {
                        fontSize: 12
                      },
                      formatter: function(params){ //避免文字太长做省略处理
                        let title=params.seriesName; //名字
                        let name=params.name; //名字
                        let percent=params.percent; //占比
                        let value=params.value; //数量
                        if(name.length>8){
                          return title.slice(0,7)+"..."+name +":"+ value +"("+percent+"%)";
                        }else{
                          return title +"\n"+name +":"+ value +"("+percent+"%)"
                        }
                      }
                    },
                    labelLine:{
                      show:true
                    }
                  },
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ],
            color: ['#ff7474', '#ffc95e', '#f0a042', '#ff9f8c','rgb(187,140,238)'] //饼图分块颜色设置
          },
          payPie1:{
            title: {
              text: '玩家付费占比',
              x: 'center',
              top:10
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 10,
              top: 250,
              bottom: 20,
              data: [],
            },
            series : [
              {
                name: '',
                type: 'pie',
                radius : '55%',
                center: ['50%', '50%'],
                hoverAnimation:false, //是否开启 hover 在扇区上的放大动画效果
                selectedMode:'single',  //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
                selectedOffset:5, //选中扇区的偏移距离
                data:[],
                itemStyle: {
                  normal:{
                    label:{
                      show:true,
                      textStyle: {
                        fontSize: 12
                      },
                      formatter: function(params){ //避免文字太长做省略处理
                        let title=params.seriesName; //名字
                        let name=params.name; //名字
                        let percent=params.percent; //占比
                        let value=params.value; //数量
                        if(name.length>8){
                          return title.slice(0,7)+"..."+name +":"+ value +"("+percent+"%)";
                        }else{
                          return title +"\n"+name +":"+ value +"("+percent+"%)"
                        }
                      }
                    },
                    labelLine:{
                      show:true
                    }
                  },
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ],
            color: ['#ff7474', '#ffc95e', '#f0a042', '#ff9f8c','rgb(187,140,238)'] //饼图分块颜色设置
          }
        }
      },
      methods:{
        drawLinepoint() {
          axios({
            url:this.global.mPath + '/datareport/paidStatistics',
            method:'post',
            params:{
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
            this.yesterdayPie = res.data.data.yesterdayPie;
            this.payPie = res.data.data.payPie;
            this.nowPie = res.data.data.nowPie;
            for (let i = 0; i < this.yesterdayPie.length; i++) {
              this.name.push(this.yesterdayPie[i].name);
              let bb = {
                value:this.yesterdayPie[i].num,
                name:this.yesterdayPie[i].name
              };
              this.nums.push(bb)
            }
            for (let j = 0; j < this.payPie.length; j++) {
              this.name1.push(this.payPie[j].name);
              let aa = {
                value:this.payPie[j].num,
                name:this.payPie[j].name
              };
              this.nums1.push(aa)
            }
            for (let k = 0; k < this.nowPie.length; k++) {
              this.name2.push(this.nowPie[k].name);
              let cc = {
                value:this.nowPie[k].num,
                name:this.nowPie[k].name
              };
              this.nums2.push(cc)
            }
            //昨日活跃玩家属性
            this.yesterdayPie1.series[0].data = this.nums;
            this.yesterdayPie1.legend.data = this.name;
            //玩家付费
            this.payPie1.series[0].data = this.nums1;
            this.payPie1.legend.data = this.name1;
            //当前会员玩家
            this.nowPie1.series[0].data = this.nums2;
            this.nowPie1.legend.data = this.name2;

            this.drawLine()
          }).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          })
        },
        drawLine(){
          // 基于准备好的dom，初始化echarts实例，找到图形容器。
          let myChart = this.$echarts.init(document.getElementById('myChart1'));
          let myChart1 = this.$echarts.init(document.getElementById('myChart2'));
          let myChart2 = this.$echarts.init(document.getElementById('myChart3'));
          myChart.setOption(this.nowPie1);
          myChart1.setOption(this.yesterdayPie1);
          myChart2.setOption(this.payPie1);
        },
        look(){
          this.$router.replace('/reCharge');
        },
        handleSearch(yearMonth){
          if(!yearMonth){
            let myDate = new Date();
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
            url:this.global.mPath + '/datareport/sellCards',
            method:'post',
            params:{
              yearMonth:this.value,
              token:sessionStorage.getItem('token')
            }
          }).then((res) => {
              // console.log(res.data)
              this.count = res.data.data;
            }
          ).catch((e) => {
            this.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
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
            this.handleSearch('');
            this.drawLinepoint()
          }else{
            this.$router.replace('/');
          }
        })
      }
    }
</script>

<style scoped lang="scss">
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
    margin-top:0;
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
