/**
 * Created by leeweijie on 29/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';

import * as Constants from './Constants'
import {request} from './Helper'

export default class Main extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            balance: '',
            advice: ds
        };
        this.update()
    }

    update() {
        request('get_balance').then((d) => {
            this.setState({balance: d.entity.value})
        });

        request('get_advice').then((d) => {
            this.setState({advice: this.state.advice.cloneWithRows(d.entity.advices)})
        })

    }

    render() {
        const row = (d) => <View key={d} style={{ paddingVertical: 8 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{d.type}</Text>
            <Text>{d.content}</Text>
        </View>;

        const header = () => <View style={{ borderBottomWidth: 1, borderBottomColor: Constants.defaultThemeColor }}>
            <Text style={{ fontWeight: 'bold', color: Constants.defaultThemeColor }}>Suggestions</Text>
        </View>;

        return <View style={{ flex: 1, margin: 15 }}>
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 40, fontWeight: 'bold' }}>Balance: </Text>
                <Text style={{ fontSize: 30 }}>${this.state.balance}</Text>
            </View>

            <ListView dataSource={this.state.advice}
                      renderRow={row}
                      renderHeader={header}
                      renderSeparator={(s, i) => <View key={i} style={{ height: 1, backgroundColor: 'gray'}}/>}
            />
        </View>
    }
}