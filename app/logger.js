'use strict';
import {system} from './defaults.js';

export default function logger (name, variable) {
  var self = this;
  if (self.options.debug) {
    console.info('==favorites==');
    console.log(name);
    if (variable) {
      console.log(variable);
    }
    console.log('///////////////////');
    console.log('///favorites//////');
    console.log('/////////////////');
  }
};
