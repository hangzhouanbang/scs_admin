<script type="text/javascript">

  const mDevPath = 'http://192.168.0.122:99'
  // const mDevPath = 'http://192.168.0.116:99'
  const mProductionPath = 'www.linshaocong.cn'

  let dev = 1
  let production = 2

  // 改变正式测试环境的服务器链接地址
  let build = dev
  let mPath

  if (build === dev) {
    mPath = mDevPath
  } else if (build === production) {
    mPath = mProductionPath
  }
  export default {
    mDevPath,
    mProductionPath,
    mPath
  }
</script>

