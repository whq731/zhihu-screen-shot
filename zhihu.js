/**
 * Created by weihanqing on 15/11/24.
 */
var sys = require('system');
var page = require('webpage').create();
var spawn = require("child_process").spawn


page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
page.open("http://www.zhihu.com/search?type=question&q=" + encodeURIComponent(sys.args[1]), function(status) {
    page.viewportSize = {
        width: 800,
        height: 600
    };
    if ( status === "success" ) {
        var answerList = page.evaluate(function(){
            document.body.bgColor = 'white';
            $('.toggle-expand').click();
            return $('.question-link').map(function(){
                return this.href;
            })
        })
        answerList = Array.prototype.slice.call(answerList, 0);
        (answerList.length > 5) && (answerList.length = 5);

        console.log(answerList.toString());

        setTimeout(function () {

            var child = spawn("phantomjs", ["worker.js"].concat(answerList))

            child.stdout.on("data", function (data) {
                console.log("child process STDOUT:", JSON.stringify(data))
            })

            child.stderr.on("data", function (data) {
                console.log("child process ERR:", JSON.stringify(data))
            })

            child.on("exit", function (code) {
                console.log("spawnEXIT:", code)
                phantom.exit(0);
            })

            page.render("meituan.png");
        },1000)




    } else {
        console.log("Page failed to load.");
    }
});

