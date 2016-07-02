import React, {Component} from 'react';
import 'aframe';
import './util/shorthand';
import {Scene, Entity} from 'aframe-react';
import Sky from './components/Sky';
import PointCloud from './components/PointCloud';

const thoms = [
  require('./jsonData/1005.csv.json'),
  require('./jsonData/1010.csv.json'),
  require('./jsonData/1015.csv.json'),
  require('./jsonData/1020.csv.json'),
  require('./jsonData/1025.csv.json'),
  require('./jsonData/1030.csv.json'),
  require('./jsonData/1035.csv.json'),
  require('./jsonData/1040.csv.json'),
  require('./jsonData/1045.csv.json'),
  require('./jsonData/1050.csv.json'),
  require('./jsonData/1055.csv.json'),
  require('./jsonData/1060.csv.json'),
  require('./jsonData/1065.csv.json'),
  require('./jsonData/1070.csv.json'),
  require('./jsonData/1075.csv.json'),
  require('./jsonData/1080.csv.json'),
  require('./jsonData/1085.csv.json'),
  require('./jsonData/1090.csv.json'),
  require('./jsonData/1095.csv.json'),
  require('./jsonData/1100.csv.json'),
]
  .map(stars => stars.map(star => [star.x / 10, star.y / -10, star.z / 10]));
// const thoms = _.range(1001, 2102, 100)
//   .map(i => require(`./jsonData/${i}.csv.json`)
//     .map(star => [star.x / 10, star.y / -10, star.z / 10])
//   );

export class App extends Component {
  render() {
    const {cursor} = this.props;
    const leapCur = cursor.refine('leapMotion');

    return (
      <Scene onEnterVR={() => {leapCur.refine('isVR').set(true);}}
             onExitVR={() => {leapCur.refine('isVR').set(false);}}
      >
        <Entity camera look-controls wasd-controls="fly: true"/>
        <Sky/>
        <PointCloud vertices={thoms} dotSize={20} gap={5} position="0 10 -10" rotation={`0 0 0`} color="#457" dotImage='images/radio.png'/>

      </Scene>
    );
  }
}