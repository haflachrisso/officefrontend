import classNames from 'classnames';
import { Component, createEffect, createResource, createSignal, For, onMount, Show } from 'solid-js';
import ControllerItem from '../components/ControllerItem';

const fetchLastTemp = async (): Promise<Temperature> => {

    const lastTemp: Temperature[] = await (await fetch('http://192.168.1.147:8080/api/tempMeasurements/1')).json();

    return lastTemp[0];
}

const fetchLastHum = async (): Promise<Humidity> => {

    const lastHum: Humidity[] = await (await fetch('http://192.168.1.147:8080/api/humMeasurements/1')).json();

    return lastHum[0];
}

const fetchControllers = async (): Promise<Controller[]> => {
    return await (await fetch('http://192.168.1.147:8080/api/embeddedControllers')).json();
}

const fetchController = async (source: number): Promise<Controller> => {
        const controllerArr: Controller = await (await fetch('http://192.168.1.147:8080/api/embeddedController/'+source)).json();
        
        return controllerArr;
}

const formatDateString = (dateStr: string): string => {
    const dateTimeSplit = dateStr.split('T');
    const date = dateTimeSplit[0];
    const time = dateTimeSplit[1].split('.')[0];
    console.log(time);
    const dateSplit = date.split('-');
    const year = dateSplit[0];
    const month = dateSplit[1];
    const day = dateSplit[2];

    return `${time} ${day}-${month}-${year}`
}

interface Temperature {
  id: number;
  createdAt: string;
  tempCelcius: number;
  controllerId: number;
}
export interface Controller {
    id: number;
    createdAt: string;
    name: string;
    location: string;
    tempMeasurements: Temperature[];
    humMeasurements: Humidity[];
}

interface Humidity {
    id: number;
    createdAt: string;
    humPercent: number;
    controllerId: number;
  }

const fahrenheitOrCelcius = (temp: number, fahrenheit: boolean): string => {
    const calcedTemp = fahrenheit ? (temp * 1.8) +32 : temp;
    return `${calcedTemp.toFixed(2)}°${fahrenheit ? 'F' : 'C'}`;
}

const getEmojiTemp = (temp: number): string => {
    if(temp > 25) {
        return '🥵';
    };

    if(temp > 23) {
        return '😁';
    }

    if(temp > 20) {
        return '😊';
    }

    return '🥶';
}

const getEmojiHum = (hum: number): string => {
    if (hum > 50) {
        return '🏊‍♂️';
    }

    return '💧'
}

const Home: Component = () => {
    const [controllerId, setControllerId] = createSignal(1);
    const [currentTempData, {refetch: refetchTemp}] = createResource<Temperature>(fetchLastTemp);
    const [currentHumData, {refetch: refetchHum}] = createResource<Humidity>(fetchLastHum);
    const [controllersData] = createResource<Controller[]>(fetchControllers);
    const [controllerData] = createResource(controllerId, fetchController)
    const [tempString, setTempString] = createSignal('No Temp');
    const [fahrenheit, setFahrenheit] = createSignal(false);
    // read value
    createEffect(() => {
      setTempString(fahrenheitOrCelcius(currentTempData()?.tempCelcius ?? 0, fahrenheit()))
    });
    
    const refetchData = () => {
        refetchTemp();
        refetchHum();
        setTimeout(() => refetchData(), 30000);
    };

    onMount(() => refetchData())
    return (
        <div>
            <div class="flex justify-between">
                {typeof currentTempData() !== 'undefined' &&
                    <div class="p-5 bg-white shadow-lg">
                        <h2 class="text-xl font-bold">Temperature</h2>
                        <p class="text-9xl text-center py-5">{getEmojiTemp(currentTempData()?.tempCelcius ?? 0)}</p>
                        <div class="justify-end flex flex-col">
                            <p class='text-center text-4xl'>{tempString}</p>
                            <p class='text-center text-lg'>{formatDateString(currentTempData()?.createdAt ?? '')}</p>
                            <div class="ml-auto mr-0 text-sm mt-2">
                                <button class={classNames('px-1 border border-black', {'bg-blue-400': !fahrenheit()})} onClick={() =>setFahrenheit(false)}>C°</button>
                                <button class={classNames('px-1 border border-black', {'bg-blue-400': fahrenheit()})} onClick={() =>setFahrenheit(true)}>F°</button>
                            </div>
                        </div>
                    </div>
                }
                {typeof currentHumData() !== 'undefined' &&
                    <div class="p-5 bg-white shadow-lg">
                        <h2 class="text-xl font-bold">Humidity</h2>
                        <p class="text-9xl text-center py-5">{getEmojiHum(currentHumData()?.humPercent ?? 0)}</p>
                        <div class="justify-end flex flex-col">
                            <p class='text-center text-4xl'>{currentHumData()?.humPercent}%</p>
                            <p class='text-center text-lg'>{formatDateString(currentTempData()?.createdAt ?? '')}</p>
                        </div>
                    </div>
                }
            </div>
            <p class="text-3xl text-bold mt-8">Controllers</p>
            <div class="flex space-x-4">
                {controllersData()?.map(c => <ControllerItem onClick={() => setControllerId(c.id)} data={c} activeController={() => controllerId()} />)}
            </div>
            <p class="text-xl text-bold mt-4 mb-2">Last 50 datapoints</p>
            <div class='flex space-x-2'>

            <div class="bg-white shadow-lg h-64 overflow-auto flex-1">
                <table>
                    <thead>
                        <tr>
                            <td class="px-5 text-right">Temperature</td>
                            <td>DateTime</td>
                        </tr>
                    </thead>
                    <tbody>                        
                        <For each={controllerData()?.tempMeasurements} fallback={<p>No readings ..</p>}>
                            {item => 
                                <tr>
                                    <td class="px-5 text-right">{fahrenheitOrCelcius(item.tempCelcius, fahrenheit())}</td>
                                    <td>{formatDateString(item.createdAt)}</td>
                                </tr>}
                        </For>
                    </tbody>
                </table>
            </div>
            <div class="bg-white shadow-lg h-64 overflow-auto flex-1">
                <table>
                    <thead>
                        <tr>
                            <td class="px-5 text-right">Humidity</td>
                            <td>DateTime</td>
                        </tr>
                    </thead>
                    <tbody>                        
                        <For each={controllerData()?.humMeasurements} fallback={<p>No Readings</p>}>
                            {item => 
                                <tr>
                                    <td class="px-5 text-right">{item.humPercent}%</td>
                                    <td>{formatDateString(item.createdAt)}</td>
                                </tr>}
                        </For>
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    );
  };
  
  export default Home;