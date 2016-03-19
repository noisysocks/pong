import { createStore } from 'redux'
import reducer from './reducer'
import draw from './draw'
import {
  ACTION_TICK,
  ACTION_KEY_DOWN,
  ACTION_KEY_UP,
  ACTION_TOUCH_DOWN,
  ACTION_TOUCH_MOVE,
  ACTION_TOUCH_UP
} from './constants'
import './pong.css'

const store = createStore(reducer)

var lastTime = new Date()
window.requestAnimationFrame(tick)

function tick () {
  const dt = (new Date() - lastTime) / 1000
  lastTime = new Date()

  store.dispatch({ type: ACTION_TICK, dt: dt })
  draw(store.getState())

  window.requestAnimationFrame(tick)
}

window.addEventListener('keydown', function (e) {
  store.dispatch({ type: ACTION_KEY_DOWN, keyCode: e.keyCode })
})
window.addEventListener('keyup', function (e) {
  store.dispatch({ type: ACTION_KEY_UP, keyCode: e.keyCode })
})

window.addEventListener('touchstart', function (e) {
  const touch = e.touches[0]
  store.dispatch({
    type: ACTION_TOUCH_DOWN,
    x: touch.clientX,
    y: touch.clientY
  })
})
window.addEventListener('touchmove', function (e) {
  const touch = e.touches[0]
  store.dispatch({
    type: ACTION_TOUCH_MOVE,
    x: touch.clientX,
    y: touch.clientY
  })
})
window.addEventListener('touchend', function (e) {
  store.dispatch({ type: ACTION_TOUCH_UP })
})
