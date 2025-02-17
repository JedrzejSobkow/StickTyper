import { TypingController, TypingModel, TypingView } from './typing.js';
import { LifeController, LifeModel, LifeView } from './life.js';
import { OneDirectionFunCollection } from './one_direction_fun_collection.js'




const text = `The world is rapidly changing, and technology plays a crucial role in this transformation. Over the past few decades, advancements in various fields, from artificial intelligence to renewable energy, have reshaped the way we live, work, and interact with each other. As we move further into the 21st century, the pace of innovation is only accelerating, and it's clear that technology will continue to shape our future.`;


const life_loss_speed = 1;

function textSpeed(x) {
    return  4 * (x / (10000 + Math.abs(x)));
}
const text_speed_fun_collection = new OneDirectionFunCollection(textSpeed, 0.25, 0);


const life_model = new LifeModel();
const life_view = new LifeView(".heart-fill");
const life_controller = new LifeController(life_model, life_view, life_loss_speed);


const typing_model = new TypingModel(text);
const typing_view = new TypingView();
const typing_controller = new TypingController(typing_model, typing_view, text_speed_fun_collection);

typing_controller.registerListener("collision", life_controller);


typing_controller.start();

