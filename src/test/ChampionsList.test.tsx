import React from 'react';
import nock from 'nock';
import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library';
// this adds custom jest matchers from jest-dom
import 'jest-dom/extend-expect';
import ChampionsList from '../components/ChampionsList';
import championsMock from './champions-mock.json';
import winnersMock from './winners-mock.json';
// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

const championsNock = nock('http://ergast.com/api')
  .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
  .get('/f1/driverStandings/1.json')
  .query({
    limit: 11,
    offset: 55,
  });

const winnersNock = nock('http://ergast.com/api')
  .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
  .get('/f1/2005/results/1.json');

test('Renders ChampionsList correctly', async () => {
  const scope = championsNock.reply(200, championsMock);

  const { getByText, getAllByText } = render(<ChampionsList />);

  expect(getByText('Loading ...')).toBeInTheDocument();

  const champions = await waitForElement(() => getAllByText(/(200[5-9]|201[0-5])/));
  expect(champions.map(item => item.innerHTML)).toEqual([
    '2005 - Fernando Alonso',
    '2006 - Fernando Alonso',
    '2007 - Kimi Räikkönen',
    '2008 - Lewis Hamilton',
    '2009 - Jenson Button',
    '2010 - Sebastian Vettel',
    '2011 - Sebastian Vettel',
    '2012 - Sebastian Vettel',
    '2013 - Sebastian Vettel',
    '2014 - Lewis Hamilton',
    '2015 - Lewis Hamilton',
  ]);

  expect(() => getByText('Loading ...')).toThrow();
  scope.done();
});

test('Renders Error message', async () => {
  const scope = championsNock.reply(500, championsMock);

  const { getByText } = render(<ChampionsList />);

  const errorMessage = await waitForElement(() => getByText('Something went wrong ...'));

  expect(errorMessage).toBeInTheDocument();

  scope.done();
});

test('Loads Season Details on Row click', async () => {
  const championsScope = championsNock.reply(200, championsMock);
  const winnersScope = winnersNock.reply(200, winnersMock);

  const { getByText } = render(<ChampionsList />);

  const row = await waitForElement(() => getByText('2005 - Fernando Alonso'));
  fireEvent.click(row);

  await waitForElement(() => getByText('Grand Prix'));

  championsScope.done();
  winnersScope.done();
});
