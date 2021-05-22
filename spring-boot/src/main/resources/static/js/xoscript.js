//I've tried to explain each JavaScript line with comments....Hope you'll understand

//selecting all required elements
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
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
var isOver = false;

window.onload = ()=>{ //once window loaded

}

function renderPlayBoard(){
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
    
    if(isNaN(boardSize) || boardSize < 3 || boardSize > 9){
        if(boardSize < 3){
            alert('Please fill board size more than 3.');
        }if(boardSize > 9){
            alert('Please fill board size less than 9.');
        }else{
            alert('Please fill only number.');
        }
    }else{
        renderPlayBoard();
        selectBox.classList.add("hide"); //hide select box
        playBoard.classList.add("show"); //show the playboard section
    }
}

selectBtnO.onclick = ()=>{ 
    boardSize = document.querySelector("#boardSize").value;
    console.log(boardSize);

    if(isNaN(boardSize) || boardSize < 3 || boardSize > 9){
        if(boardSize < 3){
            alert('Please fill board size more than 3.');
        }if(boardSize > 9){
            alert('Please fill board size less than 9.');
        }else{
            alert('Please fill only number.');
        }
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
    if(isOver == false){
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
        selectWinner('Player',playerSign); //caliing selectWinner function
        element.style.pointerEvents = "none"; //once user select any box then that box can'be clicked again
        playBoard.style.pointerEvents = "none"; //add pointerEvents none to playboard so user can't immediately click on any other box until bot select
        let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); //generating random number so bot will randomly delay to select unselected box
        setTimeout(()=>{
            bot(runBot); //calling bot function
        }, 500); //passing random delay value
    }
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
            selectWinner('Bot',playerSign); //calling selectWinner function
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
function selectWinner(currentChecker,currentSign){ 

    var paramMove;
    if(currentChecker == 'Bot'){
        paramMove = botMove;
    }else if(currentChecker == 'Player'){
        paramMove = playerMove;
    }else{
        alert('selectWinner Error');
    }
    // console.log(paramMove);

    //if the one of following winning combination match then select the winner
    if(checkWinCondition(paramMove,currentSign)){
        console.log("checkWinCondition : true" );
        runBot = false; //passing the false boolen value to runBot so bot won't run again
        bot(runBot); //calling bot function
        setTimeout(()=>{ //after match won by someone then hide the playboard and show the result box after 700ms
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 500); //1s = 1000ms
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`; //displaying winning text with passing playerSign (X or O)
        printHistoryResult();
    }else{ //if all boxes/element have id value and still no one win then draw the match
        console.log("checkWinCondition : false -> draw" );
        if(checkAllboxSelected()){
            runBot = false; //passing the false boolen value to runBot so bot won't run again
            bot(runBot); //calling bot function
            setTimeout(()=>{ //after match drawn then hide the playboard and show the result box after 700ms
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 500); //1s = 1000ms
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
    let formattedData = "<b>History Played</b>" + "<br>";

    historyPlay.forEach((data,index) => {
        formattedData += data + "<br>";
    });
    // console.log(formattedData);
    historyResult.innerHTML = formattedData;

    // call fn save to db
    saveToDB();

}

function saveToDB(){

    var today = new Date();
    var year = today.getFullYear().toString();
    var month = today.getMonth().toString().length == 1 ? '0' + today.getMonth().toString() : today.getMonth().toString();
    var day = today.getDate().toString().length == 1 ? '0' + today.getDate().toString() : today.getDate().toString();
    var date = year + '-' + month + '-' + day;
    var hour = today.getHours().toString().length == 1 ? '0' + today.getHours().toString() : today.getHours().toString();
    var minute = today.getMinutes().toString().length == 1 ? '0' + today.getMinutes().toString() : today.getMinutes().toString();
    var second = today.getSeconds().toString().length == 1 ? '0' + today.getSeconds().toString() : today.getSeconds().toString();
    var time = hour + ":" + minute + ":" + second;
    var dateTime = date + '/' + time;

    // (B) STORE IN LOCAL STORAGE
    // Note: JSON encode
    localStorage.setItem("History:"+dateTime, JSON.stringify(historyPlay));
    
    // (C) RETRIEVE
    // Note: JSON decode
    // loadedData = localStorage.getItem("History:"+dateTime);
    // loadedData = JSON.parse(loadedData);
    // console.log('new loadedData'+loadedData);

    // pass variable to Spring boot // http://localhost:8080/historyPlayed?paramName=someValue
    $.ajax({
        type : "POST",
        url : "/SendHistoryPlay",
        data : {historyPlay:historyPlay},
        timeout : 100000,
        success : function(historyPlay) {
            console.log("SUCCESS: ", historyPlay);
            alert(historyPlay);
            alert(response);   
        },
        error : function(e) {
            console.log("ERROR: ", e);
            alert(e);
        },
        done : function(e) {
            console.log("DONE");
        }
    });

    // $.ajax({ 
    //     type : "GET", 
    //     url : "/SendHistoryPlay/" + historyPlay, 
    //     timeout : 100000, 
    //     success : function(historyPlay) { 
    //         console.log("SUCCESS: ", historyPlay); 
    //         alert(historyPlay); 
    //         alert(response); 
    //     }, 
    //    error : function(e) { 
    //         console.log("ERROR: ", e); 
    //         alert(e); 
    //    }, 
    //    done : function(e) { 
    //         console.log("DONE"); 
    //    } 
    // });

}

function renderHistoryBoard(){
    let formattedData = '';
    let listKey = [];

    for(let i = 0; i < localStorage.length; i++){
        listKey.push(localStorage.key(i));
    }
    console.log(listKey);
    listKey.sort();
    console.log(listKey);

    if(listKey.length > 0){
        for (let j = 0; j < localStorage.length; j++) {
            let tempHeadder;
            let tempData;
    
            tempHeadder = listKey[j];
            tempData = JSON.parse(localStorage.getItem(tempHeadder));
            
            formattedData += tempHeadder + "<br>"
            tempData.forEach((data,index) => {
                formattedData += data + "<br>";
            });
            formattedData += "<br>";
        }
        // console.log(formattedData);
        
        // set data to div
        historyBoard.innerHTML = formattedData;
    }else{
        alert('No history record.');
    }
    
}

function clearHistoryBoard(){
    localStorage.clear();
    historyBoard.innerHTML = '';
    alert("History clear.")
}

function checkWinCondition(listMove,sign){
    let resultBoolean = false;
    let alreadyWin;
    
    for(let i = 0 ; i < winCondition.length ; i++){
        var num = 0;
        if(listMove.length >= boardSize){
            for(let j = 0 ; j < listMove.length ; j++){
                if(winCondition[i].listWinCon.includes(listMove[j].toString())){
                    num++;
                }
            }
            if(num >= boardSize){ // match all win condition
                alreadyWin = winCondition[i].listWinCon;
                resultBoolean = true;

                // highlight win box
                var elms = document.querySelectorAll("[id='" +sign + "']");
                for(let k = 0 ; k < elms.length ; k++){
                    if(alreadyWin.includes(elms[k].getAttribute("coor"))){
                        console.log(elms[k].getAttribute("coor"));
                        elms[k].style.backgroundColor = 'lawngreen';
                    }
                }

                // set flag game over
                isOver = true;

                break;
            }
            
        }
    }

    // console.log('alreadyWin : ' + JSON.stringify(alreadyWin));
    // console.log('listCoor : ' + JSON.stringify(listCoor));

    return resultBoolean;
}

function checkAllboxSelected(){
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