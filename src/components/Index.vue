<template style="background-color:#000;">
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><b style="font-size: 18px;color: #4A90E2;">首页</b></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <div class="title">会员中心</div>
    <div class="number">玩家数量</div>
    <el-row :gutter="20" style="margin:10px 0 0 30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_duliyonghu.png" alt="">
          </div>
          <div class="rightText">
            <div class="num">{{filters.amount}}人</div>
            <div class="type">玩家总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_vip.png" alt="">
          </div>
          <div class="rightText">
            <div class="num">{{filters.vipAmount}}人</div>
            <div class="type red">会员玩家</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="sks">商城售卡数</div>
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
    <el-row :gutter="20" style="margin:70px 0 0 30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_rika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters.memberRiAmount}}张</div>
            <div class="type grey">日卡</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_zhouka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters.memberZhouAmount}}张</div>
            <div class="type grey">周卡</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_yueka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters.memberYueAmount}}张</div>
            <div class="type grey">月卡</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_jika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters.memberJiAmount}}张</div>
            <div class="type grey">季卡</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <hr>

    <div class="title">推广员中心</div>
    <div class="number">推广员数量</div>
    <el-row :gutter="20" style="margin:10px 0 0 30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_yiji.png" alt="">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.amount}}人</div>
            <div class="type">推广员总数</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="sks">代理购卡数</div>
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;margin-top:20px;">
      <el-select v-model="year" placeholder="请选择年份" clearable style="margin-left:40px;" @change="handleSearch1(value1)">
        <el-option
          v-for="item in years"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="value1" placeholder="请选择月份" clearable style="margin-left:40px;" @change="handleSearch1(value1)">
        <el-option
          v-for="item in month"
          :key="item.value"
          :label="item.value"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-row :gutter="20" style="margin:70px 0 70px 30px;">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_rika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentRiAmount}}张</div>
            <div class="type grey">日卡</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_zhouka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentZhouAmount}}张</div>
            <div class="type grey">周卡</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_yueka.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentYueAmount}}张</div>
            <div class="type grey">月卡</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="leftImg">
            <img src="../assets/images/icon_jika.png" alt="" class="card">
          </div>
          <div class="rightText">
            <div class="num">{{filters1.agentJiAmount}}张</div>
            <div class="type grey">季卡</div>
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
            if(!month){
              var myDate = new Date();
              this.value = myDate.getMonth()+1 +'月';
            }
            if(month == '1月'){
              month = 1;
            }
            if(month == '2月'){
              month = 2;
            }
            if(month == '3月'){
              month = 3;
            }
            if(month == '4月'){
              month = 4;
            }
            if(month == '5月'){
              month = 5;
            }
            if(month == '6月'){
              month = 6;
            }
            if(month == '7月'){
              month = 7
            } if(month == '8月'){
              month = 8;
            }
            if(month == '9月'){
              month = 9;
            }
            if(month == '10月'){
              month = 10;
            }
            if(month == '11月'){
              month = 11;
            }
            if(month == '12月'){
              month = 12;
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
            })
              .then((res) => {
                  // console.log(res.data)
                  this.filters = res.data.data;
                },
              ).catch((e) => {
              if (e && e.response) {
                switch (e.response.status) {
                  case 504:
                    this.$message({
                      showClose: true,
                      message: '服务器异常',
                      type: 'warning'
                    });
                    this.loading = false;//隐藏加载条
                    break
                  case 500:
                    this.$message({
                      showClose: true,
                      message: '服务器异常',
                      type: 'warning'
                    });
                    this.loading = false;//隐藏加载条
                    break
                  case 405:
                    this.$message({
                      showClose: true,
                      message: '请先登录',
                      type: 'warning'
                    });
                    break
                }
              }
            });
          },
          handleSearch1(month){
          if(!month){
            var myDate = new Date();
            this.value1 = myDate.getMonth()+1+'月';
          }
          if(month == '1月'){
            month = 1;
          }
          if(month == '2月'){
            month = 2;
          }
          if(month == '3月'){
            month = 3;
          }
          if(month == '4月'){
            month = 4;
          }
          if(month == '5月'){
            month = 5;
          }
          if(month == '6月'){
            month = 6;
          }
          if(month == '7月'){
            month = 7
          } if(month == '8月'){
            month = 8;
          }
          if(month == '9月'){
            month = 9;
          }
          if(month == '10月'){
            month = 10;
          }
          if(month == '11月'){
            month = 11;
          }
          if(month == '12月'){
            month = 12;
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
          })
            .then((res) => {
                // console.log(res.data)
                this.filters1 = res.data.data;
              },
            ).catch((e) => {
            if (e && e.response) {
              switch (e.response.status) {
                case 504:
                  this.$message({
                    showClose: true,
                    message: '服务器异常',
                    type: 'warning'
                  });
                  this.loading = false;//隐藏加载条
                  break
                case 500:
                  this.$message({
                    showClose: true,
                    message: '服务器异常',
                    type: 'warning'
                  });
                  this.loading = false;//隐藏加载条
                  break
                case 405:
                  this.$message({
                    showClose: true,
                    message: '请先登录',
                    type: 'warning'
                  });
                  break
              }
            }
          });
        }
      },
      mounted(){
          this.handleSearch('');
          this.handleSearch1('');
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
    margin:10px 0 0 50px;
    font-size: 18px;
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
    width:200px;
    height:100px;
    text-align: center;
    background: #f8fafb;
    border-radius: 4px;
    border:1px solid #f8fafb;
  }
  .leftImg,
  .rightText{
    float:left;
  }
  .leftImg img{
    width:45px;
    height:45px;
    margin:23px 0 0 30px;
  }
  .leftImg .card{
    width:33px;
    height:45px;
  }
  .rightText{
    margin:27px 0 0 30px;
  }
  .rightText div:nth-child(2){
    font-size: 14px;
    color: #3688FF;
  }
  .rightText div.red{
   color:#E13743;
  }
  .rightText div.grey{
    color: #778CA2;
  }
</style>
