import classNames from "classnames";
import { Component } from "solid-js";
import { Controller } from "../pages/home";

interface Props {
    data: Controller;
    onClick(): void;
    activeController(): number;
    alive(): boolean;
}
const ControllerItem: Component<Props> = ({data,onClick, activeController, alive}) => {

    console.log(activeController() === data.id)
    return (
        <div onClick={onClick} class={classNames('py-2 px-4 bg-white shadow-lg border-2 hover:border-black cursor-pointer', {
            'border-black': activeController() === data.id,
            'border-transparent': activeController() !== data.id,
        })}>
            <h2 class="text-2xl text-bold">{alive() ? '📡' : '❌'} {data.name}</h2>
            <p class="text-lg">{data.location}</p>
        </div>
    )
};

export default ControllerItem;