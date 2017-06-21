const appWidgetAddress = 'https://demo.riot.im/modular-widgets';

class ModularWidgets {
    static widgetTypes = [
        {
            type: 'etherpad',
            icon: appWidgetAddress + '/static/etherpad.svg',
            url: appWidgetAddress + '/etherpad.html',
            name: 'Etherpad',
            description: 'Collaborative text editor',
        },
        {
            type: 'recipieStream',
            icon: appWidgetAddress + '/static/etherpad.svg',
            url: 'https://www.youtube.com/embed/ZJy1ajvMU1k?controls=0&enablejsapi=1&iv_load_policy=3&modestbranding=1&playsinline=1&autoplay=1',
            name: 'Recipie Live Stream',
            description: 'Live stream - Boeuf Bourguignon',
        },
        {
            type: 'recipieIngredients',
            icon: appWidgetAddress + '/static/etherpad.svg',
            url: appWidgetAddress + '/recepie.html',
            name: 'Recipie Ingredients',
            description: 'Ingredients - Boeuf Bourguignon',
        },
        {
            type: 'youtube',
            icon: appWidgetAddress + '/static/etherpad.svg',
            url: 'https://www.youtube.com/embed/ZfkwW4GgAiU?controls=0&enablejsapi=1&iv_load_policy=3&modestbranding=1&playsinline=1&autoplay=1',
            name: 'CamGirl',
            description: 'Live stream - ChatGirl86',
        },
        {
            type: 'tip',
            icon: appWidgetAddress + '/static/etherpad.svg',
            url: appWidgetAddress + '/index.html',
            name: 'Tips',
            description: 'Tip Me!!! -- Send me cash $$$',
        },
        {
            type: 'lg',
            icon: appWidgetAddress + '/static/etherpad.svg',
            url: appWidgetAddress + '/lg.html',
            name: 'L&G Insurance',
            description: 'L&G Insurance Policy',
        },
        {
            type: 'grafana',
            icon: appWidgetAddress + '/static/grafana.svg',
            url: appWidgetAddress + '/grafana.html',
            name: 'Grafana',
            description: 'Graph and monitor all the things!',
        },
        {
            type: 'jitsi',
            icon: appWidgetAddress + '/static/jitsi.svg',
            url: appWidgetAddress + '/jitsi.html',
            name: 'jitsi',
            description: 'Jitsi video conference',
        },
        {
            type: 'vrdemo',
            icon: appWidgetAddress + '/static/cardboard.png',
            url: appWidgetAddress + '/vrdemo.html',
            name: 'vrdemo',
            description: 'Matrix VR Demo',
        },
        {
            type: 'custom',
            icon: appWidgetAddress + '/static/blocks.png',
            name: 'Custom Widget',
            description: 'Add your own custom widget',
        },
    ];

    getWidgetConfig(type) {
        for (let i = 0; i < this.widgetTypes.length; i++) {
            const widget = this.widgetTypes[i];
            if (widget.type === type) {
                return widget;
            }
        }
        return null;
    }
}
export default ModularWidgets;