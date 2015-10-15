ALL_SERVERS_TABS =
  'https://cnodejs.org': [
    {label: '全部', value: 'all'}
    {label: '精华', value: 'good'}
    {label: '分享', value: 'share'}
    {label: '问答', value: 'ask'}
    {label: '招聘', value: 'job'}
  ]
  'http://ionichina.com': [
    {label: '全部', value: 'all'}
    #{label: '精华', value: 'good'} API BUG
    {label: '分享', value: 'share'}
    {label: '问答', value: 'ask'}
    {label: '招聘', value: 'job'}
    {label: '吐槽', value: 'bb'}
  ]
ALL_SERVERS = _.keys(ALL_SERVERS_TABS)
CUR_SERVER = localStorage.server ? ALL_SERVERS[0]

angular.module('ionic-nodeclub')

.constant 'API',
  allServers: ALL_SERVERS
  server: CUR_SERVER
  path: '/api/'
  version: 'v1'

.constant 'tabs', ALL_SERVERS_TABS[CUR_SERVER]

.constant 'config',
  TOPICS_PAGE_LIMIT: 15              # 每次加载topics为30个
  LATEST_REPLIES_DEFAULT_NUM: 30     # 最新回复默认显示30个
  POP_REPLIES_TRIGGER_NUM: 10        # 有10个回复以上才显示最赞回复
  POP_REPLIES_LIMIT: 3               # 最赞回复默认显示3个
  TOAST_SHORT_DELAY: 2000            # 短的toast显示时长为2秒
  TOAST_LONG_DELAY: 3500             # 长的toast显示时长为3.5秒

