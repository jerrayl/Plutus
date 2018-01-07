/**
 * Created by leeweijie on 29/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ToolbarAndroid,
    ScrollView,
    TextInput,
    Picker
} from 'react-native';
import DatePicker from 'react-native-datepicker'

import * as Constants from './Constants'
import {request} from './Helper'


export default class AddFinancial extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            value: '',
            type: 'Stocks',
            maturity: new Date(),
            period: '',
            interest: '',
            qty: 1,
            ticker: ''
        }
    }

    render() {
        const pickerOptions = Constants.financialTypes.map((d, i)=> <Picker.Item key={d} label={d} value={d}/>);
        return <View style={{ flex: 1 }}>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor}}
                title="Add Financial Product"
                titleColor="white"
                actions={[{title: 'Save', show: 'always'}]}
                onActionSelected={this.save.bind(this)}/>
            <ScrollView style={{ margin: 15}}>
                <Text>Name: </Text>
                <TextInput value={this.state.name} onChangeText={(name)=>{this.setState({name})}}/>

                <Text>{(this.state.type == 'Bonds') ? 'Face Value' : 'Unit Price'}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginTop: 15, fontSize: 20 }}>$</Text>
                    <TextInput value={this.state.value}
                               style={{ flex: 1, color: 'black' }}
                               onChangeText={(value)=>{this.setState({value})}}
                               keyboardType="numeric"/>
                </View>

                <Text>Type: </Text>
                <Picker
                    selectedValue={this.state.type}
                    onValueChange={(type) => this.setState({type})}>
                    {pickerOptions}
                </Picker>

                {(this.state.type == 'Bonds') ?
                    <View>
                        <Text>Maturity Date: </Text>
                        <DatePicker date={this.state.maturity} onDateChange={(maturity)=>{this.setState({maturity})}}/>

                        <Text>Period (days): </Text>
                        <TextInput value={this.state.period} onChangeText={(period)=>{this.setState({period})}}
                                   keyboardType="numeric"/>

                        <Text>Interest: </Text>
                        <TextInput value={this.state.interest} onChangeText={(interest)=>{this.setState({interest})}}
                                   keyboardType="numeric"/>

                    </View>
                    : <View>
                    <Text>Quantity: </Text>
                    <TextInput value={this.state.qty} onChangeText={(qty)=>{this.setState({qty})}}
                               keyboardType="numeric"/>
                </View>}
                {(this.state.type == 'Stocks') ? <View>
                    <Text>Ticker:</Text>
                    <TextInput value={this.state.ticker} onChangeText={(ticker)=>{this.setState({ticker})}} />
                </View>:null
                }
            </ScrollView>
        </View>
    }

    save() {
        const {name, value, type, maturity, period, interest, qty, ticker} = this.state;
        request('add_investment', {
            name,
            value,
            type,
            maturity: (maturity == '') ? null : maturity,
            period: (period == '') ? null : period,
            interest: (interest == '') ? null : interest,
            qty: (qty == '') ? null : qty,
            ticker: (ticker == '') ? null: ticker
        }).then(()=> {
            this.props.update();
            this.props.navigator.pop()
        })
    }
}

