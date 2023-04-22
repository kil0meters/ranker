// Generator for robin function to generate pairs
function* uniqueCombinations(N: number): Generator<[number, number]> {
    let i = 0, j = 1;
    while (i < N - 1) {
        yield [i, j];
        j += 1;
        if (j === N) {
            i += 1;
            j = i + 1;
        }
    }
}
  
//Randomizes pairs 
function generateSeededRandomPairs(N: number, seed: number): number[][] {
    const random = new Random(seed);
    const indexes = Array.from({ length: N }, (_, i) => i);
    random.shuffle(indexes);
    const pairs = Array.from(uniqueCombinations(N));
    const shuffledPairs = pairs.map(pair => [indexes[pair[0]], indexes[pair[1]]]);
    random.shuffle(shuffledPairs); // Shuffle the list of index pairs
    return shuffledPairs;
}
  
function getPairByIndex(N: number, index: number): number[] {
    const seed = 42; //Arbitrary seed
    const totalPairs = N * (N - 1) / 2; //Equivilant of C(n,2)
    if (index < 0 || index >= totalPairs) {
        throw new Error("Index out of range");
    }
    const pairs = generateSeededRandomPairs(N, seed);
    return pairs[index];
}
  
class Random {
    private seed: number;
    constructor(seed: number) {
        this.seed = seed;
    }
  
    nextFloat(): number {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
  
    shuffle(array: any[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(this.nextFloat() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}
  
  