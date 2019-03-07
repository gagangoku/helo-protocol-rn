import React from 'react';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GOOGLE_MAPS_API_KEY, LATITUDE_DELTA, LONGITUDE_DELTA} from "../Constants";
import {Geocoder, GooglePlacesAutocomplete, MapView, Toast} from '../NativeBindings';
import mapMarker from '../images/map-marker.png';
import currentLocationMarker from '../images/location-512.png';
import {fabBottomButton, getContext, haversineDistance} from '../util/Util';


// Signup - Location input screen
// There is some bug in this class, 3 customers location is set as initial map location. They claim to have moved the map to their location.
// Hypothesis: onRegion is not firing in time and maybe they are clicking submit button too soon.
// Fix: Making landmark mandatory. and ensuring location is within 500 meters of landmark
export default class MapLocationWidget extends React.Component {
    constructor(props) {
        super(props);
        this.ctx = getContext(props);

        // We set the region when onRegionComplete fires. This is because we don't want to re-render everything
        // in between region changes, it becomes very jerky.
        this.state = {
            gpsLocationLat: null,
            gpsLocationLon: null,

            landmarkLat: null,
            landmarkLon: null,
            addressEntered: '',
            city: null,
            area: null,

            latitude: null,
            longitude: null,
        };
    }

    componentDidMount() {
        Toast.show('Please enter a landmark, and then drag the map to your exact location', Toast.LONG);
    }

    onSubmit() {
        console.log('MapLocationWidget onSubmit: ', this.state);
        if (!this.state.landmarkLat) {
            Alert.alert(
                'Please enter a landmark !', this.props.landmarkReason,
                [{text: 'OK', onPress: () => {}}],
                { cancelable: false },
            );
            return;
        }

        const dist = haversineDistance(latLonFn(this.state.landmarkLat, this.state.landmarkLon), this.state);
        const thresh = DISTANCE_THRESHOLD_LANDMARK_METERS / 1000.0;
        console.log('distance from landmark, threshold: ', dist, thresh);

        const confirm = () => this.props.submitFn(this.state);
        if (dist > thresh) {
            Alert.alert(
                'Is this your exact home location ?',
                'The landmark you entered is more than ' + DISTANCE_THRESHOLD_LANDMARK_METERS + ' meters away. Your exact location and landmark will make coordination easier.',
                [{text: 'I WILL CHANGE IT', onPress: () => {}}, {text: 'IT\'S CORRECT', onPress: confirm}],
                { cancelable: false },
            );
        } else {
            confirm();
        }
    }

    _getSublocality = (response) => {
        const loc = response['results'][0]['address_components'];
        for (let i = 0; i < loc.length; i++) {
            if ('types' in loc[i] && loc[i]['types'].includes('sublocality')) {
                console.log('sublocality:', loc[i]['long_name']);
                return loc[i]['long_name'];
            }
        }
        return 'not_found';
    };

    _getCity = (response) => {
        const loc = response['results'][0]['address_components'];
        for (let i = 0; i < loc.length; i++) {
            if ('types' in loc[i] && loc[i]['types'].includes('locality')) {
                console.log('city:', loc[i]['long_name']);
                return loc[i]['long_name'];
            }
        }
        return 'not_found';
    };

    _onRegionChangeComplete = (region) => {
        console.log('onRegionChangeComplete: ', region);
        this.setState({
            latitude: region.latitude,
            longitude: region.longitude,
        });
    };

    _onMapReady = () => {
        console.log('map ready');

        // Get gps location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Gps position:', position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    gpsLocationLat: position.coords.latitude,
                    gpsLocationLon: position.coords.longitude,
                });
                this.refs.map.animateToCoordinate(position.coords, ANIMATION_DURATION_MS);
            },
            (error) => console.log('Gps position error:', error),
            {enableHighAccuracy: true, timeout: 10000},     // NOTE: This is needed to overwrite maximumAge parameter which causes problems: https://github.com/facebook/react-native/issues/7495
        );
    };

    _selectDestination = (dest) => {
        const address = dest['description'];
        console.log('destination:', address);

        Geocoder.from(address).then((response) => {
            const loc = response['results'][0]['geometry']['location'];
            console.log('geocoder response:', loc);

            this.setState({
                addressEntered: address,
                city: this._getCity(response),
                area: this._getSublocality(response),
                latitude: loc['lat'],
                longitude: loc['lng'],
                landmarkLat: loc['lat'],
                landmarkLon: loc['lng'],
            });
            this.refs.map.animateToCoordinate(latLonFn(loc['lat'], loc['lng']), ANIMATION_DURATION_MS);
        });
    };

    _moveToCurrentLocation = () => {
        console.log('Going to current gps location: ', this.state.gpsLocationLat, this.state.gpsLocationLon);
        if (this.state.gpsLocationLat !== null && this.state.gpsLocationLon !== null) {
            this.setState({
                latitude: this.state.gpsLocationLat,
                longitude: this.state.gpsLocationLon,
            });
            this.refs.map.animateToCoordinate(latLonFn(this.state.gpsLocationLat, this.state.gpsLocationLon), ANIMATION_DURATION_MS);
        } else {
            Toast.show('GPS location not detected yet. Please enter the landmark');
        }
    };

    _clearAddress = () => {
        console.log('clear called');
        this.refs.googlePlaces.setAddressText('');
        this.setState({
            addressEntered: '',
            landmarkLat: null,
            landmarkLon: null,
        });
    };

    render() {
        const clearAddressBtn = () => (
            <TouchableOpacity style={custom.clearAddressButtonCtr} onPress={() => this._clearAddress()}>
                <Text style={custom.clearAddressButton}>X</Text>
            </TouchableOpacity>
        );

        return (
            <View style={{ flex: 1 }}>
                <MapView ref="map" style={{ flex: 1, zIndex: -1 }} initialRegion={INITIAL_REGION}
                         onRegionChangeComplete={this._onRegionChangeComplete}
                         showsUserLocation={true} onMapReady={this._onMapReady} showsScale={true} />
                <Image style={custom.mapCenterMarker} source={mapMarker} />
                <TouchableOpacity style={custom.mapCurrentLocationMarker} onPress={ () => this._moveToCurrentLocation() }>
                    <Image style={{ height: 42, width: 42 }} source={currentLocationMarker} />
                </TouchableOpacity>

                {fabBottomButton('DONE', () => this.onSubmit())}

                <GooglePlacesAutocomplete ref="googlePlaces" placeholder='Enter landmark, then drag to your location !'
                                          autoFocus={true} minLength={3} listViewDisplayed={false} fetchDetails={false}
                                          onPress={this._selectDestination} textInputProps={{clearButtonMode: 'never'}}
                                          query={{ key: GOOGLE_MAPS_API_KEY, language: 'en', location: BANGALORE_CENTER, radius: 30000 }}
                                          styles={googlePlacesSearchStyles} debounce={200} renderRightButton={clearAddressBtn} />

            </View>
        );
    }
}

const BANGALORE_CENTER = '12.972540,77.619452';

// Trinity circle, Bangalore
const INITIAL_REGION = {
    latitude: 12.972540,
    longitude: 77.619452,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
};
const DISTANCE_THRESHOLD_LANDMARK_METERS = 500.0;                   // location should not be more than 500 meters from landmark
const ANIMATION_DURATION_MS = 200;
const latLonFn = (lat, lon) => ({latitude: lat, longitude: lon});

const custom = StyleSheet.create({
    map: {
        flex: 1,
        zIndex: -1,
    },
    mapCenterMarker: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -21,
        marginTop: -42,
        height: 42,
        width: 42,
        zIndex: 10,
    },
    mapCurrentLocationMarker: {
        position: 'absolute',
        left: '85%',
        top: '85%',
        height: 42,
        width: 42,
        zIndex: 10,
    },
    mapConfirmLocationButton: {
        position: 'absolute',
        bottom: '5%',
        height: 40,
        width: '100%',
        zIndex: 10,

        elevation: 4,
        // Material design blue from https://material.google.com/style/color.html#color-color-palette

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    clearAddressButtonCtr: {
        marginRight: 5,
    },
    clearAddressButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
});

const H = 50;
const googlePlacesSearchStyles = {
    container: {
        zIndex: 10,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,

        position: 'absolute',
        top: 10,
        left: '3%',
        width: '94%',
        right: '3%',
        backgroundColor: 'white',
    },
    textInputContainer: {
        elevation: 8,
        width: '100%',
        backgroundColor: '#FFF',
        height: H,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        width: '90%',
    },
    listView: {
        backgroundColor: '#FFF',
    },
};
