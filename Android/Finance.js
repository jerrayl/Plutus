/**
 * Created by leeweijie on 29/7/2016.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView
} from 'react-native';
import ActionButton from 'react-native-action-button';
import rest from 'rest'
import mime from 'rest/interceptor/mime'
import basicAuth from 'rest/interceptor/basicAuth'
import errorCode from 'rest/interceptor/errorCode'

import * as Constants from './Constants'

import {request} from './Helper'
import AddFinancial from './AddFinancial'

export default class Main extends Component {

    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: () => true});
        this.state = {
            ds: ds
        };
        this.update()
    }

    update() {
        request('get_investment').then((d) => {
            const investments = d.entity.investments;
            this.setState({ds: this.state.ds.cloneWithRows(investments)});

            client = rest.wrap(mime).wrap(errorCode).wrap(basicAuth, {
                username: '183f80245b1058dd29be5fa701ace83d',
                password: '2f3daf92bb0100ba45ac28264490d23a'
            });
            if(investments) {
                investments.forEach((i, c) => {
                    if(i.ticker) {
                        client('https://www.intrinio.com/api/data_point?item=close_price&ticker=' + i.ticker).then((d)=>{
                            investments[c].marketPrice = d.entity.value;
                            this.setState({ds: this.state.ds.cloneWithRows(investments)})
                        })
                    }
                });
            }
        })
    }

    render() {
        const row = (d) => <View key={d} style={{ paddingVertical: 5, flexDirection: 'row' }}>
            <View style={{ flex: 4 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{d.name}</Text>
                <Text style={{ fontSize: 20 }}>{d.type}</Text>
                <Text style={{ fontSize: 20 }}>${d.value}</Text>
                {(d.ticker) ? <Text>{d.ticker}</Text> : null}
            </View>
            {(d.marketPrice) ?
                <View style={{ flex: 2, justifyContent: 'center' }}>
                    <Text>Market Price</Text>
                    <Text style={{ fontSize: 28, fontWeight: 'bold' }}>${d.marketPrice}</Text>
                </View> : null
            }
        </View>;

        return <View style={{ flex: 1 }}>
            <ListView
                style={{ margin: 15 }}
                dataSource={this.state.ds}
                renderRow={row}
                renderFooter={()=><View style={{ height: 60 }}/>}
                renderSeparator={(s, i) => <View key={i} style={{ height: 1, backgroundColor: 'gray'}}/>}
            />
            <ActionButton onPress={this.startAddExpenditures.bind(this)} buttonColor={Constants.defaultThemeColor}/>
        </View>
    }

    startAddExpenditures() {
        this.props.navigator.push({
            id: AddFinancial,
            passProps: {
                update: this.update.bind(this)
            }
        })
    }
}