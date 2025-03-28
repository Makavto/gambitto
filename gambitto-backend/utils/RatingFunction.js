const DAY_MS = 24 * 60 * 60 * 1000;
const C = 0.5;
const Q = 0.00057565;

module.exports = function countPlayersRating(playerA, playerB, result) {
  const now = Date.now();

  function calculateNewRd(rd, lastGameDate) {
    if (!lastGameDate) return 350;
    const tau = 0.5;
    const timeDiff =
      (new Date(now) - new Date(lastGameDate)) / (1000 * 60 * 60 * 24);
    return Math.sqrt(rd ** 2 + tau ** 2 * timeDiff);
  }

  function glickoRating(rating, rd, opponentRating, opponentRd, score) {
    const q = Math.log(10) / 400;

    function g(rd) {
      return 1 / Math.sqrt(1 + (3 * q ** 2 * rd ** 2) / Math.PI ** 2);
    }

    function expectedScore(r, ro, rd) {
      return 1 / (1 + 10 ** ((-g(rd) * (r - ro)) / 400));
    }

    let gOpponent = g(opponentRd);
    let eOpponent = expectedScore(rating, opponentRating, opponentRd);
    let d2 = 1 / (q ** 2 * gOpponent ** 2 * eOpponent * (1 - eOpponent));
    let delta = (q / (1 / rd ** 2 + 1 / d2)) * gOpponent * (score - eOpponent);
    let newRd = Math.sqrt((1 / rd ** 2 + 1 / d2) ** -1);
    let newRating = rating + delta;

    return { newRating, newRd, delta };
  }

  const newRDPlayerA = calculateNewRd(playerA.rd, playerA.lastGame);
  const newRDPlayerB = calculateNewRd(playerB.rd, playerB.lastGame);

  const newPlayerA = glickoRating(
    playerA.rating,
    newRDPlayerA,
    playerB.rating,
    newRDPlayerB,
    result
  );
  const newPlayerB = glickoRating(
    playerB.rating,
    newRDPlayerB,
    playerA.rating,
    newRDPlayerA,
    Math.abs(result - 1)
  );

  return [
    {
      rating: newPlayerA.newRating,
      rd: newPlayerA.newRd,
      delta: newPlayerA.delta,
    },
    {
      rating: newPlayerB.newRating,
      rd: newPlayerB.newRd,
      delta: newPlayerB.delta,
    },
  ];
};
