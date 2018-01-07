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
    Picker
} from 'react-native';

import * as Constants from './Constants'
import {request} from './Helper'

export default class AddAsset extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            passiveIncome: '',
            period: '',
            value: ''
        }
    }

    render() {
        return <View>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor }}
                title="Add Asset"
                titleColor="white"
                actions={[{title: 'Save', show: 'always' }]}
                onActionSelected={this.save.bind(this)}/>
            <View style={{ margin: 15 }}>
                <Text>Name:</Text>
                <TextInput value={this.state.name}
                           onChangeText={(name)=>{this.setState({name})}} />

                <Text>Value:</Text>
                <TextInput value={this.state.value}
                           onChangeText={(value)=>{this.setState({value})}}
                           keyboardType="numeric" />

                <Text>Passive Income:</Text>
                <TextInput value={this.state.passiveIncome}
                           onChangeText={(passiveIncome)=>{this.setState({passiveIncome})}}
                           keyboardType="numeric" />

                <Text>Period:</Text>
                <TextInput value={this.state.period}
                           onChangeText={(period)=>{this.setState({period})}}
                           keyboardType="numeric" />

            </View>
        </View>
    }

    save() {
        const {name, value, passiveIncome, period} = this.state;
        request('add_asset', {
            name,
            value,
            passive_income: passiveIncome,
            period
        }).then(() => {
            this.props.update();
            this.props.navigator.pop()
        })
    }
}