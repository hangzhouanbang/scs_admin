<script type="text/javascript">
  const mDevPath = 'http://47.96.20.47:99' //外网
  // const mDevPath = 'http://192.168.0.156:99' //测试
  // const mDevPath = 'http://192.168.0.116:99' //林少聪
  const mProductionPath = 'http://47.96.20.47:99'

  let dev = 1;
  let production = 2;

  // 改变正式测试环境的服务器链接地址
  let build = dev;
  let mPath;

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

