/**
 * Created by leeweijie on 30/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    ScrollView
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as Constants from './Constants'
import {request} from './Helper'
import AddAsset from './AddAsset'
import AddLiability from './AddLiability'

export default class Profile extends Component {
    constructor() {
        super();
        this.state = {
            age: '',
            income: '',
            isIncomeStable: '',
            assets: [],
            liabilities: []
        };
        this.update()
    }

    update() {
        request('get_basic_data').then((d) => {
            const data = d.entity;
            this.setState({
                age: data.age,
                income: data.income,
                isIncomeStable: data.is_income_stable
            })
        });


        request('get_assets').then((d) => {
            if (d.entity.assets) {
                this.setState({assets: d.entity.assets})
            }
        });
        request('get_periodic_spending').then((d) => {
            if (d.entity.spendings) {
                this.setState({liabilities: d.entity.spendings})
            }
        })
    }

    render() {
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: () => true
        }).cloneWithRowsAndSections({
            Assets: this.state.assets,
            Liabilities: this.state.liabilities
        });
        const row = (d, s, i) => <View key={s+i} style={{ paddingVertical: 8 }}>
            <Text style={{ fontSize: 25 }}>{d.name}</Text>
            <Text>Value: {d.value}</Text>
            <Text>{(d.passive_income) ? 'Passive Income: ' + d.passive_income : ''}</Text>
            <Text>Period: {d.period}</Text>
        </View>;


        return <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ margin: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Age: </Text>
                <Text style={{ fontSize: 15 }}>{this.state.age}</Text>

                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Income: </Text>
                <Text style={{ fontSize: 15 }}>{this.state.income}</Text>

                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Part-time Job: </Text>
                <Text style={{ fontSize: 15 }}>{(this.state.isIncomeStable) ? 'No' : 'Yes'}</Text>
            </View>
            <ListView dataSource={ds}
                      style={{ margin: 15 }}
                      renderRow={row}
                      renderSectionHeader={(d, s)=><View key={s} style={{ borderBottomWidth: 1, borderBottomColor: Constants.defaultThemeColor}}>
                  <Text style={{ color: Constants.defaultThemeColor }}>{s}</Text>
                   </View>}
                      renderSeparator={(s, i) => <View key={s+i} style={{ height: 1, backgroundColor: 'gray'}}/>}
            />

            <ActionButton buttonColor={Constants.defaultThemeColor}
                          icon={<Icon name="menu" size={20} color="white"/>}>
                <ActionButton.Item buttonColor="limegreen"
                                   title="Add Asset"
                                   onPress={this.startAddAsset.bind(this)}>
                    <Icon name="add" size={20} color="white"/>
                </ActionButton.Item>
                <ActionButton.Item buttonColor="red"
                                   title="Add Liability"
                                   onPress={this.startAddLiability.bind(this)}>
                    <Icon name="add" size={20} color="white"/>
                </ActionButton.Item>
            </ActionButton>
        </View>
    }

    startAddAsset() {
        this.props.navigator.push({
            id: AddAsset,
            passProps: {
                update: this.update.bind(this)
            }
        })
    }

    startAddLiability() {
        this.props.navigator.push({
            id: AddLiability,
            passProps: {
                update: this.update.bind(this)
            }
        })
    }

}