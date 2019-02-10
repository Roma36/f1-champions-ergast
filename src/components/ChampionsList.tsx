import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

interface StandingsInfo {
  season: string;
  DriverStandings: Array<{
    Driver: {
      driverId: string;
      givenName: string;
      familyName: string;
    };
  }>;
}

function ChampionsList() {
  const [standingsList, setStandingsList] = useState<StandingsInfo[]>([]);
  const url = `${config.api}f1/driverStandings/1.json?limit=11&offset=55`;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const result = await axios(url);

      setStandingsList(result.data.MRData.StandingsTable.StandingsLists);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return (
    <Fragment>
      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {standingsList.map(item => {
            const key = `${item.season} - ${item.DriverStandings[0].Driver.driverId}`;
            return <li key={key}>{key}</li>;
          })}
        </ul>
      )}
    </Fragment>
  );
}

export default ChampionsList;
