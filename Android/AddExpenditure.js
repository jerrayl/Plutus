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
    Picker
} from 'react-native';

import * as Constants from './Constants'
import {request} from './Helper'


export default class Expenditures extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            price: '',
            type: Constants.expenditureTypes[0]
        }
    }

    render() {
        const pickerOptions = Constants.expenditureTypes.map((d)=> <Picker.Item key={d} label={d} value={d} />);
        return <View style={{ flex: 1 }}>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor}}
                title="Add Expenditure"
                titleColor="white"
                actions={[{title: 'Save', show: 'always'}]}
                onActionSelected={this.save.bind(this)} />
            <View style={{ margin: 15}}>
                <Text>Name: </Text>
                <TextInput value={this.state.name} onChangeText={(name)=>{this.setState({name})}} />
                <Text>Price: </Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 15, fontSize: 20 }}>$</Text>
                    <TextInput value={this.state.price}
                               style={{ flex: 1 }}
                               onChangeText={(price)=>{this.setState({price})}}
                               keyboardType="numeric"/>
                </View>
                <Picker
                    selectedValue={this.state.type}
                    onValueChange={(type) => this.setState({type})}>
                    {pickerOptions}
                </Picker>
            </View>
        </View>
    }

    save() {
        const name = this.state.name.trim();
        const value = this.state.price.trim();
        const type = this.state.type.trim();
        if (name != '' && value != '' && type != '') {
            request('add_expenditure', {
                name,
                type,
                value
            }).then(()=>{
                this.props.update();
                this.props.navigator.pop()
            })
        }
    }
}

