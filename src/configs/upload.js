/*
 * @Description:
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-22 09:29:36
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-09-05 15:50:02
 * @Incantation: Buddha Bless Do Not Bugs
 */
import axios from 'axios'
import store from '@/store'

const binary_upload = async payload => {
  let name = payload.name
  let type = 'binary'

  const params = {
    file_type: type,
    file_name: name,
    source: 'app',
    token: store.state.current_user.token
  }

  const uploadUrl = await axios.get(process.env.VUE_APP_UPLOAD_URL, { params: params }).then(res => {
    console.log(res)
    return res.data.data.url
  })

  const result = await axios
    .put(uploadUrl, payload.base64, {
      headers: {
        'Content-Type': type
      }
    })
    .then(() => {
      const url = uploadUrl.split('?')[0]
      return url
    })

  return result
}

export default binary_upload
