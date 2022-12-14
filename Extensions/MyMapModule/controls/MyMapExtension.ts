import * as app from '@nativescript/core/application';
import { IControl } from 'mdk-core/controls/IControl';
import { BaseObservable } from 'mdk-core/observables/BaseObservable';
import { EventHandler } from 'mdk-core/EventHandler'

export class MyMapClass extends IControl {
    private _observable: BaseObservable;
    private _mapView: any;
    private _geo: any;
    private _gMap: any;

    private _customerInfo = {
        lastName: "",
        houseNumber: "",
        street: "",
        city: "",
        country: "",
        postalCode: "",
        latitiude: "",
        longitude: ""
    }
    // public receiveMyLocation(myLocation: any){
    //     alert('myLocation '+ myLocation)
    // }

    public initialize(props: any): any {
        super.initialize(props);

        //Access the properties passed from Customers_Detail.page to the extension control.
        //in this tutorial, you will be accessing the customer's last name and address
        if (this.definition().data.ExtensionProperties.Prop) {
            var property = this.definition().data.ExtensionProperties.Prop;
            this._customerInfo.lastName = property.LastName;
            this._customerInfo.houseNumber = property.HouseNumber;
            this._customerInfo.street = property.Street;
            this._customerInfo.city = property.City;
            this._customerInfo.country = property.Country;
            this._customerInfo.postalCode = property.PostalCode;
        }

        if (app.android) {
            //You will display the Google Maps in a MapView.For more details on Google Maps API for android, visit
            //https://developers.google.com/android/reference/com/google/android/gms/maps/package-summary

            this._mapView = new com.google.android.gms.maps.MapView(app.android.context);
            var localeLanguage = java.util.Locale;

            //GeoCoder is required to convert a location to get latitude and longitude
            this._geo = new android.location.Geocoder(app.android.context, localeLanguage.ENGLISH);
            this._mapView.onCreate(null);
            this._mapView.onResume();

            //when mapview control is used, all the lifecycle activities has to be frowaded to below methods.
            app.android.on(app.AndroidApplication.activityPausedEvent, this.onActivityPaused, this);
            app.android.on(app.AndroidApplication.activityResumedEvent, this.onActivityResumed, this);
            app.android.on(app.AndroidApplication.saveActivityStateEvent, this.onActivitySaveInstanceState, this);
            app.android.on(app.AndroidApplication.activityDestroyedEvent, this.onActivityDestroyed, this);
            var that = this;

            //A GoogleMap must be acquired using getMapAsync(OnMapReadyCallback).
            //The MapView automatically initializes the maps system and the view

            var mapReadyCallBack = new com.google.android.gms.maps.OnMapReadyCallback({
                onMapReady: (gMap) => {
                    console.log("inside onMapReady function");
                    that._gMap = gMap;
                    var zoomValue = 6.0;
                    that._gMap.setMinZoomPreference = zoomValue;
                    var customerAddress = that._customerInfo.houseNumber + ' ' + that._customerInfo.street + ' ' + that._customerInfo.city + ' ' +
                        that._customerInfo.country + ' ' + that._customerInfo.postalCode;
                    var data = that._geo.getFromLocationName(customerAddress, 1);
                    var latLng = new com.google.android.gms.maps.model.LatLng(data.get(0).getLatitude(), data.get(0).getLongitude());
                    that._gMap.addMarker(new com.google.android.gms.maps.model.MarkerOptions().position(latLng).title(this._customerInfo.lastName +
                        "'s " + "location"));
                    that._gMap.moveCamera(new com.google.android.gms.maps.CameraUpdateFactory.newLatLng(latLng));
                }
            });
            this._mapView.getMapAsync(mapReadyCallBack);
        }

        if (app.ios) {

            /*initiating Apple Maps
            For more details on the Apple Maps visit
            https://developer.apple.com/documentation/mapkit */
            this._mapView = MKMapView.alloc().initWithFrame(CGRectMake(0, 0, 100, 100));
            this._mapView.zoomEnabled = true
            this._mapView.scrollEnabled = true
            this._mapView.showsCompass = true
            this._mapView.showsUserLocation = true;
            this._mapView.isUserLocationVisible = true
            this._mapView.showsScale = true
            this._mapView.showsZoomControls = true

        }
        // this._mapView.userTrackingMode = MKUserTrackingMode.follow

    }

    private onActivityPaused(args) {
        console.log("onActivityPaused()");
        if (!this._mapView || this != args.activity) return;
        this._mapView.onPause();
    }

    private onActivityResumed(args) {
        console.log("onActivityResumed()");
        if (!this._mapView || this != args.activity) return;
        this._mapView.onResume();
    }

    private onActivitySaveInstanceState(args) {
        console.log("onActivitySaveInstanceState()");
        if (!this._mapView || this != args.activity) return;
        this._mapView.onSaveInstanceState(args.bundle);
    }

    private onActivityDestroyed(args) {
        console.log("onActivityDestroyed()");
        if (!this._mapView || this != args.activity) return;
        this._mapView.onDestroy();
    }

    //In case of iOS you'll use CLGeocoder API to convert an address to get latitude and longitude.
    //NOTE - API getlatlang is called only on ios devices

    private getlatlang(customerAddress) {
        const that = this;
        return new Promise((resolve, reject) => {
            var latLng = new CLGeocoder();
            latLng.geocodeAddressStringCompletionHandler(customerAddress, function (placemarks, error) {
                if (error === null && placemarks && placemarks.count > 0) {
                    var pm = placemarks[0];
                    var cordinates = {
                        latitiude: "",
                        longitude: ""
                    }
                    cordinates.latitiude = pm.location.coordinate.latitude;
                    cordinates.longitude = pm.location.coordinate.longitude;
                    // cordinates.latitiude = this.myLocation?.latitude;
                    // cordinates.longitude = this.mylocation?.longitude;
                    // 21.035930618082922, 105.78288074507373
                    resolve(cordinates);
                } else {
                    reject();
                }
            });
        });
    }

    public view() {
        this.valueResolver().resolveValue([this._customerInfo.houseNumber, this._customerInfo.street, this._customerInfo.city, this._customerInfo
            .country, this._customerInfo.postalCode, this._customerInfo.lastName
        ], this.context)
            .then((address) => {

                this._customerInfo.houseNumber = address[0];
                this._customerInfo.street = address[1];
                this._customerInfo.city = address[2];
                this._customerInfo.country = address[3];
                this._customerInfo.postalCode = address[4];
                this._customerInfo.lastName = address[5];

                var customerAddress = address[0] + ' ' + address[1] + ' ' + address[2] + ' ' + address[3] + ' ' + address[4];
                console.log("customer's address = " + customerAddress);

                if (app.ios) {
                    // this.setValue('nguyen van vuot', true)
                    // alert('mylocation '+ this._mapView.isUserLocationVisible)
                    return this.getlatlang(customerAddress)
                        .then((cordinates) => {
                            /* below code is for the apple maps */
                            var latlong = CLLocationCoordinate2DMake(cordinates.latitiude, cordinates.longitude);
                            var annotation = MKPointAnnotation.alloc().init();
                            // MKUserTrackingButton.alloc().init(this._mapView)

                            annotation.coordinate = latlong;
                            annotation.title = this._customerInfo.lastName + "'s" + " location";
                            this._mapView.centerCoordinate = latlong;
                            this._mapView.addAnnotation(annotation);
                            //---------------???4???

                            
                            // let buttonItem = MKUserTrackingBarButtonItem.alloc().init(this._mapView);
                            // // buttonItem.frame = CGRect.alloc().init( 5, 25, 35, 35);
                            // this._mapView.addSubview(buttonItem);
                        });
                }
            });

        if (app.android) {
            return this._mapView;
        }
        if (app.ios) {
            return this._mapView;
        }
    }

    public viewIsNative() {
        return true;
    }

    public observable() {
        if (!this._observable) {
            this._observable = new BaseObservable(this, this.definition(), this.page());
        }
        return this._observable;
    }

    public setContainer(container: IControl) {
        // do nothing
    }

    public setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any> {
        // do nothing
        alert(value + notify)
        return Promise.resolve();
    }
}