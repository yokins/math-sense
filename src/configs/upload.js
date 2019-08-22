/*
 * @Description: 
 * @Author: 施永坚（yokins）
 * @Date: 2019-08-22 09:29:36
 * @LastEditors: 施永坚（yokins）
 * @LastEditTime: 2019-08-22 09:31:39
 * @Incantation: Buddha Bless Do Not Bugs
 */
import axios from 'axios'

const binary_upload = async payload => {
  let name = payload.name
  let type = 'binary'

  const params = {
    fileType: type,
    fileName: name
  }

  const uploadUrl = await axios
    .get('http://evaluating-test.wfl-ischool.cn/api/attachments/get_url', { params: params })
    .then(res => {
      return res.data.url
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
