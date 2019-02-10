import React, { Component } from 'react';
import styled from 'styled-components';
import config from './config';
import ChampionsList from './components/ChampionsList';

const AppWrapper = styled.div``;

const Header = styled.header`
  background: #e10600;
  height: 64px;
  display: flex;
  justify-content: center;
`;

const Logo = styled.img`
  width: 120px;
`;

const ContentWrapper = styled.div`
  padding: 2%;
`;

class App extends Component {
  render() {
    return (
      <AppWrapper>
        <Header>
          <Logo src={config.publicUrl + '/img/f1_logo.svg'} />
        </Header>

        <ContentWrapper>
          <ChampionsList />
        </ContentWrapper>
      </AppWrapper>
    );
  }
}

export default App;

// http://ergast.com/api/f1/driverStandings/1.json?limit=11&offset=55
