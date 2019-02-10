import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { DriverInfo } from '../models';
import WinnersList from './WinnersList';
import styled from 'styled-components';

const ToggleableWinnersList = styled(WinnersList)`
  ${(props: { isDisplayed: boolean }) => `
    display: ${props.isDisplayed ? '' : 'none'}
  `}
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

  return (
    <Fragment>
      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {standingsList.map(item => {
            const champSeason = item.season;
            const seasonState = sublistState[champSeason];
            const driverId = item.DriverStandings[0].Driver.driverId;

            const key = `${champSeason} - ${driverId}`;
            return (
              <li onClick={handleRowClick.bind(null, champSeason)} key={key}>
                {key}
                {seasonState.isLoaded && (
                  <ToggleableWinnersList
                    isDisplayed={seasonState.isDisplayed}
                    season={champSeason}
                    championId={driverId}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Fragment>
  );
}

export default ChampionsList;
