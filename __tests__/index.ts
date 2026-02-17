import { describe, expect, test } from '@jest/globals';
import {
  otherPlayer,
  playerToString,
  pointToString,
  scoreToString,
  scoreWhenDeuce,
  scoreWhenAdvantage,
  scoreWhenForty,
  scoreWhenPoint,
  score,
  scoreWhenGame
} from '..';
import { advantage, deuce, forty, game, love, fifteen, thirty, points } from '../types/score';
import { Player } from '../types/player';

const players: Player[] = ['PLAYER_ONE', 'PLAYER_TWO'];

describe('Tests for tooling functions', () => {
  test('Given playerOne or playerTwo when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
    expect(playerToString('PLAYER_TWO')).toStrictEqual('Player 2');
  });

  test('Given playerOne or playerTwo when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
    expect(otherPlayer('PLAYER_TWO')).toStrictEqual('PLAYER_ONE');
  });
});

describe('Tests for display functions', () => {
  test('Given Point when pointToString', () => {
    expect(pointToString(love())).toStrictEqual('Love');
    expect(pointToString(fifteen())).toStrictEqual('15');
    expect(pointToString(thirty())).toStrictEqual('30');
  });

  test('Given Score when scoreToString', () => {
    // Points
    expect(scoreToString(points(love(), fifteen()))).toStrictEqual('Love - 15');
    expect(scoreToString(points(thirty(), love()))).toStrictEqual('30 - Love');

    // Forty
    expect(scoreToString(forty('PLAYER_ONE', thirty()))).toStrictEqual('40 - 30');
    expect(scoreToString(forty('PLAYER_TWO', fifteen()))).toStrictEqual('15 - 40');

    // Deuce
    expect(scoreToString(deuce())).toStrictEqual('Deuce');

    // Advantage
    expect(scoreToString(advantage('PLAYER_ONE'))).toStrictEqual('Advantage Player 1');
    expect(scoreToString(advantage('PLAYER_TWO'))).toStrictEqual('Advantage Player 2');

    // Game
    expect(scoreToString(game('PLAYER_ONE'))).toStrictEqual('Game Player 1');
    expect(scoreToString(game('PLAYER_TWO'))).toStrictEqual('Game Player 2');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
    players.forEach(winner => {
      expect(scoreWhenDeuce(winner)).toStrictEqual(advantage(winner));
    });
  });

  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    players.forEach(p => {
      expect(scoreWhenAdvantage(p, p)).toStrictEqual(game(p));
    });
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    players.forEach(p => {
      expect(scoreWhenAdvantage(p, otherPlayer(p))).toStrictEqual(deuce());
    });
  });

  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    players.forEach(p => {
      const fortyState = { player: p, otherPoint: thirty() };
      expect(scoreWhenForty(fortyState, p)).toStrictEqual(game(p));
    });
  });

  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    players.forEach(p => {
      const fortyState = { player: p, otherPoint: thirty() };
      expect(scoreWhenForty(fortyState, otherPlayer(p))).toStrictEqual(deuce());
    });
  });

  test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
    players.forEach(p => {
      const fortyState = { player: p, otherPoint: fifteen() };
      expect(scoreWhenForty(fortyState, otherPlayer(p))).toStrictEqual(
        forty(p, thirty())
      );
    });
  });


  test('Given players at 0 or 15 points score kind is still POINTS', () => {
    players.forEach(p => {
      // 0 -> 15
      expect(scoreWhenPoint({ PLAYER_ONE: love(), PLAYER_TWO: love() }, p)).toStrictEqual(
        p === 'PLAYER_ONE' ? points(fifteen(), love()) : points(love(), fifteen())
      );
      // 15 -> 30
      expect(scoreWhenPoint({ PLAYER_ONE: fifteen(), PLAYER_TWO: fifteen() }, p)).toStrictEqual(
        p === 'PLAYER_ONE' ? points(thirty(), fifteen()) : points(fifteen(), thirty())
      );
    });
  });

  test('Given one player at 30 and win, score kind is forty', () => {
    players.forEach(p => {
      const thirtyState = { PLAYER_ONE: thirty(), PLAYER_TWO: thirty() };
      expect(scoreWhenPoint(thirtyState, p)).toStrictEqual(
        forty(p, thirty())
      );
    });
  });

  test('Given game, score stays game', () => {
    players.forEach(winner => {
      const gameState = game(winner);
      // It doesn't matter who wins the next point, game is over
      expect(score(gameState, winner)).toStrictEqual(gameState);
      expect(score(gameState, otherPlayer(winner))).toStrictEqual(gameState);
    });
  });

  describe('Integration: global score function dispatch', () => {
    test('Given Points, score delegates to scoreWhenPoint', () => {
      const state = points(love(), love());
      expect(score(state, 'PLAYER_ONE')).toStrictEqual(points(fifteen(), love()));
    });
    test('Given Forty, score delegates to scoreWhenForty', () => {
      const state = forty('PLAYER_ONE', thirty());
      expect(score(state, 'PLAYER_ONE')).toStrictEqual(game('PLAYER_ONE'));
    });
    test('Given Deuce, score delegates to scoreWhenDeuce', () => {
      const state = deuce();
      expect(score(state, 'PLAYER_ONE')).toStrictEqual(advantage('PLAYER_ONE'));
    });
    test('Given Advantage, score delegates to scoreWhenAdvantage', () => {
      const state = advantage('PLAYER_ONE');
      expect(score(state, 'PLAYER_ONE')).toStrictEqual(game('PLAYER_ONE'));
    });
  });
});
