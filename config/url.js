import env from './env'

const DEV_URL = 'http://127.0.0.1:8000/'
// const DEV_URL = 'http://192.168.31.106/lvshui/public'
// const DEV_URL = 'http://192.168.31.163:8000'
// const DEV_URL = 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/'
const PRO_URL = 'http://192.168.31.106/lvshui/public'

export default env === 'development' ? DEV_URL : PRO_URL
