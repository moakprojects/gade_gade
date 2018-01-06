import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { GoogleMaps, GoogleMap, GoogleMapsEvent } from '@ionic-native/google-maps';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  cityNames: string[] = [];
  objectKeys: any;
  map: GoogleMap;
  games: any[] =[];
  logged: boolean = false;

  gamesKey: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseService: DatabaseProvider, private googleMaps: GoogleMaps, private ngZone: NgZone) {
    this.databaseService.getSelectableCitysFromDataBase().subscribe(data => {

      this.cityNames = data[2];
      this.objectKeys = Object.keys(this.cityNames);
    
      this.databaseService.getGamesFromDataBase().subscribe(games => {
        if(this.logged) {

        } else {
          
          for(let i = 0; i < this.objectKeys.length; i++) {
            this.gamesKey = Object.keys(games[0][this.cityNames[i]]);
            console.log('város neve', games[0][this.cityNames[i]]);
            for(let j = 1; j <= this.gamesKey.length; j++) {
              let aux = '';
              if(j < 10) {
                aux = 'game_0' + j;
              } else {
                aux = 'game_' + j;
              }
              console.log('aux', aux);
              console.log('jatek', games[0][this.cityNames[i]][aux]);
              this.games.push(games[0][this.cityNames[i]][aux]);
              console.log('gamestömb', this.games);
            }
          }
        }
      });
      this.loadMap();
    });
  }

  loadMap() {
    console.log("futik a mapsz");
    this.map = new GoogleMap('map', {
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'target': {
          lat: 55.472376,
          lng: 8.442486
        },
        'tilt': 0,
        'zoom': 17
      }
    });
    console.info('this.map', JSON.stringify(this.map));
    this.map.on(GoogleMapsEvent.MAP_READY)
    .subscribe(() => {
      for(let i=0; i<this.games.length; i++){
        this.map.addMarker({
          title: this.games[i].title,
          icon: 'red',
          animation: 'DROP',
          position: {
            lat: this.games[i].start_point_lat, 
            lng: this.games[i].start_point_lng
          }
        });
      }
    });
  }

  test() {
    console.log("hopp mükszik");
  }

  ionViewWillEnter() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(0)';
        tabs[ key ].style.display = 'flex';
      });
    } // end if
  }

}
