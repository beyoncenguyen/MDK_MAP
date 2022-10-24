/**
 * Describe this function...
 * @param {IClientAPI} clientAPI
 */
import * as geolocation from '@nativescript/geolocation'
import { CoreTypes } from '@nativescript/core'
CoreTypes.Accuracy
export default function location(clientAPI) {
   
    geolocation.enableLocationRequest()

    geolocation.getCurrentLocation({
        desiredAccuracy: 20,
        maximumAge: 5000,
        timeout: 20000
      }).then((value) => {
       alert('value ' + value.latitude + ' - ' + value.longitude); // 👉️ "hello"
      }).catch((err) => {
        alert(err);
      });
}
