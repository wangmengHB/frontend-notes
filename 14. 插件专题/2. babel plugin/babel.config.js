const CustomPlugin = require('./babel.plugin');

/*
CustomPlugin convert the below code:

import Sanitize from 'seismic-toolkit/lib/sanitize';
--->
import { Sanitize } from 'seismic-toolkit';

*/


module.exports = {
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
    ],
    "plugins": [
        // [ 
        //     CustomPlugin, 
        //     { 
        //         "sourcePathName": "seismic-toolkit/lib/sanitize", 
        //     } 
        // ],
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-transform-runtime"
        
    ]
}
