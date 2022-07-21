// if (message.text === ""){
//     return "CON Thank you for contacting OpenHarvest! Here are the menu items: \n 1.Reputation Value \n2.Weather Updates \n3.Send Task status"
    
// }
// else if (message.text === "1"){
//     return "END You are loved"
// }
// else if (message.text === "2"){
//     return "Weather Forecast for $date : \nCloudy \nPrecipitation: "
// }
// else if (message.text === "3"){
//     return "CON Please enter your task id:"
// }
// else if (message.text.match(/3\*(\d+)/i)){
//     return "CON Please enter your task status ( 1 = in-progress , 2 = completed ):"
// }
// else if (message.text.match(/3\*(\d+)\*(1|2)/i)){
//     return "END Thank you, your task status has been received."
// }

// export interface Menu {
//     message: string;
//     type: "menu" | "terminator",
//     children: MenuItem[]
// }

// export interface MenuItem extends Menu {
//     menuItemName: string;
//     onSelect: (history: string) => {}
// }

// const USSDMessagePrompts: Menu = {
//     message: "Thank you for contacting OpenHarvest! Here are the menu items",
//     type: "menu",
//     children: [{
//         menuItemName: "Reputation Value",
//         type: "terminator",
//         onSelect: (history: string) => {return "You are loved"}
//     }, {
//         menuItemName: "Reputation Value",
//         type: "terminator",
//         onSelect: (history: string) => {return "You are loved"}
//     }]
// }

/**
 * This class handles taking in USSD prompts and responding according to a predefined tree 
 */
class USSDBuilder {
    
}

