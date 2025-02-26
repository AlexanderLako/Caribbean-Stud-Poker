
const deck = [];
const playerHand = [];
const houseHand = [];
let betAmount = 0;
let totalMoney = 0;

//Card object has a value and suit
function card(value, suit){
    let v = value;
    let s = suit;

    this.getValue = function(){
        return v;
    };

    this.getSuit = function(){
        return s;
    };
}

//Create cards and add them to deck
function initDeck(){

    //Create cards from 2-10 for each suit and add to deck
    for(let i = 2; i <= 10; i++){
        let newHeart = new card(i, "H");
        deck.push(newHeart);
        let newDiamond = new card(i, "D");
        deck.push(newDiamond);
        let newSpade = new card(i, "S");
        deck.push(newSpade);
        let newClub = new card(i, "C");
        deck.push(newClub);
    }

    //Add aces to deck
    let AH = new card("A", "H"); deck.push(AH);
    let AD = new card("A", "D"); deck.push(AD);
    let AS = new card("A", "S"); deck.push(AS);
    let AC = new card("A", "C"); deck.push(AC);

    //Add Kings to deck
    let KH = new card("K", "H"); deck.push(KH);
    let KD = new card("K", "D"); deck.push(KD);
    let KS = new card("K", "S"); deck.push(KS);
    let KC = new card("K", "C"); deck.push(KC);

    //Add Queens to deck
    let QH = new card("Q", "H"); deck.push(QH);
    let QD = new card("Q", "D"); deck.push(QD);
    let QS = new card("Q", "S"); deck.push(QS);
    let QC = new card("Q", "C"); deck.push(QC);

    //Add Jacks to deck
    let JH = new card("J", "H"); deck.push(JH);
    let JD = new card("J", "D"); deck.push(JD);
    let JS = new card("J", "S"); deck.push(JS);
    let JC = new card("J", "C"); deck.push(JC);

    //Once all cards added, shuffle deck
    shuffleDeck();
}

function initHands(){

    for(let i = 0; i < 5; i++){
        let playerCard = deck.pop(Math.floor(Math.random() * deck.length)); playerHand.push(playerCard);
        let houseCard = deck.pop(Math.floor(Math.random() * deck.length)); houseHand.push(houseCard);
    }
}

//Print the player hand
function printPlayerHand(){
    for(let i = 0; i < 5; i++){
        console.log(playerHand[i].getValue(), playerHand[i].getSuit())
    }
}

//Print the house hand
function printHouseHand(){
    for(let i = 0; i < 5; i++){
        console.log(houseHand[i].getValue(), houseHand[i].getSuit())
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

initDeck();
initHands();
printPlayerHand();