angular.module('ionic-nodeclub')

#
# 基于 github.com/lanceli/cnodejs-ionic 的 'link' filter 做了修改
# 具体参考这个 commit:
# https://github.com/lanceli/cnodejs-ionic/commit/06e703e739dbe9e026bb17b14e27716034d4aba0
#
.filter 'fixLink', ($sce) ->
  (content) ->
    if _.isString(content)
      userLinkRegex = /href="\/user\/([\S]+)"/gi
      noProtocolSrcRegex = /src="\/\/([\S]+)"/gi
      externalLinkRegex = /href="((?!#\/app\/)[\S]+)"/gi
      $sce.trustAsHtml(
        content
          .replace(userLinkRegex, 'href="#/app/user/$1"')
          .replace(noProtocolSrcRegex, 'src="https://$1"')
          .replace(externalLinkRegex, "href onClick=\"window.open('$1', '_system')\"")
      )
    else
      content

