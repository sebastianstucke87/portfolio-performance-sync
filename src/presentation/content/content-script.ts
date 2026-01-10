import {Container} from '../container.js';

const container = new Container(window.location.origin);
const controller = container.createContentScriptController();
controller.register();
