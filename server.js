
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
        console.log(houseHand[i].getValue(), houseHand[i].getSuit());
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

        for(let i = 0; i < 5; i++){
            if(dict[hand[i].getValue()] == undefined){
                dict[hand[i].getValue()] = [1];
            }
            else{
                dict[hand[i].getValue()][0] += 1;
            }

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
        return;
    }   
    else if(isStraightFlush(dict)){
        console.log("Player has straight flush");
        return;
    }
    else if(isQuads(dict)){
        console.log("Player has four of a kind / quads");
        //return;
    }
    else if(isFullHouse(dict)){
        console.log("Player has Full House");
        return;
    }
    else if(isFlush(dict)){
        console.log("Player has a flush");
        //return;
    }
    else if(isStraight(dict)){
        console.log("Player has a straight");
        return;
    }
    else if(isThreeKind(dict)){
        console.log("Player has three of a kind");
        return;
    }    
    else if(isTwoPair(dict)){
        console.log("Player has two pair");
        return;
    }
    else if(isPair(dict)){
        console.log("Player has pair");
        return;
    }  
    else{
        console.log("Player has nothing!");
        //return;
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





        

        console.log(dict);

        console.log(Object.keys(dict).length);

        // for(var key in dict){
        //     console.log(key);
        // }

        // if(dict["Hearts"] == 5 || dict["Diamonds"] == 5 || dict["Spades"] == 5 || dict["Clubs"] == 5){
        //     console.log("Player has a flush!");
        // }

    
        //Count suit amount
        //Count number of times number occurs

        //Organize the numbers from smallest to largest?
        
        
        
        
        
    }

function rigDeck(value, suit, position){
    for(let i = 0; i < deck.length; i++){
        let existingCard = new card(deck[position].getValue(), deck[position].getSuit());

        if(deck[i].getSuit() == suit && deck[i].getValue() == value){
            let myCard = new card(deck[i].getValue(), deck[i].getSuit());
            deck[position] = myCard;
            deck[i] = existingCard;
            break;
        }
    }
}

function isRoyalFlush(dict){
    return false;
}

function isStraightFlush(dict){
    return false;
}

function isQuads(dict){
    for(let i = Object.keys(dict).length-4; i > 0; i--){
        console.log("i: ", i);
        console.log(Object.keys(dict)[i-1])
        if(Object.keys(dict)[i-1][0] == 4){
            return true;
        }
    }
    return false;
}

function isFullHouse(dict){
    return false;
}

function isFlush(dict){
    if(dict["Hearts"] == 5 || dict["Diamonds"] == 5 || dict["Spades"] == 5 || dict["Clubs"] == 5)
        return true;
}

function isStraight(dict){
    return false;
}

function isThreeKind(dict){
    return false;
}

function isTwoPair(dict){
    return false;
}

function isPair(dict){
    return false;
}

initDeck();
rigDeck(1, "H", 0);
rigDeck(1, "D", 2);
rigDeck(1, "C", 4);
rigDeck(1, "S", 6);
rigDeck(5, "H", 8);

initHands();
calculateHandStrength(playerHand);
printPlayerHand();