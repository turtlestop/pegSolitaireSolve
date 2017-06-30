var globheight = 7
var globwidth = 7
var globcut = 2
var globBlank = [3,3]

var compBoard = new Array(globheight)
  for (i=0; i<globheight; i++){
    if (i<globcut || i>=(globheight-globcut)) {compBoard[i] = new Array(globwidth-2*globcut)}
    else {compBoard[i] = new Array(globwidth)}
  }

//then fill it with zeros  i is y and j is x here!
for (var i=0;i<compBoard.length; i++){
  for (var j=0; j<compBoard[i].length;j++){
    compBoard[i][j]=1}}

compBoard[globBlank[0]][globBlank[1]] = 0

function globprint (board) {
          array2 = []
          for (var i=0; i<globheight; i++){
            var blanks = globwidth - board[i].length;
            array2.push(" ".repeat(blanks) + board[i])
          }
          console.log(array2)
          console.log(" ")
        }

function getValue (arrayAd) {
  if (compBoard[arrayAd[0]]){return compBoard[arrayAd[0]][arrayAd[1]]}
  }

function setValue (array, value) {
  compBoard[array[0]][array[1]] = value}

function getValue2 (board,arrayAd) {
    if (board[arrayAd[0]]){return board[arrayAd[0]][arrayAd[1]]}}

function setValue2 (board, arrayAd, value) {
  //console.log(" " + arrayAd + " to " + value)
  board[arrayAd[0]][arrayAd[1]] = value
  //console.log("after:")
  //globprint(board)
  }

function adArrayToIndex (array){
  var index = 0
  index = (globwidth * array[0]) + array[1]
  return index}

function adIndexToArray (n){
  var adarray = []
  adarray[1] = n%globwidth
  adarray[0] = (n-adarray[1])/globwidth
  return adarray;
}

//this one's a bit tricky. need to keep track of the corner cuts
function adIntuitToArray (array){
  x=array[0]
  y=array[1]
  adarray = [y-1]
  if (y<=globcut){adarray[1] = (x-globcut)-1}
  else if (y>(globheight-globcut)){adarray[1] = (x-globcut)-1}
  else {{adarray[1] = x-1}}
  return adarray}

function adArrayToIntuit (array) {

  //given [6,1], it should give [5,7]
  var ari=array[0] //6
  var arj=array[1] //1

  var intuitArray = [];
  if (ari<globcut) {intuitArray[0] = (arj+globcut)+1;}
  else if (ari>((globheight-globcut)-1)){intuitArray[0] = (arj+globcut)+1}
  else {intuitArray[0] = arj+1}
  intuitArray[1] = ari+1;
  return intuitArray;
}

function adIntuitToIndex (array) {return adArrayToIndex(adIntuitToArray(array))}

function adIndexToIntuit (n) {return adArrayToIntuit(adIndexToArray(n))}

function boardMove (board,fromArray,midArray,toArray){

  newboard = board.slice(0)
  setValue2(newboard,fromArray,0);
  setValue2(newboard,toArray,1);
  setValue2(newboard,midArray,0);

  return newboard
}

var compBoard = new Array(globheight)
  for (var i=0; i<globheight; i++){
    if (i<globcut || i>=(globheight-globcut)) {compBoard[i] = new Array(globwidth-2*globcut)}
    else {compBoard[i] = new Array(globwidth)}
  }

//then fill it with zeros  i is y and j is x here!
for (var i=0;i<compBoard.length; i++){
  for (j=0; j<compBoard[i].length;j++){
    compBoard[i][j]=1}}

compBoard[globBlank[0]][globBlank[1]] = 0

//this is just to compute addresses. If they're not on the grid, running them through getValue returns undefined

function compass (arrayAd){

  intuitMid = adArrayToIntuit(arrayAd)
  var NESW = []
  var E2 = adIntuitToArray([(intuitMid[0]+2),intuitMid[1]])
  var E1 = adIntuitToArray([(intuitMid[0]+1),intuitMid[1]])
  var E = []

  E.push(E1)
  E.push(E2)

  var S1i = [intuitMid[0],intuitMid[1]+1]
  var S2i = [intuitMid[0],intuitMid[1]+2]
  var S1 = adIntuitToArray(S1i)
  var S2 = adIntuitToArray(S2i)
  var S = []
  S.push(S1)
  S.push(S2)

  var W2 = adIntuitToArray([(intuitMid[0]-2),intuitMid[1]])
  var W1 = adIntuitToArray([(intuitMid[0]-1),intuitMid[1]])
  var W = []
  W.push(W1)
  W.push(W2)

  var N2 = adIntuitToArray([(intuitMid[0]),intuitMid[1]-2])
  var N1 = adIntuitToArray([(intuitMid[0]),intuitMid[1]-1])
  var N = []
  N.push(N1)
  N.push(N2)

  NESW.push(N)
  NESW.push(E)
  NESW.push(S)
  NESW.push(W)
  return NESW
}

//takes a location and returns all possible moves from that location in the form:
//[location, mid, far]
function legalMoves (board,arrayAd){
  var intuitInt = adArrayToIntuit(arrayAd)
  var compassInt = compass(arrayAd)
  lMoves = []
  for (var i=0; i<compassInt.length; i++){
    //we have an array of *directions* = arrays of squares [[N1,N2],.... for each one, see if it (a) is inside the boarrd
    //(b) it has the right sequence of pegs
    var mid = compassInt[i][0]
    var far = compassInt[i][1]
    //this should only return if there are cells in the direction with the right pegs
    if (getValue2(board,arrayAd) == 1 && ((getValue2(board,far) == 0) && (getValue2(board,mid) == 1))){
      var longArray = []
      longArray[0] = arrayAd;
      longArray[1] = mid;
      longArray[2] = far;
      lMoves.push(longArray);}
    }
    return lMoves;

}

//takes a board array and finds all legal moves

function findMoves(array){
  boardMoves = []
  for (var i=0; i<array.length; i++){
    for (var j=0; j<(array[i].length); j++){
      if (legalMoves(array,[i,j]).length > 0) {
        for (var k=0; k<legalMoves(array,[i,j]).length; k++){
          boardMoves.push(legalMoves(array,[i,j])[k])
        }
      }
    }
  }
  return boardMoves
}

var deadEnds = 0
var solutions = []
var countmoves = 0
var visited = []
choices = []
deadEnds = 0

function solve(board){
  console.log("start")
  globprint(board)

  if (findMoves(board).length == 0){
    "no moves"
    var countpegs = 0
    for (var i=0; i<board.length; i++){
      for (var j=0; j<board[i].length; j++){
        if (board[i][j] == 1){countpegs++}
      }
    }
    if (countpegs == 1){
      var solved = choices.slice(0)
      solutions.push(solved)
      globprint(board)
      console.log("solved")
      return
    }
    else {deadEnds++;
    //globprint(board)
  }
  }

  else {
    var moves = findMoves(board)
    //console.log("found moves:")
    var arrayofboards = []
    console.log("boards after move to solve:")
    for (var i=0; i<moves.length;i++){
      var newboard = board.slice(0)
      var newResultingBoard = boardMove(newboard,moves[i][0],moves[i][1],moves[i][2])
      arrayofboards.push(newResultingBoard)
      globprint(newResultingBoard)}
      console.log("passing those to solve...")
    for (var i = 0; i<arrayofboards.length; i++){
      solve(arrayofboards[i])
    }}
    choices.pop()
}


test = [
  [ 0, 0, 0 ],
  [ 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 1, 0, 0, 0, 0, 0 ],
  [ 0, 0, 1, 0, 0, 0, 0 ],
  [ 1, 0, 0 ],
  [ 0, 0, 0 ] ]

//solve(test)


var moves1 = findMoves(test)

var test2 = boardMove (test,moves1[1][0],moves1[1][1],moves1[1][2])
console.log("test2:")
globprint(test2)

//solve(test2)

var movestest = findMoves(test2)
console.log("moves: " + movestest.length)
console.log(movestest[0])
console.log(movestest[1])

console.log("check input...")
globprint(test2)

var copy1 = test2
var copy2 = test2

console.log("cop1 before move:");
globprint(copy1)
var newcopy1 = copy1

//var movedcopy = boardMove(newcopy1,movestest[0][0],movestest[0][1],movestest[0][2])
console.log("cop1 after move:");
console.log(copy1)

console.log("cop2 before move:");
globprint(copy2)
var moved = boardMove(copy2,movestest[0][0],movestest[0][1],movestest[0][2])
console.log("cop2 after move:");
globprint(copy2)
/*
movestestArray = []
for (var i=0; i<movestest.length; i++){
  console.log("move " + i)


  var moved = boardMove(copar[i],movestest[i][0],movestest[i][1],movestest[i][2])
  movestestArray.push(moved)
  console.log("after move:")
  globprint(moved)
}
console.log("test2")
globprint(test2)

console.log("copy1")
globprint(copy1)

console.log("copy2")
globprint(copy2)


var result = boardMove(test2, movestest[1][0],movestest[1][1],movestest[1][2])
globprint(result)
*/
