/*
 * TODO: 
 * - bounce ball off bats
 * - keep score
 * - make AI less whack
 * - make particles come out of the ball when it hits shit
 * - remove all the magic numbers everywhere
 * - split shit (esp. draw()) out into functions
 * - clean up the tick functions
 * - run standard
 * - ship it
 */

var initialState = {
  ball: {
    x: 0,
    y: 0,
    a: Math.PI / 4,
    va: 1
  },
  player: {
    y: 0,
    vy: 0
  },
  computer: {
    y: 0,
    vy: 0
  },
  keys: {}
}

function tickBall(state, dt) {
  var vx = Math.cos(state.a) * 400
  var vy = Math.sin(state.a) * 400
  var x = state.x + vx * dt
  var y = state.y + vy * dt
  var a = state.a + state.va * dt
  if (x > 300) {
    x = 300
    a = Math.atan2(vy, -vx)
  }
  if (x < -300) {
    x = -300
    a = Math.atan2(vy, -vx)
  }
  if (y > 200) {
    y = 200
    a = Math.atan2(-vy, vx)
  }
  if (y < -200) {
    y = -200
    a = Math.atan2(-vy, vx)
  }
  return Object.assign({}, state, {
    x: x,
    y: y,
    a: a
  })
}

function tickPlayer(state, keys, dt) {
  var vy = state.vy
  var y = state.y + vy * dt
  if (y < -200 + 35) {
    y = -200 + 35
    vy = -vy
  }
  if (y > 200 - 35) {
    y = 200 - 35
    vy = -vy
  }
  if (keys[38]) {
    vy -= 40
  }
  if (keys[40]) {
    vy += 40
  }
  vy *= (0.95 / (1/60)) * dt
  return Object.assign({}, state, {
    y: y,
    vy: vy
  })
}

function tickComputer(state, ballState, dt) {
  var vy = state.vy
  var y = state.y + vy * dt
  if (y < -200 + 35) {
    y = -200 + 35
    vy = -vy
  }
  if (y > 200 - 35) {
    y = 200 - 35
    vy = -vy
  }
  if (ballState.y < state.y) {
    vy -= 40
  }
  if (ballState.y > state.y) {
    vy += 40
  }
  vy *= (0.95 / (1/60)) * dt
  return Object.assign({}, state, {
    y: y,
    vy: vy
  })
}

function reducer (state, action) {
  if (typeof state === 'undefined') {
    return initialState
  }

  switch (action.type) {
    case 'tick':
      return Object.assign({}, state, {
        ball: tickBall(state.ball, action.dt),
        player: tickPlayer(state.player, state.keys, action.dt),
        computer: tickComputer(state.computer, state.ball, action.dt)
      })

    case 'keyUp':
    case 'keyDown':
        var prop = {}
        prop[action.keyCode] = action.type === 'keyDown'
        return Object.assign({}, state, {
          keys: Object.assign({}, state.keys, prop)
        })

    default:
      return state
  }
}

function draw (state) {
  var ctx = document.getElementById('pong').getContext('2d') 

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, 600, 400)

  ctx.save()
  ctx.translate(300, 200)

  ctx.save()
  ctx.translate(state.ball.x, state.ball.y)
  ctx.rotate(state.ball.a)
  ctx.fillStyle = '#fff'
  ctx.fillRect(-10, -10, 20, 20)
  ctx.restore()

  ctx.fillStyle = '#fff'
  ctx.fillRect(-280, state.player.y - 35, 10, 70)

  ctx.fillStyle = '#fff'
  ctx.fillRect(280, state.computer.y - 35, 10, 70)

  ctx.restore()
}

var store = Redux.createStore(reducer)

function tick () {
  var dt = (new Date() - lastTime) / 1000
  lastTime = new Date()

  store.dispatch({ type: 'tick', dt: dt })
  draw(store.getState())

  window.requestAnimationFrame(tick)
}

var lastTime = new Date()
window.requestAnimationFrame(tick)

window.addEventListener('keydown', function (e) {
  store.dispatch({ type: 'keyDown', keyCode: e.keyCode })
})
window.addEventListener('keyup', function (e) {
  store.dispatch({ type: 'keyUp', keyCode: e.keyCode })
})
