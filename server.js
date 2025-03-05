
const deck = [];
const playerHand = [];
const houseHand = [];
let betAmount = 0;
let totalMoney = 0;

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
}

//Create cards and add them to deck
function initDeck(){

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

//Give the player and dealer 5 cards from the deck
function initHands(){

    for(let i = 0; i < 5; i++){
        let playerCard = deck.shift(); playerHand.push(playerCard);
        let houseCard = deck.shift(); houseHand.push(houseCard);
    }
}

//Print the player hand
function printPlayerHand(){
    for(let i = 0; i < 5; i++){
        let cardValue = playerHand[i].getValue();
        //print 1,11,12,13 as A,K,Q,J
        switch(playerHand[i].getValue()){
            case 1:
                cardValue = "A";
                break;
            case 11:
                cardValue = "J";
                break;
            case 12:
                cardValue = "Q";;
                break;
            case 13:
                cardValue = "K"
        }
        console.log(cardValue, playerHand[i].getSuit());
    }
}

//Print the house hand
function printHouseHand(){
    for(let i = 0; i < 5; i++){
        let cardValue = houseHand[i].getValue();
        //print 1,11,12,13 as A,K,Q,J
        switch(houseHand[i].getValue()){
            case 1:
                cardValue = "A";
                break;
            case 11:
                cardValue = "J";
                break;
            case 12:
                cardValue = "Q";;
                break;
            case 13:
                cardValue = "K"
        }
        console.log(cardValue, houseHand[i].getSuit());
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

    if(isRoyalFlush(dict)){
        console.log("Player has a Royal Flush");
        return 23;
    }   
    else if(isStraightFlush(dict)){
        console.log("Player has straight flush");
        return 22;
    }
    else if(isQuads(dict)){
        console.log("Player has four of a kind / quads");
        return 21;
    }
    else if(isFullHouse(dict)){
        console.log("Player has Full House");
        return 20;
    }
    else if(isFlush(dict)){
        console.log("Player has a flush");
        return 19;
    }
    else if(isStraight(dict)){
        console.log("Player has a straight");
        return 18;
    }
    else if(isThreeKind(dict)){
        console.log("Player has three of a kind");
        return 17;
    }    
    else if(isTwoPair(dict)){
        console.log("Player has two pair");
        return 16;
    }
    else if(isPair(dict)){
        console.log("Player has pair");
        return 15;
    }  
    else{
        console.log("Player has high card");
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

//Check that cards are 10,J,Q,K,A all of the same suit
function isRoyalFlush(dict){
        
    return (Object.keys(dict)[4] == 13 && 
    Object.keys(dict)[3] == 12 && 
    Object.keys(dict)[2] == 11 && 
    Object.keys(dict)[1] == 10 && 
    Object.keys(dict)[0] == 1 &&
    isFlush(dict));
}

//If cards are both straight and flush, then we have straight flush
function isStraightFlush(dict){
    return (isFlush(dict) && isStraight(dict));
}

//Check to see if we got 4 cards of the same value
function isQuads(dict){
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 4){
            return true;
        }
    }
    return false;
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
    return (dict["Hearts"] == 5 || dict["Diamonds"] == 5 || dict["Spades"] == 5 || dict["Clubs"] == 5);
}

//Check and see if we have a straight
function isStraight(dict){

    //This is the case of the Ace high straight that is not a royal flush
    if(Object.keys(dict)[4] == 13 && 
    Object.keys(dict)[3] == 12 && 
    Object.keys(dict)[2] == 11 && 
    Object.keys(dict)[1] == 10 && 
    Object.keys(dict)[0] == 1){
        return true;
    }

    for(let i = 0; i < 4; i++){
        if(parseInt(Object.keys(dict)[i])+1 != parseInt(Object.keys(dict)[i+1])){
            return false;
        }
    }
    return true;
}

//Check to see if we have 3 cards of the same value
function isThreeKind(dict){
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 3){
            return true;
        }
    }
    return false;
}

//Check and see if we have two pairs
function isTwoPair(dict){
    let pairCounter = 0;
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 2){
            pairCounter++;
        }
    }

    if(pairCounter == 2)
        return true;

    return false;
}

//Check to see if we have a pair
function isPair(dict){
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        if(dict[Object.keys(dict)[i-1]] == 2){
            return true;
        }
    }
    return false;
}

initDeck();
 rigDeck(2, "H", 0);
 rigDeck(2, "S", 2);
 rigDeck(2, "C", 4);
 rigDeck(3, "H", 6);
 rigDeck(3, "C", 8);

initHands();
let strength = calculateHandStrength(playerHand);
printPlayerHand();
//console.log(dict);
console.log("Strength: ", strength);