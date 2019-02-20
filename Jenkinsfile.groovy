
node {
//=============================================公共参数区=====================================================================



    // docker 仓库地址
    String dockerRegistry = 'http://repo.onlyharbor.com:5000'
    String dockerRegistryHost
    if ("${dockerRegistry}".startsWith("http://")) {
        dockerRegistryHost = "${dockerRegistry}".substring(7)
    } else if ("${dockerRegistry}".startsWith("https://")) {
        dockerRegistryHost = "${dockerRegistry}".substring(8)
    } else {
        throw new Exception("docker镜像仓库前缀必须是http:// 或者https：//")
    }

//=============================================公共参数区=====================================================================

    //检出代码
    svnScmParams = checkout(scm)


    //流程定义
    try {
        docker.image('car2godeveloper/dind-node-build-runner').inside('--privileged') {
          stage('登录私有仓库') {
            sh 'sudo docker login repo.onlyharbor.com:5000 -u admin -p Adminadmin123'
          }

            stage('构建发布项目docker image') {
                sh 'docker --version'
                imageName = "bingblue/group-company:${localDate}"
                docker.withRegistry("${dockerRegistry}") {
                    docker.build(imageName).push()
                    devRegistryImageName = "${dockerRegistryHost}/${imageName}"
                }
            }


            stage('部署dev环境') {
                print '部署dev环境'
                String compose = readFile encoding: 'UTF-8', file: './boss.yml'
                compose = compose.replaceAll("tmp_imageName", devRegistryImageName)
                compose = compose.replaceAll("tmp_serverName", moduleName)
                writeFile encoding: 'UTF-8', file: './tmp.yml', text: compose
                stackDeployYml(projectName, compose, devHost, devSshPort);
            }
        }
        sendDD("构建dev成功!镜像版本::" + devRegistryImageName)
    } catch (e) {
        print currentBuild.result
        sendDD("构建dev失败" + e.getMessage())
        throw e
    }

}

/** 发送到钉钉  使用 shell脚本发送 因为 jenkins 的groovy不是完整的gdk功能 调jdk 又比较麻烦   干脆直接拼写 shell命令执行算了
 *  默认钉钉 url  发版通知群jenkins 机器人
 * @param info 消息内容
 * @param mobiles 艾特电话号码组{@link *MobilesGroup }
 * @author ming
 * @date 2017-12-22 18:58
 * */
def sendDD(String info, String mobiles = '"15617565467"'
           , String url = 'https://oapi.dingtalk.com/robot/send?access_token=6a380ab6282c2425dd9d094aa6fbf0bffa5fc5478db44f15be4ca7daed0f866d') {
    String headers = 'Content-Type: application/json'
    String atStr = ""
    String[] mobilesArr = mobiles.split(",")
    for (int i = 0; i < mobilesArr.length; i++) {
        //截取 2<=n <13中间11 位电话号码
        String tmp = "${mobilesArr[i]}".substring(1, 12)
        atStr = atStr + " @${tmp}"
    }
    String jsonStr = "{ \"msgtype\": \"markdown\"" +
            ", \"markdown\": { \"title\":\"执行结果通知\", \"text\": \"#### ${atStr} 执行结果通知:${params.projectName}项目:${info}\" }," +
            " \"at\": { \"atMobiles\": [${mobiles}], \"isAtAll\": false } }"
    String script = "curl \'${url}\' -H \'${headers}\' -d \'${jsonStr}\' && exit 0 "
    sh script
}

/**根据时间格式化格式 获取当前时间  默认 yyyy-MM-dd HH:mm:ss
 * @param patten
 * @return dateStr
 * @author ming
 * @date 2017-12-22 23:39
 * */
def getFormatterLocalDate(String patten = "yyyy-MM-dd HH:mm:ss") {
    Date date = new Date()
    SimpleDateFormat formatter = new SimpleDateFormat(patten)
    formatter.format(date)
}

/**
 * 根据yaml deploy stack
 * @param sshPort
 * @param host
 *
 * @param key = 'boss' jenkins配置私钥 key是boss
 * @author ming
 * @date 2018-04-10 10:55
 */
def stackDeployYml(String stackName, String compose, String host, String sshPort, String key = "boss") {
    // jenkins 配置的sshkey id
    sshagent([key]) {
        writeFile encoding: 'UTF-8', file: './tmp.yml', text: compose
        //登陆服务器之后启动容器的命令
        sh 'scp -o StrictHostKeyChecking=no ./tmp.yml  root@10.10.10.175:/root/tmp.yml'
      String runCmd = " cat ./tmp.yml &&" +
        " docker --version && " +
        " docker login repo.onlyharbor.com:5000 -u admin -p Adminadmin123 && " +
        " docker stack deploy -c ./tmp.yml  ${stackName} --with-registry-auth"
        // 登陆 服务器 运行容器
        sh "ssh -o StrictHostKeyChecking=no  -p ${sshPort} root@${host} '${runCmd}'"
    }
}

