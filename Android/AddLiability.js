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

export default class AddLiability extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            value: '',
            period: ''
        }
    }

    render() {
        return <View>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor }}
                title="Add Liability"
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

                <Text>Period:</Text>
                <TextInput value={this.state.period}
                           onChangeText={(period)=>{this.setState({period})}}
                           keyboardType="numeric" />

            </View>
        </View>
    }

    save() {
        const {name, value, period} = this.state;
        request('add_periodic_spending', {
            name, value, period
        }).then(() => {
            this.props.update();
            this.props.navigator.pop()
        })
    }
}