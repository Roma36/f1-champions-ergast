import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { DriverInfo } from '../models';
import styled from 'styled-components';

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  & th {
    padding: 18px 20px 14px;
    text-align: left;
    text-transform: uppercase;
    font-weight: 500;
    color: gray;
    font-size: 11px;
  }

  & > tbody > tr:nth-child(odd) {
    background: #f4f4f4;
  }
`;

const WinnersListWrapper = styled.div`
  padding-left: 20px;
`;

const Row = styled.tr`
  & > td {
    font-size: 13px;
    text-align: left;
    padding: 18px 20px 14px;
    color: #171717;
  }

  ${(props: { isChampion: boolean }) =>
    props.isChampion
      ? `
  background: red;
  & > td {
    color: #fff;
  }
  `
      : ''}
`;

interface WinnerListProperties {
  season: string;
  champion: DriverInfo;
  className?: string;
}

interface WinnersInfo {
  season: string;
  round: string;
  Circuit: {
    Location: {
      country: string;
    };
  };
  date: string;
  Results: Array<{
    Driver: DriverInfo;
    Constructor: { name: string };
    laps: string;
    Time: { time: string };
  }>;
}

function WinnersList({ season, champion, className }: WinnerListProperties) {
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
        <Table>
          <thead>
            <tr>
              <th>Grand Prix</th>
              <th>Date</th>
              <th>Winner</th>
              <th>Car</th>
              <th>Laps</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {winnersList.map(item => {
              const results = item.Results[0];
              const driver = results.Driver;
              const constructor = results.Constructor;
              const key = `${item.Circuit.Location.country} - ${driver.driverId}`;
              const date = new Date(item.date);

              return (
                <Row isChampion={driver.driverId === champion.driverId} key={key}>
                  <td>{item.Circuit.Location.country}</td>
                  <td>{`${date.toDateString().slice(4)}`}</td>
                  <td>{`${driver.givenName} ${driver.familyName}`}</td>
                  <td>{constructor.name}</td>
                  <td>{results.laps}</td>
                  <td>{results.Time.time}</td>
                </Row>
              );
            })}
          </tbody>
        </Table>
      )}
    </WinnersListWrapper>
  );
}

export default WinnersList;
