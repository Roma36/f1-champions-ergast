import React from 'react';
import nock from 'nock';
import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library';
// this adds custom jest matchers from jest-dom
import 'jest-dom/extend-expect';
import WinnersList from '../components/WinnersList';
import winnersMock from './winners-mock.json';
// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

const champion = {
  code: 'ALO',
  dateOfBirth: '1981-07-29',
  driverId: 'alonso',
  familyName: 'Alonso',
  givenName: 'Fernando',
  nationality: 'Spanish',
  permanentNumber: '14',
  url: 'http://en.wikipedia.org/wiki/Fernando_Alonso',
};

const winnersNock = nock('http://ergast.com/api')
  .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
  .get('/f1/2005/results/1.json');

test('Renders WinnersList correctly', async () => {
  const scope = winnersNock.reply(200, winnersMock);

  const { getByText, getAllByText } = render(<WinnersList season="2005" champion={champion} />);

  expect(getByText('Loading ...')).toBeInTheDocument();

  const tableColumns = await waitForElement(() => getAllByText(/(Grand Prix|Date|Winner|Car|Laps|Time)/));
  expect(tableColumns.map(item => item.innerHTML)).toEqual(['Grand Prix', 'Date', 'Winner', 'Car', 'Laps', 'Time']);

  expect(() => getByText('Loading ...')).toThrow();
  scope.done();
});

test('Renders Error message', async () => {
  const scope = winnersNock.reply(500, winnersMock);

  const { getByText } = render(<WinnersList season="2005" champion={champion} />);

  const errorMessage = await waitForElement(() => getByText('Something went wrong ...'));

  expect(errorMessage).toBeInTheDocument();

  scope.done();
});

test("Highlights Champion's rows", async () => {
  const scope = winnersNock.reply(200, winnersMock);

  const { getAllByTestId } = render(<WinnersList season="2005" champion={champion} />);

  const allWins = await waitForElement(() => getAllByTestId('winnerRow'));

  const championWins = allWins.filter(win => {
    const driverName = win.querySelector('td:nth-child(3)') || ({} as any);
    return driverName.innerHTML === 'Fernando Alonso';
  });

  expect(championWins.length).toBe(7);

  scope.done();
});
