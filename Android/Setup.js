/**
 * Created by leeweijie on 29/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ToolbarAndroid,
    TextInput,
    Switch,
    AsyncStorage
} from 'react-native';

import {request} from './Helper'

import * as Constants from './Constants'
import Main from './Main'

export default class Setup extends Component {
    constructor() {
        super();
        this.state = {
            age: '',
            income: '',
            balance: '',
            isIncomeStable: false
        }
    }

    render() {
        return <View>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor}}
                title="Setup Info"
                actions={[{title: 'Save', show: 'always'}]}
                onActionSelected={this.save.bind(this)}/>
            <View style={{ margin: 20 }}>
                <Text>Age: </Text>
                <TextInput value={this.state.age} onChangeText={(age)=>{this.setState({age})}} keyboardType="numeric"/>

                <Text>Monthly Income: </Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 15, fontSize: 20 }}>$</Text>
                    <TextInput value={this.state.income}
                               style={{ flex: 1 }}
                               onChangeText={(income)=>{this.setState({income})}}
                               keyboardType="numeric"/>
                </View>

                <Text>Bank Account Balance: </Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 15, fontSize: 20 }}>$</Text>
                    <TextInput value={this.state.balance}
                               style={{ flex: 1 }}
                               onChangeText={(balance)=>{this.setState({balance})}}
                               keyboardType="numeric"/>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 2 }}>Job is part time: </Text>
                    <Switch value={this.state.isIncomeStable}
                            onValueChange={(isIncomeStable)=>{this.setState({isIncomeStable: !isIncomeStable})}}/>
                </View>
            </View>
        </View>
    }

    save() {
        const age = this.state.age.trim();
        const income = this.state.income.trim();
        const balance = this.state.balance.trim();
        const isIncomeStable = this.state.isIncomeStable;

        if (age != '' && income != '' && balance != '') {
            request('signup', {
                age,
                income,
                balance,
                is_income_stable: isIncomeStable
            }).then(()=> {
                AsyncStorage.setItem('notFirstLaunch', 'true').then((d) => {
                    console.log(d);
                    this.props.navigator.resetTo({
                        id: Main
                    })
                }).catch(console.log)
            })
        }

    }
}