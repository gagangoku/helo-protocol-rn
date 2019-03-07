import React, {Fragment} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {TEXT_COLOR} from "../Styles";
import {Toast} from '../NativeBindings';
import common from "../styles/common";
import playLogo from '../images/youtube-logo.png';
import StarRating from "react-native-star-rating";
import {MONTHS} from "../Constants";


// Customer profile. Shows the cook assigned to you and latest orders
export default class TodaysCooking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    find(scheduledId, schedules) {
        for (let i = 0; i < schedules.length; i++) {
            if (schedules[i].id === scheduledId) {
                return schedules[i];
            }
        }
        return null;
    }
    getTimeStr(epochMs) {
        epochMs = parseInt(epochMs);
        epochMs += 330*60*1000;             // To get time in Asia/Kolkata timezone
        const d = new Date(epochMs);
        const h = d.getUTCHours();
        const m = d.getUTCMinutes();
        return this.formatHrMins(h, m);
    }
    formatHrMins(hr, mins) {
        hr = parseInt(hr);
        mins = parseInt(mins);

        hr = hr <= 9 ? '0' + hr : hr;
        mins = mins <= 9 ? '0' + mins : mins;
        return hr + ':' + mins + ' ' + (hr > 11 ? 'pm' : 'am');
    }
    durationMins(schedule) {
        return (schedule.timeSlot.toHr - schedule.timeSlot.fromHr) * 60 + (schedule.timeSlot.toMins - schedule.timeSlot.fromMins);
    }
    orderDurationMins(order) {
        const millis = parseInt(order.finishedAt) - parseInt(order.startedAt);
        return Math.round(millis / (60*1000));
    }

    render() {
        const customerProfile = this.props.customerProfile;

        if (!('ordersPendingRating' in customerProfile) || customerProfile.ordersPendingRating.length === 0) {
            return (<View/>);
        }
        const order = customerProfile.ordersPendingRating[0];
        const orderDate = parseInt(order.date.split('-')[2]);
        const orderMonth = parseInt(order.date.split('-')[1]);
        const schedule = this.find(order.scheduledId, customerProfile.schedules);
        const startedAt = order['startedAt'] ? this.getTimeStr(order.startedAt) : this.formatHrMins(schedule.timeSlot.fromHr, schedule.timeSlot.fromMins);
        const durationMins = order['startedAt'] && order['finishedAt'] ? this.orderDurationMins(order) : this.durationMins(schedule);
        const scheduledStartTime = this.formatHrMins(schedule.timeSlot.fromHr, schedule.timeSlot.fromMins);
        const scheduledEndTime = this.formatHrMins(schedule.timeSlot.toHr, schedule.timeSlot.toMins);

        const veryLightColor = '#909090';
        const lightColor = '#606060';
        const headingStyle = { fontSize: 20, color: TEXT_COLOR, fontWeight: '500' };
        const subHeadingStyle = { fontSize: 18, color: TEXT_COLOR };
        const rightScheduledStartTimeStyle = { fontSize: 15, color: veryLightColor, marginRight: 10};
        const durationStyle = { fontSize: 17, color: TEXT_COLOR, fontWeight: '300' };
        const fromToTimeStyle = { fontSize: 16, color: veryLightColor };
        const whatWasTheFoodStyle = { fontSize: 14, color: lightColor, textAlign: 'center' };

        const onStarRatingPressFn = (r) => this.props.onStarRatingPressFn(r, order);

        // setTimeout(() => this.onStarRatingPressFn(3), 2000);
        return (
            <Fragment>
                <View style={[{ width: '100%', backgroundColor: 'white' }, common.justifyAlignCenter, { } ]}>
                    <View style={{ width: '90%', borderWidth: 1, borderRadius: 2, padding: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={headingStyle}>COOKING - {orderDate} {MONTHS[orderMonth - 1].substring(0, 3)}</Text>
                            <Text style={rightScheduledStartTimeStyle}>{startedAt}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ marginLeft: 5 }}>
                                <Text style={subHeadingStyle}>Duration</Text>
                                <Text style={durationStyle}>{durationMins} mins <Text style={fromToTimeStyle}>({scheduledStartTime} - {scheduledEndTime})</Text></Text>
                            </View>
                            <TouchableOpacity style={{ }} onPress={() => {Toast.show('Coming soon !', Toast.LONG)}}>
                                <View style={[common.justifyAlignCenter, { width: 80, backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 0 }]}>
                                    <Image style={{ height: 20, width: 20 }} source={playLogo} />
                                    <Text style={whatWasTheFoodStyle}>WHAT WAS THE FOOD</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[common.justifyAlignCenter, { borderWidth: 1, borderRadius: 2, width: '80%', padding: 5, backgroundColor: 'white' }]}>
                        <StarRating disabled={false} maxStars={5} rating={0} selectedStar={onStarRatingPressFn}
                                    fullStarColor={TEXT_COLOR} starStyle={{ marginLeft: 7 }} starSize={26} />
                    </View>
                </View>
            </Fragment>
        );

        // ReactNative BUG: Putting text above StarRating is causing problems
        // <Text style={subHeadingStyle}>How was the food, please rate</Text>
    }
}

const custom = StyleSheet.create({
});
