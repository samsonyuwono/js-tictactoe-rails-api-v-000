$(document).ready(function(){
  attachListeners()
})

var games = [];
var win_combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
var turn = 0;
var gameID = null;

function board(){
  var tableData = window.document.querySelectorAll('td');
  var arr = [];
  for(var i= 0; i < tableData.length; i++){
    arr.push(tableData[i].innerHTML);
  }
  return arr;
}

var player = function(){
  return turn % 2 === 0 ? "X" : "O"
}

var updateState = function(position){
  if($(position).text() == ""){
    $(position).html(player())
    turn++
   }
  else{
    console.log("position taken!")
  }
}

function setMessage(string){
  $('div#message').html(string)
}

function checkWinner(){
  var currentBoard = board()
  for(i= 0; i < win_combinations.length; i++){
    var combo = win_combinations[i]
    if(currentBoard[combo[0]] == "X" && currentBoard[combo[1]] == "X" && currentBoard[combo[2]] == "X"){
      setMessage(`Player ${currentBoard[combo[0]]} Won!`)
      return true
    }
    else if (currentBoard[combo[0]] == "O" && currentBoard[combo[1]] == "O" && currentBoard[combo[2]] == "O") {
      setMessage(`Player ${currentBoard[combo[0]]} Won!`)
      return true;
    }
  }
  return false
}

function doTurn(position){
  updateState(position)
  if(checkWinner()){
    saveGame()
    resetBoard()
  }
  else if(turn === 9){
    setMessage("Tie game.")
    saveGame()
    resetBoard()
  }
}

function resetBoard(){
  $('td').empty()
  return turn = 0
}

function previousGames(){
   $.ajax({
       url: '/games',
       method: 'GET',
     }).done(function(games){

      var buttonsHTML = "";

      for(var i =0; i < games['data'].length; i++){
        var id = games['data'][i]['id'];
         buttonsHTML += `<button type="button" data-id="${id}" >` + id + "</button>"
      };
      $('div#games').html(buttonsHTML);
    }).then(function(){
      showGames()
    });
}

function showGames(){
   $('#games button').on('click', function(evt){
       gameID = this.dataset['id'];
       console.log(gameID)
       getGame(gameID)
    })
}

function getGame(id){
  $.ajax({
    url: '/games/' + id,
    method: 'GET',
  }).done(function(game){
    var board = game['data']['attributes']['state']
    var cells = $('td')
    for(var i= 0; i < board.length; i++){
      cells[i].innerHTML = board[i]
    }
  })
}

function saveGame(board){
    $.ajax({
      url: '/games',
      data: {state : board},
      method: 'POST',
      dataType: 'json'
    }).done(function(game){
      var id = game['data']['id']
      $('#games').append(`<button data-id="${id}">` + id + "</button>")
      gameID = parseInt(id);
      showGames();
    });
  }

function updateGame(state, id) {
  console.log(id)
  $.ajax({
    url: '/games/' + id,
    data: {state : board},
    method: 'PATCH',
    dataType: 'json'
  }).done(function(game){
    console.log('clicked')
  });
}

function attachListeners(){
  $('td').on('click', function(evt){
    if (!checkWinner()){
      doTurn(evt.target)
    }
  });
  $('#save').on('click', function(evt){
    if(gameID == null){
      saveGame(board());
    }else{
      updateGame(board(), gameID);
    }
  });
  $('#previous').on('click', function(){
    previousGames();
  });
  $('#clear').on('click', function(){
    resetBoard()
    gameID = null
  });
}
