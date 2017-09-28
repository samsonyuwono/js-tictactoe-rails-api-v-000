const win_combinations=
[[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

var turn = 0


function board(){
  var tableData = window.document.querySelectorAll('td');
  var arr = [];
  for(var i= 0; i < tableData.length; i++){
    arr.push(tableData[i].innerHTML);
  }
  return arr
}

var player = function(){
  return turn % 2 === 0 ? "X" : "O"
}

var updateState = function(position){
  $(position).html(player())
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
