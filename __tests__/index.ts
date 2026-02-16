import { describe, expect, test } from '@jest/globals';
import {
  otherPlayer,
  playerToString,
  scoreWhenDeuce,
  scoreWhenAdvantage,
  scoreWhenForty,
  scoreWhenPoint,
  score
} from '..';
import { advantage, deuce, forty, game, love, fifteen, thirty, points } from '../types/score';
import { Player } from '../types/player';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
    const result = scoreWhenDeuce('PLAYER_ONE');
    expect(result).toStrictEqual(advantage('PLAYER_ONE'));
  });

  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    const result = scoreWhenAdvantage('PLAYER_ONE', 'PLAYER_ONE');
    expect(result).toStrictEqual(game('PLAYER_ONE'));
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    const result = scoreWhenAdvantage('PLAYER_ONE', 'PLAYER_TWO');
    expect(result).toStrictEqual(deuce());
  });

  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    const fortyState = { player: 'PLAYER_ONE' as Player, otherPoint: thirty() };
    const result = scoreWhenForty(fortyState, 'PLAYER_ONE');
    expect(result).toStrictEqual(game('PLAYER_ONE'));
  });

  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    const fortyState = { player: 'PLAYER_ONE' as Player, otherPoint: thirty() };
    const result = scoreWhenForty(fortyState, 'PLAYER_TWO');
    expect(result).toStrictEqual(deuce());
  });

  test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
    const fortyState = { player: 'PLAYER_ONE' as Player, otherPoint: fifteen() };
    const result = scoreWhenForty(fortyState, 'PLAYER_TWO');
    expect(result).toStrictEqual(forty('PLAYER_ONE', thirty()));
  });

  // -------------------------TESTS POINTS-------------------------- //
  test('Given players at 0 or 15 points score kind is still POINTS', () => {
    const pointsState = { PLAYER_ONE: love(), PLAYER_TWO: fifteen() };
    const result = scoreWhenPoint(pointsState, 'PLAYER_ONE');
    expect(result).toStrictEqual(points(fifteen(), fifteen()));
  });

  test('Given one player at 30 and win, score kind is forty', () => {
    const pointsState = { PLAYER_ONE: thirty(), PLAYER_TWO: fifteen() };
    const result = scoreWhenPoint(pointsState, 'PLAYER_ONE');
    expect(result).toStrictEqual(forty('PLAYER_ONE', fifteen()));
  });
});
