import env from './env'

// const DEV_URL = 'http://localhost:8000'
const DEV_URL = 'https://www.rdoorweb.com/pzhan/public'
// const DEV_URL = 'http://192.168.31.163:8000'
// const DEV_URL = 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/'
const PRO_URL = 'https://www.rdoorweb.com/pzhan/public'

export default env === 'development' ? DEV_URL : PRO_URL
