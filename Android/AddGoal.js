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
} from 'react-native';

import * as Constants from './Constants'
import {request} from './Helper'

export default class AddFinancial extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            value: ''
        }
    }

    render() {
        return <View>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor}}
                title="Add Achievement"
                titleColor="white"
                actions={[{title: 'Save', show: 'always'}]}
                onActionSelected={this.save.bind(this)}/>
            <View style={{ margin: 15 }}>
                <Text>Name:</Text>
                <TextInput value={this.state.name}
                           onChangeText={(name)=>{this.setState({name})}} />

                <Text>Price:</Text>
                <TextInput value={this.state.value}
                           onChangeText={(value)=>{this.setState({value})}}
                           keyboardType="numeric" />

            </View>
        </View>
    }

    save() {
        const {name, value} = this.state;
        request('add_goal', {
            name,
            value
        }).then(() => {
            this.props.update();
            this.props.navigator.pop()
        })
    }
}