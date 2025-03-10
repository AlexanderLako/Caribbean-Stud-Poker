
let deck = [];
let playerHand = [];
let houseHand = [];
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

//Give the player and dealer 5 cards from the deck
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

//Print the player hand
function printHand(hand){
    for(let i = 0; i < 5; i++){
        console.log(hand[i].getLetterValue(), hand[i].getSuit());
    }
}

function initialDisplay(){
    for(let i = 0; i < 5; i++){
        let labelTag = 'PCard' + [i+1];
        document.getElementById(labelTag).innerHTML = (playerHand[i].getLetterValue() + playerHand[i].getSuit());
    } 
    document.getElementById('HCard1').innerHTML = (houseHand[0].getLetterValue() + houseHand[0].getSuit());
}

function bet(){
    document.getElementById('fold').disabled = true;
    document.getElementById('bet').disabled = true;
    document.getElementById('deal').disabled = false;

    printStrength('House', calculateHandStrength(houseHand));

    printRemainingHouse();
    calculateWinner();
}

function fold(){
    document.getElementById('fold').disabled = true;
    document.getElementById('bet').disabled = true;
    document.getElementById('deal').disabled = false;

    printStrength('House', calculateHandStrength(houseHand));

    printRemainingHouse();
    calculateWinner();
}

function printRemainingHouse(){
    for(let i = 1; i < 5; i++){
        let labelTag = 'HCard' + [i+1];
        document.getElementById(labelTag).innerHTML = (houseHand[i].getLetterValue() + houseHand[i].getSuit());
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
    if(isRoyalFlush(dict)) return 23;
    else if(isStraightFlush(dict)) return 22;
    else if(isQuads(dict)) return 21;
    else if(isFullHouse(dict)) return 20;
    else if(isFlush(dict)) return 19;
    else if(isStraight(dict)) return 18;
    else if(isThreeKind(dict)) return 17; 
    else if(isTwoPair(dict)) return 16;
    else if(isPair(dict)) return 15;  
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
    return (pairCounter == 2);
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

//Based on player strength, see who wins
function calculateWinner(){
    if(calculateHandStrength(playerHand) > calculateHandStrength(houseHand))
        document.getElementById('winner').innerHTML = ("Player Wins!");
    else if(calculateHandStrength(playerHand) == calculateHandStrength(houseHand))
        document.getElementById('winner').innerHTML = ("Its a tie!");
    else if(calculateHandStrength(playerHand) < calculateHandStrength(houseHand))
        document.getElementById('winner').innerHTML = ("Dealer Wins!");
}

function printStrength(name, strength){
    let elementId = name.toLowerCase() + 'Strength';
    switch(strength){
        case 23:
            document.getElementById(elementId).innerHTML = (name + " has a Royal Flush!");
            break;
        case 22:
            document.getElementById(elementId).innerHTML = (name + " has a Straight Flush!");
            break;
        case 21:
            document.getElementById(elementId).innerHTML = (name + " has Quads!");
            break;
        case 20:
            document.getElementById(elementId).innerHTML = (name + " has a Full House!");
            break;
        case 19:
            document.getElementById(elementId).innerHTML = (name + " has a Flush!");
            break;
        case 18:
            document.getElementById(elementId).innerHTML = (name + " has a Straight!");
            break;
        case 17:
            document.getElementById(elementId).innerHTML = (name + " has Three of a kind!");
            break;
        case 16:
            document.getElementById(elementId).innerHTML = (name + " has Two Pair!");
            break;
        case 15:
            document.getElementById(elementId).innerHTML = (name + " has a Pair!");
            break;
        default:
            document.getElementById(elementId).innerHTML = (name + " has a High Card: " + strength);
            break;
    }
}

function deal(){
    initDeck();
    initHands();
    initialDisplay();
    printStrength('Player', calculateHandStrength(playerHand));

    document.getElementById('HCard2').innerHTML = "HCard2";
    document.getElementById('HCard3').innerHTML = "HCard3";
    document.getElementById('HCard4').innerHTML = "HCard4";
    document.getElementById('HCard5').innerHTML = "HCard5";
    document.getElementById('bet').disabled = false;
    document.getElementById('fold').disabled = false;
    document.getElementById('deal').disabled = true;
}


// initDeck();
//  rigDeck(2, "H", 0);
//  rigDeck(2, "S", 2);
//  rigDeck(2, "C", 4);
//  rigDeck(3, "H", 6);
//  rigDeck(3, "C", 8);

// initHands();
// initialDisplay();
// let playerStrength = calculateHandStrength(playerHand);
// let houseStrength = calculateHandStrength(houseHand);
// console.log("Player Hand: --------------------");
// printHand(playerHand);
// console.log("House Hand: --------------------");
// printHand(houseHand);
// //console.log(dict);
// console.log("Player Strength: ", playerStrength);
// unsure("Player", playerStrength);
// console.log("House Strength: ", houseStrength);
// unsure("House", houseStrength);
// calculateWinner();