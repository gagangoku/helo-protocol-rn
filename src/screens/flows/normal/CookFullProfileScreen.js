import React from "react";
import {INFO_BORDER_COLOR, TEXT_COLOR} from "../../../Styles";
import {
    age,
    capitalizeFirstLetter,
    fabBottomButton,
    getContext,
    getImageUrl,
    getThumbImage,
    hashCode,
    navigateTo,
} from "../../../util/Util";
import {shareAndRecommendationIcons, StarRating, Toast, UserAvatar} from "../../../NativeBindings";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import lockIcon from "../../../images/lock.png";
import verifiedIcon from "../../../images/verified.png";
import quotationBeginIcon from "../../../images/quotation-begin.png";
import quotationEndIcon from "../../../images/quotation-end.png";
import infoIcon from '../../../images/info.png';
import forkKnifeIcon from "../../../images/forkKnife.png";
import spokenLanguageIcon from "../../../images/icon-oral-language.png";
import {
    COOK_SRP_MAX_CUISINES_LENGTH,
    COOK_SRP_MAX_LANGUAGES_LENGTH,
    RUPEE_SYMBOL,
    STARTING_PRICE
} from '../../../Constants';
import common from "../../../styles/common";
import FullImageScreen from "./FullImageScreen";


// Full profile of cook
export class CookFullProfileScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Cook Profile',
        headerRight: shareAndRecommendationIcons(navigation),
    });
    static URL = '/normal/cook-full-profile';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.customerProfile = this.ctx.customerProfile;
        this.cookProfile = this.customerProfile['supplies'][0];
    }

    render() {
        return (
            <ScrollView>
                <CookFullProfileWidget cookProfile={this.cookProfile} onPicClickFn={_onPicClickFn(this)} miniProfile={false} />
            </ScrollView>
        );
    }
}

class CookFullProfileWidget extends React.Component {
    constructor(props) {
        super(props);
        this.ctx = getContext(props);
        this.cookProfile = this.props.cookProfile;
        this.onPicClickFn = this.props.onPicClickFn;
        this.miniProfile = this.props.miniProfile;
    }

    render() {
        console.log('this.cookProfile: ', this.cookProfile);
        const obj = this;

        const borderColor = INFO_BORDER_COLOR;
        const textColor = TEXT_COLOR;
        const textColorLight = '#808080';

        const borderBottomStyle = { borderBottomWidth: 1, borderColor: borderColor };
        const cellStyle = { borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: borderColor };

        let thumbImageUrl = getImageUrl(getThumbImage(this.cookProfile['person']));
        console.log('thumbImageUrl:', thumbImageUrl);
        let fullImageUrl = getImageUrl(this.cookProfile['person']['image']);
        console.log('fullImageUrl:', fullImageUrl);

        let cookId = this.cookProfile['person']['id'];
        let cookDisplayId = this.cookProfile['person']['presentAddress']['city'] + '-' + hashCode(cookId) % 1000000;
        let rating = this.cookProfile['rating'];
        rating = isNaN(rating) ? 5 : parseInt(rating);
        let gender = this.cookProfile['person']['gender'];
        let herWordsTitle = gender === 'FEMALE' ? 'IN HER OWN WORDS' : 'IN HIS OWN WORDS';
        let dateOfBirth = this.cookProfile['person']['dateOfBirth'] || '1988-01-01';
        let ageYears = Math.round(age(dateOfBirth));
        let workingSinceDate = this.cookProfile['startedWorkingSinceDate'] || '2008-01-01';
        let experience = Math.round(age(workingSinceDate));
        let inHisOwnWords = this.cookProfile['inHisOwnWords'];
        inHisOwnWords = inHisOwnWords ? inHisOwnWords : 'Coming soon';

        let originCity = this.cookProfile['person']['hometownAddress']['city'] || 'Karnataka';
        let originState = this.cookProfile['person']['hometownAddress']['state'] || '';
        let origin = originCity + ', ' + originState;
        let cookName = this.cookProfile['person']['name'];

        let cuisines = this.cookProfile['cuisines'] ? this.cookProfile['cuisines'] : ['CHINESE', 'BENGALI', 'NORTH_INDIAN', 'SOUTH_INDIAN'];
        cuisines = cuisines.map((x) => capitalizeFirstLetter(x.toLowerCase().replace('_', ' ')));

        let languagesKnown = this.cookProfile['person']['languages'];
        languagesKnown = languagesKnown ? languagesKnown : ['HINDI', 'KANNADA', 'ENGLISH'];
        languagesKnown = languagesKnown.map((x) => capitalizeFirstLetter(x.toLowerCase().replace('_', ' ')));

        let localities = this.cookProfile['localitiesWorkingIn'] || ['Indiranagar', 'Ejipura', 'Laville road', 'MG Road'];
        let cookAddress = this.miniProfile ? this.cookProfile['person']['presentAddress']['area'] : this.cookProfile['person']['presentAddress']['fullAddress'];
        let verifiedDocuments = this.miniProfile ? [] : (this.cookProfile['person']['documents'] ? this.cookProfile['person']['documents'] : []);

        let startingSalary = 3200;

        const headerStyle = { fontWeight: '500', fontSize: 17, color: textColor, marginTop: 10, marginBottom: 10 };
        const rowHeaderStyle = { fontWeight: '400', fontSize: 15, color: textColor, marginTop: 10, marginLeft: 10 };
        const rowTextStyle = { fontWeight: '100', fontSize: 11, color: textColorLight, marginBottom: 10, marginLeft: 10 };

        const quoteImageStyle = { resizeMode: 'stretch', height: 81*0.6, width: 100*0.6, opacity: 0.05, position: 'absolute', zIndex: 1 };

        let _viewButton = (idx, name, number, documentImageUrl) => {
            let _viewDocument = () => {
                console.log('view document:', idx, name, number);
                obj.onPicClickFn(documentImageUrl, name);
            };
            return (
                <TouchableOpacity style={{}} onPress={_viewDocument}>
                    <View style={{ width: 70, height: 30, borderWidth: 1, borderRadius: 5 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ resizeMode: 'stretch', height: 20, width: 20 }} source={lockIcon} />
                            <Text style={[{ borderWidth: 0, marginLeft: 5, marginRight: 5, fontWeight: '700' }]}>VIEW</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        };
        let _document = (idx, name, number, uri) => {
            const documentImageUrl = getImageUrl(uri);
            return (
                <View style={[{ flex: 1, flexDirection: 'row', width: '100%' }, cellStyle]} key={idx}>
                    <View style={{ width: '70%'}}>
                        <Text style={rowHeaderStyle}>{name}</Text>
                        <Text style={rowTextStyle}>{number}</Text>
                    </View>

                    <View style={{ width: '30%', alignItems: 'center', justifyContent: 'center' }}>
                        {_viewButton(idx, name, number, documentImageUrl)}
                    </View>
                </View>
            );
        };
        let _onInfoClick = () => Toast.show('Coming soon. Please check prices on website for now', Toast.LONG);

        const topBarHeight = 120;
        const thumbImageHeight = topBarHeight * 0.3;
        const verifiedIconStyle = { height: 50, width: 50, position: 'absolute', bottom: 10, right: 10, opacity: 0.3, zIndex: 1 };

        const topBarCookNameStyle = { fontWeight: '500', fontSize: 19, color: textColor };
        const topBarCookTextStyle = { fontWeight: '400', fontSize: 15, color: textColor };

        let verifiedDocumentsSection = verifiedDocuments.length === 0 ? <View/> : (
            <View style={{ width: '80%', borderWidth: 0, paddingLeft: 10 }}>
                <View style={{ height: 20 }} />
                <Text style={headerStyle}>VERIFIED DOCUMENTS</Text>

                {verifiedDocuments.map((item, i) => {
                    let d = verifiedDocuments[i];
                    return _document(i, d['type'] + '-' + d['metadata'], d['documentId'], d['uri']);
                })}

                <View style={borderBottomStyle} />
            </View>
        );
        return (
            <ScrollView>
                <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                    <View style={{ width: '100%', height: topBarHeight, backgroundColor: '#CACACA', marginBottom: 10, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: '40%', borderWidth: 0, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{}} onPress={() => this.onPicClickFn(fullImageUrl, cookName)}>
                                <UserAvatar size={thumbImageHeight * 2} name={cookName}
                                            src={thumbImageUrl} style={{ borderColor: TEXT_COLOR, borderWidth: thumbImageHeight-1 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '60%', borderWidth: 0, zIndex: 10 }}>
                            <Text style={topBarCookNameStyle}>{cookName}</Text>
                            <Text style={topBarCookTextStyle}>{gender}, {ageYears} Yrs Old</Text>
                            <Text style={topBarCookTextStyle}>{cookDisplayId}</Text>
                            <View style={{ width: 80, marginTop: 5 }}>
                                <StarRating disabled={true} maxStars={5} rating={rating}
                                            fullStarColor={TEXT_COLOR} starStyle={{ margin: 0, padding: 0 }} starSize={14} />
                            </View>
                        </View>

                        <Image style={verifiedIconStyle} source={verifiedIcon} />
                    </View>

                    <View style={{ width: '80%', borderWidth: 0, }}>
                        <Image style={[quoteImageStyle, { top: 0, left: 0 }]} source={quotationBeginIcon} />
                        <Text style={[headerStyle, { marginTop: 20, marginLeft: 10, zIndex: 10 }]}>{herWordsTitle}</Text>
                    </View>
                    <View style={{ width: '80%', borderWidth: 0 }}>
                        <Text style={[rowHeaderStyle, { marginLeft: 10, marginTop: 10, zIndex: 10 }]}>{inHisOwnWords}</Text>
                        <Text style={{ height: 35 }} />
                        <Image style={[quoteImageStyle, { bottom: 0, right: 0 }]} source={quotationEndIcon} />
                    </View>


                    <View style={{ width: '80%', borderWidth: 0, paddingLeft: 10 }}>
                        <View style={{ height: 0 }} />
                        <Text style={headerStyle}>EXPERIENCE</Text>

                        <View style={[cellStyle]}>
                            <Text style={rowHeaderStyle}>Starting salary</Text>
                            <Text style={rowTextStyle}>{RUPEE_SYMBOL} {startingSalary} per month</Text>
                            <View style={{ height: '100%', flex: 1, position: 'absolute', right: 10, justifyContent: 'center' }}>
                                <TouchableOpacity style={{}} onPress={_onInfoClick}>
                                    <Image style={{ resizeMode: 'stretch', height: 20, width: 20, }} source={infoIcon} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[cellStyle]}>
                            <Text style={rowHeaderStyle}>Total Experience</Text>
                            <Text style={rowTextStyle}>{experience} years</Text>
                        </View>
                        <View style={[cellStyle]}>
                            <Text style={rowHeaderStyle}>Origin</Text>
                            <Text style={rowTextStyle}>{origin}</Text>
                        </View>
                        <View style={[cellStyle]}>
                            <Text style={rowHeaderStyle}>Languages known ({languagesKnown.length})</Text>
                            <Text style={rowTextStyle}>{languagesKnown.join(', ')}</Text>
                        </View>
                        <View style={[cellStyle]}>
                            <Text style={rowHeaderStyle}>Cuisines ({cuisines.length})</Text>
                            <Text style={rowTextStyle}>{cuisines.join(', ')}</Text>
                        </View>
                        <View style={[cellStyle]}>
                            <Text style={rowHeaderStyle}>Address</Text>
                            <Text style={rowTextStyle}>{cookAddress}</Text>
                        </View>

                        <View style={borderBottomStyle} />
                    </View>

                    {verifiedDocumentsSection}

                    <View style={{ height: 50 }} />
                </View>
            </ScrollView>
        );
    }
}


// Mini profile - during signup flow
export class CookMiniProfileScreen extends React.Component {
    static navigationOptions = {
        title: 'Chef details',
    };
    static URL = '/normal/cook-mini-profile';

    constructor(props) {
        super(props);
        this.ctx = getContext(props);
    }

    onSubmit() {
        // Do nothing
        // navigateTo(this, CuisinesLanguagesScreen.URL);
    }
    render() {
        if (!this.ctx.customerRequirement.cookSelected) {
            console.error('No cook selected');
            return (<View><Text>Select a cook</Text></View>);
        }
        return (
            <View style={common.containerCenter}>
                <ScrollView>
                    <CookFullProfileWidget cookProfile={this.ctx.customerRequirement.cookSelected} onPicClickFn={_onPicClickFn(this)} miniProfile={true} />
                </ScrollView>

                {fabBottomButton('BOOK', () => this.onSubmit())}
            </View>
        );
    }
}


// Search results profile - during signup flow
export class CookSearchResultsProfile extends React.Component {
    constructor(props) {
        super(props);
        this.cook = this.props.cook;
        this.width = this.props.width;
        this.height = this.props.height;
        this.onChooseCookFn = this.props.onChooseCookFn;
    }

    searchResult(cook) {
        const margin = 5;
        const w = this.width;
        const starSize = 18;

        const borderColor = INFO_BORDER_COLOR;
        const textColor = TEXT_COLOR;
        const imageSize = w * 0.2;

        let imageUrl = getImageUrl(getThumbImage(cook['person']));
        console.log('imageUrl:', imageUrl);

        let cookName = cook['person']['name'];
        let gender = cook['person']['gender'];
        let workingSinceDate = cook['startedWorkingSinceDate'] || '2008-01-01';
        let experience = Math.round(age(workingSinceDate));
        let experienceStr = gender + ' | ' + experience + ' yrs exp';

        let rating = 4.5;                       // TODO: Fix this
        let startingPrice = STARTING_PRICE;     // TODO: Fix this

        let cuisines = cook['cuisines'] ? cook['cuisines'] : ['CHINESE', 'BENGALI', 'NORTH_INDIAN', 'SOUTH_INDIAN'];
        cuisines = cuisines.map((x) => capitalizeFirstLetter(x.toLowerCase().replace('_', ' '))).join(', ');
        if (cuisines.length > COOK_SRP_MAX_CUISINES_LENGTH) {
            cuisines = cuisines.substr(0, COOK_SRP_MAX_CUISINES_LENGTH) + ' ...';
        }

        let languagesKnown = cook['person']['languages'];
        let languages = languagesKnown ? languagesKnown : ['HINDI', 'KANNADA', 'ENGLISH'];
        languages = languages.map((x) => capitalizeFirstLetter(x.toLowerCase().replace('_', ' '))).join(', ');
        if (languages.length > COOK_SRP_MAX_LANGUAGES_LENGTH) {
            languages = languages.substr(0, COOK_SRP_MAX_LANGUAGES_LENGTH) + ' ...';
        }

        const cookNameStyle = { fontWeight: '500', fontSize: 16, color: textColor, marginLeft: 2 };
        const experienceStyle = { fontSize: 15, color: textColor, marginLeft: 2 };
        const cuisineLanguageStyle = { fontSize: 15, color: textColor, flex: 1, flexWrap: 'wrap' };

        return (
            <TouchableOpacity onPress={ () => this.onChooseCookFn(cook) }>
                <View style={{ borderWidth: 1, borderColor: borderColor, borderRadius: 4, height: this.height, width: w - 2*margin, padding: margin, margin: margin, justifyContent: 'flex-start' }}>
                    <View style={{ height: 5}} />

                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 5, marginBottom: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'row', width: w/2 - margin, height: starSize }}>
                                <View style={{ width: starSize + 10, height: starSize, paddingLeft: 10 }}>
                                    <StarRating disabled={true} maxStars={1} rating={1} fullStarColor={TEXT_COLOR} starSize={starSize} />
                                </View>
                                <Text>{rating}</Text>
                            </View>

                            <View style={{ width: w/2 - margin, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 10 }}>
                                <Text>{RUPEE_SYMBOL} {startingPrice}*</Text>
                            </View>
                        </View>

                        <View style={{ height: 5}} />
                        <UserAvatar size={imageSize * 2} name={cookName} src={imageUrl} style={{ borderColor: TEXT_COLOR }} />
                    </View>


                    <View style={{ height: 5 }} />
                    <Text style={ cookNameStyle }>{cookName}</Text>
                    <Text style={ experienceStyle }>{experienceStr}</Text>
                    <View style={{ height: 2 }} />
                    <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 5 }}>
                        <Image source={forkKnifeIcon} style={{ resizeMode: 'stretch', height: w * 0.1, width: w * 0.1, marginLeft: 2, marginRight: 5 }} />
                        <Text style={cuisineLanguageStyle}>{cuisines}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center', paddingRight: 5 }}>
                        <Image source={spokenLanguageIcon} style={{ resizeMode: 'stretch', height: w * 0.1, width: w * 0.1, marginLeft: 2, marginRight: 5 }} />
                        <Text style={cuisineLanguageStyle}>{languages}</Text>
                    </View>
                    <View style={{ height: 5 }} />
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return this.searchResult(this.cook);
    }
}

const _onPicClickFn = (obj) => (imageUrl, cookName) => {
    if (imageUrl) {
        navigateTo(obj, FullImageScreen.URL, {imageUrl: imageUrl, title: cookName});
    }
};

const custom = StyleSheet.create({
});
