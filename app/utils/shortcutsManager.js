import { pairs, each } from 'lodash'
import key from 'keymaster'

key.filter = function(event) {
  return true
}

export default {
  listen(keymap, handler) {
    each(keymap, (v, k) => {
      key(v, (e) => {
        if ((/input|textarea|select/i).test(e.target.tagName) && !(/^blur_/i).test(k)) return
        handler(k, e)
      })
    })
  }
}
