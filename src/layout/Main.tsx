import { h } from 'preact';
import style from './main.css';
import Form from '../routes/Form';
import { useContext, useState } from 'preact/hooks';
import { ConfigContext, GlobalsContext } from '../AppContext';
import clsx from 'clsx';
import TitleBar from '../components/TitleBar';
import { Router, RouteComponent } from './Router';

const Main = () => {
    const config = useContext(ConfigContext);
    const { widgetOpen } = useContext(GlobalsContext);

    const [title, setTitle] = useState('');
    const getTitle = (route: string) => {
        switch (route) {
            case '/':
            default:
                return config.text.formTitle ?? ' Form';
        }
    };

    return (
        <div className={clsx(style.root, { [style.noDark]: config.disableDarkMode })}>
            <div>
                <TitleBar routeTitle={title} />
                <div className={clsx(
                    style.container,
                    { [style.minimized]: !widgetOpen },
                    config.styles.classNameContainer)}>
                    <Router
                        onChange={(r) => setTitle(getTitle(r))}
                        routes={{
                            '/': <RouteComponent component={Form} /> 
                        }} />
                </div>
            </div>
        </div >);
};

export default Main;
