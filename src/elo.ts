//helper function
function getExpectedScore(player1: number, player2: number): number {
    return 1 / (1 + Math.pow(10, (player2 - player1) / 400));
}

//helper function
export function getRatingChange(player1: number, player2: number, outcome: boolean, kValue: number): number {
    // const kValue = 50 //Scales the elo gains/losses
    const expectedScore = getExpectedScore(player1, player2);
    const actualScore = outcome ? 1 : 0;
    const ratingChange = kValue * (actualScore - expectedScore);
    return Math.round(ratingChange);
}

//player1kValue & player2kValue optional for friendly (no value) & global
export function updateRatings(
    player1Elo: number,
    player2Elo: number,
    outcome: boolean,
    player1kValue: number = 50,
    player2kValue: number = 50
): [number, number] {

    const player1RatingChange = getRatingChange(player1Elo, player2Elo, outcome, player1kValue);
    const player2RatingChange = getRatingChange(player2Elo, player1Elo, !outcome, player2kValue);

    return [player1Elo + player1RatingChange, player2Elo + player2RatingChange];
}
