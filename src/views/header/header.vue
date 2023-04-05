<template>
 <div class='header'>
   <div class='left'>
     <img src="./assets/logo.png" class='logo'>
   </div>
   <div class="right">
     <div v-if="this.userInfo === null" class="loginButton" @click="toLogin">登陆</div>
     <img v-if="this.userInfo != null" :src="avatorUrl" class='user-photo'>
     <div v-if="this.userInfo != null" class="user">
       <Dropdown class='user-name' @on-click="handleUserAction">
        <a class='name' href="javascript:void(0)">
            {{this.userInfo.username}}
            <Icon type="ios-arrow-down"></Icon>
        </a>
        <DropdownMenu slot="list" >
            <!-- <DropdownItem  name='userCenter'>个人信息</DropdownItem> -->
            <DropdownItem  name='logout'>退出账号</DropdownItem>
        </DropdownMenu>
      </Dropdown>
     </div>
   </div>
 </div>
</template>

<script>
import { BASE_URL } from '@/public/configs/config.js'
import { clearToken } from '@/common/helpers/token'
import { mapGetters } from 'vuex'
export default {
    data () {
        return {
        }
    },
    computed: {
      ...mapGetters('user',[
        'userInfo'
      ]),
      avatorUrl () {
          if (this.userInfo != null) {
              return BASE_URL + this.userInfo.avatar
          } else {
              return ''
          }
      },
    },
    methods: {
        toLogin(){
          clearToken()
          this.$router.push('/login')
        },
        handleUserAction (action) {
            switch (action) {
            case 'logout':
                clearToken()
                this.$router.push('/login')
                break
            // case 'userCenter':
            //     this.$router.push('/personal-information')
            //     break
            default:
                break
            }
        },
    },
}
</script>
<style lang='less' scoped>
// 宽度1200居中
.w{
  width:1200px;
  margin:auto;
}
.header{
  // display: flex;
  // position: relative;
  width:100%;
  height: 50px;
  background: #00296b;
  box-shadow: 0px 0px 4px 0px undefined;
}
// 左侧部分
.left{
  float:left;
  .logo{
    width:164px;
    height: 20px;
    margin-top:15px;
    margin-left: 25px;
      padding-right: 18px;
  }
}
// 右侧部分
.right{
  float:right;
  display: flex;
}
.loginButton{
  float:left;
  width: 28px;
  margin-left:30px;
  margin-right:30px;
  margin-top:19px;
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: rgba(255,255,255,0.65);
  line-height: 14px;
  cursor:pointer;
}
.loginButton:hover{
  color:#ffffff;
}
.avatar{
  height:32px;
  width: 32px;
  margin-left:40px;
  margin-top: 10px;
  // border-radius: 50%;
  border:1px red solid
}
.user-photo{
  height:32px;
  width: 32px;
  margin-left:40px;
  margin-top: 10px;
  border-radius: 20%;
}
.user{
  float:left;
  margin-top:17px;
  margin-right:20px
}
.user-name{
  margin-left:10px;
  justify-content: flex-end;
}
.name{
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: rgba(255,255,255,0.85);
  line-height: 20px;
}
</style>
