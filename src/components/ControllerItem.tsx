import classNames from "classnames";
import { Component } from "solid-js";
import { Controller } from "../pages/home";

interface Props {
    data: Controller;
    onClick(): void;
    activeController(): number;
}
const ControllerItem: Component<Props> = ({data,onClick, activeController}) => {

    console.log(activeController() === data.id)
    return (
        <div onClick={onClick} class={classNames('py-2 px-4 bg-white shadow-lg border-2 hover:border-black cursor-pointer', {
            'border-black': activeController() === data.id,
            'border-transparent': activeController() !== data.id,
        })}>
            <h2 class="text-2xl text-bold">📡 {data.name}</h2>
            <p class="text-lg">{data.location}</p>
        </div>
    )
};

export default ControllerItem;