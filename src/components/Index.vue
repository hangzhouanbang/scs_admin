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
            <div class="num">{{filters1.amount}}</div>
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
            <div class="num">{{filters1.amount}}</div>
            <div class="type">总销售额</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--柱状图-->
    <div id="main" :style="{width: '400px', height: '400px',margin:'30px 0 30px 50px'}"></div>

    <div class="title">销售详情</div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;margin-top:20px;">
      <el-select v-model="year" placeholder="请选择年份" clearable style="margin-left:40px;" @change="handleSearch1(value1)">
        <el-option
          v-for="item in years"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value" clearable placeholder="请选择月份" style="margin-left:40px;" @change="handleSearch(value)">
        <el-option
          v-for="item in month"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>

    <div class="number" style="padding-top:56px;">平台消费</div>
    <el-row :gutter="20" style="margin:20px 0 0 30px;">
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_rika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters.memberRiAmount}}张</div>
            <div class="type grey">412.00元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_zhouka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters.memberZhouAmount}}张</div>
            <div class="type grey">412.00元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_yueka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters.memberYueAmount}}张</div>
            <div class="type grey">412.00元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_jika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters.memberJiAmount}}张</div>
            <div class="type grey">412.00元</div>
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
            <div class="num">{{filters1.agentRiAmount}}张</div>
            <div class="type grey">412.00元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_zhouka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentZhouAmount}}张</div>
            <div class="type grey">412.00元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_yueka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentYueAmount}}张</div>
            <div class="type grey">412.00元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_jika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentJiAmount}}张</div>
            <div class="type grey">412.00元</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_jade.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentGoldAmount}}个</div>
            <div class="type grey">412.00元</div>
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
            {value:'2018年'},
            {value:'2019年'},
            {value:'2020年'},
            {value:'2021年'},
            {value:'2022年'},
            {value:'2023年'},
            {value:'2024年'},
            {value:'2025年'},
          ],
          month:[
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
          filters:[],
          filters1:[],
          value:'',
          value1:'',
          year:''
        }
      },
      methods:{
        handleSearch(month){
          let myDate = new Date();
          if(!month){
            this.year = myDate.getFullYear() + '年';
            this.value = myDate.getMonth()+1 +'月';
          }
          for(let i = 1;i < 13;i++){
            if(month === i + '月'){
              month = i
            }
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/index/memberindex',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'month': month,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
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
            this.value1 = myDate.getMonth()+1+'月';
            this.year = myDate.getFullYear() + '年';
          }
          for(let i = 1;i < 13;i++){
            if(month === i + '月'){
              month = i
            }
          }
          axios({
            method: 'post',
            url: this.global.mPath + '/index/agentindex',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            params: {
              'month': month,
              'token':sessionStorage.getItem('token')
            }
          }).then((res) => {
            // console.log(res.data)
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
        drawLine(){
          let myChart = this.$echarts.init(document.getElementById('main'));
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
              x: '15%'
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
              data: ['星期三','星期四']
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
                stack:'xxx',
                barWidth: 50,
                itemStyle: {
                  normal: {
                    color: '#37a2da'
                  }
                },
                data: [["星期三",10000],["星期四",20000]]
              },
              {
                name:'代理消费收入',
                type:'bar',
                stack:'xxx',
                barWidth: 50,
                itemStyle: {
                  normal: {
                    color: '#ffd85c'
                  }
                },
                data:  [["星期三",11000],["星期四",21000]]
              },
              {
                name:'合计',
                type:'bar',
                stack:'xxx',
                barWidth: 50,
                label: {
                  normal: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: '#000'
                    },
                    formatter:''
                  }
                },
                data:  [["星期三",0],["星期四",0]]    //思路一：给series集合末尾多加一栏用于展示合计，但是值都是0；缺点：必须根据xAxis的data生成一组为空的数据，且tooltip不能加trigger: 'axis',这个条件，不然会展示合计：0
              }
            ]
          };
          let series = option["series"];
          let arrayData = function (params) {
            let data3 =0;
            for(let i=0,l=series.length;i<l;i++){
              data3 += series[i].data[params.dataIndex][1]
            }
            return data3
          };
          //加载页面时候替换最后一个series的formatter
          series[series.length-1]["label"]["normal"]["formatter"] = arrayData;
          // 使用刚指定的配置项和数据显示图表。
          myChart.setOption(option);
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
            this.handleSearch1('');
            this.drawLine()
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
