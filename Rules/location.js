/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
import * as geolocation from '@nativescript/geolocation'
import { CoreTypes } from '@nativescript/core'
CoreTypes.Accuracy
export default function location(clientAPI) {
    let targetCtrl = clientAPI._context.evaluateTargetPath("#Page:Customers_Detail/#Control:MyMapExtension");

    geolocation.enableLocationRequest()

    geolocation.getCurrentLocation({
        desiredAccuracy: 20,
        maximumAge: 5000,
        timeout: 20000
    }).then((value) => {

        // alert('value ' + value.latitude + ' - ' + value.longitude); // 👉️ "hello"
        targetCtrl.setValue('nguyenn van vuot', true);
    }).catch((err) => {
        alert(err);
    });
}
