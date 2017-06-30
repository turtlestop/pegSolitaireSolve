//variables
var globMoves = []
var redoMoves = []
var playing = false;
var board = []
var globheight = 0
var globwidth = 0
var globcut = 0
globBlank = []


test_board = [
          [ 1, 1, 1 ],
          [ 1, 1, 1 ],
    [ 1, 1, 1, 1, 1, 1, 1 ],
    [ 1, 1, 1, 0, 1, 1, 1 ],
    [ 1, 1, 1, 1, 1, 1, 1 ],
          [ 1, 1, 1 ],
          [ 1, 1, 1 ] ]

//GameBoard is a constructor used to build an empty board
function GameBoard (height, width,cut){
      //store the four parameters that define a board
      this.height = height;
      this.width = width;
      this.cut = cut

      //use them to create an array to represent the state of the board.
      //first, create an empty board of the right shape
      this.boardArray = new Array(this.height);
      for (i=0; i<this.height; i++){
          if (i<this.cut || i>=(this.height-this.cut)) {this.boardArray[i] = new Array(this.width-2*cut)}
          else {this.boardArray[i] = new Array(this.width)}
        }

      //then fill it with zeros  i is y and j is x here!
      for (i=0;i<this.boardArray.length; i++){
        for (j=0; j<this.boardArray[i].length;j++){
          this.boardArray[i][j]=0}
        }}

//this is just a way to print the array to the console in a readable way for debugging
GameBoard.prototype.print = function() {
          array = []
          for (i=0; i<this.height; i++){
            var blanks = this.width - this.boardArray[i].length;
            array.push(" ".repeat(blanks) + this.boardArray[i])
          } return array
        }

//board is an array that stores the state of each element using its id.



////this is just a way to print the array to the console in a readable way for debugging
function globprint (board) {
          array2 = []
          for (var i=0; i<globheight; i++){
            var blanks = globwidth - board[i].length;
            array2.push(" ".repeat(blanks) + board[i])
          }
          console.log(array2)
          console.log(" ")
        }

//this function runs when the newgame button is pressed: create a new game object usng the
//parameters set by the form
function newGame() {
    var height = parseInt(document.getElementById("height").value);
    var width = parseInt(document.getElementById("width").value);
    var cut = parseInt(document.getElementById("cut").value);
    var blanktile = parseInt(document.getElementById("blank").value)

    //create new game object, then export the parameters to global variables.
    var game = new GameBoard(height,width,cut)
    board = game.boardArray
    globheight = height
    globwidth = width
    globcut = cut
    console.log(game.print())

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight
    var cellWidth = Math.min(windowWidth/2,windowHeight/2)/width


    //loop through the created array to make visible board on page
    var boardWrapper = document.getElementById("boardWrapper");
    	for (var i = 0; i<height; i++){
      	var row = document.createElement("div");
      	row.class = "row"
      	for (var j=0; j<game.boardArray[i].length; j++){
      		var col = document.createElement("div");
      	 	col.style["display"] = "inline-block";
      	 	col.style["width"] = cellWidth + "px";
      	 	col.style["height"] = cellWidth + "px";
      	 	col.style["border"] = "2px solid black";
      	  col.style["color"] = "#2C9090";
          col.style["cursor"] = "pointer";
          //give each square a number that identifies it and ties it to an address in the board array
          // i = row; j = column *in array*
          col.id = i*width+j
          col.className="E"
          col.onmouseover=function(){this.style["background-color"]= "darkslategrey"}
          col.onmouseout=function(){colorState(this)}
          col.onclick=function(){mover(this)};
	        row.appendChild(col)}
      	boardWrapper.appendChild(row)}

    //replace initial button with an instruction
    var instructions = document.getElementById("instructions");
    var oldbutton = document.getElementById("button");
    var buttonDiv = document.getElementById("buttonWrapper")
    buttonDiv.removeChild(oldbutton)

    //add instructions to the instructions div
    var centerMessage = document.createTextNode("Click on a box to indicate which tile should be left blank:")
    instructions.style.fontSize = "20px";
    instructions.style["font-weight"] = "bold";
    var messageWrap = document.createElement("div");
    messageWrap.id = "msg"
    messageWrap.appendChild(centerMessage);
    var instructionDiv = document.getElementById("instructions")
    instructionDiv.appendChild(messageWrap);

    //add an "empty board" and "newboard" button

   if (blanktile == 1){
      var centerx = Math.floor((globwidth/2))
      var centery = Math.floor((globheight/2))
      var centerAd = [centery,centerx]
      globBlank = centerAd
      populate(centerAd)
    }

  }
  //^^end of the newGame function

/*Each box is associated with *THREE* addresses. For example, in the following picture:
  1 2 3 4 5 6 7 8 9
1       x x x
2       x x x
3       x @ x
4 x x x x x x x x x

@ has the address:
  (1) array[2][1] = array[i,j] = y-1, x-4
  (2) intuitive: [5,3] = (x,y)
  (3) index = i*width+j = 2*9+1= 19

I'm going to write six functions to translate between these:
adArrayToIndex x
adIndexToArray x

adIntuitToIndex
adIndextoIntuit

adIntuittoArray x
adArrayToIntuit x

NOTE: We'll also need further functions that takes a clicked box as input and returns an address in a given format
*/

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

//tests:

function getValue2 (board,arrayAd) {
    if (board[arrayAd[0]]){return board[arrayAd[0]][arrayAd[1]]}}

function setValue2 (board, arrayAd, value) {
  board[arrayAd[0]][arrayAd[1]] = value
  }


function getValue (array) {
  // console.log("getValue(" + array + ") = " + board[array[0]][array[1]]);
  return board[array[0]][array[1]]}

function setValue (array, value) {
  // console.log("setValue: " + array);
  board[array[0]][array[1]] = value}


//address converter functions

function adBoxToIndex (box) {return box.id}

//colorState runs onmouseout
function colorState(box){
  // console.log("running mouseout")
  adBoxIndex = box.id
  var adArray = adIndexToArray(adBoxIndex)
  if (getValue(adArray) == 0){console.log("val: " + adArray + ": " + getValue(adArray));
  box.style["background-color"] = "white"}
  else if (getValue(adArray) == 2) {box.style["background-color"] = "lightsalmon"}
  else {box.style["background-color"] = "teal"}
  }

//the first time this function runs, it should create a blank and make the rest of
//the tiles inhabitted

//modes: 0 = empty array, choose an empty spot (this is for customizing where the empty
// tile is.)
//        1 = choose a first peg
//        2 = choose a second peg

function mover (box){
  if (mode == 0) {
    var id = box.id
    var arrAd = adIndexToArray(id)
    populate(arrAd)}
  else if (mode == 1) {firstpeg(box)}
  else if (mode == 2){secondpeg(box)}}

    //remove instructions

function replaceInstruction (newMsg){
  var msg = document.getElementById("msg");
  var instructions = document.getElementById("instructions");

  instructions.removeChild(msg);

  var firstmove = document.createElement("div");
  firstmove.id = "msg";
  var firstmovetext = document.createTextNode(newMsg)
  firstmove.appendChild(firstmovetext);
  instructions.appendChild(firstmove);
}

function populate(arrAd) {
  //if we got here automatically, we need to use ArrAd to identify a DOM square
  var adBlankBoxArray = arrAd
  var adBlankBoxIndex = adArrayToIndex(arrAd)
  var box = document.getElementById(adBlankBoxIndex)
  console.log(box.id)
  var adBlankBoxArrayi = adBlankBoxArray[0]
  var adBlankBoxArrayj = adBlankBoxArray[1]
  box.className = "O"
  globBlank = adBlankBoxArray
  if (box.childNodes.length > 0){
    var pegimg = box.childNodes[0]
    box.removeChild(pegimg)
  }

  //change instruction message
    replaceInstruction("Now select which peg you'd like to move...")

    //change mode to 1 (waiting for first peg)
    mode = 1;

  for (var i=0;i<board.length; i++){
    for (var j=0; j<board[i].length;j++){
      if (j == adBlankBoxArrayj && i == adBlankBoxArrayi){board[i][j]= 0;}
      else {board[i][j]=1}
    }}

    console.log(board)

  var findO = document.getElementsByClassName("O")
  for (var i = 0; i < findO.length; i++) {
      findO[i].style.backgroundColor = "white";
      var current = findO[i];
      current.style.overflow = "hidden"
      current.setAttribute('height', '80%');
      current.setAttribute('width', '80%');
    }
  //reset the appearance of the board

  var findX = document.getElementsByClassName("E")
  for (var i = 0; i < findX.length; i++) {
      findX[i].style.backgroundColor = "teal";
      var current = findX[i];
      //current.className = "F"
      current.style.overflow = "hidden"
      if (current.childNodes.length == 0){
      var peg = document.createElement("img");
      peg.id = [current.id,1]
      peg.setAttribute('src', 'peg.png');
      peg.setAttribute('alt', 'na');
      peg.setAttribute('height', '80%');
      peg.setAttribute('width', '80%');
      current.appendChild(peg)}}

//add the computer panel buttons below the board
if (playing == false){
  var compPanel = document.getElementById("control")

  var undoDiv = document.createElement("div")
  undoDiv.id = "undoDiv"
  undoDiv.style.margin = "10px"

  var undoButton = document.createElement("button")
  undoButton.innerHTML = "Undo move!"
  undoButton.onclick = function(){undoMove()}
  undoDiv.appendChild(undoButton)

  var redoButton = document.createElement("button")
  redoButton.innerHTML = "Redo move!"
  redoButton.style.margin = "10px"
  redoButton.onclick = function(){redoMove()}
  undoDiv.appendChild(redoButton)

  var resetButton = document.createElement("button")
  resetButton.innerHTML = "Reset board"
  resetButton.style.margin = "10px"
  resetButton.onclick = function(){resetBoard()}
  undoDiv.appendChild(resetButton)

  var restartButton = document.createElement("button")
  restartButton.innerHTML = "Create New Board"
  restartButton.onclick = function() {location.reload()}
  resetButton.style.margin = "10px"
  undoDiv.appendChild(restartButton)

  compPanel.appendChild(undoDiv)

  var solveDiv = document.createElement("div")
  solveDiv.id = "solveDiv"
  solveDiv.style.margin = "10px"

  var solveText = document.createTextNode("Have the computer search for solutions. Warning! This might take some time -- the standard game has 2^45 possible states!")
  solveDiv.appendChild(solveText)

  var solveButtonDiv = document.createElement("div")
  solveButtonDiv.id = "solveButtonDiv"
  solveButtonDiv.style.margin = "10px"

  var solveButton = document.createElement("button")
  solveButton.innerHTML = "Solve the Board"
  solveButton.id = "solveButton"
  solveButton.onclick = function() {solveButtonScript()}
  solveButtonDiv.appendChild(solveButton)
  solveDiv.appendChild(solveButtonDiv)

  compPanel.appendChild(solveDiv)
}

  //compPanel.appendChild(resetDiv)}

  playing = true
    }

function resetBoard () {populate(globBlank)}

//board = new GameBoard(game.height, game.width, box.id, )
  var pegfrom = []
  var pegto = []

function firstpeg(box){
  var adfirstPegIndex = box.id
  var adFirstPegArray = adIndexToArray(adfirstPegIndex)
  var adFirstPegArrayi = adFirstPegArray[0]
  var adFirstPegArrayj = adFirstPegArray[1]
  if (board[adFirstPegArrayi][adFirstPegArrayj] == 0){replaceInstruction("There's no peg there! Try again.")}
  else if (board[adFirstPegArrayi][adFirstPegArrayj] == 1) {
  mode = 2
  pegfrom = adArrayToIntuit(adFirstPegArray)
  console.log("adFirstPegArray: " + adFirstPegArray)
  board[adFirstPegArrayi][adFirstPegArrayj] = 2;
  box.style.backgroundColor = "lightsalmon"

  replaceInstruction("Now choose where you'd like to move it")

}}

//need to validate the move: (1) pegto must be empty, (2) pegto and perfrom must be on same row
//or same column, and there can only be one square between them. (we've already checked that pegfrom
//has a peg)

//To make this easier, I'll make one more function: it takes an address in array form and returns the value
//in the board array

function getMiddle(fromIntuit,toIntuit){
  var midIntuit = []
  if (fromIntuit[0] == toIntuit[0]){
      midIntuit[0] = fromIntuit[0];
      midIntuit[1] = (fromIntuit[1]+toIntuit[1])/2}
  if (fromIntuit[1] == toIntuit[1]){
      midIntuit[1] = fromIntuit[1]
      midIntuit[0] = ((fromIntuit[0]+toIntuit[0])/2)}
      return midIntuit
}

function validateMove (arr1,arr2){
  //for checking same row/col, intuitive addresses are best. for checking emptiness, need array addresses
  var pegFromArray = arr1;
  var pegToArray = arr2;
  var pegToIntuit = adArrayToIntuit(pegToArray);
  var pegFromIntuit = adArrayToIntuit(pegFromArray);

  var mpegIntuit = getMiddle(pegFromIntuit,pegToIntuit)

  if (getValue(pegToArray) != 0) {replaceInstruction("There's already a peg there! Let's start again. Choose a peg to move."); return false}
  else if ((pegFromIntuit[0] != pegToIntuit[0]) && (pegFromIntuit[1] != pegToIntuit[1])) {replaceInstruction("Pegs can only move vertically or horizontally! Let's try again: choose a peg to move."); return false}
  else if ((Math.abs(pegFromIntuit[0] - pegToIntuit[0]) + Math.abs(pegFromIntuit[1] - pegToIntuit[1]))>2){replaceInstruction("You can only jump over one peg at a time! Let's try again: choose a peg to move."); return false}
  else if (getValue(adIntuitToArray(mpegIntuit)) != 1){replaceInstruction("You need to jump over a peg. Let's start again. Choose a peg to move."); return false}
  else {return true}
  }

function secondpeg(box){
  var toBoxIndex = box.id
  var toBoxArray = adIndexToArray(toBoxIndex)
  console.log('moving to ' + toBoxArray);
  var toBoxi = toBoxArray[0]
  var toBoxj = toBoxArray[1]
  //check
  var fromBoxArray = adIntuitToArray(pegfrom)
  console.log('moving from ' + fromBoxArray);
  // var fromBoxi = fromBoxArray[0]
  // var fromboxj = fromBoxArray[1]
  //console.log("move from " + x1 + "," + y1 + " to " + x2 "," + y2)
  //if the move is invalid, return to mode 1 and reset the selected tile
  if (!validateMove(fromBoxArray,toBoxArray)){
    console.log("invalid move. resetting oldpeg: " + pegfrom)
    mode=1
    setValue(fromBoxArray,1)

    var oldpegIndex = adArrayToIndex(fromBoxArray)

    var oldpeg = document.getElementById(oldpegIndex)
    oldpeg.style.backgroundColor = "teal"
  }
  //if the move is valid, change the instructions and run the boardMove function
  else {
    // pegto = adArrayToIntuit(toBoxArray)

    replaceInstruction("Moving from " + fromBoxArray + " to " + toBoxArray + "...")
    boardMove(fromBoxArray,toBoxArray)
}}

function boardMove(fromArray, toArray){
  console.log('Running boardMove; old board:');
  globprint(board)
  var fromIndex = adArrayToIndex(fromArray);
  var toIndex = adArrayToIndex(toArray);
  var fromIntuit = adArrayToIntuit(fromArray)
  var toIntuit = adArrayToIntuit(toArray)
  var midIntuit = getMiddle(fromIntuit,toIntuit);
  console.log("" + fromIntuit + "+" + toIntuit + "; mid: " + midIntuit);
  var midArray = adIntuitToArray(midIntuit);
  var midIndex = adIntuitToIndex(midIntuit)

  setValue(fromArray,0);
  setValue(toArray,1);
  setValue(midArray,0);

  var moveArray = [fromArray,midArray,toArray]
  globMoves.push(moveArray)

  //update the colors and pegs...
  var frompeg = document.getElementById(fromIndex);
  frompeg.style.backgroundColor = "white";
  var frompegimg = frompeg.childNodes[0];
  frompeg.removeChild(frompegimg)

  var midpeg = document.getElementById(midIndex);
  midpeg.style.backgroundColor = "white";
  var midpegimg = midpeg.childNodes[0];
  midpeg.removeChild(midpegimg)

  var topeg = document.getElementById(toIndex);
  topeg.style.backgroundColor = "teal";
  topeg.style.overflow = "hidden"
  var peg = document.createElement("img");
  peg.setAttribute('src', 'peg.png');
  peg.setAttribute('alt', 'na');
  peg.setAttribute('height', '80%');
  peg.setAttribute('width', '80%');
  topeg.appendChild(peg)
  //update the pegs...


  //update message
  replaceInstruction("Great move! Keep it up: choose another peg.")

  //update mode
  mode = 1;
}

function undoMove(){
  if (globMoves.length > 0){
    var lastMove = globMoves[(globMoves.length-1)]
    var lastMoveFArr = lastMove[0]
    var lastMoveMArr = lastMove[1]
    var lastMoveTArr = lastMove[2]

    console.log(lastMoveFArr + lastMoveTArr)

    var lastMoveFIndex = adArrayToIndex(lastMoveFArr)
    var lastMoveMIndex = adArrayToIndex(lastMoveMArr)
    var lastMoveTIndex = adArrayToIndex(lastMoveTArr)

    setValue(lastMoveFArr,1);
    setValue(lastMoveTArr,0);
    setValue(lastMoveMArr,1);

    //update the colors and pegs...
    var frompeg = document.getElementById(lastMoveFIndex);
    frompeg.style.backgroundColor = "teal";
    frompeg.style.overflow = "hidden"
    var peg1 = document.createElement("img");
    peg1.setAttribute('src', 'peg.png');
    peg1.setAttribute('alt', 'na');
    peg1.setAttribute('height', '80%');
    peg1.setAttribute('width', '80%');
    frompeg.appendChild(peg1)

    var midpeg = document.getElementById(lastMoveMIndex);
    midpeg.style.backgroundColor = "teal";
    midpeg.style.overflow = "hidden"
    var peg2 = document.createElement("img");
    peg2.setAttribute('src', 'peg.png');
    peg2.setAttribute('alt', 'na');
    peg2.setAttribute('height', '80%');
    peg2.setAttribute('width', '80%');
    midpeg.appendChild(peg2)

    var topeg = document.getElementById(lastMoveTIndex);
    var topegimg = topeg.childNodes[0];
    topeg.removeChild(topegimg)
    topeg.style.backgroundColor = "white";

    redoMoves.push(lastMove)
    globMoves.pop()
    //update the pegs...


    //update message
    replaceInstruction("Ok, undid a move")

    //update mode
    mode = 1;
}}

function redoMove(){
  if (redoMoves.length > 0){
    var lastMove = redoMoves[(redoMoves.length-1)]
    var lastMoveF = adArrayToIntuit(lastMove[0])
    var lastMoveT = adArrayToIntuit(lastMove[2])
    redoMoves.pop()
    boardMove(lastMoveF,lastMoveT)

    //update message
    replaceInstruction("Ok, redid a move")

    //update mode
    mode = 1;
}}

var deadEnds = 0
var solutions = []
var countmoves = 0
var visited = []
var choices = []
var deadEnds = 0
var solved = false
var seen = []

function copyBoard (board){
  var newboard = []
  for (var i=0; i<board.length; i++){
    newboard.push(board[i].slice(0))
  }
  return newboard
}

function boardCompMove (board,fromArray,midArray,toArray){

  var newboard = copyBoard(board)
  setValue2(newboard,fromArray,0);
  setValue2(newboard,toArray,1);
  setValue2(newboard,midArray,0);

  return newboard
}


console.log(test_board);

function compass (arrayAd){
  //[1,1] should return [[2,3],[3,3]]
  //return the possible moves from arrayAd

  board = test_board

  var NESW = []
  var x = arrayAd[0]
  var y = arrayAd[1]

  var E = [[x,y+1],[x,y+2]]
  if ([y+2]<board[x].length){NESW.push(E)}
  var W = [[x,y-1],[x,y-2]]
  if ([y-2]>=0){NESW.push(W)}

  var N1x = x - 1
  var N2x = x - 2
  if (N2x >=0){
  var N1y = y + (board[N1x].length - board[x].length)/2
  var N2y = y + (board[N2x].length - board[x].length)/2
  if ((N1y > 0 && N1y <= board[N1x].length) &&
     (N2y > 0 && N2y <= board[N2x].length)) {
       N = [[N1x, N1y], [N2x,N2y]];
       NESW.push(N)
     }}

   var S1x = x + 1
   var S2x = x + 2
   if (S2x < board.length){
   var S1y = y + (board[S1x].length - board[x].length)/2
   var S2y = y + (board[S2x].length - board[x].length)/2
   if ((S1y > 0 && S1y <= board[S1x].length) &&
      (S2y > 0 && S2y <= board[S2x].length)) {
        S = [[S1x, S1y], [S2x,S2y]];
        NESW.push(S)
      }}
    return NESW
    }

// takes a location and returns all possible moves from that location in the
// form: [location, mid, far]
function legalMoves (board,arrayAd){
  // why doesn't it return 1,1?
  var compassInt = compass(arrayAd)
  var lMoves = []
  for (var i=0; i<compassInt.length; i++){
    //we have an array of *directions* = arrays of squares [[N1,N2],.... for each one, see if it
    //(a) is inside the board (b) it has the right sequence of pegs
    var mid = compassInt[i][0]
    var far = compassInt[i][1]
    // console.log(arrayAd,mid,far);
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

// console.log('legalMoves for 1,1');
// console.log(legalMoves(test_board,[1,1]));

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


function solveButtonScript () {
  console.log("SOLVING!")
  var solveButton = document.getElementById("solveButton")
  var solveButtonDiv = document.getElementById("solveButtonDiv")
  solveButtonDiv.removeChild(solveButton)

  var solvingText = document.createTextNode("Thinking.... looked at 0 moves so far...");
  console.log("text: " + solvingText.nodeValue);
  // solvingText.className = "t"
  solvingText.id = "t"
  solveButtonDiv.appendChild(solvingText)
  var number = 12


  solve()
}

function check_if_board_solved (board){
  var moves = findMoves(board)
  if (moves.length == 0){
    var countpegs = 0
    for (var i=0; i<board.length; i++){
      for (var j=0; j<board[i].length; j++){
        if (board[i][j] == 1){countpegs++}
      }}
    if (countpegs == 1 & board[3][3] == 1){
      // Solution Found!
      return true}
    else {return false}
    }
  }

// algorithm: add all possible moves for each *level*. So we could just keep an
// array of possible first moves, replace that with a list of possible two-move games,
// etc.
//


function add_level (games_list){
  // want to take a list of [[list_of_moves], resulting_board] items, and return a new
  // list with (a) all of the new [[list_of_moves, resulting_board] reachable from them,
  // BUT none of the old games that are dead ends.
  new_games = []
  for (var i = 0; i<games_list.length; i++){
    old_board = games_list[i][1]
    oldgame_moves = games_list[i][0]
    new_moves = findMoves(old_board)
    if (new_moves.length>0){
    for (var j = 0; j<new_moves.length; j++){
      new_move = new_moves[j]
      // console.log('new_move: ' + new_move);
      this_oldgame_moves = oldgame_moves.slice()
      this_oldgame_moves.push(new_move)
      new_board = boardCompMove(old_board, new_move[0],new_move[1], new_move[2])

      if (seen_boards.indexOf(new_board) == -1){
        seen_boards.push(new_board)
        new_game = [this_oldgame_moves, new_board]
      if (check_if_board_solved(new_board)) {
        solved = true
        var text = document.getElementById("solveButtonDiv").childNodes[1]
        var soln = ""
        for (var i=0; i<choices.length; i++){soln += new_game[0][i] + ""}
        text.nodeValue = "DONE! Solution: " + soln;
        return}
      new_games.push(new_game)
    }}}}
    return new_games
}

// GLOBAL VARIABLES
var seen_boards = []
var initial_game = [[[], test_board]]
var solved = false
var solution = []
var init

function add_level_wrap (){
  initial_game = add_level(initial_game)
}

function solve (){
  count = 0
    while (solved == false){
      count ++;
      add_level_wrap()
      // setTimeout(function () {add_level_wrap()}, 5);
    }
    var choice = initial_game[0]
    var  soln = ""
    for (var i=0; i<choices.length; i++){soln += choices[i] + ""}
    text.nodeValue = "DONE! Solution: " + soln;
}
