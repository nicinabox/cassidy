import { pairs, each } from 'lodash'
import key from 'keymaster'

key.filter = function(event) {
  return true
}

export default {
  listen(keymap, handler) {
    each(keymap, (v, k) => {
      key(v, (e) => {
        handler(k, e)
      })
    })
  },

  unlisten(keymap) {
    each(keymap, (v, k) => key.unbind(v))
  }
}
