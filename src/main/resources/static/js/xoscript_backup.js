//I've tried to explain each JavaScript line with comments....Hope you'll understand

//selecting all required elements
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
// allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button"),
historyBoard = document.querySelector(".history-board"),
historyResult = document.querySelector(".history-result");

var allBox;
var historyPlay = [];
var loadedData;
var winCondition = [];
var boardSize = 0;

window.onload = ()=>{ //once window loaded
    // for (let i = 0; i < allBox.length; i++) { //add onclick attribute in all available span
    //    allBox[i].setAttribute("onclick", "clickedBox(this)");
    // }

}

function renderPlayBoard(){
    // alert(boardSize);
    // iterate board
    var count = 0; // To number cells
    var list = ''; // Use string to store appended values

    var winConditionCross = [];
    var winConditionCrossReverse = [];

    for (var row = 0; row < boardSize; row++) {
        list += "<section>";

        var winConditionLineVertical = [];
        var winConditionLineHorizontal = [];
        
        for (var col = 0; col < boardSize; col++) {
            count++;
            // list += "<div class='cell' row=" + "'" + row + "' col='" + col + "'>" + count + "</div>";
            var boxNoAttr = "'" + "box" + count + "'" ;
            var coorAttr = "'(" + row + "," + col + ")'" ;
            list += "<span class=" + boxNoAttr + " coor=" + coorAttr + "></span>";

            var coor = "(" + row + "," + col + ")" ;
            var coorReverse = "(" + col + "," + row + ")" ;
            // collect win condition line vertical \
            winConditionLineVertical.push(coor);
            // collect win condition line horizontal \
            winConditionLineHorizontal.push(coorReverse);
            // collect win condition cross \
            if(row == col){
                winConditionCross.push(coor);
            }
            // collect win condition cross /
            if(row + col == boardSize - 1){
                winConditionCrossReverse.push(coor);
            }
        }
        list += "</section>";

        winCondition.push({
            listWinCon : winConditionLineVertical,
        });
        winCondition.push({
            listWinCon : winConditionLineHorizontal,
        });
        
    }
    winCondition.push({
        listWinCon : winConditionCross,
    });
    winCondition.push({
        listWinCon : winConditionCrossReverse,
    });

    for(let index = 0 ; index < winCondition.length ; index++){
        console.log(JSON.stringify(winCondition[index]));
    }

    // alert(list);
    var playArea = document.querySelector(".play-area");
    // alert(playArea.innerHTML);
    playArea.innerHTML = list;

    // set onclick fn
    allBox = document.querySelectorAll("section span");
    for (let i = 0; i < allBox.length; i++) { //add onclick attribute in all available span
        allBox[i].setAttribute("onclick", "clickedBox(this)");
     }
}

selectBtnX.onclick = ()=>{
    boardSize = document.querySelector("#boardSize").value;
    console.log(boardSize);
    if(boardSize < 3){
        alert('Please fill board size more than 3')
    }else{
        renderPlayBoard();
        selectBox.classList.add("hide"); //hide select box
        playBoard.classList.add("show"); //show the playboard section
    }

}

selectBtnO.onclick = ()=>{ 
    boardSize = document.querySelector("#boardSize").value;
    console.log(boardSize);
    if(boardSize < 3){
        alert('Please fill board size more than 3')
    }else{
        renderPlayBoard();
        selectBox.classList.add("hide"); //hide select box
        playBoard.classList.add("show"); //show the playboard section
        players.setAttribute("class", "players active player"); //set class attribute in players with players active player values
    }
    
}

let playerXIcon = "fas fa-times"; //class name of fontawesome cross icon
let playerOIcon = "far fa-circle"; //class name of fontawesome circle icon
let playerSign = "X"; //this is a global variable beacuse we've used this variable inside multiple functions
let runBot = true; //this also a global variable with boolen value..we used this variable to stop the bot once match won by someone or drawn

let playerMove = [];
let botMove = [];

// user click function
function clickedBox(element){
    // console.log(element);
    
    if(players.classList.contains("player")){
        // collect history
        historyPlay.push("Player O -> " + element.getAttribute("coor"));
        playerMove.push(element.getAttribute("coor"));

        playerSign = "O"; //if player choose (O) then change playerSign to O
        element.innerHTML = `<i class="${playerOIcon}"></i>`; //adding circle icon tag inside user clicked element/box
        players.classList.add("active"); //add active class in players
        element.setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
    }else{
        // collect history
        historyPlay.push("Player X -> " + element.getAttribute("coor"));
        playerMove.push(element.getAttribute("coor"));

        element.innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag inside user clicked element/box
        players.classList.add("active"); //add active class in players
        element.setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
    }
    // console.log(historyPlay);
    selectWinner('Player'); //caliing selectWinner function
    element.style.pointerEvents = "none"; //once user select any box then that box can'be clicked again
    playBoard.style.pointerEvents = "none"; //add pointerEvents none to playboard so user can't immediately click on any other box until bot select
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); //generating random number so bot will randomly delay to select unselected box
    setTimeout(()=>{
        bot(runBot); //calling bot function
    }, randomTimeDelay); //passing random delay value
}

// bot auto select function
function bot(){
    let array = []; //creating empty array...we'll store unclicked boxes index
    if(runBot){ //if runBot is true
        playerSign = "O"; //change the playerSign to O so if player has chosen X then bot will O
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){ //if the box/span has no children means <i> tag
                array.push(i); //inserting unclicked boxes number/index inside array
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; //getting random index from array so bot will select random unselected box
        if(array.length > 0){ //if array length is greater than 0
            if(players.classList.contains("player")){ 
                // collect history
                historyPlay.push("Bot X -> " + allBox[randomBox].getAttribute("coor"));
                botMove.push(allBox[randomBox].getAttribute("coor"));

                playerSign = "X"; //if player has chosen O then bot will X
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`; //adding cross icon tag inside bot selected element
                players.classList.remove("active"); //remove active class in players
                allBox[randomBox].setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
            }else{
                // collect history
                historyPlay.push("Bot O -> " + allBox[randomBox].getAttribute("coor"));
                botMove.push(allBox[randomBox].getAttribute("coor"));

                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`; //adding circle icon tag inside bot selected element
                players.classList.remove("active"); //remove active class in players
                allBox[randomBox].setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
            }
            // console.log(historyPlay);
            selectWinner('Bot'); //calling selectWinner function
        }
        allBox[randomBox].style.pointerEvents = "none"; //once bot select any box then user can't click on that box
        playBoard.style.pointerEvents = "auto"; //add pointerEvents auto in playboard so user can again click on box
        playerSign = "X"; //if player has chosen X then bot will be O right then we change the playerSign again to X so user will X because above we have changed the playerSign to O for bot
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id; //return id value
}
function checkIdSign(val1, val2, val3, sign){ //checking all id value is equal to sign (X or O) or not if yes then return true
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function selectWinner(currentChecker){ 

    var paramMove;
    if(currentChecker == 'Bot'){
        paramMove = botMove;
    }else if(currentChecker == 'Player'){
        paramMove = playerMove;
    }else{
        alert('selectWinner Error');
    }
    console.log(paramMove);

    //if the one of following winning combination match then select the winner
    // if(checkIdSign(1,2,3,playerSign) || checkIdSign(4,5,6, playerSign) || checkIdSign(7,8,9, playerSign) || 
    // checkIdSign(1,4,7, playerSign) || checkIdSign(2,5,8, playerSign) || checkIdSign(3,6,9, playerSign) || 
    // checkIdSign(1,5,9, playerSign) || checkIdSign(3,5,7, playerSign)){
    if(checkWinCondition(paramMove)){
        console.log("checkWinCondition : true" );
        runBot = false; //passing the false boolen value to runBot so bot won't run again
        bot(runBot); //calling bot function
        setTimeout(()=>{ //after match won by someone then hide the playboard and show the result box after 700ms
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700); //1s = 1000ms
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`; //displaying winning text with passing playerSign (X or O)
        printHistoryResult();
        
    }else{ //if all boxes/element have id value and still no one win then draw the match
        console.log("checkWinCondition : false -> draw" );
        // if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" 
        // && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" 
        // && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != ""){
        if(checkAllboxSelected()){
            runBot = false; //passing the false boolen value to runBot so bot won't run again
            bot(runBot); //calling bot function
            setTimeout(()=>{ //after match drawn then hide the playboard and show the result box after 700ms
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700); //1s = 1000ms
            wonText.textContent = "Match has been drawn!"; //displaying draw match text
            printHistoryResult();
        }
    }
}

replayBtn.onclick = ()=>{
    historyPlay = [];
    window.location.reload(); //reload the current page on replay button click
}

function printHistoryResult(){
    // let historyResult = document.querySelector(".history-result");
    // console.log(historyResult);
    let formattedData = "<b>History Played</b>" + "<br>";

    historyPlay.forEach((data,index) => {
        // console.log(index);
        formattedData += data + "<br>";
    });
    console.log(formattedData);
    historyResult.innerHTML = formattedData;

    // call fn save to db
    saveToDB();

}

function saveToDB(){

    // var name=document.getElementById("name").value;
    // var address= document.getElementById("address").value;
    // var age= document.getElementById("age").value;

    // $.ajax({
    //     type:"GET",
    //     url:"http://hostname/projectfolder/webservicename.php?callback=jsondata&history_data="+historyPlay,
    //     crossDomain:true,
    //     dataType:'jsonp',
    //     success: function jsondata(data)
    //         {

    //             var parsedata=JSON.parse(JSON.stringify(data));
    //             var logindata=parsedata["Status"];

    //             if("sucess"==logindata)
    //             {   
    //                 alert("success");
    //             }
    //             else
    //             {
    //                 alert("failed");
    //             }
    //         }  
    //     }); 

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + '/' + time;

    // (B) STORE IN LOCAL STORAGE
    // Note: JSON encode
    localStorage.setItem("History:"+dateTime, JSON.stringify(historyPlay));
    
    // (C) RETRIEVE
    // Note: JSON decode
    loadedData = localStorage.getItem("History:"+dateTime);
    loadedData = JSON.parse(loadedData);
    console.log('new loadedData'+loadedData);

}

function renderHistoryBoard(){
    // let historyBoard = document.querySelector(".history-board");
    // console.log(historyBoard);

    // let formattedData = "<b>History Board</b>" + "<br>";
    let formattedData = '';

    for (var i = 0; i < localStorage.length; i++) {
        
        let tempHeadder;
        let tempData;

        tempHeadder = localStorage.key(i);
        console.log('key[' + i + '] : ' + tempHeadder);
        tempData = JSON.parse(localStorage.getItem(tempHeadder));
        console.log('tempData[' + i + '] : ' + tempData);
        
        formattedData += tempHeadder + "<br>"
        tempData.forEach((data,index) => {
            // console.log(index);
            formattedData += data + "<br>";
        });
        formattedData += "<br>";
        
    }
    console.log(formattedData);
    
    // set data to div
    historyBoard.innerHTML = formattedData;
}

function clearHistoryBoard(){
    localStorage.clear();
    historyBoard.innerHTML = '';
    alert("History clear.")
}

function checkWinCondition(listMove){
    let resultBoolean = false;

    // console.log('listMove : ' + listMove);
    // console.log('botMove : ' + botMove);
    // console.log(JSON.stringify(winCondition));
    
    for(let i = 0 ; i < winCondition.length ; i++){
        var num = 0;
        if(listMove.length >= boardSize){
            for(let j = 0 ; j < listMove.length ; j++){
                if(winCondition[i].listWinCon.includes(listMove[j].toString())){
                    num++;
                }
            }
            if(num >= boardSize){
                console.log('rtn true : ' + num);
                resultBoolean = true;
            }
        }
    }

    return resultBoolean;
}

function checkAllboxSelected(){
    // console.log('boardSize : ' + boardSize);

    let checked = true;
    for(let index = 1 ; index <= boardSize*boardSize ; index++){
        
        if(getIdVal(index) != ""){
            checked &= true;
        }else{
            checked &= false;
        }
    }

    // console.log('checked : ' + checked);
    return checked;
}