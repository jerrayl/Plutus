/**
 * Created by leeweijie on 29/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    DrawerLayoutAndroid,
    TouchableHighlight,
    ToolbarAndroid,
    ListView
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';

import Home from './Home';
import Expenditure from './Expenditure';
import Finance from './Finance'
import Goals from './Goals'
import Profile from './Profile'
import Insurance from './Insurance'

import * as Constants from './Constants'

export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            app: 'Home'
        }
    }

    render() {
        const APPS = [
            {Home},
            {Expenditure},
            {Finance},
            {Insurance},
            {Goals},
            {Profile}
        ];


        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        ds = ds.cloneWithRows(APPS.map((d)=> {
            return Object.keys(d)[0]
        }));

        const row = (d) => <TouchableHighlight style={{ paddingVertical: 8, height: 60, justifyContent: 'center', backgroundColor: (this.state.app == d)?Constants.defaultThemeSecondaryColor:'white'}}
                                               underlayColor="#EDE7F6"
                                               onPress={()=>{this.refs['DRAWER'].closeDrawer();
                                               this.setState({app: d})}}>
            <Text style={{ marginLeft: 15, fontWeight: 'bold' }}>
                {d}
            </Text>
        </TouchableHighlight>;

        const navigationView = (
            <View style={{ flex: 1, paddingVertical: 15 }}>
                <Text style={{ marginLeft: 10, fontSize: 30, fontWeight: 'bold', color: Constants.defaultThemeColor }}>Plutus</Text>
                <View style={{ height: 1, backgroundColor: 'lightgray' }}/>

                <ListView dataSource={ds}
                          renderRow={row}
                />
            </View>
        );

        const content = APPS.filter((d)=>Object.keys(d)[0]==this.state.app)[0][this.state.app];

        return <DrawerLayoutAndroid drawerWidth={300}
                                    ref="DRAWER"
                                    renderNavigationView={()=>navigationView}>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor }}
                title={this.state.app}
                titleColor="white"
                actions={[{title: 'Menu', show: 'always'}]}
                onActionSelected={()=> {this.refs['DRAWER'].openDrawer()}}/>
            {React.createElement(content, {navigator: this.props.navigator})}
        </DrawerLayoutAndroid>


    }
}
