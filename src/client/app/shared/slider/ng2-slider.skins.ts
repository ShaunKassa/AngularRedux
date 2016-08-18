import {IStyledConfig} from './ng2-styled.directive';

    export var skins:IStyledConfig = {
        default: {
            block: [
                ".filterContainer {width:208px; margin:0px;}",
                ".range-ribbon {position: absolute; width: 200px; height: 16px; background:#273142; top: 4px; display:flex; flex-direction:row;}",
                ".slider-handle {position: absolute;  background: #00C9FF; width: 5px; height: 24px;}",
                ".slider-handle.sliding {position: absolute;  background: #00C9FF; width: 5px; height: 24px;}",
                "* { box-sizing: content-box;}",
				".left-color { background-color:#BEC8D2;}",
				".middle-color { background-color:#9398A0;}",
                "input::-webkit-inner-spin-button {display:none;}",
                ".filterInputLow {text-align:center; color:#BEC8D2; padding-top:0px; border:none; background-color:#EBF0F2; font-style:Italic; font-family:consolas;}",
                ".filterInputMedium {text-align:center; color:#9398A0; padding-top:0px; border:none; background-color:#EBF0F2;font-style:Italic; font-family:consolas;}",
                ".filterInputHigh {text-align:center; color:#273142; padding-top:0px; border:none; background-color:#EBF0F2;font-style:Italic; font-family:consolas;}",
				".filterValues {width:200px; height:24px; margin-left:4px; margin-right:4px;}"
            ]
        }
    };
