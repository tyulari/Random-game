const CARDS_ARRAY = document.querySelectorAll('.game_card');
const RESTART = document.querySelector('.restart');
const SEE_LEADERBOARD = document.querySelector('.see');
const CLOSE = document.querySelector('.close');
const LEADER_BOARD_DATA = document.querySelector('.leader_board_data');
//console.log(RESTART);
const SCORE = document.querySelector('#score');

const GAME_OVER_WIND = document.querySelector('.modal_window');
const LEADER_BOARD_WIND = document.querySelector('.leader_board');

const TURNOVERCARD = new Audio('assets/music/turnovercard.mp3');
const MATHCARD = new Audio('assets/music/cardMatch.mp3');
const NOTMATCH = new Audio('assets/music/error.mp3');
const GAME_OVER_SOUND = new Audio('assets/music/gameOver.mp3');
const SAVE_RESULT = document.querySelector('#input_form');

let LEADERS_BOARD = [];
//const PLAYER_NAME = new FormData('#input_form');


let isOpen = false;
let firstEl = null;
let secondEl = null;
let isNotActive = false;
let count = 0;
let attempt = 0;

window.onload = function (){
    setCardsOrder();
    loadLeaderboard();
}

SEE_LEADERBOARD.addEventListener('click', showResults);

function showResults(){
    LEADER_BOARD_WIND.classList.remove('disable');
    drawResults(LEADERS_BOARD);
}

RESTART.addEventListener('click', restart);

CLOSE.addEventListener('click', () => {
    LEADER_BOARD_DATA.innerHTML='';
    LEADER_BOARD_WIND.classList.add('disable');
})

CARDS_ARRAY.forEach(el => el.addEventListener('click', turnOver));

SAVE_RESULT.addEventListener('submit', setResult);

function loadLeaderboard(){
    if(localStorage){
        const savedScores = localStorage.getItem('leaderBoard');
       // console.log(savedScores);
       if(savedScores){
        LEADERS_BOARD = JSON.parse(savedScores);
       }
    }
    else{
        console.log('Local storage is empty...');
    }
};


function setResult(e){
    e.preventDefault();
    console.log('Save result...');

    const PLAYER_NAME = new FormData(SAVE_RESULT);
    //console.log(PLAYER_NAME);
    const player ={
        name:PLAYER_NAME.get('player'),
        attempt: attempt
    };

    updateBoard(player);

    GAME_OVER_WIND.classList.add('disable');
    LEADER_BOARD_WIND.classList.remove('disable');
    //console.log(player);
}

function updateBoard(player){
    console.log('update leader board');
    console.log(LEADERS_BOARD);
    if(LEADERS_BOARD.length < 10) {
        LEADERS_BOARD.push(player);
    }else{
        console.log('массив заполнен');
        if(LEADERS_BOARD[9].attempt > player.attempt){
            console.log('последний эл-т массива > текущего значения -> заменяем его')
            LEADERS_BOARD[9].name = player.name;
            LEADERS_BOARD[9].attempt = player.attempt;
            console.log(LEADERS_BOARD);
        }
    }

    //сортировка результатов
    LEADERS_BOARD.sort((a, b) => a.attempt - b.attempt);

    drawResults(LEADERS_BOARD);
   // console.log(LEADERS_BOARD);
   if(localStorage){
        localStorage.setItem('leaderBoard', JSON.stringify(LEADERS_BOARD))
   }
}

function drawResults(LEADERS_BOARD){
    console.log('draw results on leader board...');
    LEADERS_BOARD.map((el, i) => {
        const item = document.createElement('div');
        item.classList.add('item');
        const number = document.createElement('div');
        const player_name = document.createElement('div');
        const player_attempt = document.createElement('div');

        number.classList.add('number');
        player_name.classList.add('number');
        player_attempt.classList.add('number');

        number.innerHTML = i+1;
        player_name.innerHTML = LEADERS_BOARD[i].name;
        player_attempt.innerHTML = LEADERS_BOARD[i].attempt;

        item.appendChild(number);
        item.appendChild(player_name);
        item.appendChild(player_attempt);

        LEADER_BOARD_DATA.appendChild(item);

    })
}

function restart(){
    count = 0;
    attempt = 0;
    LEADER_BOARD_DATA.innerHTML='';

    GAME_OVER_WIND.classList.add('disable');
    LEADER_BOARD_WIND.classList.add('disable');

    setCardsOrder();
    refreshValue();
    CARDS_ARRAY.forEach(el => {
        el.classList.remove('open');
        el.addEventListener('click', turnOver);
    });
}

function setCardsOrder(){
    CARDS_ARRAY.forEach(el => {
        el.style.order = Math.floor(Math.random()*16);
    });
}

function turnOver(){
    console.log('turnOver()');
    if(firstEl == this) {return}
    if(isNotActive){return}
    TURNOVERCARD.play();
    attempt++;
    console.log(attempt);
    this.classList.toggle('open');

    if(isOpen){
        isOpen = false;
        secondEl = this;
        isMatch(firstEl, secondEl);
    }else{
        isOpen = true;
        firstEl = this;
    }

}

function isMatch(firstEl, secondEl){
    if(firstEl.dataset.description === secondEl.dataset.description){
        MATHCARD.play();
        firstEl.removeEventListener('click', turnOver);
        secondEl.removeEventListener('click', turnOver);
        count++;
        if(count === 8){
            //console.log("Game over!");
            //console.log('attempt = ${attempt}')
            GAME_OVER_SOUND.play();
            GAME_OVER_WIND.classList.toggle('disable');
            SCORE.innerHTML = attempt;
        }
        //add some sound
    }else{
       // NOTMATCH.play();
        isNotActive = true;

        setTimeout(() => {
            firstEl.classList.toggle('open');
            secondEl.classList.toggle('open');
            //isNotActive = false;
            refreshValue()
        }, 500);
        //add some sound
    }
}

function refreshValue(){
    isNotActive = false;
    isOpen = false;
    firstEl = null;
    secondEl = null;

}