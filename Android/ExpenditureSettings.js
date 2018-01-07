/**
 * Created by leeweijie on 29/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ToolbarAndroid,
    Slider,
    ScrollView
} from 'react-native';

import * as Constants from './Constants'
import {request} from './Helper'

export default class ExpenditureSettings extends Component {
    constructor() {
        super();
        this.state = {desiredSavings: 50};
        this.options = Constants.expenditureTypes.concat('Savings');
        this.options.forEach((d) => {
            this.state[d] = 0;
            this.state[d + 'p'] = 0;
        })
    }

    getSum() {
        let sum = 0;
        this.options.forEach((d)=> {
            sum += this.state[d]
        });
        console.log(sum);
        return sum
    }

    calculatePercent() {
        const total = this.getSum();
        this.options.forEach((d)=> {
            let newObj = {};
            const current = this.state[d];
            newObj[d + 'p'] = Math.round((current / total) * 100);
            this.setState(newObj)
        })
    }

    render() {
        const sliders = this.options.map((d) => <View key={d}>
            <Text style={{ paddingVertical: 5 }}>{d}</Text>
            <Text>{this.state[d + 'p']}%</Text>
            <Slider value={this.state[d]}
                    onValueChange={(data) => {
                        let newObj = {};
                        newObj[d] = data;
                        this.setState(newObj, this.calculatePercent.bind(this))
                        }}/>
        </View>);
        return <ScrollView>
            <ToolbarAndroid
                style={{ height: 60, backgroundColor: Constants.defaultThemeColor}}
                title="Expenditure Settings"
                titleColor="white"
                actions={[{title: 'Save', show: 'always'}]}
                onActionSelected={this.save.bind(this)}/>
            <View style={{ margin: 15 }}>
                {sliders}
            </View>
        </ScrollView>
    };

    save() {
        const budgets = this.options.map((d) => {
            const newObj = {};
            newObj.type = d;
            newObj.percentage = this.state[d] * 100;
            return newObj
        });
        request('add_budget', {
            budgets
        }).then(() => {
            return request('add_desired_saving', {
                desired_saving: this.state.desiredSavings
            });
        }).then(()=>{this.props.navigator.pop()});
    }
}
