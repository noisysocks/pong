import { createStore } from 'redux'
import reducer from './reducer'
import draw from './draw'
import './pong.css'

const store = createStore(reducer)

var lastTime = new Date()
window.requestAnimationFrame(tick)

function tick () {
  const dt = (new Date() - lastTime) / 1000
  lastTime = new Date()

  store.dispatch({ type: 'tick', dt: dt })
  draw(store.getState())

  window.requestAnimationFrame(tick)
}

window.addEventListener('keydown', function (e) {
  store.dispatch({ type: 'keyDown', keyCode: e.keyCode })
})
window.addEventListener('keyup', function (e) {
  store.dispatch({ type: 'keyUp', keyCode: e.keyCode })
})
