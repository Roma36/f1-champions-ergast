import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { DriverInfo } from '../models';
import styled from 'styled-components';

const WinnersListWrapper = styled.div`
  padding-left: 20px;
`;

const Row = styled.li`
  ${(props: { isChampion: boolean }) => (props.isChampion ? 'background: red; color: #fff;' : '')}
`;

interface WinnerListProperties {
  season: string;
  championId: string;
  className?: string;
}

interface WinnersInfo {
  season: string;
  round: string;
  Circuit: {
    circuitName: string;
  };
  Results: Array<{
    Driver: DriverInfo;
  }>;
}

function WinnersList({ season, championId, className }: WinnerListProperties) {
  const [winnersList, setWinnersList] = useState<WinnersInfo[]>([]);
  const url = `${config.api}f1/${season}/results/1.json`;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const result = await axios(url);

      setWinnersList(result.data.MRData.RaceTable.Races);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return (
    <WinnersListWrapper className={className}>
      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ul>
          {winnersList.map(item => {
            const driverId = item.Results[0].Driver.driverId;
            const key = `${item.Circuit.circuitName} - ${driverId}`;
            return (
              <Row isChampion={driverId === championId} key={key}>
                {key}
              </Row>
            );
          })}
        </ul>
      )}
    </WinnersListWrapper>
  );
}

export default WinnersList;
