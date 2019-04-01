import java.text.SimpleDateFormat
node {
  env.projectName = 'group-company'
  env.version = '1.0.1'
  env.port = '3001:80'
  String emailList = '895355044@qq.com'
  String aliRegistryKey = 'aliRegistryKey'
  currentBuild.result = 'SUCCESS'
  try {
    stage('Checkout') {
      echo '更新代码'
      checkout scm
    }
    stage('Test') {
      echo '项目测试-跳过'
    }
    stage('Build & Push') {
      echo '构建并提交镜像'
      docker.withRegistry('https://registry-internal.cn-shanghai.aliyuncs.com', aliRegistryKey) {
        def customImage = docker.build("bingblue/${env.projectName}:${env.version}")
        customImage.push()
      }
    }
    stage('Deploy') { 
      echo '部署项目'
      runDeploy()
    }
    stage('Send Email') { 
      echo '发送邮件'
      emailext (
        subject: "[滨清科技] 构建结果:成功 --> ${JOB_NAME}-${env.BUILD_ID}",
        body: getHtml(),
        mimeType : 'text/html',
        from: 'system@bingblue.com',
        replyTo: 'system@bingblue.com',
        to: emailList
      )
    }
  }catch (err) {
    echo '构建失败'
    currentBuild.result = 'FAILURE'
    emailext (
      subject: "[滨清科技] 构建结果:失败 --> ${JOB_NAME}-${env.BUILD_ID}",
      body: getHtml(),
      mimeType : 'text/html',
      from: 'system@bingblue.com',
      replyTo: 'system@bingblue.com',
      to: emailList
    )
    throw err
  }
}

/**
 * 获取HTML模板
 * @author <XiaoMuCOOL> [<gavin@bingblue.com>]
 * @return {String} HTML字符串
 */
def getHtml() {
  String html = readFile encoding: 'UTF-8', file: "${pwd()}/jenkins.html"
  boolean  result = currentBuild.result == 'SUCCESS'
  String isSuccess = result ? "block" : "none"
  String hideCont = result ? "✘ 很抱歉，构建失败！" : "✔ 恭喜你，构建成功！"
  String isFail = (!result) ? "block" : "none"
  String color = result ? "#77af37" : "#d54c53"
  html = html.replaceAll("env.JOB_NAME", env.JOB_NAME)
  html = html.replaceAll("currentBuild.result", currentBuild.result)
  html = html.replaceAll("env.BUILD_DISPLAY_NAME", env.BUILD_DISPLAY_NAME)
  html = html.replaceAll("currentBuild.startTimeInMillis", getFormatDate(currentBuild.startTimeInMillis))
  html = html.replaceAll("currentBuild.durationString", currentBuild.durationString)
  html = html.replaceAll("env.projectName", env.projectName)
  html = html.replaceAll("isSuccess", isSuccess)
  html = html.replaceAll(hideCont, "")
  html = html.replaceAll("isFail", isFail)
  html = html.replaceAll("envcolor", color)
  return html
}

/**
 * 获取Docker-cpmpose.yml模板
 * @author <XiaoMuCOOL> [<gavin@bingblue.com>]
 * @return {String} yml模板字符串
 */
def getYml() {
  String yml = readFile encoding: 'UTF-8', file: "${pwd()}/jenkins.yml"
  yml = yml.replaceAll("env.projectName", env.projectName)
  yml = yml.replaceAll("env.version", env.version)
  yml = yml.replaceAll("env.port", env.port)
  return yml
}

/**
 * 时间格式化，中国时区+8
 * @author <XiaoMuCOOL> [<gavin@bingblue.com>]
 * @return {String} 本地时间
 */
def getFormatDate(def date) {
  SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
  simpleDateFormat.format(date+(8*60*60*1000))
}

/**
 * 登陆运程服务器并执行compose更新
 * @author <XiaoMuCOOL> [<gavin@bingblue.com>]
 */
def runDeploy() {
  String yml = getYml()
  sshagent(credentials: ['aliServerKey']) {
    writeFile encoding: 'UTF-8', file: "./${env.projectName}.yml", text: yml
    sh "scp -o StrictHostKeyChecking=no ./${env.projectName}.yml  root@116.62.46.205:/root/yml/${env.projectName}.yml"
    String strSH = "docker stack deploy -c ./yml/${env.projectName}.yml bing_blue --with-registry-auth"
    sh "ssh -o StrictHostKeyChecking=no -p 22 root@116.62.46.205 '${strSH}'"
  }
}