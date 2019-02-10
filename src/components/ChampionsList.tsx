import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { DriverInfo } from '../models';
import WinnersList from './WinnersList';
import styled from 'styled-components';
import Error from './Error';

const ToggleableWinnersList = styled(WinnersList)`
  ${(props: { isDisplayed: boolean }) => `
    display: ${props.isDisplayed ? '' : 'none'}
  `}
`;

const List = styled.ul`
  margin-top: 0;
  padding: 0;
`;

const Row = styled.li`
  width: 100%;
  min-height: 40px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  & > span {
    font-weight: bold;
    font-size: 20px;
    padding: 10px 5px;
    cursor: pointer;
    &:hover {
      background: #000;
      color: #fff;
    }

    ${(props: { isActive: boolean }) =>
      props.isActive
        ? `
      background: #000;
      color: #fff;
    `
        : ''}
  }
`;

interface StandingsInfo {
  season: string;
  DriverStandings: Array<{
    Driver: DriverInfo;
  }>;
}

interface SublistState {
  isDisplayed: boolean;
  isLoaded: boolean;
}

function ChampionsList() {
  const [standingsList, setStandingsList] = useState<StandingsInfo[]>([]);
  const url = `${config.api}f1/driverStandings/1.json?limit=11&offset=55`;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [sublistState, setSublistState] = useState<{ [season: string]: SublistState }>({});

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const result = await axios(url);
      const standings: StandingsInfo[] = result.data.MRData.StandingsTable.StandingsLists;
      setStandingsList(standings);
      setSublistState(
        // prefill sublist state;
        standings.reduce((acc, current) => ({ ...acc, [current.season]: { isDisplayed: false, isLoaded: false } }), {})
      );
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const handleRowClick = (season: string) => {
    setSublistState({
      ...sublistState,
      [season]: {
        isLoaded: true,
        isDisplayed: !sublistState[season].isDisplayed,
      },
    });
  };

  if (isError) return <Error>Something went wrong ...</Error>;

  return (
    <Fragment>
      {isLoading && <div>Loading ...</div>}
      {!isLoading && !isError && Boolean(standingsList.length) && (
        <List>
          {standingsList.map(item => {
            const champSeason = item.season;
            const seasonState = sublistState[champSeason];
            const driver = item.DriverStandings[0].Driver;

            const key = `${champSeason} - ${driver.driverId}`;
            return (
              <Row isActive={seasonState.isDisplayed} key={key}>
                <span onClick={handleRowClick.bind(null, champSeason)}>{`${champSeason} - ${driver.givenName} ${
                  driver.familyName
                }`}</span>
                <div>
                  {seasonState.isLoaded && (
                    <ToggleableWinnersList
                      isDisplayed={seasonState.isDisplayed}
                      season={champSeason}
                      champion={driver}
                    />
                  )}
                </div>
              </Row>
            );
          })}
        </List>
      )}
    </Fragment>
  );
}

export default ChampionsList;
