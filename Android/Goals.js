/**
 * Created by leeweijie on 30/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ToolbarAndroid,
    TextInput,
    Picker,
    ListView,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';
import ActionButton from 'react-native-action-button';

import * as Constants from './Constants'
import AddGoal from './AddGoal'
import {request} from './Helper'

const star = require('./images/star.png');
const grayStar = require('./images/star-gray.png');

export default class Achievements extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            data: ds
        };
        this.update()
    }

    update() {
        request('get_goals').then((data)=> {
            this.setState({data: this.state.data.cloneWithRows(data.entity.goals)})
        })
    }

    render() {
        const row = (d) => <TouchableHighlight key={d}
                                               underlayColor="#EDE7F6"
                                               onPress={this.promptBuy.bind(this, d.name)}
                                               style={{ paddingVertical: 5 }}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={(d.is_achieved)?star:grayStar} style={{ height: 50, width: 50}}
                       resizeMode="contain"/>
                <View style={{ flex: 7, justifyContent: 'center', marginLeft: 15 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{d.name}</Text>
                </View>
                <View style={{ flex: 4, justifyContent: 'center'}}>
                    <Text style={{ fontSize: 20 }}>${d.value}</Text>
                </View>

            </View>
        </TouchableHighlight>;

        return <View style={{ flex: 1}}>
            <ListView
                style={{ margin: 15 }}
                dataSource={this.state.data}
                renderRow={row}
                renderSeparator={(s, i) => <View key={i} style={{ height: 1, backgroundColor: 'black'}} />}
            />
            <ActionButton onPress={this.startAdd.bind(this)} buttonColor={Constants.defaultThemeColor}/>
        </View>
    }

    startAdd() {
        this.props.navigator.push({
            id: AddGoal,
            passProps: {
                update: this.update.bind(this)
            }
        })
    }

    buyAchievement(name) {
        request('update_goal', {
            name,
            is_achieved: true
        }).then(this.update.bind(this))
    }

    promptBuy(name) {
        Alert.alert('Complete Goal?', 'This purchase will be added to your expenditure', [
            {text: 'Cancel'},
            {text: 'Confirm', onPress: () => {this.buyAchievement(name)}}
        ])
    }
}

