// 宣告遊戲狀態
const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished',
}

const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const view = {
  // 渲染背面 -> 遊戲開始由view.displayCards () 呼叫
  getCardElement (index) {
    return `<div data-index="${index}" class="card back"></div>`
  },

  // 渲染牌面 -> 使用者點擊時由view.flipCard () 呼叫
  getCardContent (index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
        <p>${number}</p>
        <img src="${symbol}" />
        <p>${number}</p>
    `
  },

  transformNumber (number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },
  
  // 傳入洗牌後的陣列
  displayCards (indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
  } ,

  flipCards (...cards) {
    cards.map(card => {
      // 如果是背面，點擊變正面
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        // 用dataset運算卡片內容
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      // 如果是正面，點擊變背面
      card.classList.add('back')
      card.innerHTML = null
    })
  },

  // 配對成功加上灰底
  pairCards (...cards) {
    cards.map(card => {
      card.classList.add('pair')
    })
  },

  renderScore(score) {
    document.querySelector('.score').textContent = `Score: ${score}`
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times} times`
  },

  // 動畫
  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      // 監聽animation結束時移除wrong，{once: true} 執行一次就卸載監聽器
      card.addEventListener('animationend', (event) => {
        event.target.classList.remove('wrong'), {once: true}
      })
    })
  },

  // 遊戲結束
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.tried} times</p>
    `
    const header = document.querySelector('#header')
    // 在header前面加上div
    header.before(div)
  }
}

const utility = {
  // 產生陣列長度為count的隨機連續整數陣列
  getRandomNumberArray (count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--){
      let randomIndex = Math.floor(Math.random() * (index + 1))
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  }
}

const model = {
  // 暫存被翻開的卡片
  revealedCards: [],

  // 配對兩張卡片是否相同
  isRevealedCardsMatched () {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,
  tried: 0
}

const controller = {
  // 遊戲初始狀態
  currentState: GAME_STATE.FirstCardAwaits,

  generateCards () {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  dispatchCardAction (card) {
    // 翻到正面的就不能再點
    if(!card.classList.contains('back')) return

    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break

      case GAME_STATE.SecondCardAwaits:
        // 嘗試次數+1
        view.renderTriedTimes(++model.tried)
        view.flipCards(card)
        model.revealedCards.push(card)
        // 判斷是否配對成功
        if (model.isRevealedCardsMatched()) {
          // 配對成功
          // 分數+10
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          model.revealedCards = []
          
          // 判斷遊戲是否結束
          if (model.score === 260){
            console.log('show game finish')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }

          this.currentState = GAME_STATE.FirstCardAwaits

        } else {
          // 配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          // 動畫
          view.appendWrongAnimation(...model.revealedCards)
          // 延遲一秒
          setTimeout(this.restCards, 1000)
          
        }
        break
    }
    console.log(this.currentState)
    console.log(model.revealedCards.map(card => card.dataset))
  },

  restCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    // 參數傳給setTimeout後，this會指向setTimeout，因此要改成controller
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}


controller.generateCards() // 取代 view.displayCards()

document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('click', e => {
    controller.dispatchCardAction(card)
  })
})