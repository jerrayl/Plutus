/**
 * Created by leeweijie on 29/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ToolbarAndroid,
    ListView
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as Constants from './Constants'
import ExpenditureSettings from './ExpenditureSettings'
import AddExpenditure from './AddExpenditure'
import {request} from './Helper'


export default class Expenditures extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            data: ds,
            total: 0
        };
        this.update()
    }

    update() {
        request('get_expenditure').then((d) => {
            const data = this.state.data.cloneWithRows(d.entity.expenditures);
            this.setState({
                data,
                total: d.entity.total
            })
        })
    }

    render() {
        const rows = (d) => <View key={d} style={{ flexDirection: 'row', paddingVertical: 5 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>${d.value}</Text>
            </View>
            <View style={{ marginLeft: 15, flex: 3}}>
                <Text style={{ fontSize: 25 }}>{d.name}</Text>
                <Text>{d.date.substr(0, 10)}</Text>
                <Text>{d.type}</Text>
            </View>
        </View>;

        return <View style={{ flex: 1 }}>
            <View style={{ margin: 15, borderBottomWidth: 1, borderBottomColor: 'gray', paddingBottom: 15 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Total: ${this.state.total}</Text>
            </View>

            <ListView
                style={{ margin: 15 }}
                dataSource={this.state.data}
                renderRow={rows}
                renderSeparator={(s, i) => <View key={i} style={{ height: 1, backgroundColor: 'gray'}}/>}/>

            <ActionButton buttonColor={Constants.defaultThemeColor} icon={<Icon name="menu" size={20} color="white" />}>
                <ActionButton.Item buttonColor="red"
                                   onPress={this.startAddExpenditures.bind(this)}>
                    <Icon name="add" size={20} color="white" />
                </ActionButton.Item>
                <ActionButton.Item buttonColor="orange" onPress={this.startSettings.bind(this)}>
                    <Icon name="settings" size={20} color="white" />
                </ActionButton.Item>
            </ActionButton>
        </View>
    }

    startAddExpenditures() {
        this.props.navigator.push({
            id: AddExpenditure,
            passProps: {
                update: this.update.bind(this)
            }
        })
    }

    startSettings() {
        this.props.navigator.push({
            id: ExpenditureSettings
        })
    }
}