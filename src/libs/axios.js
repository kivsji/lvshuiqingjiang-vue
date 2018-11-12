import Axios from 'axios'
import baseURL from '_conf/url'
import { Message } from 'iview'
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/libs/util'
class httpRequest {
  constructor () {
    this.options = {
      method: '',
      url: ''
    }
    // 存储请求队列
    this.queue = {}
  }
  // 销毁请求实例
  destroy (url) {
    delete this.queue[url]
    const queue = Object.keys(this.queue)
    return queue.length
  }
  // 请求拦截
  interceptors (instance, url) {
    // 添加请求拦截器
    
    instance.interceptors.request.use(config => {
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.headers['Access-Control-Allow-Origin'] = ''
      if (!config.url.includes('/users')) {
        config.headers['token'] = Cookies.get(TOKEN_KEY)
      }
      // 在发送请求之前做些什么
      return config
    }, error => {
      // 对请求错误做些什么
      return Promise.reject(error)
    })

    // 添加响应拦截器
    instance.interceptors.response.use((res) => {
      let { data } = res
      
      const is = this.destroy(url)
      if (data.code === 401) {
        // Cookies.remove(TOKEN_KEY)
        window.location.href = '/login'
        Message.error('未登录，或登录失效，请登录')
      }
      /*
      if (data.code !== 200) {
        // 后端服务在个别情况下回报201，待确认
        if (data.code === 401) {
          Cookies.remove(TOKEN_KEY)
          window.location.href = '/#/login'
          Message.error('未登录，或登录失效，请登录')
        } else {
          if (data.msg) Message.error(data.msg)
        }
        return false
      }
      */
      return data
    }, (error) => {
      
      /*
      error :{
        config
        request
        response
      }
      */
      // Message.error('服务内部错误')
      // 对响应错误做点什么
      // Cookies.remove(TOKEN_KEY)
        // window.location.href = '/login'
        if(error['request'].status === 401){
          Cookies.remove(TOKEN_KEY)
          window.location.href = '/login'
          Message.error('登录过期，请重新登录')
        }else{
          Message.error('发生未知错误,请按f12查看network')
        }
        
        // Message.error('未登录，或登录失效，请登录')
      // return Promise.reject(error)
    })
    
  }
  // 创建实例
  create () {
    let conf = {
      baseURL: baseURL,
      // timeout: 2000,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'X-URL-PATH': location.pathname,
        // 'Access-Control-Request-Headers' : 'Origin, Content-Type, Cookie, Accept'
      }
    }
    return Axios.create(conf)
  }
  // 合并请求实例
  mergeReqest (instances = []) {
    //
  }
  // 请求实例
  request (options) {
    var instance = this.create()
    this.interceptors(instance, options.url)
    options = Object.assign({}, options)
    this.queue[options.url] = instance
    return instance(options)
  }
}
export default httpRequest
