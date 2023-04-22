//helper function
function getExpectedScore(player1, player2) {
    return 1 / (1 + Math.pow(10, (player2 - player1) / 400));
}

//helper function
function getRatingChange(player1, player2, outcome, kValue) {
    // const kValue = 50 //Scales the elo gains/losses
    const expectedScore = getExpectedScore(player1, player2);
    const actualScore = outcome ? 1 : 0;
    const ratingChange = kValue * (actualScore - expectedScore);
    return Math.round(ratingChange);
}

/*
player1Elo int
player2Elo int
outcome boolean
player1kValue float
player2kValue float

player1kValue & player2kValue optional for friendly (no value) & global
*/
function updateRatings(player1Elo, player2Elo, outcome, player1kValue = 50, player2kValue = 50) {
    const player1RatingChange = getRatingChange(player1Elo, player2Elo, outcome, player1kValue);
    const player2RatingChange = getRatingChange(player2Elo, player1Elo, !outcome, player2kValue);

    return [player1Elo+player1RatingChange, player2Elo+player2RatingChange];
}
