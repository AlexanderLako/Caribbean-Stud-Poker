
let deck = [];
let playerHand = [];
let houseHand = [];
let ante = 0;
let betAmount = 0;
let totalMoney = 1000;
document.getElementById('balance').innerHTML = ('Balance: $' + totalMoney);
document.getElementById('fold').disabled = true;
document.getElementById('bet').disabled = true;
document.getElementById('deal').disabled = false;

//Card object has a value and suit
function card(value, suit){
    let v = value;
    let s = suit;

    //Return card value
    this.getValue = function(){
        return v;
    };

    //Return suit of the card
    this.getSuit = function(){
        return s;
    };

    //Return the letter value if its J, Q, K, A
    this.getLetterValue = function(){
        switch(value){
            case 1:
                return "A";
            case 11:
                return "J";
            case 12:
                return "Q";
            case 13:
                return "K";
            default:
                return value;
        }  
    };
}

//Create cards and add them to deck
function initDeck(){

    //Set deck to empty
    deck = [];

    //Create cards from A(1)-K(13) for each suit and add to deck
    for(let i = 1; i <= 13; i++){
        let newHeart = new card(i, "H");
        deck.push(newHeart);
        let newDiamond = new card(i, "D");
        deck.push(newDiamond);
        let newSpade = new card(i, "S");
        deck.push(newSpade);
        let newClub = new card(i, "C");
        deck.push(newClub);
    }

    //Once all cards added, shuffle deck
    shuffleDeck();
}

//rigDeck takes value, suit, and deck position then switches the current card in position with the desired one
function rigDeck(value, suit, position){
    for(let i = 0; i < deck.length; i++){
        let existingCard = new card(deck[position].getValue(), deck[position].getSuit());

        //If we found our card, swap it with the one in our desired position, then assign our card to position
        if(deck[i].getSuit() == suit && deck[i].getValue() == value){
            let myCard = new card(deck[i].getValue(), deck[i].getSuit());
            deck[position] = myCard;
            deck[i] = existingCard;
            break;
        }
    }
}

//Shuffle deck using Fisher-Yates method
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let k = deck[i];
        deck[i] = deck[j];
        deck[j] = k;
    }
}

//Give the player and house 5 cards from the deck
function initHands(){

    //Sets hands to empty
    playerHand = [];
    houseHand = [];

    //Give player and house 5 cards each from the front of the deck
    for(let i = 0; i < 5; i++){
        let playerCard = deck.shift(); playerHand.push(playerCard);
        let houseCard = deck.shift(); houseHand.push(houseCard);
    }
}

//Calculate a hands strength by using a dictionary then return the hands strength
function calculateHandStrength(hand){
    
    let dict = {"Hearts":[0], "Diamonds":[0], "Spades":[0], "Clubs":[0]};

        //Increase dict card value by 1, or add it to the dict
        for(let i = 0; i < 5; i++){
            if(dict[hand[i].getValue()] == undefined){
                dict[hand[i].getValue()] = [1];
            }
            else{
                dict[hand[i].getValue()][0] += 1;
            }

            //If card is a suit, increase said suit
            switch(hand[i].getSuit()){
                case "H":
                    dict["Hearts"][0] += 1
                    break;
                case "D":
                    dict["Diamonds"][0] += 1;
                    break;
                case "S":
                    dict["Spades"][0] += 1;
                    break;
                case "C":
                    dict["Clubs"][0] += 1;
                    break;
            }
        }

    //Returns the strength by checking if the cards create a poker hand
    if(isRoyalFlush(dict)) return 133; //                        143
    else if(isStraightFlush(dict)) return isStraightFlush(dict); //Highest Card    127 - 142 (125)
    else if(isQuads(dict)) return isQuads(dict); //Highest card            111 - 126 (109)
    else if(isFullHouse(dict)) return isFullHouse(dict); //highest triple      95 - 110 (93)
    else if(isFlush(dict)) return isFlush(dict); //Highest card            79 - 94 (77)
    else if(isStraight(dict)) return isStraight(dict); //Highest card         63 - 78 (61)
    else if(isThreeKind(dict)) return isThreeKind(dict); //highest card        47 - 62 (45)
    else if(isTwoPair(dict)) return isTwoPair(dict); //highest pair          31-46 (29)
    else if(isPair(dict) != 0) return isPair(dict); //highest pair           15-30 (13)
    else{
        //Return the highest card as its strength
        if(Object.keys(dict)[0] == 1){return 14;}
        else{return Object.keys(dict)[Object.keys(dict).length-5];}
    }
        // let dict = new Map();
        // dict.set('Heart', 0);
        // dict.set('Diamond', 0);
        // dict.set('Spade', 0);
        // dict.set('Club', 0);


        // if (dict.get('two') == undefined){
        //     dict.set('two', 2);
        // }

        // dict.set('two', dict.get("two")+1)

        // console.log(dict.get('two'));

        // for(var key in dict){
        //     console.log(key);
        // }
}

//Check that cards are 10,J,Q,K,A all of the same suit
function isRoyalFlush(dict){
    if (Object.keys(dict)[4] == 13 && 
    Object.keys(dict)[3] == 12 && 
    Object.keys(dict)[2] == 11 && 
    Object.keys(dict)[1] == 10 && 
    Object.keys(dict)[0] == 1 &&
    isFlush(dict)){
        return 143;
    }
    return 0;
}

//If cards are both straight and flush, then we have straight flush
function isStraightFlush(dict){
    if(isFlush(dict) != 0 && isStraight(dict) != 0)
        return ((parseInt(isStraight(dict))-61)+125);

    return 0;
}

//Check to see if we got 4 cards of the same value
function isQuads(dict){
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 4){
            if(Object.keys(dict)[i-1] == 1){
                return (14 + 109);
            }
            return (parseInt(Object.keys(dict)[i-1]) + 109);
        }
    }
    return 0;
}

//Check to see if we have both three of a kind and a pair
function isFullHouse(dict){
    let sameThree = false;
    let sameTwo = false;
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 3){
            sameThree = true;
        }
        else if(dict[Object.keys(dict)[i-1]] == 2){
            sameTwo = true;
        }
    }
    return (sameThree && sameTwo);
}

//Check to see if all cards are of the same suit
function isFlush(dict){
    if(dict["Hearts"] == 5 || dict["Diamonds"] == 5 || dict["Spades"] == 5 || dict["Clubs"] == 5){
        if(Object.keys(dict)[0] == 1)
            return 14 + 77;
        return ((parseInt(Object.keys(dict)[Object.keys(dict).length-5]))+77);
    }
    return 0;
}

//Check and see if we have a straight
function isStraight(dict){

    //This is the case of the Ace high straight that is not a royal flush
    if(Object.keys(dict)[4] == 13 && 
    Object.keys(dict)[3] == 12 && 
    Object.keys(dict)[2] == 11 && 
    Object.keys(dict)[1] == 10 && 
    Object.keys(dict)[0] == 1){
        return 14 + 61;
    }

    for(let i = 0; i < 4; i++){
        if(parseInt(Object.keys(dict)[i])+1 != parseInt(Object.keys(dict)[i+1])){
            return 0;
        }
    }
    return ((parseInt(Object.keys(dict)[Object.keys(dict).length-5]))+61);
}

//Check to see if we have 3 cards of the same value
function isThreeKind(dict){
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 3){
            if(Object.keys(dict)[i-1] == 1){
                return (parseInt(Object.keys(dict)[i-1]) + 13 + 45);
            }
            return (parseInt(Object.keys(dict)[i-1]) + 45);
        }
    }
    return 0;
}

//Check and see if we have two pairs
function isTwoPair(dict){
    let pairCounter = 0;
    let highestPairValue = 0;
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 2){
            pairCounter++;
            if(Object.keys(dict)[i-1] == 1){
                highestPairValue = 14;
            }
            if(Object.keys(dict)[i-1] >= highestPairValue)
                highestPairValue = (parseInt(Object.keys(dict)[i-1]));
        }
    }
    if(pairCounter == 2){
        return (highestPairValue + 29);
    }
    return 0;
}

//Check to see if we have a pair
function isPair(dict){
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 2){
            if(Object.keys(dict)[i-1] == 1){
                return (parseInt(Object.keys(dict)[i-1]) + 13 + 13);
            }
            return (parseInt(Object.keys(dict)[i-1]) + 13);
        }
    }
    return 0;
}

function printStrength(name, strength){
    let elementId = name.toLowerCase() + 'Strength';
        if(strength == 143)
            document.getElementById(elementId).innerHTML = (name + " has a Royal Flush!");
        else if (strength >= 127 && strength <= 142)
            document.getElementById(elementId).innerHTML = (name + " has a Straight Flush! High card: " + printLetters((parseInt(strength)-125)));
        else if (strength >= 111 && strength <= 126)
            document.getElementById(elementId).innerHTML = (name + " has Quads! 4 of: " + printLetters((parseInt(strength)-109)));
        else if (strength >= 95 && strength <= 110)
            document.getElementById(elementId).innerHTML = (name + " has a Full House! Triple: " + printLetters((parseInt(strength)-93)));
        else if (strength >= 79 && strength <= 94)
            document.getElementById(elementId).innerHTML = (name + " has a Flush! Highest card: " + printLetters((parseInt(strength)-77)));
        else if (strength >= 63 && strength <= 78)
            document.getElementById(elementId).innerHTML = (name + " has a Straight! Highest card: " + printLetters((parseInt(strength)-61)));
        else if(strength >= 47 && strength <= 62)
            document.getElementById(elementId).innerHTML = (name + " has Three of a kind! Triple: " + printLetters((parseInt(strength)-45)));
        else if (strength >= 31 && strength <= 46)
            document.getElementById(elementId).innerHTML = (name + " has Two Pair! Highest pair: " + printLetters((parseInt(strength)-29)));
        else if(strength >= 15 && strength <= 30)
            document.getElementById(elementId).innerHTML = (name + " has a Pair of " + printLetters((parseInt(strength)-13)));
        else
            document.getElementById(elementId).innerHTML = (name + " has High Card: " + printLetters(strength));
}

//Returns 1,11,12,13,14 as A,J,Q,K,A
function printLetters(num){
    switch (String(num)){
        case "1":
            return "A";
        case "11":
            return "J";
        case "12":
            return "Q";
        case "13":
            return "K";
        case "14":
            return "A"
        default:
            return num;
    }
}

//Check if house has Ace King to qualify
function houseQualify(hand){
    foundAce = false;
    foundKing = false;
    for(let i = 0; i < 5; i++){
        if(hand[i].getValue() == 1){foundAce = true;}
        if(hand[i].getValue() == 13){foundKing = true;}
    }
    return (foundAce && foundKing);
}

//Based on player strength, see who wins
function calculateWinner(){

    let payout = 0;

    if(calculateHandStrength(playerHand) > calculateHandStrength(houseHand)){
        let winAmount = 0;

        if(calculateHandStrength(houseHand) > 14 || houseQualify(houseHand)){
            payout = payoffAmount(calculateHandStrength(playerHand));
            winAmount = ante + (betAmount*payout);
            setTimeout(function(){
                alert("Player won: $" + winAmount + "\n\n" + document.getElementById('playerStrength').innerHTML + "\n" + document.getElementById('houseStrength').innerHTML);
            }, 1000);
            
            totalMoney = totalMoney + ante + betAmount+ winAmount;
            document.getElementById('winner').innerHTML = ("Player Wins! House qualified");

        }
        else{
            winAmount = ante;
            setTimeout(function(){
                alert("Player won: $" + winAmount + "\n\n" + document.getElementById('playerStrength').innerHTML + "\n" + document.getElementById('houseStrength').innerHTML);
            }, 1000);
            
            totalMoney = totalMoney + ante + winAmount + betAmount;
            document.getElementById('winner').innerHTML = ("Player Wins! House did NOT qualify");
        }
        
        
        document.getElementById('balance').innerHTML = "Balance: $" + totalMoney;
    }
    else if(calculateHandStrength(playerHand) == calculateHandStrength(houseHand)){
        document.getElementById('winner').innerHTML = ("Its a tie!");
        totalMoney = totalMoney + ante + betAmount;
        document.getElementById('balance').innerHTML = "Balance: $" + totalMoney;
        setTimeout(function(){
            alert("Tie!" + "\n\n" + document.getElementById('playerStrength').innerHTML + "\n" + document.getElementById('houseStrength').innerHTML);
        }, 1000);
        
    }
        
    else if(calculateHandStrength(playerHand) < calculateHandStrength(houseHand)){
        document.getElementById('winner').innerHTML = ("House Wins!");
        document.getElementById('balance').innerHTML = "Balance: $" + totalMoney;
        setTimeout(function(){
            alert("House wins!" + "\n\n" + document.getElementById('playerStrength').innerHTML + "\n" + document.getElementById('houseStrength').innerHTML);
        }, 1000);
        
    }
    betAmount = 0;
}

function payoffAmount(strength){
    if(strength == 143)
        return 100;
    else if (strength >= 127 && strength <= 142)
        return 50;
    else if (strength >= 111 && strength <= 126)
        return 20;
    else if (strength >= 95 && strength <= 110)
        return 7;
    else if (strength >= 79 && strength <= 94)
        return 5;
    else if (strength >= 63 && strength <= 78)
        return 4;
    else if(strength >= 47 && strength <= 62)
        return 3;
    else if (strength >= 31 && strength <= 46)
        return 2;
    else if(strength >= 15 && strength <= 30)
        return 1;
    else
        return 1;
}

function initialDisplay(){
    for(let i = 0; i < 5; i++){
        let labelTag = 'PCard' + [i+1];
        let imageVal = playerHand[i].getLetterValue() + playerHand[i].getSuit()
        document.getElementById(labelTag).src = "media/" + imageVal + ".png";
    } 
    let imageValue = houseHand[0].getLetterValue() + houseHand[0].getSuit()
    document.getElementById('HCard1').src = "media/" + imageValue + ".png";
}


function printRemainingHouse(){
    for(let i = 1; i < 5; i++){
        let labelTag = 'HCard' + [i+1];
        let imageSrc = houseHand[i].getLetterValue() + houseHand[i].getSuit();
        document.getElementById(labelTag).src = "media/" + imageSrc + ".png";
    }

    let flipCounter = 0;

    document.querySelectorAll('.flipCard').forEach(card => {
        if(flipCounter >= 6){
            card.classList.toggle('flip');
        }
        flipCounter++;
    });
}

function deal(){

    ante = parseInt(document.getElementById('betAmount').value);

    document.getElementById('player').play();

    if(ante > 0 && ante*3 <= totalMoney){
        totalMoney = totalMoney - ante;
        document.getElementById('balance').innerHTML = "Balance: $" + totalMoney;
        document.getElementById('betAmount').disabled = true;
    
        initDeck();
        initHands();
        initialDisplay();
        printStrength('Player', calculateHandStrength(playerHand));
    
        document.getElementById('HCard2').src = "media/red_back.png";
        document.getElementById('HCard3').src = "media/red_back.png";
        document.getElementById('HCard4').src = "media/red_back.png";
        document.getElementById('HCard5').src = "media/red_back.png";
        document.getElementById('houseStrength').innerHTML = "House has ?";
        document.getElementById('winner').innerHTML = "Winner?";
        document.getElementById('bet').disabled = false;
        document.getElementById('fold').disabled = false;
        document.getElementById('deal').disabled = true;
    
        let counter = 0;
    
        document.querySelectorAll('.flipCard').forEach(card => {
            if(counter == 6) return;
            card.classList.toggle('flip');
            counter++;
        });
    }
    else{
        alert("Bet amount not valid");
        return;
    }
}

function bet(){

    document.getElementById('fold').disabled = true;
    document.getElementById('bet').disabled = true;
    document.getElementById('deal').disabled = true;
    document.getElementById('betAmount').disabled = true;

    betAmount =  ante * 2;
    totalMoney = totalMoney - betAmount;
    document.getElementById('balance').innerHTML = "Balance: $" + totalMoney;

    printStrength('House', calculateHandStrength(houseHand));
    printRemainingHouse();
    calculateWinner();

    setTimeout(function() {
        document.querySelectorAll('.flipCard').forEach(card => {
            card.classList.toggle('flip');
        });
        document.getElementById('playerStrength').innerHTML = "Player has ?";
        document.getElementById('houseStrength').innerHTML = "House has ?";
        document.getElementById('winner').innerHTML = "Winner?";

        document.getElementById('fold').disabled = true;
        document.getElementById('bet').disabled = true;
        document.getElementById('deal').disabled = false;
        document.getElementById('betAmount').disabled = false;
    }, 2000);
}

function fold(){

    document.getElementById('fold').disabled = true;
    document.getElementById('bet').disabled = true;
    document.getElementById('deal').disabled = true;
    document.getElementById('betAmount').disabled = true;

    printStrength('House', calculateHandStrength(houseHand));

    printRemainingHouse();

    setTimeout(function() {
        alert("Folded" + "\n\n" + document.getElementById('playerStrength').innerHTML + "\n" + document.getElementById('houseStrength').innerHTML);
    }, 2000);

    setTimeout(function() {
        document.querySelectorAll('.flipCard').forEach(card => {
            card.classList.toggle('flip');
        });
        document.getElementById('playerStrength').innerHTML = "Player has ?";
        document.getElementById('houseStrength').innerHTML = "House has ?";
        document.getElementById('winner').innerHTML = "Winner?";

        document.getElementById('fold').disabled = true;
        document.getElementById('bet').disabled = true;
        document.getElementById('deal').disabled = false;
        document.getElementById('betAmount').disabled = false;

    }, 2000);

    document.getElementById('winner').innerHTML = "Folded";
}

function reset(){

    totalMoney = 1000;
    document.getElementById('balance').innerHTML = "Balance: $" + totalMoney;

    document.getElementById('fold').disabled = true;
    document.getElementById('bet').disabled = true;
    document.getElementById('deal').disabled = false;
    document.getElementById('betAmount').disabled = false;

    document.getElementById('playerStrength').innerHTML = "Player has ?";
    document.getElementById('houseStrength').innerHTML = "House has ?";
    document.getElementById('winner').innerHTML = "Winner?";

    document.querySelectorAll('.flipCard.flip').forEach(card => {
        card.classList.toggle('flip');
    });
}

// initDeck();
//  rigDeck(2, "H", 0);
//  rigDeck(2, "S", 2);
//  rigDeck(2, "C", 4);
//  rigDeck(3, "H", 6);
//  rigDeck(3, "C", 8);