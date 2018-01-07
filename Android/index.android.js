/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    BackAndroid,
    AsyncStorage
} from 'react-native';

import Main from './Main'
import Setup from './Setup'

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();
        return true;
    }
    return false;
});

class Plutus extends Component {
    constructor() {
        super();
        this.state = {
            app: null
        };
        AsyncStorage.getItem('notFirstLaunch').then((data)=> {
            if (data == 'true') {
                this.setState({ app: Main})
            } else {
                this.setState({ app: Main})
            }
        })
    }

    render() {
        return (this.state.app != null) ? <Navigator
            initialRoute={{id: this.state.app}}
            renderScene={this._renderScene}
            configureScene={this._configureScene}/> : <View />;
    }

    _renderScene(route, navigator) {
        _navigator = navigator;
        return <route.id navigator={navigator} {...route.passProps} />
    }

    _configureScene(route, routeStack) {
        return Navigator.SceneConfigs.PushFromRight
    }
}


AppRegistry.registerComponent('Plutus', () => Plutus);
