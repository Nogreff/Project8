import "./css/style.css";
const memoryGame = document.getElementById("memory_game") as HTMLDivElement;
const timer = document.getElementById("timer") as HTMLDivElement;
const totalMoves = document.getElementById("moves") as HTMLDivElement;
const replayWin = document.getElementById("replay_win") as HTMLButtonElement;
const replayLose = document.getElementById("replay_lose") as HTMLButtonElement;
const memoWin = document.getElementById("memo_win") as HTMLDialogElement;
const memoLose = document.getElementById("memo_lose") as HTMLDialogElement;

type MemoCardFormat = {
  cardClass: string;
  cardSlots: string[];
  currentCard: string;
  currentNode: number;
  check: boolean;
  match: boolean;
};
type MemoCurrent = {
  check: boolean;
  currentCard: string;
  currentNode: number;
};
type GameStats = {
  cardOrder: string[];
  gameStart: boolean;
  time: number;
  timerInterval: number;
  moves: number;
  matchCount: number;
};

let memoID: number[] = memoIdFill();
let memoCardState: MemoCardFormat[] = [];

const memoCurrent: MemoCurrent = {
  check: false,
  currentCard: "",
  currentNode: 0,
};
const gameStats: GameStats = {
  cardOrder: memoRandomizer(),
  gameStart: false,
  time: 100,
  timerInterval: 0,
  moves: 0,
  matchCount: 0,
};
console.log(gameStats);
addCards();
memoCardStateFormat();
function addCards() {
  for (let x: number = 0; x < 16; x++) {
    let memoCard = document.createElement("div") as HTMLDivElement;
    let memoFront = document.createElement("div") as HTMLDivElement;
    let memoBack = document.createElement("div") as HTMLDivElement;
    let memoContainer = document.createElement("div") as HTMLDivElement;
    memoContainer.className = "memo_container";
    memoCard.className = "card";
    memoFront.className = "card_front";
    memoBack.className = "card_back";
    memoCard.append(memoFront);
    memoCard.append(memoBack);
    memoContainer.append(memoCard);
    memoryGame.appendChild(memoContainer);
  }
}

function memoCardStateFormat() {
  for (let x: number = 0; x < 8; x++) {
    let newCard: MemoCardFormat = {
      cardClass: `memo_img_${x}`,
      cardSlots: [],
      currentCard: "",
      currentNode: 0,
      check: false,
      match: false,
    };
    newCard.cardSlots = [`memo_card_${x}`, `memo_card_${x + 8}`];
    memoCardState.push(newCard);
    if (x === 7) {
      memoShuffle();
    }
  }
}
function memoShuffle() {
  if (gameStats.cardOrder.length > 15) {
    for (let x: number = 0; x < 16; x++) {
      let memoBack = memoryGame.children[x].children[0]
        .children[1] as HTMLDivElement;
      let memoCard = memoryGame.children[x] as HTMLDivElement;
      addRandomCard();
      memoCard.addEventListener("click", () => {
        let memoObjId: number = memoCheck(gameStats.cardOrder[x]) as number;
        if (
          memoCardState[memoObjId].cardSlots.includes(gameStats.cardOrder[x]) &&
          memoCurrent.check === false &&
          memoCardState[memoObjId].match === false
        ) {
          firstCheck(memoCard, memoObjId, x);
        } else if (
          memoCardState[memoObjId].cardSlots.includes(gameStats.cardOrder[x]) &&
          memoCurrent.check === true &&
          memoCurrent.currentCard === `memo_img_${memoObjId}` &&
          memoCardState[memoObjId].match === false &&
          memoCurrent.currentNode != x
        ) {
          checkIfMatch(memoCard, memoObjId);
        } else if (
          !memoCardState[memoObjId].cardSlots.includes(
            memoCurrent.currentCard
          ) &&
          memoCardState[memoObjId].match === false
        ) {
          checkIfDoesntMatch(memoCard, memoBack);
        } else if (
          !memoCardState[memoObjId].cardSlots.includes(
            memoCurrent.currentCard
          ) &&
          !memoryGame.children[
            memoCurrent.currentNode
          ].children[0].classList.contains("match")
        ) {
          checkIfSameCard(memoBack);
        }
        gameStart();
        movesUpdate();
      });
    }
  }
}
function gameStart() {
  if (
    gameStats.time === 100 &&
    gameStats.gameStart === false &&
    memoCurrent.check === true
  ) {
    displayTime();
    gameStats.gameStart = true;
  }
}
function movesUpdate() {
  gameStats.moves++;
  totalMoves.innerHTML = `Moves: ${gameStats.moves.toString()}`;
}
function firstCheck(
  memoCard: HTMLDivElement,
  memoObjId: number,
  currentId: number
) {
  memoCard.classList.toggle("checked");
  memoCurrent.check = true;
  memoCurrent.currentCard = memoCardState[memoObjId].cardClass;
  memoCurrent.currentNode = currentId;
}
function checkIfMatch(memoCard: HTMLDivElement, memoObjId: number) {
  memoCard.classList.add("checked");
  memoCardState[memoObjId].match = true;
  memoryGame.children[memoCurrent.currentNode].children[0].classList.add(
    "match"
  );
  memoCard.children[0].classList.add("match");
  memoCurrent.check = false;
  memoCurrent.currentCard = "";
  memoCurrent.currentNode = 0;
  memoCardState[memoObjId].match = true;
  gameStats.matchCount++;
  gameOver();
}
function checkIfDoesntMatch(
  memoCard: HTMLDivElement,
  memoBack: HTMLDivElement
) {
  memoCard.classList.add("checked");
  setTimeout(() => {
    memoCard.classList.remove("checked");
    memoryGame.children[memoCurrent.currentNode].classList.add("checked");
    memoryGame.children[memoCurrent.currentNode].classList.remove("checked");
    memoBack.classList.remove("checked");
    memoCurrent.check = false;
    memoCurrent.currentCard = "";
    memoCurrent.currentNode = 0;
  }, 1000);
}
function checkIfSameCard(memoBack: HTMLDivElement) {
  setTimeout(() => {
    memoryGame.children[memoCurrent.currentNode].classList.add("checked");
    memoryGame.children[memoCurrent.currentNode].classList.remove("checked");
    memoBack.classList.remove("checked");
    memoCurrent.check = false;
    memoCurrent.currentCard = "";
    memoCurrent.currentNode = 0;
  }, 1000);
}
function memoCheck(card: string) {
  for (let x: number = 0; x < 12; x++) {
    if (memoCardState[x].cardSlots.includes(card)) {
      return x;
    }
  }
}

function displayTime() {
  gameStats.timerInterval = setInterval(() => {
    gameOver();
    console.log("clear");
    if (gameStats.time > 0) {
      gameStats.time--;
    }
    timer.innerHTML = `Time: 
    ${gameStats.time}`;
  }, 1000);
}
function gameOver() {
  if (gameStats.matchCount < 8 && gameStats.time === 0) {
    gameLose();
  } else if (gameStats.matchCount === 8) {
    gameWin();
  }
}
function gameLose() {
  memoLose.showModal();
  for (let x: number = 0; x < 16; x++) {
    memoryGame.children[x].classList.remove("checked");
    memoryGame.children[x].children[0].classList.remove("match");
    memoryGame.children[x].children[0].children[1].className = "card_back";
  }
  clearInterval(gameStats.timerInterval);
}
function gameWin() {
  console.log("lol");
  memoWin.showModal();
  for (let x: number = 0; x < 16; x++) {
    memoryGame.children[x].classList.remove("checked");
    memoryGame.children[x].children[0].classList.remove("match");
    memoryGame.children[x].children[0].children[1].className = "card_back";
  }
  clearInterval(gameStats.timerInterval);
}
replayWin.addEventListener("click", () => {
  replay();
  memoWin.close();
});
replayLose.addEventListener("click", () => {
  replay();
  memoLose.close();
});
function replay() {
  memoID = memoIdFill();
  resetMemoObj();
  resetMemoCurrent();
  resetGameStats();
  timer.innerHTML = "Time: 100";
  totalMoves.innerHTML = "Moves: 0";
  addRandomCard();
}
function resetGameStats() {
  gameStats.time = 100;
  gameStats.moves = 0;
  gameStats.gameStart = false;
  gameStats.timerInterval = 0;
  gameStats.matchCount = 0;
  gameStats.cardOrder = [];
  gameStats.cardOrder = memoRandomizer();
}
function resetMemoCurrent() {
  memoCurrent.check = false;
  memoCurrent.currentCard = "";
  memoCurrent.currentNode = 0;
}
function resetMemoObj() {
  memoCardState.forEach((index) => {
    index.currentCard = "";
    index.currentNode = 0;
    index.check = false;
    index.match = false;
  });
}
function memoIdFill() {
  return Array(16)
    .fill(1)
    .map((_, index: number) => index + 0);
}
function memoRandomizer() {
  return Array(16)
    .fill("memo_card_")
    .map((index: string) => index + randomCard());
}

function randomCard() {
  const card: number = Math.floor(Math.random() * memoID.length);
  return memoID.splice(card, 1);
}
function addRandomCard() {
  for (let x: number = 0; x < 16; x++) {
    memoryGame.children[x].children[0].children[1].classList.add(
      gameStats.cardOrder[x]
    );
  }
}
