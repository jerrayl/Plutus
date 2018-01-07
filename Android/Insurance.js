/**
 * Created by leeweijie on 30/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Dimensions
} from 'react-native';
import ActionButton from 'react-native-action-button';

import * as Constants from './Constants'
import {request} from './Helper'
import AddInsurance from './AddInsurance'

export default class Insurance extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            coverage: '',
            ds: ds
        };
        this.update()
    }

    update() {
        request('get_insurance_coverage').then((d) => {
            this.setState({coverage: d.entity.value})
        });

        request('get_insurance').then((d) => {
            this.setState({ds: this.state.ds.cloneWithRows(d.entity.insurances)})
        })
    }

    render() {
        const row = (d) => <View key={d} style={{ paddingVertical: 5}}>
            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{d.name}</Text>
            <Text style={{ fontSize: 20 }}>{d.type}</Text>
            <Text style={{ fontSize: 20 }}>{(d.expiry)?'Due: ' + d.expiry.substr(0, 10):''}</Text>
        </View>;
        const width = Dimensions.get('window').width;
        return <View style={{ flex: 1 }}>
            <View style={{ margin: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>You are {this.state.coverage}% insured</Text>
                <View style={{ borderWidth: 1, borderColor: 'black', height: 40 }}>
                    <View style={{ width: width * (this.state.coverage / 100), height: 38, backgroundColor: Constants.defaultThemeColor }}/>
                </View>
            </View>
            <ListView
                style={{ margin: 15 }}
                dataSource={this.state.ds}
                renderRow={row}
                renderHeader={() => <View style={{ borderBottomWidth: 1, borderBottomColor: Constants.defaultThemeColor }}>
                    <Text style={{ fontWeight: 'bold', color: Constants.defaultThemeColor }}>Insurance List</Text>
                    </View>}
                renderSeparator={(s, i) => <View key={i} style={{ height: 1, backgroundColor: 'gray'}}/>}
            />
            <ActionButton onPress={this.startAddInsurance.bind(this)} buttonColor={Constants.defaultThemeColor} />
        </View>
    }

    startAddInsurance() {
        this.props.navigator.push({
            id: AddInsurance,
            passProps: {
                update: this.update.bind(this)
            }
        })
    }
}