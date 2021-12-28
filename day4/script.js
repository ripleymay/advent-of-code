/* --- Day 4: Giant Squid ---
You're already almost 1.5km (almost a mile) below the surface of the ocean, already so deep that you can't see any sunlight. What you can see, however, is a giant squid that has attached itself to the outside of your submarine.

Maybe it wants to play bingo?

Bingo is played on a set of boards each consisting of a 5x5 grid of numbers. Numbers are chosen at random, and the chosen number is marked on all boards on which it appears. (Numbers may not appear on all boards.) If all numbers in any row or any column of a board are marked, that board wins. (Diagonals don't count.)

The submarine has a bingo subsystem to help passengers (currently, you and the giant squid) pass the time. It automatically generates a random order in which to draw numbers and a random set of boards (your puzzle input). For example:

7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
After the first five numbers are drawn (7, 4, 9, 5, and 11), there are no winners, but the boards are marked as follows (shown here adjacent to each other to save space):

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
After the next six numbers are drawn (17, 23, 2, 0, 14, and 21), there are still no winners:

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
Finally, 24 is drawn:

22 13 17 11  0         3 15  0  2 22        14 21 17 24  4
 8  2 23  4 24         9 18 13 17  5        10 16 15  9 19
21  9 14 16  7        19  8  7 25 23        18  8 23 26 20
 6 10  3 18  5        20 11 10 24  4        22 11 13  6  5
 1 12 20 15 19        14 21 16 12  6         2  0 12  3  7
At this point, the third board wins because it has at least one complete row or column of marked numbers (in this case, the entire top row is marked: 14 21 17 24 4).

The score of the winning board can now be calculated. Start by finding the sum of all unmarked numbers on that board; in this case, the sum is 188. Then, multiply that sum by the number that was just called when the board won, 24, to get the final score, 188 * 24 = 4512.

To guarantee victory against the giant squid, figure out which board will win first. What will your final score be if you choose that board?
*/

const nums = require('./nums');

const fs = require('fs');
const input = fs.readFileSync("/Users/ripleymay/Code/advent-of-code/day4/input.txt", 'utf-8');
const boardStrs = input.split(/\n\n/);

let boards = [];
boardStrs.forEach(b => boards.push(b.split(/[\s\n]/).filter(num => num)));

const winCombos = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24]  
]
let winner = [];
let winNum = null;

let i = 0;
while (!winner.length && i < nums.length) {
    let n = nums[i];
    boards.forEach(function(board) {
        board.forEach(function(slot, idx) {
            if (parseInt(slot) === n) board[idx] = 'm' + slot;
        });
        checkWin(board, n);
    });
    i++;
}

function checkWin(board, num) {
    winCombos.forEach(function(combo) {
        let win = true;
        combo.forEach(function(idx) {
            if (!board[idx].includes('m')) win = false;
        });
        if (win && !winner.length) {
            winner = [...board];
            winNum = num;
        }
    });
}

function findTotal(board, num) {
    let unmarked = board.filter(n => !n.includes('m'));
    let unmarkedSum = unmarked.reduce((acc, num) => acc + parseInt(num), 0); 
    return unmarkedSum * num;
}

console.log('first winning score is ', findTotal(winner, winNum));
// answer is 89001


/* --- Part Two ---
On the other hand, it might be wise to try a different strategy: let the giant squid win.

You aren't sure how many bingo boards a giant squid could play at once, so rather than waste time counting its arms, the safe thing to do is to figure out which board will win last and choose that one. That way, no matter which boards it picks, it will win for sure.

In the above example, the second board is the last to win, which happens after 13 is eventually called and its middle column is completely marked. If you were to keep playing until this point, the second board would have a sum of unmarked numbers equal to 148 for a final score of 148 * 13 = 1924.

Figure out which board will win last. Once it wins, what would its final score be?
*/

let lastWinner = [];
let lastWinNum = null;

for(j = 0; j < nums.length; j++) {
    let n = nums[j];
    boards.forEach(function(board) {
        board.forEach(function(slot, idx) {
            if (parseInt(slot) === n) board[idx] = 'm' + slot;
        });
        checkLastWin(board, n);
    });
}

function checkLastWin(board, num) {
    if (!board.includes('w')) {
        winCombos.forEach(function (combo) {
            let win = true;
            combo.forEach(function (idx) {
                if (!board[idx].includes('m')) win = false;
            });
            if (win) {
                lastWinner = [...board];
                lastWinNum = num;
                board.push('w');
            }
        });
    }
}

lastWinner.pop(); // to remove the w flag
console.log('last winning score is ', findTotal(lastWinner, lastWinNum));
// answer is 7296