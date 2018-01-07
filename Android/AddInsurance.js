/**
 * Created by leeweijie on 30/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Picker,
    ToolbarAndroid,
    TextInput
} from 'react-native';
import DatePicker from 'react-native-datepicker'

import * as Constants from './Constants'
import {request} from './Helper'

export default class AddInsurance extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            type: '',
            expiry: new Date(),
            premium: ''
        }
    }

    render() {
        const pickerOptions = Constants.insuranceType.map((d) => <Picker.Item
            key={d}
            label={d}
            value={d}
        />);

        return <View>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor }}
                title="Add Insurance"
                titleColor="white"
                actions={[{title: 'Save', show: 'always' }]}
                onActionSelected={this.save.bind(this)}/>
            <View style={{ margin: 15 }}>
                <Text>Name:</Text>
                <TextInput value={this.state.name}
                           onChangeText={(name)=>{this.setState({name})}} />

                <Text>Premium: </Text>
                <TextInput value={this.state.premium}
                           onChangeText={(premium)=>{this.setState({premium})}} />

                <Text style={{ marginTop: 10 }}>Type:</Text>
                <Picker
                    selectedValue={this.state.type}
                    onValueChange={(type) => this.setState({type})}>
                    {pickerOptions}
                </Picker>

                <Text style={{ marginTop: 10 }}>Expiry:</Text>
                <DatePicker date={this.state.expiry} onDateChange={(expiry)=>{this.setState({expiry})}}/>

            </View>
        </View>
    }

    save() {
        const {name, type, premium} = this.state;
        request('add_insurance', {
            name,
            type,
            premium
        }).then(() => {
            this.props.update();
            this.props.navigator.pop()
        })
    }
}