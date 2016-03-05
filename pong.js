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

var FIELD_WIDTH = 600
var FIELD_HEIGHT = 400

var BALL_SIZE = 20
var BALL_SPEED = 400
var BALL_CURVE = 0.002
var BALL_MAX_VA = 2

var BAT_OFFSET = 280
var BAT_WIDTH = 10
var BAT_HEIGHT = 70
var BAT_SPEED = 40
var BAT_DAMPING = 57

var KEY_UP = 38
var KEY_DOWN = 40

var BG_COLOR = '#fff'
var FG_COLOR = '#666'

var initialState = {
  ball: {
    x: 0,
    y: 0,
    a: Math.PI / 4,
    va: 0
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

function tickBall(ball, player, computer, dt) {
  var vx = Math.cos(ball.a) * BALL_SPEED
  var vy = Math.sin(ball.a) * BALL_SPEED
  var x = ball.x + vx * dt
  var y = ball.y + vy * dt
  var a = ball.a + ball.va * dt
  var va = ball.va
  if (x > FIELD_WIDTH / 2) {
    x = FIELD_WIDTH / 2
    a = Math.atan2(vy, -vx)
  }
  if (x < -FIELD_WIDTH / 2) {
    x = -FIELD_WIDTH / 2
    a = Math.atan2(vy, -vx)
  }
  if (y > FIELD_HEIGHT / 2 - BALL_SIZE / 2) {
    y = FIELD_HEIGHT / 2 - BALL_SIZE / 2
    a = Math.atan2(-vy, vx)
  }
  if (y < -FIELD_HEIGHT / 2 + BALL_SIZE / 2) {
    y = -FIELD_HEIGHT / 2 + BALL_SIZE / 2
    a = Math.atan2(-vy, vx)
  }
  if (
    x < -BAT_OFFSET + BAT_WIDTH / 2 + BALL_SIZE / 2 &&
    //x > -BAT_OFFSET - BAT_WIDTH / 2 - BALL_SIZE / 2 &&
    y > player.y - BAT_HEIGHT / 2 &&
    y < player.y + BAT_HEIGHT / 2 &&
    Math.cos(a) < 0
  ) {
    x = -BAT_OFFSET + BAT_WIDTH / 2 + BALL_SIZE / 2
    a = Math.atan2(vy, -vx)
    va += player.vy * BALL_CURVE
  }
  if (
    x > BAT_OFFSET - BAT_WIDTH / 2 - BALL_SIZE / 2 &&
    //x < BAT_OFFSET + BAT_WIDTH / 2 + BALL_SIZE / 2 &&
    y > computer.y - BAT_HEIGHT / 2 &&
    y < computer.y + BAT_HEIGHT / 2 &&
    Math.cos(a) > 0
  ) {
    x = BAT_OFFSET - BAT_WIDTH / 2 - BALL_SIZE / 2
    a = Math.atan2(vy, -vx)
    va += computer.vy * BALL_CURVE
  }
  va = Math.max(Math.min(va, BALL_MAX_VA), -BALL_MAX_VA)
  return Object.assign({}, ball, {
    x: x,
    y: y,
    a: a,
    va: va
  })
}

function tickPlayer(state, keys, dt) {
  var vy = state.vy
  var y = state.y + vy * dt
  if (y < -FIELD_HEIGHT / 2 + BAT_HEIGHT / 2) {
    y = -FIELD_HEIGHT / 2 + BAT_HEIGHT / 2
    vy = -vy
  }
  if (y > FIELD_HEIGHT / 2 - BAT_HEIGHT / 2) {
    y = FIELD_HEIGHT / 2 - BAT_HEIGHT / 2
    vy = -vy
  }
  if (keys[KEY_UP]) {
    vy -= BAT_SPEED
  }
  if (keys[KEY_DOWN]) {
    vy += BAT_SPEED
  }
  vy *= BAT_DAMPING * dt
  return Object.assign({}, state, {
    y: y,
    vy: vy
  })
}

function tickComputer(state, ballState, dt) {
  var vy = state.vy
  var y = state.y + vy * dt
  if (y < -FIELD_HEIGHT / 2 + BAT_HEIGHT / 2) {
    y = -FIELD_HEIGHT / 2 + BAT_HEIGHT / 2
    vy = -vy
  }
  if (y > FIELD_HEIGHT / 2 - BAT_HEIGHT / 2) {
    y = FIELD_HEIGHT / 2 - BAT_HEIGHT / 2
    vy = -vy
  }
  if (ballState.y < state.y) {
    vy -= BAT_SPEED
  }
  if (ballState.y > state.y) {
    vy += BAT_SPEED
  }
  vy *= BAT_DAMPING * dt
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
        ball: tickBall(state.ball, state.player, state.computer, action.dt),
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

  ctx.fillStyle = BG_COLOR
  ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT)

  ctx.save()
  ctx.translate(FIELD_WIDTH / 2, FIELD_HEIGHT / 2)

  ctx.save()
  ctx.translate(state.ball.x, state.ball.y)
  ctx.rotate(state.ball.a)
  ctx.fillStyle = FG_COLOR
  ctx.fillRect(-BALL_SIZE / 2, -BALL_SIZE / 2, BALL_SIZE, BALL_SIZE)
  ctx.restore()

  ctx.fillStyle = FG_COLOR
  ctx.fillRect(-BAT_OFFSET - BAT_WIDTH / 2, state.player.y - BAT_HEIGHT / 2, BAT_WIDTH, BAT_HEIGHT)

  ctx.fillStyle = FG_COLOR
  ctx.fillRect(BAT_OFFSET - BAT_WIDTH / 2, state.computer.y - BAT_HEIGHT / 2, BAT_WIDTH, BAT_HEIGHT)

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
