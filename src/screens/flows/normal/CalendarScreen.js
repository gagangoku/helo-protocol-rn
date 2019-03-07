import React from "react";
import {DAYS_OF_WEEK, HOST, MONTHS, NUM_DAYS_TO_SHOW_PREVIOUS_MONTHS_CALENDAR, RUPEE_SYMBOL} from "../../../Constants";
import xrange from "xrange";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Toast} from "../../../NativeBindings";
import {INFO_BORDER_COLOR, TEXT_COLOR} from "../../../Styles";
import {getContext, navigateTo} from "../../../util/Util";
import PaymentScreen from "./PaymentScreen";


export class CalendarScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        let day = new Date().getDate();
        let month = new Date().getMonth() + 1;
        month = day > NUM_DAYS_TO_SHOW_PREVIOUS_MONTHS_CALENDAR ? month : (month === 1 ? 12 : month - 1);
        return { title: MONTHS[month-1] };
    };
    static URL = '/normal/calendar';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.customerProfile = this.ctx.customerProfile;
        this.state = {
            fetched: false,
            leaveResponse: null,
        };

        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        this.month = day > NUM_DAYS_TO_SHOW_PREVIOUS_MONTHS_CALENDAR ? month : (month === 1 ? 12 : month - 1);
        this.year = day <= NUM_DAYS_TO_SHOW_PREVIOUS_MONTHS_CALENDAR && month === 1 ? new Date().getFullYear() -1 : new Date().getFullYear();

        this.daysInMonth = new Date(this.year, this.month, 0).getDate();
        let d = new Date(Date.parse(this.year + '-' + (this.month < 10 ? '0' + this.month : this.month) + '-01'));
        this.dow = d.getDay() + 1;     // Sun = 1, Mon = 2, ... Sat = 7

        this.weeksInMonth = [0, 1, 2, 3, 4, 5, 6];     // week 0 is for day header
        this.daysInWeek = xrange(1, 8).toArray();
    }

    componentDidMount() {
        var url = HOST + '/v2/billing/customer/bill?customerId=' + this.customerProfile['customer']['person']['id'] + '&month=' + this.month + '&year=' + this.year + '&format=json';
        console.log(url);
        let obj = this;
        fetch(url).then((o) => {
            return o.json();
        }).then((o) => {
            let r = o['leave']['month'][0];
            this.slots = r['slots'];
            this.dayStatus = r['day'];
            obj.setState({fetched: true, leaveResponse: o});
        });
    }

    cell(w, i) {
        if (w === 0) {
            return (<Text key={w*8 + i} style={[calendarStyles.calendarCellBase, calendarStyles.calendarCellHeader]}>{DAYS_OF_WEEK[i-1]}</Text>);
        }

        let clazz = calendarStyles.calendarCellEmpty;
        let day = (w-1)*7 + i - this.dow + 1;
        if (day <= 0 || day > this.daysInMonth) {
            day = '';
        } else {
            switch (this.dayStatus[day - 1]['summary']) {
                case 'ATLEAST_ONE_JOB_DONE':
                    clazz = calendarStyles.calendarCellWorking;
                    break;
                case 'NO_JOBS_DONE':
                    clazz = calendarStyles.calendarCellUnsure;
                    break;
                case 'PLANNED_LEAVE':
                    clazz = calendarStyles.calendarCellPlannedLeave;
                    break;
                case 'UNPLANNED_LEAVE':
                    clazz = calendarStyles.calendarCellUnplannedLeave;
                    break;
                case 'NO_SCHEDULE':
                    clazz = calendarStyles.calendarCellNoSchedule;
                    break;
                case 'SCHEDULE_BUT_NO_WORK':
                    clazz = calendarStyles.calendarCellNoSchedule;
                    break;
                default:
                    clazz = calendarStyles.error;
                    break;
            }
        }
        return (<Text key={w*8 + i} style={[calendarStyles.calendarCellBase, clazz]}>{day}</Text>);
    }
    row(n) {
        return (
            <View key={n} style={calendarStyles.calendarRow}>
                {this.daysInWeek.map(i => { return this.cell(n, i); })}
            </View>
        );
    }

    render() {
        if (!this.state.fetched) {
            return (<View><Text>Loading ...</Text></View>);
        }

        const paymentLink = 'paymentLink' in this.state.leaveResponse['bill'] ? this.state.leaveResponse['bill']['paymentLink'] : null;
        // const paymentLink = 'https://www.google.com/';       // For testing
        const payButtonPrefix = paymentLink ? 'PAY' : 'TOTAL AMOUNT =';

        const _payment = () => {
            console.log('Trying payment');
            if (paymentLink) {
                navigateTo(this, PaymentScreen.URL, { leaveResponse: this.state.leaveResponse, paymentLink: paymentLink });
            } else {
                Toast.show('Coming soon. Please pay via link sent in email for now.', Toast.LONG);
            }
        };

        // BUG in ReactNative: Using View here does not work, the children expand to more height. Setting the height on
        // children is not working. ScrollView works though
        return (
            <View style={{height: '100%', backgroundColor: 'white'}}>
                <ScrollView>
                    <View style={calendarStyles.calendarContainer}>
                        {this.weeksInMonth.map(n => { return this.row(n); })}
                        <View style={{ height: 20 }} />

                        <View style={{ height: 10 }} />
                        <View style={{ flex: 1, flexDirection: 'row', width: 2*INFO_CELL_WIDTH }}>
                            <View style={[infoCellStlye, borderLeftStyle]}>
                                <Text style={infoHeaderStyle}>Work Days</Text>
                                <Text style={infoValueStyle}>{this.state.leaveResponse['bill']['numWorkingDays']}</Text>
                            </View>
                            <View style={infoCellStlye}>
                                <Text style={infoHeaderStyle}>Leaves Taken</Text>
                                <Text style={infoValueStyle}>{this.state.leaveResponse['bill']['numPlannedLeaves'] + this.state.leaveResponse['bill']['numUnannouncedLeaves']}*</Text>
                            </View>
                        </View>

                        <View style={{ height: 30 }} />
                        <View>
                            <TouchableOpacity style={{}} onPress={ () => _payment() }>
                                <Text style={totalBillStyle}>{payButtonPrefix} {RUPEE_SYMBOL} {this.state.leaveResponse['bill']['finalBill']}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}


const INFO_CELL_WIDTH = 140;
const borderLeftStyle = { borderLeftWidth: 1 };
const infoCellStlye = {
    flex: 1, flexDirection: 'column', height: 100, width: INFO_CELL_WIDTH, justifyContent: 'center', alignItems: 'center',
    borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: INFO_BORDER_COLOR, borderStyle: 'dashed',
};
const infoHeaderStyle = { fontSize: 18, fontWeight: '100', color: TEXT_COLOR };
const infoValueStyle = { fontSize: 26, fontWeight: '500', color: TEXT_COLOR };
const totalBillStyle = {
    fontSize: 18, color: 'white', backgroundColor: '#555555',
    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
    textAlignVertical: 'center', textAlign: 'center', borderRadius: 5,
};

// CSS styles
const CALENDAR_CELL_HEIGHT = 51;
const CALENDAR_CELL_WIDTH = 50;
const CALENDAR_BORDER_COLOR = '#CACACA';

const calendarStyles = StyleSheet.create({
    error: {
        backgroundColor: 'red',
        color: 'white',
        fontWeight: 'bold',
    },

    calendarContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    calendarRow: {
        flex: 1,
        flexDirection: 'row',
        height: CALENDAR_CELL_HEIGHT,
        margin: 0,
        padding: 0,
        width: 7*CALENDAR_CELL_WIDTH,

        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarCellBase: {
        width: CALENDAR_CELL_WIDTH,
        height: CALENDAR_CELL_HEIGHT,
        margin: 0,
        padding: 0,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontSize: 18,
    },
    calendarCellHeader: {
        color: TEXT_COLOR,
        // fontWeight: 'bold',
    },
    calendarCellWorking: {
        color: TEXT_COLOR,
        borderBottomWidth: 1,
        borderBottomColor: CALENDAR_BORDER_COLOR,
    },
    calendarCellPlannedLeave: {
        color: 'red',
        borderBottomWidth: 1,
        borderBottomColor: CALENDAR_BORDER_COLOR,
    },
    calendarCellUnplannedLeave: {
        color: 'white',
        backgroundColor: 'red',
        borderBottomWidth: 1,
        borderBottomColor: CALENDAR_BORDER_COLOR,
    },
    calendarCellNoSchedule: {
        color: '#C0C0C0',
        borderBottomWidth: 1,
        borderBottomColor: CALENDAR_BORDER_COLOR,
    },
    calendarCellUnsure: {
        color: TEXT_COLOR,
        backgroundColor: '#EAEAEA',
        borderBottomWidth: 1,
        borderBottomColor: CALENDAR_BORDER_COLOR,
    },
    calendarCellEmpty: {
    },
});