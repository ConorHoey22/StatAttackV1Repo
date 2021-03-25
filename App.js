import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//------------FIREBASE-----------------
import * as firebase from 'firebase/app';
import { firebaseConfig } from './config/config';
// ------------------------------------

  
// Info pages
import Welcome from './screens/WelcomeScreen/WelcomeScreen';


// Login
import Login from './screens/LoginScreen/LoginScreen';

// SuperUser Access routes - As only we should be able to grant them these accounts after payment
import HeadTeamAnalystRegistration from './screens/HeadTeamAnalystRegistrationScreen/HeadTeamAnalystRegistrationScreen';
import TeamAnalystRegistration from './screens/TeamAnalystRegistrationScreen/TeamAnalystRegistrationScreen';

// Registration
import PlayerRegistration from './screens/PlayerRegistrationScreen/PlayerRegistrationScreen';

// Home Menu
import Home from './screens/HomeScreen/HomeScreen'

// Head Team Analyst Routes
import CreateATeam from './screens/CreateATeamScreen/CreateATeam';
import ManageTeam from './screens/ManageTeam/ManageTeamScreen';
import AddPlayers from './screens/AddPlayers/AddPlayersScreen';

// Team Analyst Routes
import SetupStatsApp from './screens/SetupStatsAppScreen/SetupStatsApp';
import StatsApp from './screens/StatsApp/StatsApp';

// Profiles 
import PlayerProfile from './screens/PlayerProfile/PlayerProfile';
import TeamProfile from './screens/TeamProfile/TeamProfile';

//Player Profile 
import ViewPlayer from './screens/ViewPlayer/ViewPlayer';

//Game
import ViewGame from './screens/ViewGame/ViewGame';


export default class App extends React.Component {


  render() {
    
    return <AppContainer/>;
  }
}

const AppNavigator = createStackNavigator({
   
  Welcome: {
    screen: Welcome
  },

  Login: {
    screen: Login
  },

  HeadTeamAnalystRegistration: {
    screen: HeadTeamAnalystRegistration,
  
  },

  TeamAnalystRegistration: {
      screen: TeamAnalystRegistration,
      navigationOptions: {
        title: 'How to register/join as a team analyst ',

      },
  },

  PlayerRegistration: {
    screen: PlayerRegistration,
    navigationOptions: {
      title: 'Player Registration',

    },
  },

  Home: {
    screen: Home
  },

  CreateATeam: {
    screen: CreateATeam,
    navigationOptions: {
      title: 'Create your team',

    },
  },

  AddPlayers: {
    screen: AddPlayers,
    navigationOptions: {
      title: 'Add players to your team',

    },
  },

  ManageTeam: {
    screen: ManageTeam,
    navigationOptions: {
      title: 'Manage your team',

    },
  },

  TeamProfile: {
    screen: TeamProfile,
    navigationOptions: {
      title: 'Team Profile',

    },
  },

  SetupStatsApp: {
    screen: SetupStatsApp,
    navigationOptions: {
      title: 'Set up Stats App',

      headerShown: true
    },
  },
  StatsApp: {
    screen: StatsApp,
    navigationOptions: {
      headerShown: false,

      },
  },

  ViewGame: {
    screen: ViewGame,
    navigationOptions: {
      headerShown: false,
    
    },
  },

  PlayerProfile: {
    screen: PlayerProfile,
    navigationOptions: {
      title: 'Player Profile',

    },
  },


  ViewPlayer: {
    screen: ViewPlayer,
    navigationOptions: {
      title: 'Player Review',

    },
  },


});

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#242424"


  
  },
});
